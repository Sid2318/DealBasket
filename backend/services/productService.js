import Product from "../models/Product.js";
import SellerProduct from "../models/SellerProduct.js";
import Seller from "../models/Seller.js";
import { Client as ElasticClient } from "@elastic/elasticsearch";
import { createClient as createRedisClient } from "redis";
import logger from "../utils/logger.js";

const SEARCH_INDEX = process.env.ELASTICSEARCH_INDEX || "dealbasket_products";
const SEARCH_CACHE_TTL_SECONDS = Number(
  process.env.SEARCH_CACHE_TTL_SECONDS || 300,
);
const INDEX_SYNC_INTERVAL_MS = Number(
  process.env.ELASTICSEARCH_SYNC_INTERVAL_MS || 5 * 60 * 1000,
);

let elasticClient;
let redisClient;
let redisConnectionInFlight;
let indexInitialized = false;
let lastIndexedAt = 0;

const getElasticClient = () => {
  if (!process.env.ELASTICSEARCH_URL) {
    return null;
  }

  if (!elasticClient) {
    elasticClient = new ElasticClient({
      node: process.env.ELASTICSEARCH_URL,
      auth:
        process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD
          ? {
              username: process.env.ELASTICSEARCH_USERNAME,
              password: process.env.ELASTICSEARCH_PASSWORD,
            }
          : undefined,
    });
  }

  return elasticClient;
};

const getRedisCandidates = () => {
  const configuredUrl = (process.env.REDIS_URL || "").trim();
  const configuredHost = (process.env.REDIS_HOST || "").trim();
  const configuredPort = Number(process.env.REDIS_PORT || 6379);

  const candidates = [];

  if (configuredUrl) {
    candidates.push(configuredUrl);
  }

  if (configuredHost) {
    candidates.push(`redis://${configuredHost}:${configuredPort}`);
  }

  if (!configuredUrl && !configuredHost) {
    // Common local/docker defaults.
    candidates.push("redis://localhost:6379");
    candidates.push("redis://host.docker.internal:6379");
    candidates.push("redis://redis:6379");
  }

  return [...new Set(candidates)];
};

const createRedisConnection = async (url) => {
  const client = createRedisClient({ url });
  client.on("error", (error) => {
    logger.warn("Redis client error", { error: error.message, url });
  });
  await client.connect();
  return client;
};

const ensureRedisConnection = async () => {
  if (redisClient?.isOpen) {
    return redisClient;
  }

  if (redisConnectionInFlight) {
    return redisConnectionInFlight;
  }

  const redisUrls = getRedisCandidates();
  if (redisUrls.length === 0) {
    return null;
  }

  redisConnectionInFlight = (async () => {
    for (const url of redisUrls) {
      try {
        const client = await createRedisConnection(url);
        redisClient = client;
        logger.info("Redis connected for search cache", { url });
        return redisClient;
      } catch (error) {
        logger.warn("Redis connection attempt failed", {
          url,
          error: error.message,
        });
      }
    }

    return null;
  })();

  try {
    const client = await redisConnectionInFlight;
    return client;
  } catch (error) {
    logger.warn("Redis unavailable, continuing without cache", {
      error: error.message,
    });
    return null;
  } finally {
    redisConnectionInFlight = null;
  }
};

const normalizeForSearch = (product, sourceType) => ({
  productId: product._id.toString(),
  sourceType,
  name: product.name || "",
  category: product.category || "",
  subcategory: product.subcategory || "",
  website: product.website || "",
  image: product.image || "",
  quantity: product.quantity || "",
  actualPrice: product.actualPrice || "",
  discountedPrice: product.discountedPrice || "",
  discount: product.discount || "",
  details: Array.isArray(product.details) ? product.details : [],
  link: product.link || "",
  createdAt: product.createdAt || new Date(),
  shopName:
    sourceType === "seller"
      ? product.sellerId?.shopName || product.shopName || ""
      : "",
});

const fetchSearchableProducts = async () => {
  const [scrapedProducts, sellerProducts] = await Promise.all([
    Product.find({}).lean(),
    SellerProduct.find({}).populate("sellerId", "shopName").lean(),
  ]);

  const normalizedScraped = scrapedProducts.map((product) =>
    normalizeForSearch(product, "scraped"),
  );
  const normalizedSeller = sellerProducts.map((product) => ({
    ...normalizeForSearch(product, "seller"),
    shopName: product.sellerId?.shopName || "",
  }));

  return [...normalizedScraped, ...normalizedSeller];
};

const ensureIndexExists = async () => {
  const client = getElasticClient();
  if (!client) {
    return false;
  }

  if (indexInitialized) {
    return true;
  }

  const indexExists = await client.indices.exists({ index: SEARCH_INDEX });
  if (!indexExists) {
    await client.indices.create({
      index: SEARCH_INDEX,
      mappings: {
        properties: {
          productId: { type: "keyword" },
          sourceType: { type: "keyword" },
          name: { type: "text" },
          category: { type: "text" },
          subcategory: { type: "text" },
          website: { type: "text" },
          shopName: { type: "text" },
          image: { type: "keyword" },
          quantity: { type: "text" },
          actualPrice: { type: "keyword" },
          discountedPrice: { type: "keyword" },
          discount: { type: "keyword" },
          details: { type: "text" },
          link: { type: "keyword" },
          createdAt: { type: "date" },
        },
      },
    });
  }

  indexInitialized = true;
  return true;
};

const syncIndexIfNeeded = async (force = false) => {
  const client = getElasticClient();
  if (!client) {
    return false;
  }

  const now = Date.now();
  if (!force && now - lastIndexedAt < INDEX_SYNC_INTERVAL_MS) {
    return true;
  }

  await ensureIndexExists();
  const searchableProducts = await fetchSearchableProducts();
  if (searchableProducts.length === 0) {
    lastIndexedAt = now;
    return true;
  }

  const operations = searchableProducts.flatMap((product) => [
    {
      index: {
        _index: SEARCH_INDEX,
        _id: `${product.sourceType}_${product.productId}`,
      },
    },
    product,
  ]);

  await client.bulk({
    refresh: true,
    operations,
  });

  lastIndexedAt = now;
  return true;
};

const searchFromElastic = async (query, pagination) => {
  try {
    const client = getElasticClient();
    if (!client) {
      return null;
    }

    await syncIndexIfNeeded(false);

    const { page, limit } = pagination;
    const from = (page - 1) * limit;
    const response = await client.search({
      index: SEARCH_INDEX,
      from,
      size: limit,
      query: {
        multi_match: {
          query,
          fields: [
            "name^3",
            "subcategory^2",
            "category^2",
            "details",
            "shopName",
            "website",
          ],
          fuzziness: "AUTO",
        },
      },
      sort: [{ _score: "desc" }, { createdAt: "desc" }],
    });

    return response.hits.hits.map((hit) => ({
      _id: hit._source.productId,
      ...hit._source,
      score: hit._score,
    }));
  } catch (error) {
    logger.warn("Elasticsearch unavailable, using Mongo fallback", {
      error: error.message,
    });
    return null;
  }
};

const searchFromMongo = async (query, pagination) => {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;
  const regex = new RegExp(query, "i");

  const [scrapedProducts, sellerProducts] = await Promise.all([
    Product.find({
      $or: [
        { name: regex },
        { category: regex },
        { subcategory: regex },
        { website: regex },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean(),
    SellerProduct.find({
      $or: [
        { name: regex },
        { category: regex },
        { subcategory: regex },
        { website: regex },
      ],
    })
      .populate("sellerId", "shopName")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean(),
  ]);

  const normalizedScraped = scrapedProducts.map((product) => ({
    ...product,
    sourceType: "scraped",
    productId: product._id.toString(),
  }));

  const normalizedSeller = sellerProducts.map((product) => ({
    ...product,
    sourceType: "seller",
    productId: product._id.toString(),
    shopName: product.sellerId?.shopName || "",
  }));

  return [...normalizedScraped, ...normalizedSeller];
};

export const getSellerShopService = async (sellerId) => {
  const seller = await Seller.findById(sellerId);
  if (!seller) {
    throw new Error("Seller not found");
  }
  return seller;
};

export const getAllProductsService = async (filters, pagination = {}) => {
  const { category, subcategory } = filters;
  const { page = 1, limit = 20 } = pagination;
  const skip = (page - 1) * limit;

  const filter = {};
  if (category && category !== "all") {
    filter.category = category;
  }
  if (subcategory) {
    filter.subcategory = subcategory;
  }

  const scrapedProducts = await Product.find(filter)
    .limit(limit)
    .skip(skip)
    .lean();
  const sellerProducts = await SellerProduct.find(filter)
    .limit(limit)
    .skip(skip)
    .lean();
  return [...scrapedProducts, ...sellerProducts];
};

export const searchProductsService = async (rawQuery, pagination = {}) => {
  const query = (rawQuery || "").trim();
  const page = Number(pagination.page) > 0 ? Number(pagination.page) : 1;
  const limitRaw = Number(pagination.limit) > 0 ? Number(pagination.limit) : 20;
  const limit = limitRaw > 50 ? 50 : limitRaw;

  if (!query) {
    return {
      products: [],
      currentPage: page,
      limit,
      hasMore: false,
      source: "none",
      cached: false,
    };
  }

  const cacheKey = `search:v1:${query.toLowerCase()}:${page}:${limit}`;
  const redis = await ensureRedisConnection();

  if (redis) {
    try {
      const cachedResult = await redis.get(cacheKey);
      if (cachedResult) {
        const parsed = JSON.parse(cachedResult);
        return {
          ...parsed,
          cached: true,
        };
      }
    } catch (error) {
      logger.warn("Redis cache read failed", {
        error: error.message,
      });
    }
  }

  let products = await searchFromElastic(query, { page, limit });
  let source = "elastic";
  if (!products) {
    products = await searchFromMongo(query, { page, limit });
    source = "mongo";
  }

  const response = {
    products,
    currentPage: page,
    limit,
    hasMore: products.length === limit,
    source,
    cached: false,
  };

  if (redis) {
    try {
      await redis.set(cacheKey, JSON.stringify(response), {
        EX: SEARCH_CACHE_TTL_SECONDS,
      });
    } catch (error) {
      logger.warn("Redis cache write failed", {
        error: error.message,
      });
    }
  }

  return response;
};

export const getProductsBySubcategoryService = async (subcategory) => {
  const scrapedProducts = await Product.find({ subcategory });
  const sellerProducts = await SellerProduct.find({ subcategory }).populate(
    "sellerId",
    "shopName",
  );

  const sellerProductsWithShop = sellerProducts.map((p) => ({
    ...p.toObject(),
    shopName: p.sellerId?.shopName || undefined,
  }));

  return [...scrapedProducts, ...sellerProductsWithShop];
};

export const getAllCategoriesService = async () => {
  const categories = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        subcategories: { $addToSet: "$subcategory" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  return categories;
};

export const getProductByIdService = async (productId) => {
  let product = await Product.findById(productId);
  if (!product) {
    product = await SellerProduct.findById(productId).populate(
      "sellerId",
      "shopName contactNumber address shopDescription",
    );
    if (!product) {
      throw new Error("Product not found in both collections");
    }
  }
  return product;
};

export const createProductService = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

export const seedProductsService = async () => {
  // Clear existing data
  await Product.deleteMany({});
  await Store.deleteMany({});
  await Price.deleteMany({});

  // Create stores
  const amazon = await Store.create({
    name: "Amazon",
    website: "https://amazon.in",
  });
  const flipkart = await Store.create({
    name: "Flipkart",
    website: "https://flipkart.com",
  });
  const myntra = await Store.create({
    name: "Myntra",
    website: "https://myntra.com",
  });

  // Create products
  const laptop = await Product.create({
    name: "Dell Laptop",
    category: "Electronics",
    image: "https://via.placeholder.com/200",
  });
  const phone = await Product.create({
    name: "Samsung Phone",
    category: "Electronics",
    image: "https://via.placeholder.com/200",
  });
  const shirt = await Product.create({
    name: "Casual Shirt",
    category: "Clothing",
    image: "https://via.placeholder.com/200",
  });

  // Create prices for products
  await Price.create([
    {
      productId: laptop._id,
      storeId: amazon._id,
      originalPrice: 50000,
      discountedPrice: 45000,
    },
    {
      productId: laptop._id,
      storeId: flipkart._id,
      originalPrice: 50000,
      discountedPrice: 43000,
    },
    {
      productId: phone._id,
      storeId: amazon._id,
      originalPrice: 20000,
      discountedPrice: 18000,
    },
    {
      productId: phone._id,
      storeId: flipkart._id,
      originalPrice: 20000,
      discountedPrice: 17500,
    },
    {
      productId: phone._id,
      storeId: myntra._id,
      originalPrice: 20000,
      discountedPrice: 19000,
    },
    {
      productId: shirt._id,
      storeId: myntra._id,
      originalPrice: 1500,
      discountedPrice: 1200,
    },
    {
      productId: shirt._id,
      storeId: flipkart._id,
      originalPrice: 1500,
      discountedPrice: 1100,
    },
  ]);

  return { message: "Seed data created successfully" };
};

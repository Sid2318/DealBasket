import { exec } from "child_process";
import { promisify } from "util";
import Product from "../models/Product.js";

const execPromise = promisify(exec);

// List of scraper scripts to run (relative to scrappers directory)
const scrapers = [
  "amazon-scappers/scrapper1.js",
  "amazon-scappers/scrapper2.js",
  "amazon-scappers/scrapper3.js",
  "amazon-scappers/scrapper4.js",
  "amazon-scappers/scrapper5.js",
  "amazon-scappers/scrapper6.js",
  "flipkart-scrappers/scrapper1.js",
  "flipkart-scrappers/scrapper2.js",
  "flipkart-scrappers/scrapper3.js",
];

async function runScraper(script, scrapperDir) {
  return new Promise((resolve) => {
    const fullPath = `${scrapperDir}/${script}`;
    console.log(`Running scraper: ${script}...`);

    exec(
      `node ${fullPath}`,
      { maxBuffer: 1024 * 1024 * 10, cwd: scrapperDir },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error running ${script}:`, error.message);
          return resolve([]);
        }
        try {
          // Find all JSON arrays in the output (handle multiple or mixed with console.log)
          const jsonMatches = stdout.match(
            /\[[^\[\]]*?\{[\s\S]*?\}[^\[\]]*?\]/g
          );

          if (jsonMatches && jsonMatches.length > 0) {
            // Parse and flatten all JSON arrays found
            const allProducts = [];
            for (const match of jsonMatches) {
              try {
                const data = JSON.parse(match);
                if (Array.isArray(data)) {
                  allProducts.push(...data);
                } else {
                  allProducts.push(data);
                }
              } catch (e) {
                // Skip invalid JSON chunks
              }
            }
            console.log(`✓ ${script} returned ${allProducts.length} products`);
            resolve(allProducts);
          } else {
            console.log(`✗ ${script} returned no valid JSON`);
            resolve([]);
          }
        } catch (e) {
          console.error(`✗ ${script} JSON parse error:`, e.message);
          resolve([]);
        }
      }
    );
  });
}

export const runAggregateScraperAndStore = async () => {
  try {
    console.log("🔄 Starting aggregate scraper service...\n");

    const scrapperDir = process.cwd() + "/scrappers";
    let allProducts = [];

    // Run all scrapers sequentially
    for (const script of scrapers) {
      const products = await runScraper(script, scrapperDir);
      if (Array.isArray(products)) {
        allProducts = allProducts.concat(products);
      } else if (products && typeof products === "object") {
        allProducts.push(products);
      }
    }

    console.log(`\n📊 Total products scraped: ${allProducts.length}`);

    // Filter out invalid products (missing required fields)
    const validProducts = allProducts.filter((product) => {
      return (
        product &&
        product.name &&
        product.name.trim() !== "" &&
        product.category &&
        product.subcategory &&
        product.website
      );
    });

    const invalidCount = allProducts.length - validProducts.length;
    if (invalidCount > 0) {
      console.log(
        `⚠️  Filtered out ${invalidCount} invalid products (missing required fields)`
      );
    }

    console.log(`✓ Valid products to insert: ${validProducts.length}`);

    if (validProducts.length === 0) {
      console.log(
        "⚠️  No valid products were scraped. Skipping database update."
      );
      return { success: false, count: 0, message: "No valid products scraped" };
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products from database");

    // Insert all products
    const result = await Product.insertMany(validProducts);
    console.log(
      `✅ Successfully inserted ${result.length} products into MongoDB`
    );

    // Log category and subcategory counts with website information
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: {
            category: "$category",
            subcategory: "$subcategory",
            website: "$website",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.category": 1,
          "_id.subcategory": 1,
          "_id.website": 1,
        },
      },
    ]);

    console.log("\n--- Product Statistics by Website ---");
    categoryStats.forEach((stat) => {
      console.log(
        `${stat._id.category} > ${stat._id.subcategory} [${stat._id.website}]: ${stat.count} products`
      );
    });
    console.log("-------------------------------------\n");

    return { success: true, count: result.length };
  } catch (error) {
    console.error("❌ Error in aggregate scraper service:", error);
    throw error;
  }
};

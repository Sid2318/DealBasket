# DealBasket - Easy Interview Guide

This README is written in simple language.

Use it for:

1. Interview preparation
2. Project explanation
3. Quick revision before interview

---

## 0. Quick Product Pitch

### 30-second pitch

DealBasket is a shopping platform where users can see products from big websites and local shops in one place.
Users can compare prices, check discounts, save purchase history, and chat with sellers.
The app is fast and reliable because it uses search, cache, and fallback logic.

### 2-minute pitch

People usually open many apps to compare prices.
Local sellers are also hard to find online.
DealBasket solves this by combining scraped products and seller products in one app.

What users can do:

1. Browse categories and products
2. Compare prices and discounts
3. Track savings in history
4. Chat directly with sellers

What sellers can do:

1. Register as seller
2. Add and manage products
3. See stats
4. Chat with customers

Tech summary:

1. React frontend
2. Node + Express backend
3. MongoDB for data
4. Elasticsearch for better search
5. Redis for cache
6. Socket.IO for real-time chat

One-line value:
DealBasket saves users time and money, and helps local shops get online visibility.

---

## 1. Problem We Solve

Main problems:

1. Price comparison is manual and slow
2. Users switch between many websites
3. Local sellers have low online reach
4. No direct communication with shopkeepers in one app

---

## 2. Main Features

### For users

1. Signup/login/logout
2. Browse category and subcategory
3. See products from scraped data and local sellers
4. Search products from home page
5. Save purchase history and savings
6. Chat with sellers

### For sellers

1. Register as seller
2. Add/update/delete products
3. View stats
4. Chat with users

### For system

1. Scrape product data
2. Merge scraped + seller data
3. Fast search with cache
4. Fallback when external services are down

---

## 3. Non-Functional Goals

1. Security: JWT auth, role checks, rate limiting
2. Performance: pagination, compression, Redis cache
3. Reliability: fallback from Elastic to Mongo
4. Scalability: modular services and stateless APIs
5. Maintainability: layered architecture
6. Observability: structured logging

---

## 4. High-Level Architecture

Main parts:

1. Frontend: React + Vite
2. Backend: Node.js + Express + Socket.IO
3. Database: MongoDB
4. Search: Elasticsearch
5. Cache: Redis
6. Data ingestion: Scrapers

Data flow:

1. Scrapers collect products and store in MongoDB
2. Sellers add products via seller APIs
3. Listing APIs combine both sources
4. Search API checks Redis first
5. If cache miss, query Elasticsearch
6. If Elastic fails, use Mongo fallback
7. Chat uses REST for history and sockets for live messages

---

## 5. Project Structure (Simple and Clear)

Top level:

1. frontend/ - all UI code
2. backend/ - all API and server code
3. README.md - documentation and interview notes

### Backend folders

1. backend/app.js
   - starts server
   - loads middlewares
   - mounts routes
   - starts socket server

2. backend/config/
   - DB connection config

3. backend/models/
   - Mongo schemas
   - examples: User, Seller, Product, SellerProduct, Conversation, ChatMessage

4. backend/routes/
   - endpoint paths
   - calls controllers

5. backend/controllers/
   - request/response handling
   - input validation
   - calls services

6. backend/services/
   - core business logic
   - search + cache logic
   - auth logic
   - chat logic

7. backend/middlewares/
   - auth check
   - rate limiter
   - performance middleware

8. backend/sockets/
   - socket events
   - socket auth and room logic

9. backend/scrappers/
   - source-wise scraper files

10. backend/utils/
    - shared helpers like logger

### Frontend folders

1. frontend/src/main.jsx
   - app entry point

2. frontend/src/App.jsx
   - app shell and provider wrapper

3. frontend/src/Router/
   - route definitions

4. frontend/src/pages/
   - page-level UI
   - Home, Subcategory, Auth, Seller, Connect, History

5. frontend/src/components/
   - reusable UI parts
   - Navbar, Loader, LoginModal, etc.

6. frontend/src/api/
   - all API call files
   - axios setup and token refresh

7. frontend/src/hooks/
   - shared hooks like useAuth

8. frontend/src/data/
   - static mappings and category data

9. frontend/src/styles/
   - shared SCSS and color tokens

---

## 6. Complete Directory Map

```text
DealBasket/
├── backend/
│   ├── app.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController/
│   │   ├── productController.js
│   │   ├── sellerController.js
│   │   ├── myHistoryController.js
│   │   └── chatController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── authLimiter.js
│   │   ├── performanceMiddleware.js
│   │   └── validateRequest.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Seller.js
│   │   ├── Product.js
│   │   ├── SellerProduct.js
│   │   ├── MyHistory.js
│   │   ├── Conversation.js
│   │   └── ChatMessage.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── sellerRoutes.js
│   │   ├── myHistoryRoutes.js
│   │   └── chatRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── sellerService.js
│   │   ├── myHistoryService.js
│   │   ├── chatService.js
│   │   ├── scraperService.js
│   │   └── otpService.js
│   ├── scrappers/
│   ├── sockets/
│   │   └── chatSocket.js
│   ├── utils/
│   │   └── logger.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── Router/router.jsx
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   ├── authApi.js
│   │   │   ├── productApi.js
│   │   │   ├── sellerApi.js
│   │   │   ├── historyApi.js
│   │   │   └── chatApi.js
│   │   ├── hooks/
│   │   │   └── useAuth.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   ├── Subcategory/
│   │   │   ├── History/
│   │   │   ├── Connect/
│   │   │   ├── Auth/
│   │   │   └── Seller/
│   │   ├── data/
│   │   └── styles/
│   └── package.json
└── README.md
```

---

## 7. What To Edit Where (Very Practical)

If you want a new backend API:

1. Add route in backend/routes/
2. Add controller in backend/controllers/
3. Add business logic in backend/services/
4. Add schema changes in backend/models/ if needed

If you want a new frontend page:

1. Add page in frontend/src/pages/
2. Add API call in frontend/src/api/
3. Add route in frontend/src/Router/router.jsx
4. Add style file next to page

If feature needs auth:

1. Protect route in backend middleware
2. Use useAuth and axios token flow in frontend

If feature needs real-time:

1. Add socket event in backend/sockets/
2. Save data in DB from service layer
3. Handle event in frontend page/component

---

## 8. Request Lifecycle (One API Call Example)

Example: search from home page

1. User types query and clicks Search
2. Home page calls productApi search function
3. Axios sends request with auth token (if present)
4. Backend route receives request
5. Controller validates input
6. Service does search with cache-aside pattern
7. Controller sends formatted response
8. Frontend renders result cards

---

## 9. End-to-End Workflows

### A) Login + protected access

1. User logs in
2. Backend checks credentials
3. Access + refresh tokens are generated
4. Frontend stores access token
5. Protected APIs work
6. If access token expires, refresh flow gets a new one

### B) Seller adds product

1. Seller opens product form
2. Frontend sends POST request
3. Backend checks seller auth
4. Service validates seller and data
5. Product saved in SellerProduct collection
6. Product appears in listings

### C) Search with Redis and Elastic

1. Query comes in
2. Redis hit returns fast result
3. Redis miss goes to Elasticsearch
4. If Elastic fails, fallback to Mongo search
5. Result is cached with TTL

### D) Chat workflow

1. User clicks chat on shop
2. Conversation created/fetched
3. User joins socket room
4. Message sent via socket
5. Message saved in DB
6. Server emits to both users
7. Both users see live messages

### E) Scraper workflow

1. Scraper collects product data
2. Data stored in Product collection
3. APIs combine Product + SellerProduct
4. User sees merged catalog

---

## 10. System Design Concepts Used

1. Layered architecture
   - routes -> controllers -> services -> models

2. Stateless auth
   - access token in header
   - refresh token flow

3. Cache-aside pattern
   - check Redis first, then source, then set cache

4. Graceful degradation
   - Redis down: still works
   - Elastic down: Mongo fallback

5. Event-driven real-time messaging
   - socket rooms for conversation

6. Pagination
   - controls response size and load

7. Eventual consistency
   - search index can be slightly behind DB

---

## 11. Why This Tech Stack (Simple)

### React + Vite

Why:

1. Fast UI development
2. Reusable components
3. Good ecosystem

Why not Angular:

1. More heavy for this project size

Why not Next.js:

1. SSR not needed for current version

### Node + Express

Why:

1. Same language full stack
2. Fast development
3. Good for REST + socket

Why not Spring Boot:

1. More setup and boilerplate for this stage

### MongoDB

Why:

1. Flexible schema for scraped and changing data
2. Good for document model

Why not PostgreSQL:

1. Less flexible for frequently changing scraped fields

### Elasticsearch

Why:

1. Better full-text search quality than simple regex

### Redis

Why:

1. Very fast cache reads
2. Easy to run with Docker

### Socket.IO

Why:

1. Easy real-time communication
2. Room-based chat logic

---

## 12. Security Overview

Implemented:

1. JWT auth middleware
2. Role checks
3. Rate limiting on sensitive auth routes
4. Request validation
5. Controlled token refresh flow

Can improve later:

1. Better secret management
2. More strict schema validation everywhere
3. More production security headers

---

## 13. Performance Overview

Implemented:

1. Pagination
2. Compression
3. Redis cache for search
4. Lean queries and async flow

Can improve later:

1. Metrics (p95 latency)
2. Smarter cache invalidation
3. Background indexing worker

---

## 14. Reliability Overview

Current behavior:

1. If Redis fails, search still works
2. If Elastic fails, fallback to Mongo
3. If socket auth fails, connection is blocked safely

Can improve later:

1. Retry with backoff for dependencies
2. Circuit breaker pattern
3. Better health checks and alerts

---

## 15. Scalability Discussion

Good now:

1. Stateless API design
2. Separate search and cache services
3. Socket room partition by conversation

Possible bottlenecks later:

1. Single Mongo instance
2. Basic index sync strategy
3. Single Node process for heavy chat load

Scale plan:

1. Multiple backend instances
2. Redis + socket adapter for distributed sockets
3. Dedicated indexing worker
4. DB indexing/sharding as data grows

---

## 16. Interview Questions You May Get (Easy Answers)

1. Why two product collections?
   - One is scraped source data, one is seller-owned data. It keeps ownership clear and logic clean.

2. Why fallback search?
   - To keep app usable even if Elastic is down.

3. How avoid duplicate chats?
   - Use deterministic conversation key for same user pair.

4. Why Redis?
   - Faster repeated search response and lower backend load.

5. How secure sockets?
   - Token auth at handshake and participant check before room join.

6. What if user wants very specific search like "red color blue lines ball"?
   - I split that query into attributes.
   - Example mapping:
     1. Product type: ball
     2. Color: red, blue
     3. Pattern/style: lines/striped
   - Then I run hybrid search:
     1. Full-text match for product name/details
     2. Attribute filters for color/pattern/type if available
   - If some fields are missing in old data, I still do text search so user gets useful results.
   - Better version (next step):
     1. Save normalized fields like `color`, `pattern`, `material`, `brand` during scraping/seller upload
     2. Add synonym dictionary (for example "striped" = "lines")
     3. Use weighted scoring (type match > color match > description match)

7. What if target websites keep changing JavaScript and scraper breaks?
   - This is common in real projects.
   - I handle it in layers:
     1. Keep source-specific scraper files, so one site change does not break all sites
     2. Use fallback selectors and defensive parsing
     3. Catch errors per source and continue pipeline (partial success is better than full failure)
     4. Log failures clearly so we can fix quickly
   - Strong production approach:
     1. Add monitoring and alert if product count drops suddenly
     2. Add daily health check job for scraper outputs
     3. Prefer official APIs/feed where available
     4. Keep parser versioning and test snapshots for each source page format
   - So even if one website changes JS, system keeps running and we fix that source quickly.

---

## 17. Honest Weak Points

1. Index sync is simple now, not fully event-driven
2. Search ranking can be tuned more
3. More strict validation can be added
4. Production observability can be stronger

How to answer in interview:

1. Say clearly what is missing
2. Explain why current approach was chosen
3. Share concrete next improvement plan

---

## 18. Environment Setup (Important)

Backend .env keys:

1. PORT
2. NODE_ENV
3. MONGODB_URI
4. JWT_ACCESS_SECRET
5. JWT_REFRESH_SECRET
6. FRONTEND_URL
7. ELASTICSEARCH_URL
8. ELASTICSEARCH_INDEX
9. REDIS_URL (or REDIS_HOST + REDIS_PORT)
10. SEARCH_CACHE_TTL_SECONDS

Docker Redis quick run:

```bash
docker run -d --name dealbasket-redis -p 6379:6379 redis:7-alpine
```

Use this in .env:

```env
REDIS_URL=redis://localhost:6379
```

If backend is also inside Docker Compose:

```env
REDIS_URL=redis://redis:6379
```

---

## 19. 5-Layer Project Explanation (Great For Interview)

Use this order:

1. Problem
2. Solution and features
3. Architecture
4. Trade-offs
5. Scale plan

---

## 20. 30-Minute Revision Plan

1. 5 min: pitch + problem
2. 5 min: architecture + structure
3. 5 min: workflows
4. 5 min: design concepts + tech choices
5. 5 min: interview questions + weak points
6. 5 min: speak your 1-minute and 2-minute pitch

---

## 21. If You Had More Time

1. Event-driven indexing pipeline
2. Event-based cache invalidation
3. Better metrics and dashboards
4. More integration tests
5. Better distributed socket scaling

---

## 22. Final Interview Tip

Do not try to sound perfect.
Show clear thinking.
Use this format in answers:
Problem -> Decision -> Trade-off -> Next Step

That gives a strong engineering impression.

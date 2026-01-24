# DealBasket 🛒

A comprehensive price comparison and e-commerce platform that helps users save money by comparing prices across multiple vendors and provides seller capabilities for businesses.

## 🌟 Features

### For Customers

- **Price Comparison**: Compare products across Amazon, Flipkart, BigBasket, and local sellers
- **Category Browsing**: Browse products by categories (Electronics, Fashion, Lifestyle, Beauty, Groceries)
- **Best Deals**: Special section showcasing products with highest discounts
- **Smart Savings Tracking**: Track your purchase history and total savings
- **User Authentication**: Secure signup/login system with JWT authentication
- **Purchase History**: Detailed history with savings analytics
- **Responsive Design**: Mobile-friendly interface with modern UI/UX

### For Sellers

- **Seller Registration**: Register as a seller with business details
- **Product Management**: Add, edit, and delete products with images
- **Inventory Tracking**: Monitor product quantities and pricing
- **Sales Analytics**: View detailed statistics and performance metrics
- **Dashboard**: Comprehensive seller dashboard with insights

### Technical Features

- **Web Scraping**: Automated product data collection from major e-commerce sites
- **Data Aggregation**: Combines scraped data with seller-added products
- **Real-time Updates**: Dynamic product information and pricing
- **RESTful API**: Clean API architecture for frontend-backend communication
- **MongoDB Database**: Scalable NoSQL database for product and user data

## 🛠️ Technology Stack

### Frontend

- **React.js** - Modern JavaScript framework for UI development
- **React Router** - Client-side routing
- **Vite** - Fast build tool and development server
- **SCSS** - Enhanced CSS with variables and mixins
- **Axios** - HTTP client for API calls

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Web Scraping

- **Puppeteer/Cheerio** - Web scraping tools
- **Custom scrapers** for Amazon, Flipkart, BigBasket
- **Data aggregation** service

## 📁 Project Structure

```
DealBasket/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Navbar/     # Navigation component
│   │   │   ├── LoginModal/ # Login modal component
│   │   │   ├── ProfileDrawer/ # User profile sidebar
│   │   │   └── Loader/     # Loading component
│   │   ├── pages/          # Page components
│   │   │   ├── Home/       # Homepage with categories
│   │   │   ├── Auth/       # Login/Signup pages
│   │   │   ├── History/    # Purchase history page
│   │   │   ├── Subcategory/ # Product listing page
│   │   │   └── Seller/     # Seller dashboard pages
│   │   ├── api/            # API service functions
│   │   ├── data/           # Static data and categories
│   │   └── styles/         # Global SCSS styles
│   └── public/             # Static assets
├── backend/                 # Node.js backend application
│   ├── controllers/        # Business logic handlers
│   ├── models/            # MongoDB data models
│   ├── routes/            # API route definitions
│   ├── middlewares/       # Authentication middleware
│   ├── services/          # Business services
│   ├── scrappers/         # Web scraping modules
│   └── config/            # Database configuration
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/DealBasket.git
   cd DealBasket
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/dealbasket
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Frontend Setup**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the Application**

   **Backend (Terminal 1):**

   ```bash
   cd backend
   npm run dev
   ```

   **Frontend (Terminal 2):**

   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

## 📊 Database Models

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: "customer"),
  createdAt: Date
}
```

### Product Model (Scraped)

```javascript
{
  name: String,
  category: String,
  subcategory: String,
  image: String,
  price: String,
  originalPrice: String,
  discount: String,
  website: String,
  link: String
}
```

### Seller Model

```javascript
{
  userId: ObjectId (ref: User),
  shopName: String,
  shopDescription: String,
  contactNumber: String,
  address: Object,
  businessType: String,
  gstNumber: String
}
```

### Purchase History Model

```javascript
{
  userId: ObjectId (ref: User),
  productId: String,
  productName: String,
  originalPrice: Number,
  finalPrice: Number,
  savedAmount: Number,
  website: String,
  category: String,
  purchaseDate: Date
}
```

## 🔧 API Endpoints

### Authentication

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Products

- `GET /products` - Get all products with filters
- `GET /products/subcategory/:subcategory` - Get products by subcategory
- `GET /products/:id` - Get single product details

### Purchase History

- `POST /myhistory/purchase` - Save purchase to history
- `GET /myhistory` - Get user's purchase history
- `GET /myhistory/total-savings` - Get savings statistics

### Seller Routes

- `POST /seller/register` - Register as seller
- `GET /seller/profile` - Get seller profile
- `POST /seller/products` - Add new product
- `GET /seller/products` - Get seller's products
- `PUT /seller/products/:id` - Update product
- `DELETE /seller/products/:id` - Delete product
- `GET /seller/stats` - Get seller statistics

## 🎨 Key Features Explained

### 1. **Price Comparison Engine**

- Scrapes product data from multiple e-commerce sites
- Aggregates pricing information in real-time
- Displays best deals and savings opportunities

### 2. **Smart Categories System**

- Hierarchical category structure (Category → Subcategory)
- Visual category browsing with images
- Special "Best Deals" section for discounted items

### 3. **Purchase Tracking & Analytics**

- Tracks every purchase made through the platform
- Calculates total savings, average savings per purchase
- Provides detailed purchase history with filters

### 4. **Seller Dashboard**

- Complete seller onboarding flow
- Product management with image uploads
- Sales analytics and performance metrics
- Inventory management tools

### 5. **Responsive Design**

- Mobile-first approach with SCSS styling
- Modern UI components with animations
- Dark/light theme support

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Route Protection**: Middleware for protected routes

## 📱 User Interface

### Homepage

- Hero section with platform statistics
- Category navigation with visual icons
- Subcategory grid with product images
- Responsive layout for all devices

### Product Listing

- Advanced filtering (price range, category)
- Sorting options (price, discount, popularity)
- Product cards with pricing comparison
- "Buy Now" functionality with purchase tracking

### Purchase History

- Comprehensive savings dashboard
- Purchase timeline with product details
- Savings analytics and statistics
- Review and feedback system

### Seller Dashboard

- Product management interface
- Sales performance metrics
- Inventory tracking tools
- Business analytics

## 🚀 Deployment

### Backend Deployment

1. Set up MongoDB Atlas or cloud database
2. Configure environment variables
3. Deploy to platforms like Heroku, Vercel, or AWS

### Frontend Deployment

1. Build the production bundle: `npm run build`
2. Deploy to Netlify, Vercel, or similar platforms
3. Configure API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: React.js, SCSS, Responsive Design
- **Backend Development**: Node.js, Express, MongoDB
- **Web Scraping**: Automated data collection and aggregation
- **UI/UX Design**: Modern interface with user-centered design

## 📞 Support

For support and queries:

- Create an issue on GitHub
- Email: support@dealbasket.com
- Documentation: Check the wiki section

---

**DealBasket** - Smart Shopping, Maximum Savings! 💰

# DealBasket 🛒

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-v16+-green.svg)
![React](https://img.shields.io/badge/react-v19+-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-latest-green.svg)

A comprehensive price comparison and e-commerce platform that helps users save money by comparing prices across multiple vendors and provides seller capabilities for businesses. DealBasket aggregates product data from major e-commerce platforms and allows local sellers to list their products, creating a unified marketplace for smart shopping.

<div align="center">

[🚀 Quick Start](#-getting-started) • [📖 Documentation](#-table-of-contents) • [💡 Features](#-features) • [🤝 Contributing](#-contributing) • [📞 Support](#-support--contact)

</div>

---

## 📑 Table of Contents

- [Features](#-features)
  - [For Customers](#for-customers)
  - [For Sellers](#for-sellers)
  - [Technical Features](#technical-features)
- [Technology Stack](#️-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Quick Start](#quick-start-tldr)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables Reference](#environment-variables-reference)
- [Database Models](#-database-models)
- [API Endpoints](#-api-endpoints)
- [Key Features Explained](#-key-features-explained)
- [Screenshots](#-screenshots)
- [User Interface](#-user-interface)
- [Deployment](#-deployment)
- [Development Workflow](#-development-workflow)
- [Troubleshooting](#-troubleshooting)
- [Performance Optimization](#-performance-optimization)
- [Security Best Practices](#-security-best-practices)
- [FAQ](#-frequently-asked-questions-faq)
- [Contributing](#-contributing)
- [Roadmap](#️-roadmap)
- [Project Stats](#-project-stats)
- [Support & Contact](#-support--contact)
- [License](#-license)

---

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

- **React.js v19** - Modern JavaScript framework for UI development
- **React Router DOM v6** - Client-side routing and navigation
- **Vite v7** - Fast build tool and development server
- **SCSS/Sass** - Enhanced CSS with variables and mixins
- **ESLint** - Code linting and formatting
- **Responsive Design** - Mobile-first approach

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js v5** - Web application framework
- **MongoDB v7** - NoSQL database
- **Mongoose v9** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and security
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting
- **Compression** - Response compression middleware
- **Cookie Parser** - Cookie parsing middleware
- **Nodemailer** - Email service integration
- **dotenv** - Environment variable management

### Web Scraping

- **Puppeteer/Cheerio** - Web scraping tools for dynamic content
- **Custom scrapers** for Amazon, Flipkart, and BigBasket
- **Data aggregation** service combining multiple sources
- **Scheduled scraping** for real-time price updates
- **Error handling** and retry mechanisms
- **Scraper categories**: Electronics, Fashion, Lifestyle, Beauty, Groceries

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

### Quick Start (TL;DR)

```bash
# Clone the repository
git clone https://github.com/your-username/DealBasket.git
cd DealBasket

# Backend setup
cd backend
npm install
# Create .env file (see below)
npm run dev

# In a new terminal - Frontend setup
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` 🎉

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account) - [Setup Guide](https://docs.mongodb.com/manual/installation/)
- **Git** for version control - [Download here](https://git-scm.com/)
- **npm** or **yarn** package manager (comes with Node.js)

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

   Create a `.env` file in the backend directory with the following variables:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/dealbasket
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dealbasket

   # Authentication
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_EXPIRE=7d

   # Email Configuration (for password reset)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # CORS Configuration
   CLIENT_URL=http://localhost:5173
   ```

   > 💡 **Tip**: Generate a secure JWT_SECRET using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

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
   - API Documentation: `http://localhost:3000/api-docs` (if configured)

### Default Test Accounts

For testing purposes, you can create accounts or use:

```javascript
// Customer Account
Email: customer@test.com
Password: Test@123

// Seller Account
Email: seller@test.com
Password: Test@123
```

_Note: You'll need to register these accounts first through the signup page._

### Available NPM Scripts

#### Backend Scripts

```bash
npm start       # Start the server with nodemon (development)
npm run dev     # Start the server with nodemon (development)
npm test        # Run tests (when configured)
```

#### Frontend Scripts

```bash
npm run dev     # Start Vite development server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint for code quality
```

### Environment Variables Reference

#### Backend Environment Variables

| Variable        | Description                     | Required | Default     | Example                              |
| --------------- | ------------------------------- | -------- | ----------- | ------------------------------------ |
| `PORT`          | Server port number              | No       | 3000        | 3000                                 |
| `NODE_ENV`      | Environment mode                | No       | development | production                           |
| `MONGODB_URI`   | MongoDB connection string       | Yes      | -           | mongodb://localhost:27017/dealbasket |
| `JWT_SECRET`    | Secret key for JWT tokens       | Yes      | -           | your_secret_key_here                 |
| `JWT_EXPIRE`    | JWT token expiration time       | No       | 7d          | 30d                                  |
| `EMAIL_SERVICE` | Email service provider          | No       | gmail       | gmail                                |
| `EMAIL_USER`    | Email address for notifications | No       | -           | your-email@gmail.com                 |
| `EMAIL_PASS`    | Email password or app password  | No       | -           | your_app_password                    |
| `CLIENT_URL`    | Frontend URL for CORS           | Yes      | -           | http://localhost:5173                |

#### Frontend Environment Variables

| Variable            | Description          | Required | Default               | Example                    |
| ------------------- | -------------------- | -------- | --------------------- | -------------------------- |
| `VITE_API_BASE_URL` | Backend API base URL | No       | http://localhost:3000 | https://api.dealbasket.com |

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

### Authentication Routes (`/api/auth`)

| Method | Endpoint                | Description               | Auth Required |
| ------ | ----------------------- | ------------------------- | ------------- |
| POST   | `/auth/signup`          | User registration         | No            |
| POST   | `/auth/login`           | User login                | No            |
| POST   | `/auth/forgot-password` | Request password reset    | No            |
| POST   | `/auth/reset-password`  | Reset password with token | No            |
| GET    | `/auth/profile`         | Get user profile          | Yes           |
| PUT    | `/auth/profile`         | Update user profile       | Yes           |

### Products Routes (`/api/products`)

| Method | Endpoint                             | Description                         | Auth Required |
| ------ | ------------------------------------ | ----------------------------------- | ------------- |
| GET    | `/products`                          | Get all products with filters       | No            |
| GET    | `/products/category/:category`       | Get products by category            | No            |
| GET    | `/products/subcategory/:subcategory` | Get products by subcategory         | No            |
| GET    | `/products/:id`                      | Get single product details          | No            |
| GET    | `/products/search`                   | Search products                     | No            |
| GET    | `/products/best-deals`               | Get products with highest discounts | No            |

### Purchase History Routes (`/api/myhistory`)

| Method | Endpoint                   | Description                     | Auth Required |
| ------ | -------------------------- | ------------------------------- | ------------- |
| POST   | `/myhistory/purchase`      | Save purchase to history        | Yes           |
| GET    | `/myhistory`               | Get user's purchase history     | Yes           |
| GET    | `/myhistory/total-savings` | Get savings statistics          | Yes           |
| GET    | `/myhistory/stats`         | Get detailed purchase analytics | Yes           |
| DELETE | `/myhistory/:id`           | Delete purchase record          | Yes           |

### Seller Routes (`/api/seller`)

| Method | Endpoint               | Description           | Auth Required |
| ------ | ---------------------- | --------------------- | ------------- |
| POST   | `/seller/register`     | Register as seller    | Yes           |
| GET    | `/seller/profile`      | Get seller profile    | Yes           |
| PUT    | `/seller/profile`      | Update seller profile | Yes           |
| POST   | `/seller/products`     | Add new product       | Yes           |
| GET    | `/seller/products`     | Get seller's products | Yes           |
| GET    | `/seller/products/:id` | Get specific product  | Yes           |
| PUT    | `/seller/products/:id` | Update product        | Yes           |
| DELETE | `/seller/products/:id` | Delete product        | Yes           |
| GET    | `/seller/stats`        | Get seller statistics | Yes           |
| GET    | `/seller/orders`       | Get seller orders     | Yes           |

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

### Environment Setup

#### Development

```bash
# Backend
cd backend
npm run dev    # Starts with nodemon for auto-reload

# Frontend
cd frontend
npm run dev    # Starts Vite dev server
```

#### Production Build

```bash
# Frontend production build
cd frontend
npm run build
npm run preview  # Preview production build

# Backend production
cd backend
npm start
```

### Cloud Deployment

#### Backend Deployment (Railway, Render, or Heroku)

1. **Set up MongoDB Atlas**

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dealbasket
   ```

2. **Configure Environment Variables**

   ```env
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=your_atlas_connection_string
   JWT_SECRET=your_production_jwt_secret
   CLIENT_URL=https://your-frontend-domain.com
   ```

3. **Deploy Backend**
   - Connect your GitHub repository
   - Set environment variables in the platform
   - Deploy from main branch

#### Frontend Deployment (Netlify, Vercel)

1. **Build Configuration**

   ```bash
   npm run build
   ```

2. **Environment Variables**

   ```env
   VITE_API_BASE_URL=https://your-backend-domain.com/api
   ```

3. **Deploy**
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

### Docker Deployment

Create `docker-compose.yml` in the root directory:

```yaml
version: "3.8"
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/dealbasket
      - JWT_SECRET=your_jwt_secret

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

Run with: `docker-compose up -d`

## 📝 Development Workflow

### Git Workflow

1. **Clone and Setup**

   ```bash
   git clone <repository-url>
   cd DealBasket
   git checkout -b feature/your-feature-name
   ```

2. **Development Cycle**

   ```bash
   # Make your changes
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

3. **Pull Request**
   - Create PR to main branch
   - Add description and screenshots
   - Wait for code review

### Code Standards

- **ESLint**: Frontend linting with React rules
- **Prettier**: Code formatting (recommended)
- **Commit Messages**: Use conventional commits
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `style:` for formatting changes
  - `refactor:` for code refactoring

### Testing

```bash
# Frontend testing (setup required)
npm run test

# Backend testing (setup required)
npm run test

# Linting
npm run lint
```

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```

   **Solution**: Make sure MongoDB is running locally or check your Atlas connection string.

2. **CORS Error**

   ```
   Access to fetch blocked by CORS policy
   ```

   **Solution**: Verify CLIENT_URL in backend .env matches frontend URL.

3. **JWT Token Issues**

   ```
   JsonWebTokenError: invalid token
   ```

   **Solution**: Clear localStorage and login again, or check JWT_SECRET configuration.

4. **Build Errors**

   ```
   Module not found
   ```

   **Solution**: Delete node_modules and package-lock.json, then run `npm install`.

5. **Port Already in Use**

   ```
   Error: EADDRINUSE: address already in use
   ```

   **Solution**:

   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F

   # macOS/Linux
   lsof -ti:3000 | xargs kill
   ```

### Environment Setup Issues

- **Node Version**: Use Node.js v16 or higher
- **MongoDB**: Ensure MongoDB is running on port 27017
- **Environment Variables**: Double-check all .env variables are set correctly

## 📈 Performance Optimization

### Frontend Optimizations

- **Code Splitting**: Implemented with React.lazy()
- **Image Optimization**: Use WebP format where possible
- **Bundle Analysis**: Run `npm run build -- --analyze`
- **Caching**: Implement service workers for API caching

### Backend Optimizations

- **Database Indexing**: Add indexes on frequently queried fields
- **Compression**: Enabled gzip compression
- **Rate Limiting**: Protected against abuse
- **Caching**: Implement Redis for session storage

## 🔒 Security Best Practices

- **Environment Variables**: Never commit .env files
- **Password Hashing**: Using bcryptjs with salt rounds
- **JWT Security**: Secure secret keys and expiration times
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Whitelist specific origins
- **Rate Limiting**: Prevent brute force attacks
- **HTTPS**: Always use HTTPS in production

## 🤝 Contributing

We welcome contributions to DealBasket! Here's how you can help:

### Getting Started

1. **Fork the Repository**

   ```bash
   git clone https://github.com/your-username/DealBasket.git
   cd DealBasket
   ```

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation

4. **Test Your Changes**

   ```bash
   npm run lint
   npm run test
   ```

5. **Submit Pull Request**
   - Commit with conventional commit messages
   - Push to your fork
   - Create PR with detailed description

### Contribution Guidelines

- **Bug Reports**: Use the issue template
- **Feature Requests**: Discuss in issues first
- **Code Style**: Follow ESLint configuration
- **Commits**: Use conventional commit format
- **Documentation**: Update README if needed

### Areas for Contribution

- 🐛 Bug fixes and improvements
- ✨ New features (discuss first)
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🔍 Test coverage improvements
- 🚀 Performance optimizations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team & Credits

### Development Team

- **Frontend Development**: React.js v19, SCSS, Responsive Design
- **Backend Development**: Node.js, Express v5, MongoDB Atlas
- **Web Scraping**: Automated data collection and aggregation
- **UI/UX Design**: Modern interface with user-centered design
- **DevOps**: Deployment, CI/CD, Monitoring

### Acknowledgments

- Thanks to all contributors who have helped improve this project
- Special thanks to the open-source community for amazing tools and libraries
- E-commerce platforms for data insights

## 📊 Project Stats

<div align="center">

| Metric                 | Value                          |
| ---------------------- | ------------------------------ |
| **Languages**          | JavaScript, SCSS, HTML         |
| **Frameworks**         | React v19, Express v5, Node.js |
| **Database**           | MongoDB v7                     |
| **Lines of Code**      | 10,000+                        |
| **Active Development** | ✅ Yes                         |
| **Contributors**       | Open for contributions         |
| **License**            | MIT                            |

</div>

## 🗺️ Roadmap

### Planned Features

#### Phase 1 (Current)

- ✅ Basic price comparison
- ✅ User authentication
- ✅ Seller dashboard
- ✅ Purchase history tracking

#### Phase 2 (In Progress)

- 🚧 Advanced filtering and search
- 🚧 Price history graphs
- 🚧 Email notifications for price drops
- 🚧 Wishlist functionality

#### Phase 3 (Planned)

- 📋 Mobile application (React Native)
- 📋 Price alerts and notifications
- 📋 Social sharing features
- 📋 Product recommendations AI
- 📋 Multi-language support
- 📋 Payment gateway integration

#### Phase 4 (Future)

- 📋 Browser extension for real-time comparison
- 📋 Machine learning for price prediction
- 📋 Blockchain integration for secure transactions
- 📋 Voice search capability

## � Screenshots

### Homepage

![Homepage](docs/screenshots/homepage.png)
_Browse categories and find best deals_

### Product Comparison

![Product Comparison](docs/screenshots/products.png)
_Compare prices across multiple vendors_

### Seller Dashboard

![Seller Dashboard](docs/screenshots/seller-dashboard.png)
_Manage your products and track sales_

### Purchase History

![Purchase History](docs/screenshots/history.png)
_Track your savings and past purchases_

## ❓ Frequently Asked Questions (FAQ)

### General Questions

**Q: What is DealBasket?**  
A: DealBasket is a price comparison platform that helps users find the best deals by comparing prices across Amazon, Flipkart, BigBasket, and local sellers.

**Q: Is DealBasket free to use?**  
A: Yes, DealBasket is completely free for customers. Sellers may have different pricing tiers in the future.

**Q: How often are prices updated?**  
A: Prices are scraped and updated regularly, typically every few hours, to ensure accuracy.

### For Customers

**Q: Do I need to create an account?**  
A: You can browse products without an account, but you'll need to register to track your purchase history and savings.

**Q: How do I make a purchase?**  
A: Click "Buy Now" on any product to be redirected to the seller's website to complete your purchase.

**Q: Can I get price drop alerts?**  
A: This feature is coming soon in Phase 2 of our roadmap.

### For Sellers

**Q: How do I register as a seller?**  
A: Create an account, then navigate to the Seller Dashboard and complete the seller registration form with your business details.

**Q: What information do I need to provide?**  
A: You'll need shop name, description, contact number, address, business type, and optionally a GST number.

**Q: Is there a fee to list products?**  
A: Currently, there are no fees to list products. This may change in the future.

### Technical Questions

**Q: Can I contribute to the project?**  
A: Absolutely! Check our [Contributing](#-contributing) section for guidelines.

**Q: What technologies are used?**  
A: React v19, Node.js, Express v5, MongoDB, and more. See [Technology Stack](#️-technology-stack).

**Q: Is there an API available?**  
A: Yes, we have a RESTful API. Check [API Endpoints](#-api-endpoints) for details.

## 🔗 Useful Links

- **Documentation**: [Wiki](https://github.com/your-username/DealBasket/wiki)
- **Issue Tracker**: [GitHub Issues](https://github.com/your-username/DealBasket/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/DealBasket/discussions)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)
- **API Documentation**: [API Docs](docs/API.md)

## 📞 Support & Contact

### Get Help

- 📖 **Documentation**: Check our [comprehensive wiki](https://github.com/your-username/DealBasket/wiki)
- 🐛 **Bug Reports**: [Create an issue](https://github.com/your-username/DealBasket/issues/new)
- 💡 **Feature Requests**: [Open a discussion](https://github.com/your-username/DealBasket/discussions)
- 💬 **Community**: Join our developer community

### Contact

- **Email**: support@dealbasket.com
- **Website**: [www.dealbasket.com](https://www.dealbasket.com)
- **LinkedIn**: [DealBasket Official](https://linkedin.com/company/dealbasket)
- **Twitter**: [@DealBasketApp](https://twitter.com/DealBasketApp)

## ⭐ Show Your Support

If you find this project helpful, please consider:

- ⭐ **Starring** the repository
- 🐛 **Reporting bugs** and suggesting features
- 📢 **Sharing** with others who might benefit
- 🤝 **Contributing** to the codebase

## 📜 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

---

<div align="center">

**DealBasket** - Smart Shopping, Maximum Savings! 💰

Made with ❤️ by the DealBasket Team

[Report Bug](https://github.com/your-username/DealBasket/issues) · [Request Feature](https://github.com/your-username/DealBasket/issues) · [Documentation](https://github.com/your-username/DealBasket/wiki)

</div>

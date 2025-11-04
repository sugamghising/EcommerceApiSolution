# E-Commerce Platform - React TypeScript Frontend

A complete, production-ready React TypeScript frontend application for an e-commerce platform. Features user authentication, product browsing, shopping cart management, Stripe payment integration, and admin dashboard.

## 🚀 Features

### User Features

- **Authentication System**: Register, login, and JWT-based session management
- **Product Browsing**: Browse products with search, category filters, and pagination
- **Shopping Cart**: Add/remove items with local storage persistence and server synchronization
- **Checkout Process**: Complete checkout with Stripe payment integration
- **Order History**: View past orders with status tracking
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Admin Features

- **Product Management**: Full CRUD operations for products
- **Admin Dashboard**: Overview of products and orders
- **Protected Routes**: Role-based access control

### Technical Features

- TypeScript for type safety
- Context API for global state management
- React Router for navigation
- Axios with JWT interceptors
- React Hook Form for form validation
- Tailwind CSS for styling
- React Testing Library for unit tests

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (v7 or higher) - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

---

## 🛠️ Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd E-Commerce\ API\ Solutions
```

### Step 2: Navigate to Client Directory

```bash
cd client
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages:

- React & React DOM
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios
- Stripe
- React Hook Form
- Testing libraries
- And all other dependencies

### Step 4: Install Tailwind CSS (If Not Already Configured)

Tailwind CSS should be automatically configured with the provided `tailwind.config.js` and `postcss.config.js` files. If you need to reinstall:

```bash
npm install -D tailwindcss postcss autoprefixer
```

### Step 5: Configure Environment Variables

Create a `.env` file in the `client` directory:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Or manually create the file
New-Item -Path . -Name ".env" -ItemType "file"
```

Edit the `.env` file with your configuration:

```env
# Backend API URL
REACT_APP_API_BASE_URL=http://localhost:5000/api

# Stripe Publishable Key (Get from https://dashboard.stripe.com/test/apikeys)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

**Important Notes:**

- The backend server must be running on `http://localhost:5000` (or update the URL accordingly)
- You need a Stripe account to get the publishable key
- Use Stripe **test mode** keys for development

---

## 🎯 Running the Application

### Development Mode

Start the development server:

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

**Features in Development Mode:**

- Hot module reloading
- Source maps for debugging
- Error overlays
- Fast refresh

### Production Build

Create an optimized production build:

```bash
npm run build
```

This creates a `build` folder with:

- Minified and optimized JavaScript bundles
- CSS optimization and purging
- Asset optimization
- Service worker (if configured)

To test the production build locally:

```bash
# Install a static server
npm install -g serve

# Serve the build folder
serve -s build
```

---

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

This launches the test runner in interactive watch mode.

### Run Tests in CI Mode

```bash
npm test -- --coverage --watchAll=false
```

### Test Files Included

1. **App.test.tsx** - Basic App component rendering
2. **AuthContext.test.tsx** - Authentication logic (login, logout, state management)
3. **CartContext.test.tsx** - Cart operations (add, remove, clear, total calculation)
4. **ProductCard.test.tsx** - Product card component rendering and behavior

---

## 🔗 Running with Backend Server

### Backend Server Setup

1. Navigate to the server directory:

```bash
cd ../server
```

2. Install backend dependencies:

```bash
npm install
```

3. Create `.env` file in the server directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

4. Start the backend server:

```bash
npm run dev
```

### Running Both Frontend and Backend Concurrently

**Option 1: Two Terminals**

Terminal 1 - Backend:

```bash
cd server
npm run dev
```

Terminal 2 - Frontend:

```bash
cd client
npm start
```

**Option 2: Using Concurrently (Recommended)**

From the root directory, you can create a script to run both:

In root `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm start"
  }
}
```

Install concurrently:

```bash
npm install -g concurrently
```

Then run:

```bash
npm run dev
```

---

## 🗺️ Frontend to Backend API Mapping

### Authentication Endpoints

| Frontend Action  | Backend Endpoint     | Method | Description                    |
| ---------------- | -------------------- | ------ | ------------------------------ |
| Register User    | `/api/auth/register` | POST   | Create new user account        |
| Login User       | `/api/auth/login`    | POST   | Authenticate user and get JWT  |
| Get User Profile | `/api/auth/profile`  | GET    | Get authenticated user details |
| Update Profile   | `/api/auth/profile`  | PUT    | Update user information        |

### Product Endpoints

| Frontend Action        | Backend Endpoint           | Method | Description                            |
| ---------------------- | -------------------------- | ------ | -------------------------------------- |
| Get All Products       | `/api/products`            | GET    | Get products with filters & pagination |
| Get Single Product     | `/api/products/:id`        | GET    | Get product details                    |
| Create Product (Admin) | `/api/products`            | POST   | Create new product                     |
| Update Product (Admin) | `/api/products/:id`        | PUT    | Update product details                 |
| Delete Product (Admin) | `/api/products/:id`        | DELETE | Remove product                         |
| Get Categories         | `/api/products/categories` | GET    | Get all product categories             |

### Cart Endpoints

| Frontend Action  | Backend Endpoint    | Method | Description                 |
| ---------------- | ------------------- | ------ | --------------------------- |
| Get Cart         | `/api/cart`         | GET    | Get user's cart             |
| Add to Cart      | `/api/cart`         | POST   | Add item to cart            |
| Update Cart Item | `/api/cart/:itemId` | PUT    | Update item quantity        |
| Remove from Cart | `/api/cart/:itemId` | DELETE | Remove item from cart       |
| Clear Cart       | `/api/cart/clear`   | DELETE | Remove all items            |
| Sync Cart        | `/api/cart/sync`    | POST   | Sync local cart with server |

### Order Endpoints

| Frontend Action             | Backend Endpoint         | Method | Description              |
| --------------------------- | ------------------------ | ------ | ------------------------ |
| Create Order                | `/api/orders`            | POST   | Place new order          |
| Get User Orders             | `/api/orders`            | GET    | Get user's order history |
| Get Order Details           | `/api/orders/:id`        | GET    | Get single order details |
| Update Order Status (Admin) | `/api/orders/:id/status` | PUT    | Update order status      |

### Payment Endpoints

| Frontend Action       | Backend Endpoint              | Method | Description                  |
| --------------------- | ----------------------------- | ------ | ---------------------------- |
| Create Payment Intent | `/api/payments/create-intent` | POST   | Create Stripe payment intent |
| Update Payment Status | `/api/payments/:id/status`    | PUT    | Update payment status        |
| Get Payment History   | `/api/payments`               | GET    | Get user's payment history   |

---

## 📁 Project Structure

```
client/
├── public/                      # Static files
│   ├── index.html              # HTML template
│   ├── manifest.json           # PWA manifest
│   └── robots.txt              # SEO robots file
├── src/
│   ├── api/                    # API layer
│   │   ├── axios.ts           # Axios instance with interceptors
│   │   ├── auth.ts            # Authentication API
│   │   ├── product.ts         # Product API
│   │   ├── cart.ts            # Cart API
│   │   ├── order.ts           # Order API
│   │   └── payment.ts         # Payment API
│   ├── components/            # Reusable components
│   │   ├── common/           # Common UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── product/          # Product components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductList.tsx
│   │   │   └── ProductForm.tsx
│   │   ├── cart/             # Cart components
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   └── auth/             # Auth components
│   │       ├── LoginForm.tsx
│   │       └── RegisterForm.tsx
│   ├── contexts/              # React Context providers
│   │   ├── AuthContext.tsx   # Authentication state
│   │   ├── CartContext.tsx   # Shopping cart state
│   │   └── ProductContext.tsx # Product state
│   ├── hooks/                 # Custom React hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── useFetch.ts
│   ├── pages/                 # Page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ProductPage.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── CartPage.tsx
│   │   ├── Checkout.tsx
│   │   ├── Orders.tsx
│   │   └── Admin/
│   │       ├── Dashboard.tsx
│   │       └── ProductManager.tsx
│   ├── routes/                # Routing configuration
│   │   └── AppRouter.tsx
│   ├── types/                 # TypeScript type definitions
│   │   └── env.d.ts
│   ├── tests/                 # Test files
│   │   ├── AuthContext.test.tsx
│   │   ├── CartContext.test.tsx
│   │   └── ProductCard.test.tsx
│   ├── App.tsx                # Main App component
│   ├── App.test.tsx           # App component tests
│   ├── index.tsx              # Entry point
│   ├── index.css              # Global styles
│   ├── setupTests.ts          # Test setup
│   └── reportWebVitals.ts     # Performance monitoring
├── .env.example               # Environment variable template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
└── README.md                  # This file
```

---

## 🌐 Deployment

### Deploy to Netlify

1. **Build the project:**

```bash
npm run build
```

2. **Install Netlify CLI:**

```bash
npm install -g netlify-cli
```

3. **Deploy:**

```bash
netlify deploy --prod
```

4. **Configure Environment Variables:**

   - Go to Site Settings > Build & Deploy > Environment
   - Add `REACT_APP_API_BASE_URL` (your production API URL)
   - Add `REACT_APP_STRIPE_PUBLISHABLE_KEY`

5. **Continuous Deployment:**
   - Connect your GitHub repository
   - Netlify will auto-deploy on every push to main branch

### Deploy to Vercel

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Deploy:**

```bash
vercel
```

3. **Set Environment Variables:**

```bash
vercel env add REACT_APP_API_BASE_URL
vercel env add REACT_APP_STRIPE_PUBLISHABLE_KEY
```

4. **Production Deployment:**

```bash
vercel --prod
```

### Deploy to AWS S3 + CloudFront

1. **Build the project:**

```bash
npm run build
```

2. **Create S3 bucket:**

   - Enable static website hosting
   - Upload `build` folder contents

3. **Create CloudFront distribution:**

   - Point origin to S3 bucket
   - Configure SSL certificate

4. **Set up CI/CD:**
   - Use AWS CodePipeline or GitHub Actions
   - Configure build and deploy stages

### Environment Variables for Production

**Important:** Update these in your deployment platform:

```env
REACT_APP_API_BASE_URL=https://your-api-domain.com/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_key
```

**Security Notes:**

- Never commit `.env` file to Git
- Use different Stripe keys for production (live mode)
- Ensure backend API has CORS configured for your frontend domain
- Use HTTPS for both frontend and backend in production

---

## 🔐 User Roles & Access

### Regular User

- Browse products
- Add items to cart
- Place orders
- View order history
- Update profile

### Admin User

- All user capabilities
- Create/Edit/Delete products
- View all orders
- Update order statuses
- Access admin dashboard

**Default Admin Credentials** (if seeded in backend):

```
Email: admin@example.com
Password: admin123
```

---

## 🧩 Key Technologies

| Technology            | Version | Purpose            |
| --------------------- | ------- | ------------------ |
| React                 | 18.2.0  | UI framework       |
| TypeScript            | 4.9.5   | Type safety        |
| Tailwind CSS          | 3.3.6   | Styling            |
| React Router          | 6.20.1  | Navigation         |
| Axios                 | 1.6.2   | HTTP client        |
| Stripe                | 2.2.0   | Payment processing |
| React Hook Form       | 7.48.2  | Form handling      |
| React Testing Library | 13.4.0  | Testing            |
| Jest                  | 27.5.1  | Test runner        |

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend API"

**Solution:**

- Ensure backend server is running on the correct port
- Check `REACT_APP_API_BASE_URL` in `.env`
- Verify CORS is configured in backend

### Issue: "Stripe payment not working"

**Solution:**

- Verify `REACT_APP_STRIPE_PUBLISHABLE_KEY` is set
- Use test card: `4242 4242 4242 4242` (any future date, any CVC)
- Check browser console for Stripe errors

### Issue: "Module not found" errors

**Solution:**

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 already in use"

**Solution:**

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
set PORT=3001 && npm start
```

### Issue: "TypeScript compilation errors"

**Solution:**

- Ensure all dependencies are installed
- Check `tsconfig.json` is correctly configured
- Run: `npm run build` to see full error details

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/)
- [Stripe Documentation](https://stripe.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [React Testing Library](https://testing-library.com/react)

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Support

For issues and questions:

1. Check the troubleshooting section above
2. Review backend server logs
3. Check browser console for errors
4. Ensure all environment variables are set correctly

---

## 🎉 Getting Started Checklist

- [ ] Clone the repository
- [ ] Install Node.js and npm
- [ ] Run `npm install` in client directory
- [ ] Create `.env` file with required variables
- [ ] Set up backend server (see server README)
- [ ] Get Stripe API keys (test mode)
- [ ] Start backend server (`npm run dev`)
- [ ] Start frontend (`npm start`)
- [ ] Visit `http://localhost:3000`
- [ ] Register a new user account
- [ ] Browse products and test checkout
- [ ] Run tests (`npm test`)

---

**Happy Coding! 🚀**

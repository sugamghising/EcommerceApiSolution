## E‑Commerce API Solutions

A complete, production-ready full-stack e-commerce platform with TypeScript/Node.js backend and React TypeScript frontend. Features authentication, product management, shopping cart, order processing, and Stripe payment integration.

**Frontend:** React + TypeScript + Tailwind CSS (`client/`)  
**Backend:** Node.js + Express + MongoDB + TypeScript (`server/`)

Inspired by [Roadmap.sh](https://roadmap.sh/projects/ecommerce-api)

### Project structure

```
E-Commerce API Solutions/
├── client/                  # React TypeScript Frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── api/           # API layer (Axios)
│   │   ├── components/    # Reusable React components
│   │   ├── contexts/      # React Context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Routing configuration
│   │   └── tests/         # Unit tests
│   ├── package.json
│   └── README.md          # Frontend documentation
│
├── server/                 # Node.js TypeScript Backend
│   ├── src/
│   │   ├── config/        # DB connection
│   │   ├── controller/    # Route handlers
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # Express routers
│   │   └── utils/         # Helpers (JWT)
│   ├── dist/              # Compiled JavaScript
│   └── package.json
│
└── README.md              # This file
```

### Prerequisites

- **Node.js** 18+ (LTS recommended) - [Download](https://nodejs.org/)
- **npm** 7+ (comes with Node.js)
- **MongoDB** - Local or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Stripe Account** - For payment processing (test mode)

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
# Add: PORT=5000, MONGO_URI, JWT_SECRET, STRIPE_SECRET_KEY

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to client directory (from root)
cd client

# Install dependencies
npm install

# Create .env file
# Add: REACT_APP_API_BASE_URL=http://localhost:5000/api
#      REACT_APP_STRIPE_PUBLISHABLE_KEY=your_key

# Start development server
npm start
```

Frontend will open at `http://localhost:3000`

### 3. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- Register a new user or use admin credentials (if seeded)

---

## 📖 Detailed Documentation

- **Frontend Documentation:** See `client/README.md` for complete frontend setup, features, and deployment
- **Backend Documentation:** Continue reading below for backend API details

---

## Backend Setup (Detailed)

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Create environment file

Create `server/.env` with values for your environment:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NODE_ENV=development
```

### 3. Build and run

Development (auto‑rebuild and restart):

```bash
cd server
npm run dev
```

Production build and start:

```bash
cd server
npm run build
npm start
```

### Available scripts (from `server/`)

- `npm run dev` — Watches `src/`, rebuilds TypeScript, restarts server
- `npm run build` — Compiles TypeScript to `dist/`
- `npm start` — Runs compiled app from `dist/index.js`

### API base URL

- Local default: `http://localhost:5000`

### API Endpoints

Base URL: `http://localhost:5000/api`

#### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

#### Products

- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `GET /api/products/categories` - Get categories

#### Cart

- `GET /api/cart` - Get user cart (protected)
- `POST /api/cart` - Add item to cart (protected)
- `PUT /api/cart/:itemId` - Update cart item (protected)
- `DELETE /api/cart/:itemId` - Remove from cart (protected)
- `DELETE /api/cart/clear` - Clear cart (protected)
- `POST /api/cart/sync` - Sync local cart (protected)

#### Orders

- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order details (protected)
- `PUT /api/orders/:id/status` - Update status (admin only)

#### Payments

- `POST /api/payments/create-intent` - Create payment intent (protected)
- `PUT /api/payments/:id/status` - Update payment status (protected)
- `GET /api/payments` - Get payment history (protected)

For detailed API documentation, see route files in `server/src/routes/*`

### Linting & formatting

ESLint and Prettier are installed. Run from `server/` (add scripts as desired) or use your editor integrations.

### Environment variables

- `PORT` — Port to run the server
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for JWT signing
- `STRIPE_SECRET_KEY` — Stripe secret key (if payments used)
- `NODE_ENV` — `development` or `production`

## 🌐 Deployment

### Backend Deployment

- Build with `npm run build` from `server/`
- Deploy `server/dist/` to platforms like Heroku, Railway, or AWS
- Set environment variables on your hosting platform
- Ensure MongoDB is accessible (use MongoDB Atlas for cloud)

### Frontend Deployment

- Build with `npm run build` from `client/`
- Deploy to Netlify, Vercel, or AWS S3 + CloudFront
- Set `REACT_APP_API_BASE_URL` to your production backend URL
- Set `REACT_APP_STRIPE_PUBLISHABLE_KEY` (use live key for production)

**Security Notes:**

- Never commit `.env` files or secrets to Git
- Use different Stripe keys for development (test) and production (live)
- Enable HTTPS for both frontend and backend in production
- Configure CORS properly in backend for your frontend domain

---

## 🧪 Testing

### Backend Tests

```bash
cd server
npm test
```

### Frontend Tests

```bash
cd client
npm test
```

Run with coverage:

```bash
npm test -- --coverage --watchAll=false
```

---

## 🛠️ Tech Stack

### Frontend

- React 18.2.0
- TypeScript 4.9.5
- Tailwind CSS 3.3.6
- React Router DOM 6.20.1
- Axios 1.6.2
- Stripe (React Stripe.js)
- React Hook Form 7.48.2

### Backend

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Stripe (Node.js SDK)
- Bcrypt for password hashing

---

## 📚 Features

✅ User authentication (register, login, JWT)  
✅ Product browsing with filters and search  
✅ Shopping cart (local storage + server sync)  
✅ Stripe payment integration  
✅ Order management and history  
✅ Admin dashboard for product CRUD  
✅ Protected routes (authentication + role-based)  
✅ Responsive design (mobile-first)  
✅ TypeScript for type safety  
✅ Production-ready code (no placeholders)

---

## 🐛 Troubleshooting

See `client/README.md` for frontend-specific troubleshooting.

### Backend Issues

**MongoDB Connection Failed:**

- Check `MONGO_URI` in `server/.env`
- Ensure MongoDB is running
- Check network/firewall settings

**Port Already in Use:**

```bash
# Change PORT in server/.env
PORT=5001
```

**JWT Authentication Errors:**

- Verify `JWT_SECRET` is set
- Check token expiration settings

---

## 📄 License

MIT License - See individual package.json files

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

---

## 📞 Support

For issues or questions:

- Check documentation in `client/README.md` and `server/README.md`
- Review console logs (browser + server)
- Verify environment variables are set correctly
- Ensure all dependencies are installed

---

**Built with ❤️ using React, TypeScript, Node.js, and MongoDB**

## E‑Commerce API Solutions

TypeScript/Node.js backend for an e‑commerce API with authentication, products, cart, orders, payments, and reviews. The source lives in `server/` and compiles to `server/dist/`.

### Project structure

- `server/src/` — TypeScript source
  - `config/` — DB connection
  - `controller/` — route handlers (users, products, cart, orders, payments)
  - `middleware/` — auth middleware
  - `models/` — Mongoose models
  - `routes/` — Express routers
  - `utils/` — helpers (JWT)
- `server/dist/` — compiled JavaScript output
- `server/package.json` — scripts and deps

### Prerequisites

- Node.js 18+ (LTS recommended)
- MongoDB connection string

### Setup

1) Install dependencies

```bash
cd server
npm install
```

2) Create environment file

Create `server/.env` with values for your environment:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NODE_ENV=development
```

3) Build and run

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

### Common endpoints

Note: Actual route mounts are defined in `server/src/index.ts` and `server/src/routes/*`.

- Auth: register/login/logout (see `userRoutes.ts`/`userController.ts`)
- Products: CRUD and listing (see `productRoutes.ts`/`productController.ts`)
- Cart: add/update/remove items (see `cartRoutes.ts`/`cartController.ts`)
- Orders: create/get/update status (see controllers in `orderController.ts`)

### Linting & formatting

ESLint and Prettier are installed. Run from `server/` (add scripts as desired) or use your editor integrations.

### Environment variables

- `PORT` — Port to run the server
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for JWT signing
- `STRIPE_SECRET_KEY` — Stripe secret key (if payments used)
- `NODE_ENV` — `development` or `production`

### Deployment notes

- Build with `npm run build`, deploy `server/dist/` with Node 18+.
- Ensure environment variables are configured on your platform.
- Never commit `.env`, private keys, or secrets.

### License

ISC (see `server/package.json`).



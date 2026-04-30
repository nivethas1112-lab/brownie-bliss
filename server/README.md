# Brownie Bliss Backend API

Node.js + Express backend with MongoDB for the Brownie Bliss admin dashboard.

## Features

- **Authentication & Authorization** - JWT-based auth with role management
- **Product Management** - Full CRUD with categories, variants, inventory
- **Order Management** - Order lifecycle (pending → processing → shipped → delivered)
- **Customer Management** - Customer profiles and order history
- **Coupon System** - Percentage, fixed, and free shipping coupons
- **Shipping Zones** - Multi-zone shipping configuration
- **Transaction Tracking** - Payment transaction records
- **Inquiry Management** - Customer support ticket system
- **Blog Management** - Content management with SEO
- **Testimonial Moderation** - Customer review approval system
- **File Uploads** - Image upload with multer
- **Dashboard Analytics** - Revenue, orders, customers stats

## Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

```bash
cd server
npm install
```

## Configuration

Copy `.env.example` to `.env` and update:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/brownie_bliss
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@browniebliss.com
ADMIN_PASSWORD=your_secure_password
CLIENT_URL=http://localhost:5173
```

## Database Setup

### Option 1: Local MongoDB
```bash
# Start MongoDB (if using local)
mongod
```

### Option 2: MongoDB Atlas
1. Create cluster at https://cloud.mongodb.com
2. Get connection string
3. Update `MONGODB_URI` in `.env`

### Seed Initial Data
```bash
# Populate database with sample data
node src/seed.js
```

## Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server runs at http://localhost:5000

## API Base URL

```
http://localhost:5000/api/v1
```

## API Endpoints

### Authentication
```
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
```

### Products
```
GET    /api/v1/products                    # List all products (paginated)
GET    /api/v1/products/:id                # Get product by ID
POST   /api/v1/products                    # Create product
PUT    /api/v1/products/:id                # Update product
DELETE /api/v1/products/:id                # Delete product
GET    /api/v1/products/category/:category # Filter by category
```

### Categories
```
GET    /api/v1/categories
GET    /api/v1/categories/:id
POST   /api/v1/categories
PUT    /api/v1/categories/:id
DELETE /api/v1/categories/:id
```

### Cart
```
GET    /api/v1/cart
POST   /api/v1/cart/items
PUT    /api/v1/cart/items/:itemId
DELETE /api/v1/cart/items/:itemId
DELETE /api/v1/cart
POST   /api/v1/cart/apply-coupon
```

### Orders
```
GET    /api/v1/orders
GET    /api/v1/orders/:id
POST   /api/v1/orders
PATCH  /api/v1/orders/:id/status
PATCH  /api/v1/orders/:id/cancel
```

### Customers
```
GET    /api/v1/customers
GET    /api/v1/customers/:id
PUT    /api/v1/customers/:id
DELETE /api/v1/customers/:id
```

### Coupons
```
GET    /api/v1/coupons
GET    /api/v1/coupons/:id
POST   /api/v1/coupons
PUT    /api/v1/coupons/:id
DELETE /api/v1/coupons/:id
POST   /api/v1/coupons/validate
```

### Shipping
```
GET    /api/v1/shipping/zones
PUT    /api/v1/shipping/zones/:id
```

### Transactions
```
GET    /api/v1/transactions
GET    /api/v1/transactions/:id
```

### Inquiries
```
GET    /api/v1/inquiries
GET    /api/v1/inquiries/:id
POST   /api/v1/inquiries
PATCH  /api/v1/inquiries/:id/status
DELETE /api/v1/inquiries/:id
```

### Blogs
```
GET    /api/v1/blogs
GET    /api/v1/blogs/:id
POST   /api/v1/blogs
PUT    /api/v1/blogs/:id
DELETE /api/v1/blogs/:id
```

### Testimonials
```
GET    /api/v1/testimonials
GET    /api/v1/testimonials/:id
POST   /api/v1/testimonials
PUT    /api/v1/testimonials/:id
DELETE /api/v1/testimonials/:id
PATCH  /api/v1/testimonials/:id/approve
```

### Dashboard
```
GET    /api/v1/dashboard/stats
GET    /api/v1/dashboard/recent-orders?limit=5
GET    /api/v1/dashboard/sales?range=7d
```

### Uploads
```
POST   /api/v1/upload/image
GET    /api/v1/upload/static/:filename  # Serves uploaded files
```

## Error Handling

Standard error response format:

```json
{
  "message": "Error description",
  "errors": {}, // validation errors (if any)
  "stack": "..." // in development only
}
```

## Authentication

All protected endpoints require Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

Successful responses:

```json
{
  "data": { ... }, // endpoint-specific data
  "pagination": { // for list endpoints
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Integration with Frontend

The React frontend is pre-configured to use this API:

- Base URL: `http://localhost:5000/api/v1`
- Auth token stored in: `brownie_bliss_auth_token`
- Uses axios with interceptors for auth and error handling

In production, update `VITE_API_URL` in the frontend `.env` to point to your deployed backend.

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── database.js    # MongoDB connection
│   │   └── jwt.js         # JWT utilities
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Auth, error handling
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routes
│   ├── uploads/          # Uploaded files (created automatically)
│   ├── app.js            # Main Express app
│   ├── seed.js           # Database seeder
│   └── index.js
├── .env                  # Environment variables
├── .env.example
├── package.json
└── README.md
```

## Database Schema

### User
Admin/staff/customer accounts with JWT auth

### Category
Product categories with parent-child support

### Product
Full e-commerce product with variants, inventory, SEO

### Cart
User shopping cart with coupon support

### Order
Complete order with address, payment, status tracking

### Customer
Customer profile linked to user account

### Coupon
Percentage, fixed, free shipping types with usage limits

### ShippingZone
Multi-zone shipping configuration

### Transaction
Payment transaction records

### Inquiry
Customer support tickets

### Blog
Content management with author, category

### Testimonial
Customer reviews with moderation

## Security

- Passwords hashed with bcryptjs
- JWT tokens with configurable expiry
- Helmet for security headers
- CORS configured for frontend
- Rate limiting available (recommended for production)

## Deployment

1. **Set environment variables** on your hosting platform:
   - `MONGODB_URI` (from MongoDB Atlas)
   - `JWT_SECRET` (generate secure random string)
   - `CLIENT_URL` (your frontend URL)
   - Other env vars as needed

2. **Install dependencies**: `npm ci --only=production`

3. **Start server**: `npm start`

4. **Frontend configuration**: Update frontend `.env` with production API URL

## License

Private project - Brownie Bliss

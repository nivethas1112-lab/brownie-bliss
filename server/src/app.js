import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Import database connection
import connectDB from './config/database.js';

// Import error handling middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import * as routes from './routes/index.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logging
app.use(cors({
  origin: (origin, callback) => {
    // Allow any localhost origin or the one specified in .env
    if (!origin || origin.startsWith('http://localhost:') || origin === process.env.CLIENT_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes - All prefixed with /api/v1
const apiV1 = express.Router();

apiV1.use('/auth', routes.authRoutes);
apiV1.use('/products', routes.productRoutes);
apiV1.use('/categories', routes.categoryRoutes);
apiV1.use('/cart', routes.cartRoutes);
apiV1.use('/orders', routes.orderRoutes);
apiV1.use('/customers', routes.customerRoutes);
apiV1.use('/coupons', routes.couponRoutes);
apiV1.use('/shipping', routes.shippingRoutes);
apiV1.use('/transactions', routes.transactionRoutes);
apiV1.use('/inquiries', routes.inquiryRoutes);
apiV1.use('/blogs', routes.blogRoutes);
apiV1.use('/testimonials', routes.testimonialRoutes);
apiV1.use('/dashboard', routes.dashboardRoutes);
apiV1.use('/upload', routes.uploadRoutes);
apiV1.use('/users', routes.userRoutes);

app.use('/api/v1', apiV1);

// 404 handler
app.use('*', notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/v1`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;

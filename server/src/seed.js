import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import ShippingZone from './models/ShippingZone.js';

dotenv.config({ path: './.env' });

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/brownie_bliss';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await ShippingZone.deleteMany({});

    // Create admin user
    const admin = await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@browniebliss.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      name: 'Admin User',
      role: 'admin',
      isActive: true,
    });

    console.log('Admin user created:', admin.email);

    // Create categories
    const categories = await Category.create([
      { name: 'Brownies', slug: 'brownies', description: 'Delicious fudgy brownies', image: '/assets1/chocolate-brownie.webp' },
      { name: 'Cakes', slug: 'cakes', description: 'Celebration cakes', image: '/assets1/item-642f5ad0783b8.jpg' },
      { name: 'Tubs', slug: 'tubs', description: 'Delicious dessert tubs', image: '/assets1/TiramisuDessertTub.webp' },
      { name: 'Jar Cakes', slug: 'jar-cakes', description: 'Sweet jar cakes', image: '/assets1/p-red-velvet-jar-cake-150gm-272450-m.avif' },
      { name: 'Cookies', slug: 'cookies', description: 'Fresh baked cookies', image: '/assets1/Cookie-Monster-Cookies.jpg' },
      { name: 'Cupcakes', slug: 'cupcakes', description: 'Delicious cupcakes', image: '/assets1/SOP_Cupcake_web-LG-e1770142023962-2-1200x901.jpg' },
      { name: 'Dream Cakes', slug: 'dream-cakes', description: 'Chocolate dream cakes', image: '/assets1/chocolate-tub-cake.jpg' },
      { name: 'Vegans', slug: 'vegans', description: 'Vegan friendly treats', image: '/assets1/64b95a4329858e4bbafc5e84_IMG_3043.jpg' },
      { name: 'Roll Cakes', slug: 'roll-cakes', description: 'Fresh roll cakes', image: '/assets1/fresh-mango-cake-roll-with-whipped-cream-1-735x735.jpg' },
      { name: 'Gift Boxes', slug: 'gift-boxes', description: 'Curated gift boxes', image: '/assets1/Brownie-Box-delivered-2.jpg' },
    ]);

    console.log('Categories created:', categories.length);

    // Create sample products
    const brownieCategory = categories[0]._id;
    const cookieCategory = categories[1]._id;
    const cakeCategory = categories[2]._id;

    const products = await Product.create([
      {
        name: 'Triple Chocolate Fudgy',
        slug: 'triple-chocolate-fudgy',
        description: 'Ultra-fudgy triple chocolate brownie',
        price: 199,
        cost: 100,
        sku: 'BRW-001',
        category: brownieCategory,
        images: ['/assets1/1737386355174-998of1ip.webp'],
        rating: 4.9,
        badge: 'Best Seller',
        inventory: 100,
        status: 'active',
        featured: true,
      },
      {
        name: 'Red Velvet White Choco',
        slug: 'red-velvet-white-choco',
        description: 'Classic red velvet with white chocolate',
        price: 220,
        cost: 110,
        sku: 'CK-001',
        category: cakeCategory,
        images: ['/assets1/redvelvetcake123aws-1-of-1.jpg'],
        rating: 4.8,
        badge: 'Sale - 10%',
        inventory: 75,
        status: 'active',
        featured: true,
      },
      {
        name: 'Sea Salt Caramel Tub',
        slug: 'sea-salt-caramel-tub',
        description: 'Caramel sea salt dessert tub',
        price: 520,
        cost: 250,
        sku: 'TUB-001',
        category: categories[2]._id, // Tubs
        images: ['/assets1/salted-caramel-ice-cream-260nw-2751842125.webp'],
        rating: 5.0,
        badge: 'New In',
        inventory: 50,
        status: 'active',
        featured: true,
      },
      {
        name: 'Walnut Crunch Brownie',
        slug: 'walnut-crunch-brownie',
        description: 'Chunky walnut chocolate brownie',
        price: 180,
        cost: 90,
        sku: 'BRW-002',
        category: brownieCategory,
        images: ['/assets1/chocolate-walnut-brownie.avif'],
        rating: 4.7,
        inventory: 120,
        status: 'active',
        featured: true,
      },
      {
        name: 'Birthday Cake Slice',
        slug: 'birthday-cake-slice',
        description: 'Celebration birthday cake slice',
        price: 240,
        cost: 120,
        sku: 'CK-002',
        category: cakeCategory,
        images: ['/assets1/images (1).jpg'],
        rating: 4.9,
        inventory: 60,
        status: 'active',
        featured: true,
      },
      {
        name: 'Assorted Treat Box',
        slug: 'assorted-treat-box',
        description: 'Premium assorted dessert box',
        price: 999,
        cost: 450,
        sku: 'BOX-001',
        category: categories[9]._id, // Gift Boxes
        images: ['/assets1/ASSORTEDBOXOF9_10.webp'],
        rating: 5.0,
        badge: 'Luxury',
        inventory: 30,
        status: 'active',
        featured: true,
      },
    ]);

    console.log('Products created:', products.length);

    // Create shipping zones
    await ShippingZone.create([
      {
        name: 'Local Delivery (City Center)',
        regions: 'Downtown, Central, Westside',
        baseRate: 5.00,
        freeThreshold: 50.00,
        estimatedDays: 'Same Day',
        isActive: true,
        priority: 1,
      },
      {
        name: 'Suburban Areas',
        regions: 'North Hills, East End, South Suburbs',
        baseRate: 12.00,
        freeThreshold: 80.00,
        estimatedDays: '1-2 Days',
        isActive: true,
        priority: 2,
      },
      {
        name: 'National Delivery (Standard)',
        regions: 'All other states',
        baseRate: 25.00,
        freeThreshold: 150.00,
        estimatedDays: '3-5 Days',
        isActive: true,
        priority: 3,
      },
      {
        name: 'National Delivery (Express)',
        regions: 'All other states',
        baseRate: 45.00,
        freeThreshold: 250.00,
        estimatedDays: '1-2 Days',
        isActive: true,
        priority: 4,
      },
      {
        name: 'International (Zone 1)',
        regions: 'Canada, Mexico',
        baseRate: 80.00,
        freeThreshold: null,
        estimatedDays: '7-10 Days',
        isActive: false,
        priority: 5,
      },
    ]);

    console.log('Shipping zones created');

    console.log('\n✅ Seed data completed successfully!');
    console.log('📧 Admin login credentials:');
    console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@browniebliss.com'}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('\n⚠️  Please change the default password in production!');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

connectDB().then(() => {
  seedData();
});

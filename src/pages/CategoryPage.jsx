import React from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import Reveal from '../components/Reveal'
import ProductModal from '../components/ProductModal'
import './CategoryPage.css'

const CategoryPage = ({ onAddToCart }) => {
  const { type } = useParams()
  const [selectedProduct, setSelectedProduct] = React.useState(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const openModal = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const categoryData = {
    'brownies': [
      { id: 1, name: 'Triple Chocolate Fudgy', price: '₹199', img: '/assets1/1737386355174-998of1ip.webp', rating: 4.9 },
      { id: 2, name: 'Strawberry Brownie', price: '₹220', img: '/assets1/StrawberrySeductionCakeSlice.webp', rating: 4.8 },
      { id: 3, name: 'Marshmallow Brownie', price: '₹640', img: '/assets1/84229936.avif', rating: 4.7 },
      { id: 4, name: 'Nutella Brownie', price: '₹340', img: '/assets1/overload-chocolate-brownie.jpg', rating: 4.9 },
      { id: 5, name: 'Cheesecake Brownie', price: '₹999', img: '/assets1/cheesecake-brownies-28-1200.jpg', rating: 5.0 },
      { id: 6, name: 'Caramel Brownie', price: '₹720', img: '/assets1/images (6).jpg', rating: 4.9 },
      { id: 7, name: 'Matcha Brownie', price: '₹260', img: '/assets1/Matcha-Brownies-0682-II.jpg', rating: 4.8 },
      { id: 8, name: 'Red Velvet Brownie', price: '₹240', img: '/assets1/images (8).jpg', rating: 4.9 },
      { id: 9, name: 'White Chocolate Brownie', price: '₹280', img: '/assets1/Chocolate-Baileys-Brownies-6.jpg', rating: 4.7 },
    ],
    'cakes': [
      { id: 10, name: 'Blueberry Cake', price: '₹640', img: '/assets1/images (9).jpg', rating: 4.9 },
      { id: 11, name: 'Mousse Cake', price: '₹500', img: '/assets1/image-132765-1745309798.jpeg', rating: 4.8 },
      { id: 12, name: 'Strawberry Seduction', price: '₹600', img: '/assets1/StrawberrySeductionCakeSlice.webp', rating: 4.7 },
      { id: 13, name: 'Blueberry Raw Cake', price: '₹660', img: '/assets1/Raw Blueberry Cheesecake, page 435.jpg', rating: 4.9 },
      { id: 14, name: 'Mango Cake', price: '₹1200', img: '/assets1/images (1).jpg', rating: 5.0 },
      { id: 15, name: 'Vanilla Cream Cake', price: '₹720', img: '/assets1/chocolate-Cake-440x440.webp', rating: 4.9 },
      { id: 16, name: 'White Forest Cake', price: '₹480', img: '/assets1/rosy-white-forest-cake-2-kg_1.webp', rating: 4.8 },
      { id: 17, name: 'Valentine Cake', price: '₹280', img: '/assets1/Vanilla-Cakes.webp', rating: 5.0 },
      { id: 18, name: 'Chocolate Lava Cake', price: '₹880', img: '/assets1/Chocolate-Lava-Cakes-11.jpg', rating: 4.7 },
    ],
    'tubs': [
      { id: 19, name: 'Tiramisu Tub', price: '₹520', img: '/assets1/TiramisuDessertTub.webp', rating: 4.9 },
      { id: 20, name: 'Red Velvet Jar', price: '₹420', img: '/assets1/red-velvet-brownies-pic-735x1103 (1).jpg', rating: 4.8 },
      { id: 21, name: 'Caramel Crunch Tub', price: '₹480', img: '/assets1/salted-caramel-ice-cream-260nw-2751842125.webp', rating: 4.7 },
      { id: 22, name: 'Double Choco Jar', price: '₹380', img: '/assets1/b4418799-b22d-4241-9cd0-ada9a474493e.webp', rating: 4.9 },
      { id: 23, name: 'Butterscotch Delight', price: '₹480', img: '/assets1/16788618111-600x600.jpg', rating: 5.0 },
      { id: 24, name: 'Cookie Crumble Tub', price: '₹520', img: '/assets1/IMG_4132.webp', rating: 4.9 },
      { id: 25, name: 'Nutty Fudge Jar', price: '₹400', img: '/assets1/bbda14b8a22648c2e7fa718c0fbc5154.avif', rating: 4.8 },
      { id: 26, name: 'Berry Bliss Jar', price: '₹460', img: '/assets1/Berry-Bliss-Duo-Cake-Jars.jpg', rating: 5.0 },
      { id: 27, name: 'Coffee Mocha Tub', price: '₹600', img: '/assets1/images (11).jpg', rating: 4.7 },
    ],
    'gift-boxes': [
      { id: 28, name: 'Elite Assorted Box', price: '₹1440', img: '/assets1/EliteBoxCo-session2-day34-14-scaled.webp', rating: 5.0 },
      { id: 29, name: 'Brownie Lover Set', price: '₹1140', img: '/assets1/images (12).jpg', rating: 4.9 },
      { id: 30, name: 'Luxury Party Box', price: '₹1800', img: '/assets1/1000001200.webp', rating: 4.8 },
      { id: 31, name: 'Classic Treats Case', price: '₹900', img: '/assets1/images (13).jpg', rating: 4.9 },
      { id: 32, name: 'Celebration Bundle', price: '₹2000', img: '/assets1/4590.jpg', rating: 5.0 },
      { id: 33, name: 'Gourmet Selection', price: '₹1280', img: '/assets1/gourmet.webp', rating: 4.9 },
      { id: 34, name: 'Mini Sampler Box', price: '₹600', img: '/assets1/81Kr8KPr-hL._AC_UF350,350_QL80_.jpg', rating: 4.8 },
      { id: 35, name: 'Signature Bliss Box', price: '₹1080', img: '/assets1/images (14).jpg', rating: 5.0 },
      { id: 36, name: 'Ultimate Dessert Crate', price: '₹2600', img: '/assets1/1_6e7fc051-858b-4d53-a5b6-b5b2f78488c7.webp', rating: 4.9 },
    ],
    'jar-cakes': [
      { id: 37, name: 'Red Velvet Jar', price: '₹420', img: '/assets1/p-red-velvet-jar-cake-150gm-272450-m.avif', rating: 4.9 },
      { id: 38, name: 'Chocolate Jar Cake', price: '₹380', img: '/assets1/p-red-velvet-jar-cake-150gm-272450-m (1).avif', rating: 4.8 },
      { id: 39, name: 'Butterscotch Jar', price: '₹440', img: '/assets1/Berry-Bliss-Duo-Cake-Jars.jpg', rating: 4.7 },
      { id: 40, name: 'Mango Jar Cake', price: '₹500', img: '/assets1/bbda14b8a22648c2e7fa718c0fbc5154.avif', rating: 4.9 },
      { id: 41, name: 'Vanilla Jar Cake', price: '₹360', img: '/assets1/IMG_4132.webp', rating: 4.8 },
      { id: 42, name: 'Strawberry Jar', price: '₹400', img: '/assets1/TiramisuDessertTub.webp', rating: 4.7 },
    ],
    'cookies': [
      { id: 43, name: 'Cookie Monster Cookie', price: '₹140', img: '/assets1/Cookie-Monster-Cookies.jpg', rating: 4.9 },
      { id: 44, name: 'Choco Chip Cookie', price: '₹120', img: '/assets1/easy_choc_biscuits-59ca9be.jpg', rating: 4.8 },
      { id: 45, name: 'Fresh Strawberry Cookie', price: '₹140', img: '/assets1/fresh-strawberry-cookies-step-9.jpg', rating: 4.7 },
      { id: 46, name: 'Oatmeal Raisin Cookie', price: '₹100', img: '/assets1/HD-wallpaper-cookie-monster-cupcake-cupcake-cookie-cup-cake-cookie-monster-eating.jpg', rating: 4.9 },
      { id: 47, name: 'Double Choco Cookie', price: '₹120', img: '/assets1/C0835_90048480-bcd9-4182-8a64-10d5ee884dcd.webp', rating: 4.8 },
      { id: 48, name: 'Peanut Butter Cookie', price: '₹130', img: '/assets1/Template-Size-for-Blog-Photos-15.jpg', rating: 4.7 },
    ],
    'cupcakes': [
      { id: 49, name: 'Chocolate Cupcake', price: '₹180', img: '/assets1/SOP_Cupcake_web-LG-e1770142023962-2-1200x901.jpg', rating: 4.9 },
      { id: 50, name: 'Vanilla Cupcake', price: '₹160', img: '/assets1/ClassicBrownie.webp', rating: 4.8 },
      { id: 51, name: 'Red Velvet Cupcake', price: '₹200', img: '/assets1/redvelvetcake123aws-1-of-1.jpg', rating: 4.7 },
      { id: 52, name: 'Strawberry Cupcake', price: '₹180', img: '/assets1/Deep-Dish-Fudge-Brownies-For-Two-In-Ramekins-photo-2816b-720x405.jpg', rating: 4.9 },
      { id: 53, name: 'Mint Choco Cupcake', price: '₹200', img: '/assets1/Matcha-Brownies-0682-II.jpg', rating: 4.8 },
      { id: 54, name: 'Lemon Cupcake', price: '₹160', img: '/assets1/cheesecake-brownies-28-1200.jpg', rating: 4.7 },
    ],
    'dream-cakes': [
      { id: 55, name: 'Chocolate Dream Cake', price: '₹1040', img: '/assets1/chocolate-tub-cake.jpg', rating: 4.9 },
      { id: 56, name: 'Mango Dream Cake', price: '₹1160', img: '/assets1/mango-mousse-cake-recipe.jpg', rating: 4.8 },
      { id: 57, name: 'Strawberry Dream Cake', price: '₹1080', img: '/assets1/StrawberrySeductionCakeSlice.webp', rating: 4.7 },
      { id: 58, name: 'Butterscotch Dream', price: '₹1000', img: '/assets1/16788618111-600x600.jpg', rating: 4.9 },
      { id: 59, name: 'Black Forest Dream', price: '₹1200', img: '/assets1/rosy-white-forest-cake-2-kg_1.webp', rating: 4.8 },
      { id: 60, name: 'Blueberry Dream', price: '₹1120', img: '/assets1/HIGHRESBlueberryCheesecake-Square.webp', rating: 4.7 },
    ],
    'vegans': [
      { id: 61, name: 'Vegan Brownie', price: '₹199', img: '/assets1/64b95a4329858e4bbafc5e84_IMG_3043.jpg', rating: 4.9 },
      { id: 62, name: 'Vegan Choco Cake', price: '₹520', img: '/assets1/dark-chocolate.png', rating: 4.8 },
      { id: 63, name: 'Vegan Cookie', price: '₹120', img: '/assets1/Raw Blueberry Cheesecake, page 435.jpg', rating: 4.7 },
      { id: 64, name: 'Vegan Muffin', price: '₹140', img: '/assets1/ClassicBrownie.webp', rating: 4.9 },
      { id: 65, name: 'Vegan Cupcake', price: '₹180', img: '/assets1/gourmet.webp', rating: 4.8 },
      { id: 66, name: 'Vegan Donut', price: '₹160', img: '/assets1/KennyHillsCakes_1x1-3749.jpg', rating: 4.7 },
    ],
    'roll-cakes': [
      { id: 67, name: 'Mango Roll Cake', price: '₹640', img: '/assets1/fresh-mango-cake-roll-with-whipped-cream-1-735x735.jpg', rating: 4.9 },
      { id: 68, name: 'Strawberry Roll Cake', price: '₹600', img: '/assets1/image-132765-1745309798.jpeg', rating: 4.8 },
      { id: 69, name: 'Choco Roll Cake', price: '₹620', img: '/assets1/Chocolate-Lava-Cakes-11.jpg', rating: 4.7 },
      { id: 70, name: 'Matcha Roll Cake', price: '₹680', img: '/assets1/Matcha-hot-chocolate-photos-1000-wide-3.jpg', rating: 4.9 },
      { id: 71, name: 'Red Velvet Roll', price: '₹640', img: '/assets1/red-velvet-brownies-pic-735x1103.jpg', rating: 4.8 },
      { id: 72, name: 'Blueberry Roll', price: '₹580', img: '/assets1/images.jpg', rating: 4.7 },
    ]
  }

  const products = categoryData[type.toLowerCase()] || categoryData['brownies']

  return (
    <div className="category-page">
      <header className="category-header">
        <div className="container">
          <Reveal>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="capitalize"
            >
              {type}
            </motion.h1>
            <p>Handcrafted {type.toLowerCase()} made with the finest ingredients.</p>
          </Reveal>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="product-grid">
            {products.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.1}>
                <div className="product-card" onClick={() => openModal(item)} style={{ cursor: 'pointer' }}>
                  <div className="card" style={{ height: '100%', padding: '1.5rem' }}>
                    <div className="product-img-wrapper">
                      <img src={item.img} alt={item.name} className="product-img" />
                    </div>
                    <div className="product-info">
                      <div className="product-meta">
                        <span className="product-rating"><Star size={16} fill="var(--brown-primary)" /> {item.rating}</span>
                        <span className="product-price">{item.price}</span>
                      </div>
                      <h3 className="product-name">{item.name}</h3>
                      <button className="btn-add">Quick View</button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={selectedProduct} 
        onAddToCart={onAddToCart}
      />
    </div>
  )
}

export default CategoryPage

import React from 'react'
import { motion } from 'framer-motion'
import Reveal from '../components/Reveal'
import './About.css'

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <Reveal>
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Our Sweet Story
            </motion.h1>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <Reveal delay={0.2}>
            <div className="about-image">
              <img src="/assets/joyful-baking-team-stockcake.webp" alt="Baking Process" />
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="about-text">
              <h2>Born out of Love for Chocolate</h2>
              <p>Brownie Bliss started in a small kitchen with a simple mission: to create the world's most decadent brownies. We spent months perfecting our signature recipe, balancing the richness of Belgian chocolate with a perfectly fudgy texture.</p>
              <p>Today, we've grown into a beloved bakery, but our heart remains the same. Every batch is still handcrafted using premium, ethically sourced ingredients. We believe that life is too short for mediocre desserts.</p>
              <div className="about-promise-mission">
                <p><strong>Our Promise:</strong> Focus on quality ingredients like real butter, premium cocoa, and fresh ingredients (no preservatives).</p>
                <p><strong>The Mission:</strong> Bringing joy through indulgence, creating memories, or providing the best gooey, rich, or fudgy brownie experience.</p>
              </div>
              <div className="about-stats">
                <div className="stat">
                  <h3>10+</h3>
                  <p>Years of Baking</p>
                </div>
                <div className="stat">
                  <h3>25+</h3>
                  <p>Secret Recipes</p>
                </div>
                <div className="stat">
                  <h3>50k+</h3>
                  <p>Happy Souls</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section values-section">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <h2 className="section-title">The Brownie Bliss Difference</h2>
              <p className="section-subtitle">What makes our brownies irresistible</p>
            </div>
          </Reveal>
          <div className="values-grid">
            <Reveal delay={0.1}>
              <div className="value-card">
                <div className="value-icon">🍫</div>
                <h3>Premium Belgian Chocolate</h3>
                <p>We source only the finest chocolate for that sets our brownies apart.</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="value-card">
                <div className="value-icon">🧈</div>
                <h3>Real Butter, Always</h3>
                <p>No margarine or substitutes. Just pure, creamy butter that gives our brownies that perfect texture.</p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="value-card">
                <div className="value-icon">🌿</div>
                <h3>Fresh & Natural</h3>
                <p>No preservatives, no artificial flavors. Every batch is made fresh with organic, quality ingredients.</p>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="value-card">
                <div className="value-icon">👨‍🍳</div>
                <h3>Handcrafted with Love</h3>
                <p>Each pan is mixed and baked by hand. Our bakers put heart into every single brownie.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section memory-section">
        <div className="container">
          <Reveal>
            <div className="memory-content">
              <h2>Creating Sweet Memories</h2>
              <p className="memory-text">From birthday parties to cozy movie nights, from celebrations to simple indulgences, Brownie Bliss is there for every moment. We don't just bake brownies — we bake happiness, share love, and create memories that last a lifetime. Because every bite should be a moment of pure bliss.</p>
              <div className="memory-quote">
                <blockquote>"Life is uncertain. Eat dessert first."</blockquote>
                <cite>— Brownie Bliss Philosophy</cite>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section chef-section">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <h2 className="section-title">Meet the Master Baker</h2>
              <p>The heart and soul behind every bite</p>
            </div>
          </Reveal>
          <div className="chef-grid">
            <Reveal delay={0.2}>
              <div className="chef-image">
                <img src="/assets/1757990062918.jpg" alt="Master Baker" />
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="chef-info card">
                <h3>Chef Isabella Rivera</h3>
                <p className="chef-title">Founder & Executive Pastry Chef</p>
                <p>With over 15 years of experience in French patisseries, Isabella brought her passion for fine chocolate to the creation of Brownie Bliss. She believes that a brownie isn't just a dessert; it's a moment of pure, unadulterated joy.</p>
                <div className="chef-signature">
                  Isabella Rivera
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

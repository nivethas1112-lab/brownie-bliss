import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Plus, Minus } from 'lucide-react'
import Reveal from '../components/Reveal'
import './Contact.css'

const Contact = () => {
  const [openFaq, setOpenFaq] = React.useState(null)

  const faqs = [
    { q: "Do you deliver nationwide?", a: "Yes, we deliver our brownies and gift boxes nationwide using express shipping to ensure freshness." },
    { q: "Can I customize the brownies?", a: "Absolutely! We offer customizations for bulk orders and special occasions. Contact us for more details." },
    { q: "Are there any gluten-free options?", a: "We currently have a signature gluten-free fudge brownie. Check our categories section for availability." },
    { q: "How long do the brownies stay fresh?", a: "Our brownies stay fresh for up to 10 days in an airtight container, or up to 3 months if frozen." }
  ]

  return (
    <div className="contact-page">
      <header className="contact-header">
        <div className="container">
          <Reveal>
            <h1>Get in Touch</h1>
            <p>Have a question or a special order? We'd love to hear from you!</p>
          </Reveal>
        </div>
      </header>

      <section className="section">
        <div className="container contact-grid">
          <Reveal delay={0.2}>
            <div className="contact-info-cards">
              <div className="info-card card">
                <div className="icon-box"><Mail /></div>
                <div>
                  <h3>Email Us</h3>
                  <p>hello@browniebliss.com</p>
                </div>
              </div>
              <div className="info-card card">
                <div className="icon-box"><Phone /></div>
                <div>
                  <h3>Call Us</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="info-card card">
                <div className="icon-box"><MapPin /></div>
                <div>
                  <h3>Visit Us</h3>
                  <p>123 Dessert Lane, Sweet City, NY</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="contact-form-container card">
              <form className="contact-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="John Doe" required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="john@example.com" required />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select>
                    <option>General Inquiry</option>
                    <option>Bulk Order</option>
                    <option>Gift Box Customization</option>
                    <option>Feedback</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Your Message</label>
                  <textarea rows="5" placeholder="Tell us how we can help..."></textarea>
                </div>
                <button type="submit" className="btn-primary w-full">
                  Send Message <Send size={18} />
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <h2 className="section-title">Common Questions</h2>
              <p>Everything you need to know about Brownie Bliss</p>
            </div>
          </Reveal>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div 
                  className={`faq-item card ${openFaq === index ? 'open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="faq-question">
                    <h3>{faq.q}</h3>
                    {openFaq === index ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="faq-answer"
                      >
                        <p>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact

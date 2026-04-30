/**
 * Environment configuration
 * Provides typed access to environment variables
 */

export const env = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  apiVersion: import.meta.env.VITE_API_VERSION || 'v1',

  // Authentication
  authTokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'brownie_bliss_auth_token',

  // Payment
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',

  // Features
  enableCart: import.meta.env.VITE_ENABLE_CART !== 'false',
  enablePayment: import.meta.env.VITE_ENABLE_PAYMENT !== 'false',
  enableReviews: import.meta.env.VITE_ENABLE_REVIEWS !== 'false',

  // Helper to construct full API URL
  getApiUrl: (endpoint = '') => {
    const base = `${env.apiUrl}/${env.apiVersion}`.replace(/\/+$/, '');
    return endpoint ? `${base}/${endpoint.replace(/^\/+/, '')}` : base;
  }
};

export default env;

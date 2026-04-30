import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../services/api.js';
import env from '../config/env.js';

/**
 * Cart Store - Manages shopping cart state
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      isCartOpen: false,
      isLoading: false,
      error: null,
      totalItems: 0,
      subtotal: 0,

      // Modal actions
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      // Internal helper to update totals
      updateTotals: () => {
        const items = get().items;
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
        set({ totalItems, subtotal });
      },

      // API actions
      fetchCart: async () => {
        const token = localStorage.getItem(env.authTokenKey);
        if (!token) {
          get().updateTotals();
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const data = await api.cart.get();
          const rawItems = data.cart?.items || data.items || [];
          // Normalize items
          const items = rawItems.map(item => ({
            id: item._id,
            productId: item.product?._id || item.product?.id,
            name: item.product?.name,
            price: item.product?.price,
            image: item.product?.images?.[0] || item.product?.image,
            quantity: item.quantity
          }));
          set({ items, isLoading: false });
          get().updateTotals();
        } catch (error) {
          set({ error: error.message, isLoading: false });
          get().updateTotals();
        }
      },

      addItem: async (product, quantity = 1) => {
        const token = localStorage.getItem(env.authTokenKey);
        const productId = product._id || product.id || product.productId;

        // Auto-open cart
        set({ isCartOpen: true });

        if (!token) {
          // Guest mode - Local only
          get().addItemOptimistic(product, quantity);
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const data = await api.cart.addItem(productId, quantity);
          const rawItems = data.cart?.items || data.items || [];
          const items = rawItems.map(item => ({
            id: item._id,
            productId: item.product?._id || item.product?.id,
            name: item.product?.name,
            price: item.product?.price,
            image: item.product?.images?.[0] || item.product?.image,
            quantity: item.quantity
          }));
          set({ items, isLoading: false });
          get().updateTotals();
        } catch (error) {
          console.error('Cart sync error:', error);
          get().addItemOptimistic(product, quantity);
          set({ isLoading: false });
        }
      },

      updateItem: async (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const token = localStorage.getItem(env.authTokenKey);
        if (!token) {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          }));
          get().updateTotals();
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const data = await api.cart.updateItem(itemId, quantity);
          const rawItems = data.cart?.items || data.items || [];
          const items = rawItems.map(item => ({
            id: item._id,
            productId: item.product?._id || item.product?.id,
            name: item.product?.name,
            price: item.product?.price,
            image: item.product?.images?.[0] || item.product?.image,
            quantity: item.quantity
          }));
          set({ items, isLoading: false });
          get().updateTotals();
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      removeItem: async (itemId) => {
        const token = localStorage.getItem(env.authTokenKey);
        if (!token) {
          set((state) => ({
            items: state.items.filter((item) => item.id !== itemId),
          }));
          get().updateTotals();
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const data = await api.cart.removeItem(itemId);
          const rawItems = data.cart?.items || data.items || [];
          const items = rawItems.map(item => ({
            id: item._id,
            productId: item.product?._id || item.product?.id,
            name: item.product?.name,
            price: item.product?.price,
            image: item.product?.images?.[0] || item.product?.image,
            quantity: item.quantity
          }));
          set({ items, isLoading: false });
          get().updateTotals();
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      clearCart: async () => {
        const token = localStorage.getItem(env.authTokenKey);
        if (!token) {
          set({ items: [], totalItems: 0, subtotal: 0 });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          await api.cart.clear();
          set({ items: [], totalItems: 0, subtotal: 0, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Local-only optimistic updates
      addItemOptimistic: (product, quantity = 1) => {
        const items = get().items;
        const productId = product._id || product.id || product.productId;
        const existingItem = items.find((item) => item.productId === productId);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: `temp-${Date.now()}`,
                productId: productId,
                name: product.name,
                price: product.price,
                image: product.image || product.img || (product.images && product.images[0]),
                quantity: quantity,
              },
            ],
          });
        }
        get().updateTotals();
      },

      // Clear cart after successful order
      reset: () => set({ items: [], totalItems: 0, subtotal: 0 }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        isCartOpen: state.isCartOpen,
        totalItems: state.totalItems,
        subtotal: state.subtotal,
      }),
    }
  )
);

export default useCartStore;

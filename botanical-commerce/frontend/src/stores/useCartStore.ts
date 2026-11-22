import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ICart, ICartItem } from '../types';
import { fetchApi } from '../lib/api';

interface CartState {
  cart: ICart | null;
  isLoading: boolean;
  isOpen: boolean;
  guestToken: string;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, variantSku: string, quantity?: number) => Promise<void>;
  updateQuantity: (variantSku: string, quantity: number) => Promise<void>;
  removeItem: (variantSku: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      isOpen: false,
      guestToken: typeof window !== 'undefined'
        ? (localStorage.getItem('aranya_guest_token') || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`)
        : '',

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      fetchCart: async () => {
        try {
          set({ isLoading: true });
          const res = await fetchApi('/cart');
          set({ cart: res.data });
        } catch (error) {
          console.error('[Cart] Fetch cart error:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (productId: string, variantSku: string, quantity = 1) => {
        try {
          set({ isLoading: true });
          const res = await fetchApi('/cart/items', {
            method: 'POST',
            body: JSON.stringify({
              productId,
              variantSku,
              quantity,
              guestToken: get().guestToken,
            }),
          });
          set({ cart: res.data, isOpen: true });
        } catch (error) {
          console.error('[Cart] Add item error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantSku: string, quantity: number) => {
        try {
          set({ isLoading: true });
          const res = await fetchApi(`/cart/items/${variantSku}`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity }),
          });
          set({ cart: res.data });
        } catch (error) {
          console.error('[Cart] Update quantity error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (variantSku: string) => {
        try {
          set({ isLoading: true });
          const res = await fetchApi(`/cart/items/${variantSku}`, {
            method: 'DELETE',
          });
          set({ cart: res.data });
        } catch (error) {
          console.error('[Cart] Remove item error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      applyCoupon: async (code: string) => {
        try {
          set({ isLoading: true });
          const res = await fetchApi('/cart/coupon', {
            method: 'POST',
            body: JSON.stringify({ code }),
          });
          set({ cart: res.data });
        } catch (error) {
          console.error('[Cart] Apply coupon error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => set({ cart: null }),
    }),
    {
      name: 'aranya_cart_state',
      partialize: (state) => ({ guestToken: state.guestToken }),
    }
  )
);

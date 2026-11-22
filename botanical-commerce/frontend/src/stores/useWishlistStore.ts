import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IProduct } from '../types';

interface WishlistState {
  items: IProduct[];
  toggleWishlist: (product: IProduct) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (product: IProduct) => {
        const current = get().items;
        const exists = current.some((p) => p._id === product._id);
        if (exists) {
          set({ items: current.filter((p) => p._id !== product._id) });
        } else {
          set({ items: [...current, product] });
        }
      },
      isInWishlist: (productId: string) => {
        return get().items.some((p) => p._id === productId);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'aranya_wishlist_state',
    }
  )
);

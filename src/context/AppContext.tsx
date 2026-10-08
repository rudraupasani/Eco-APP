import React, { createContext, useContext, useState } from 'react';
import { CartItem, Product, Review, UserProfile } from '../types';
import { MOCK_PRODUCTS, MOCK_REVIEWS, MOCK_USER } from '../constants/mockData';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  user: UserProfile;
  activeFilter: string;
  searchQuery: string;
  toastMessage: string | null;
  selectedSizeModalProduct: Product | null;
  reviews: Record<string, Review[]>;
  addToCart: (product: Product, size?: string, colorName?: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  setActiveFilter: (category: string) => void;
  setSearchQuery: (query: string) => void;
  openSizeModal: (product: Product) => void;
  closeSizeModal: () => void;
  showToast: (msg: string) => void;
  placeOrder: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  addReview: (
    productId: string,
    reviewData: {
      rating: number;
      title: string;
      comment: string;
      fitFeedback?: 'Runs Small' | 'True to Size' | 'Runs Large';
      userName?: string;
    }
  ) => void;
  getSuggestedProducts: (currentProduct: Product) => Product[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [reviews, setReviews] = useState<Record<string, Review[]>>(MOCK_REVIEWS);
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: MOCK_PRODUCTS[0], // Heavyweight Knit Crewneck
      selectedSize: 'S',
      selectedColor: MOCK_PRODUCTS[0].colors[0],
      quantity: 1,
    },
    {
      product: MOCK_PRODUCTS[1], // Court Low Leather
      selectedSize: 'UK 8',
      selectedColor: MOCK_PRODUCTS[1].colors[0],
      quantity: 1,
    },
    {
      product: MOCK_PRODUCTS[2], // Cotton Overshirt
      selectedSize: 'M',
      selectedColor: MOCK_PRODUCTS[2].colors[0],
      quantity: 1,
    },
  ]);
  const [wishlist, setWishlist] = useState<string[]>(['1', '2', '4', '7']);
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedSizeModalProduct, setSelectedSizeModalProduct] = useState<Product | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const addToCart = (product: Product, size?: string, colorName?: string) => {
    const sizeToUse = size || product.sizes[0];
    const colorToUse = colorName
      ? product.colors.find((c) => c.name === colorName) || product.colors[0]
      : product.colors[0];

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === sizeToUse
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            selectedSize: sizeToUse,
            selectedColor: colorToUse,
            quantity: 1,
          },
        ];
      }
    });
    showToast(`Added ${product.name} (${sizeToUse}) to bag`);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedSize === size)));
    showToast('Item removed from bag');
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from saved items');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist');
        return [...prev, productId];
      }
    });
  };

  const openSizeModal = (product: Product) => {
    setSelectedSizeModalProduct(product);
  };

  const closeSizeModal = () => {
    setSelectedSizeModalProduct(null);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const addReview = (
    productId: string,
    reviewData: {
      rating: number;
      title: string;
      comment: string;
      fitFeedback?: 'Runs Small' | 'True to Size' | 'Runs Large';
      userName?: string;
    }
  ) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName: reviewData.userName || user.name || 'Anonymous User',
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      date: 'Just now',
      fitFeedback: reviewData.fitFeedback || 'True to Size',
      verifiedPurchase: true,
    };

    setReviews((prev) => {
      const existing = prev[productId] || [];
      const updatedList = [newRev, ...existing];
      return { ...prev, [productId]: updatedList };
    });

    // Recalculate average rating & review count for the product
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === productId) {
          const currentRevs = [newRev, ...(reviews[productId] || [])];
          const newCount = p.reviewCount + 1;
          const totalStars = currentRevs.reduce((acc, r) => acc + r.rating, 0);
          const newRating = Number((totalStars / currentRevs.length).toFixed(1));
          return {
            ...p,
            rating: newRating,
            reviewCount: newCount,
          };
        }
        return p;
      })
    );

    showToast('Thank you! Your review has been added.');
  };

  const getSuggestedProducts = (currentProduct: Product): Product[] => {
    if (!currentProduct) return products.slice(0, 4);

    // Filter out current product
    const others = products.filter((p) => p.id !== currentProduct.id);

    // Prioritize products in the same category or brand
    const sameCategory = others.filter((p) => p.category === currentProduct.category);
    const sameBrand = others.filter((p) => p.brand === currentProduct.brand && p.category !== currentProduct.category);
    const remaining = others.filter((p) => p.category !== currentProduct.category && p.brand !== currentProduct.brand);

    const combined = [...sameCategory, ...sameBrand, ...remaining];
    return combined.slice(0, 4);
  };

  const placeOrder = () => {
    clearCart();
    setUser((prev) => ({
      ...prev,
      activeOrder: {
        orderId: `WEFT-${Math.floor(10000 + Math.random() * 90000)}`,
        itemCount: getCartCount() || 3,
        deliveryDate: 'Wed 12 Aug',
        status: 'Arriving Wed 12 Aug',
      },
    }));
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        wishlist,
        user,
        activeFilter,
        searchQuery,
        toastMessage,
        selectedSizeModalProduct,
        reviews,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        setActiveFilter,
        setSearchQuery,
        openSizeModal,
        closeSizeModal,
        showToast,
        placeOrder,
        getCartTotal,
        getCartCount,
        addReview,
        getSuggestedProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};


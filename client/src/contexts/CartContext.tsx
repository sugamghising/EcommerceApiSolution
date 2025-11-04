import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { cartAPI, CartItem } from "../api/cart";
import { Product } from "../api/product";

interface CartContextType {
  items: CartItem[];
  total: number;
  loading: boolean;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Calculate total - safely handle undefined items
  const total = (items || []).reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const itemCount = (items || []).reduce((sum, item) => sum + item.quantity, 0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (isAuthenticated) {
          // Fetch cart from backend if authenticated
          setLoading(true);
          const cartData = await cartAPI.getCart();
          setItems(cartData.items || []);
        } else {
          // Load from localStorage if not authenticated
          const storedCart = localStorage.getItem("cart");
          if (storedCart) {
            setItems(JSON.parse(storedCart));
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        // Fallback to localStorage
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          setItems(JSON.parse(storedCart));
        } else {
          setItems([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated]);

  // Sync cart to localStorage whenever items change
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  // Sync local cart to backend when user logs in
  useEffect(() => {
    const syncCartOnLogin = async () => {
      if (isAuthenticated && items.length > 0) {
        try {
          await cartAPI.syncCart(items);
          const syncedCart = await cartAPI.getCart();
          setItems(syncedCart.items);
        } catch (error) {
          console.error("Error syncing cart:", error);
        }
      }
    };

    syncCartOnLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const addItem = async (product: Product, quantity: number = 1) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        // Add to backend cart
        const updatedCart = await cartAPI.addToCart({
          productId: product._id,
          quantity,
        });
        setItems(updatedCart.items);
      } else {
        // Add to local cart
        setItems((prevItems) => {
          const existingItem = prevItems.find(
            (item) => item.product._id === product._id
          );

          if (existingItem) {
            return prevItems.map((item) =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }

          return [...prevItems, { product, quantity }];
        });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        // Remove from backend cart
        const updatedCart = await cartAPI.removeFromCart(productId);
        setItems(updatedCart.items);
      } else {
        // Remove from local cart
        setItems((prevItems) =>
          prevItems.filter((item) => item.product._id !== productId)
        );
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    try {
      setLoading(true);

      if (isAuthenticated) {
        // Update backend cart
        const updatedCart = await cartAPI.updateCartItem({
          productId,
          quantity,
        });
        setItems(updatedCart.items);
      } else {
        // Update local cart
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.product._id === productId ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        await cartAPI.clearCart();
      }

      setItems([]);
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: CartContextType = {
    items,
    total,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { demoUsers, mockProducts, mockOrders } from '@/lib/mockData';

interface User {
  id: string;
  role: 'client' | 'seller';
  email: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  brand: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  sellerId: string;
}

interface CartItem {
  productId: string;
  quantity: number;
}

interface Order {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'delivered';
  date: string;
  deliveryInfo: {
    name: string;
    address: string;
    phone: string;
  };
}

interface AppContextType {
  // Auth
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Favorites
  favorites: string[];
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  
  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'date'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('gdk-user');
    const savedCart = localStorage.getItem('gdk-cart');
    const savedFavorites = localStorage.getItem('gdk-favorites');
    const savedProducts = localStorage.getItem('gdk-products');
    const savedOrders = localStorage.getItem('gdk-orders');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('gdk-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gdk-user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('gdk-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gdk-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('gdk-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('gdk-orders', JSON.stringify(orders));
  }, [orders]);

  // Auth functions
  const login = (email: string, password: string): boolean => {
    const foundUser = demoUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser({
        id: foundUser.id,
        role: foundUser.role,
        email: foundUser.email,
        name: foundUser.name
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setFavorites([]);
  };

  // Product functions
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Cart functions
  const addToCart = (productId: string, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.productId === productId);
      if (existingItem) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Favorites functions
  const addToFavorites = (productId: string) => {
    setFavorites(prev => [...prev, productId]);
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(id => id !== productId));
  };

  // Order functions
  const createOrder = (orderData: Omit<Order, 'id' | 'date'>) => {
    const newOrder = {
      ...orderData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      favorites,
      addToFavorites,
      removeFromFavorites,
      orders,
      createOrder,
      updateOrderStatus
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
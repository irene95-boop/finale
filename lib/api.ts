const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API Error');
    }

    return data;
  }

  // Auth methods
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    this.token = data.token;
    return data;
  }

  async register(userData: any) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    this.token = data.token;
    return data;
  }

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.token = null;
  }

  // Product methods
  async getProducts(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/products${queryString}`);
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  // Order methods
  async createOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getMyOrders() {
    return this.request('/orders/my-orders');
  }

  async getVendorOrders() {
    return this.request('/orders/vendor-orders');
  }

  async updateOrderStatus(id: string, status: string, trackingNumber?: string) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, trackingNumber }),
    });
  }

  // Cart methods
  async addToCart(productId: string, quantity: number = 1) {
    return this.request('/users/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async getCart() {
    return this.request('/users/cart');
  }

  async updateCartItem(productId: string, quantity: number) {
    return this.request(`/users/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(productId: string) {
    return this.request(`/users/cart/${productId}`, {
      method: 'DELETE',
    });
  }

  // Favorites methods
  async addToFavorites(productId: string) {
    return this.request(`/users/favorites/${productId}`, {
      method: 'POST',
    });
  }

  async removeFromFavorites(productId: string) {
    return this.request(`/users/favorites/${productId}`, {
      method: 'DELETE',
    });
  }

  async getFavorites() {
    return this.request('/users/favorites');
  }

  // Review methods
  async createReview(reviewData: any) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getProductReviews(productId: string) {
    return this.request(`/reviews/product/${productId}`);
  }
}

export const api = new ApiClient();
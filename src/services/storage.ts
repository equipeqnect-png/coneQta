import { Producer, Product, Order, CartItem, AppUser, ChatMessage, SealItem, ReviewItem, CategoryDef, ProducerStory, StoryComment } from '../types';
import { 
  INITIAL_PRODUCERS, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_USERS, 
  INITIAL_SEALS, 
  INITIAL_CATEGORIES, 
  INITIAL_REVIEWS, 
  INITIAL_STORIES,
  INITIAL_CHATS 
} from '../data/mockData';

const PRODUCERS_KEY = 'coneqta_producers_v3';
const PRODUCTS_KEY = 'coneqta_products_v3';
const ORDERS_KEY = 'coneqta_orders_v3';
const CART_KEY = 'coneqta_cart_v3';
const USERS_KEY = 'coneqta_users_v3';
const SEALS_KEY = 'coneqta_seals_v3';
const CATEGORIES_KEY = 'coneqta_categories_v3';
const REVIEWS_KEY = 'coneqta_reviews_v3';
const STORIES_KEY = 'coneqta_stories_v3';
const CHATS_KEY = 'coneqta_chats_v3';
const FAVORITES_KEY = 'coneqta_favorites_v3';
const CURRENT_USER_KEY = 'coneqta_current_user_v3';
const USER_ADDRESS_KEY = 'coneqta_user_address_v3';

export interface UserAddressConfig {
  label: string;
  address: string;
  neighborhood: string;
  city: string;
}

export const DEFAULT_USER_ADDRESS: UserAddressConfig = {
  label: 'Sítio Vivian – Sede 🏡',
  address: 'Estrada do Sol, 450',
  neighborhood: 'Zona Rural',
  city: 'Queimados, RJ',
};

export interface UserLocation {
  city: string;
  state: string;
  neighborhood: string;
  maxDistanceKm: number;
}

export const DEFAULT_USER_LOCATION: UserLocation = {
  city: 'Queimados',
  state: 'RJ',
  neighborhood: 'Zona Rural',
  maxDistanceKm: 30,
};

export class StorageService {
  static logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.dispatchEvent(new Event('coneqta_user_changed'));
  }

  static saveChatMessage(msg: ChatMessage): void {
    this.sendChatMessage(msg);
  }

  static getUserLocation(): UserLocation {
    return DEFAULT_USER_LOCATION;
  }

  static saveUserLocation(_loc: UserLocation): void {
    // no-op compatibility
  }
  // Producers
  static getProducers(): Producer[] {
    try {
      const data = localStorage.getItem(PRODUCERS_KEY);
      if (!data) {
        localStorage.setItem(PRODUCERS_KEY, JSON.stringify(INITIAL_PRODUCERS));
        return INITIAL_PRODUCERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PRODUCERS;
    }
  }

  static saveProducer(producer: Producer): void {
    const producers = this.getProducers();
    const index = producers.findIndex((p) => p.id === producer.id);
    if (index >= 0) {
      producers[index] = producer;
    } else {
      producers.unshift(producer);
    }
    localStorage.setItem(PRODUCERS_KEY, JSON.stringify(producers));
    window.dispatchEvent(new Event('coneqta_storage_updated'));

    // Asynchronous backend database persistence
    fetch(`/api/producers/${producer.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producer),
    }).catch(err => console.warn('API sync warning:', err));
  }

  // Products
  static getProducts(): Product[] {
    try {
      const data = localStorage.getItem(PRODUCTS_KEY);
      if (!data) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  static saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('coneqta_storage_updated'));

    // Asynchronous backend database persistence
    fetch(index >= 0 ? `/api/products/${product.id}` : '/api/products', {
      method: index >= 0 ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    }).catch(err => console.warn('API sync warning:', err));
  }

  static deleteProduct(productId: string): void {
    const products = this.getProducts().filter((p) => p.id !== productId);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('coneqta_storage_updated'));

    fetch(`/api/products/${productId}`, {
      method: 'DELETE',
    }).catch(err => console.warn('API sync warning:', err));
  }

  static incrementProductClick(productId: string): void {
    const products = this.getProducts();
    const product = products.find((p) => p.id === productId);
    if (product) {
      product.clicksCount = (product.clicksCount || 0) + 1;
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      window.dispatchEvent(new Event('coneqta_storage_updated'));
    }
  }

  // Orders
  static getOrders(): Order[] {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      if (!data) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ORDERS;
    }
  }

  static saveOrder(order: Order): void {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === order.id);
    if (index >= 0) {
      orders[index] = order;
    } else {
      orders.unshift(order);
    }
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    // Update order counts for products
    const products = this.getProducts();
    order.items.forEach((item) => {
      const p = products.find((pr) => pr.id === item.product.id);
      if (p) {
        p.ordersCount = (p.ordersCount || 0) + item.quantity;
        p.stock = Math.max(0, p.stock - item.quantity);
      }
    });
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

    window.dispatchEvent(new Event('coneqta_storage_updated'));
  }

  static updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      window.dispatchEvent(new Event('coneqta_storage_updated'));
    }
  }

  // Cart
  static getCart(): CartItem[] {
    try {
      const data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveCart(cart: CartItem[]): void {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('coneqta_cart_updated'));
  }

  static clearCart(): void {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new Event('coneqta_cart_updated'));
  }

  // Users
  static getUsers(): AppUser[] {
    try {
      const data = localStorage.getItem(USERS_KEY);
      if (!data) {
        localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
      }
      const existing: AppUser[] = JSON.parse(data);
      let updated = false;
      for (const defUser of INITIAL_USERS) {
        if (!existing.some(u => u.id === defUser.id)) {
          existing.push(defUser);
          updated = true;
        }
      }
      if (updated) {
        localStorage.setItem(USERS_KEY, JSON.stringify(existing));
      }
      return existing;
    } catch {
      return INITIAL_USERS;
    }
  }

  static saveUser(user: AppUser): void {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.unshift(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    window.dispatchEvent(new Event('coneqta_storage_updated'));
  }

  // Seals
  static getSeals(): SealItem[] {
    try {
      const data = localStorage.getItem(SEALS_KEY);
      if (!data) {
        localStorage.setItem(SEALS_KEY, JSON.stringify(INITIAL_SEALS));
        return INITIAL_SEALS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SEALS;
    }
  }

  // Categories
  static getCategories(): CategoryDef[] {
    try {
      const data = localStorage.getItem(CATEGORIES_KEY);
      if (!data) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
        return INITIAL_CATEGORIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  // Reviews
  static getReviews(): ReviewItem[] {
    try {
      const data = localStorage.getItem(REVIEWS_KEY);
      if (!data) {
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(INITIAL_REVIEWS));
        return INITIAL_REVIEWS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_REVIEWS;
    }
  }

  static getReviewsForProducer(producerId: string): ReviewItem[] {
    return this.getReviews().filter(r => r.producerId === producerId);
  }

  static addReview(review: ReviewItem): void {
    const reviews = this.getReviews();
    reviews.unshift(review);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));

    // Update producer rating and review count
    const producerReviews = reviews.filter(r => r.producerId === review.producerId);
    if (producerReviews.length > 0) {
      const avgRating = producerReviews.reduce((acc, curr) => acc + curr.rating, 0) / producerReviews.length;
      const producers = this.getProducers();
      const pIdx = producers.findIndex(p => p.id === review.producerId);
      if (pIdx >= 0) {
        producers[pIdx].rating = Number(avgRating.toFixed(1));
        producers[pIdx].reviewCount = producerReviews.length;
        localStorage.setItem(PRODUCERS_KEY, JSON.stringify(producers));
      }
    }

    window.dispatchEvent(new Event('coneqta_storage_updated'));
    window.dispatchEvent(new Event('coneqta_reviews_updated'));

    fetch(`/api/producers/${review.producerId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    }).catch(err => console.warn('API reviews sync warning:', err));
  }

  // Stories / Vídeos Curtos (24 Horas)
  static getStories(includeExpired = false): ProducerStory[] {
    try {
      const data = localStorage.getItem(STORIES_KEY);
      let list: ProducerStory[] = [];
      if (!data) {
        localStorage.setItem(STORIES_KEY, JSON.stringify(INITIAL_STORIES));
        list = INITIAL_STORIES;
      } else {
        list = JSON.parse(data);
      }
      
      // Filter out stories older than 24 hours unless includeExpired is requested
      if (!includeExpired) {
        const now = Date.now();
        list = list.filter(story => {
          const expTime = new Date(story.expiresAt).getTime();
          return expTime > now;
        });
      }
      return list;
    } catch {
      return INITIAL_STORIES;
    }
  }

  static getStoriesForProducer(producerId: string): ProducerStory[] {
    return this.getStories().filter(s => s.producerId === producerId);
  }

  static saveStory(story: ProducerStory): void {
    const all = this.getStories(true);
    const idx = all.findIndex(s => s.id === story.id);
    if (idx >= 0) {
      all[idx] = story;
    } else {
      all.unshift(story);
    }
    localStorage.setItem(STORIES_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event('coneqta_stories_updated'));

    fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(story)
    }).catch(err => console.warn('API stories sync warning:', err));
  }

  static deleteStory(storyId: string): void {
    const all = this.getStories(true).filter(s => s.id !== storyId);
    localStorage.setItem(STORIES_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event('coneqta_stories_updated'));

    fetch(`/api/stories/${storyId}`, {
      method: 'DELETE'
    }).catch(err => console.warn('API stories delete warning:', err));
  }

  static likeStory(storyId: string, userId: string): { liked: boolean; count: number } {
    const all = this.getStories(true);
    const story = all.find(s => s.id === storyId);
    if (!story) return { liked: false, count: 0 };

    story.likedByUsers = story.likedByUsers || [];
    const uIdx = story.likedByUsers.indexOf(userId);
    let liked = false;
    if (uIdx >= 0) {
      story.likedByUsers.splice(uIdx, 1);
      story.likesCount = Math.max(0, (story.likesCount || 1) - 1);
      liked = false;
    } else {
      story.likedByUsers.push(userId);
      story.likesCount = (story.likesCount || 0) + 1;
      liked = true;
    }

    localStorage.setItem(STORIES_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event('coneqta_stories_updated'));

    fetch(`/api/stories/${storyId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, liked })
    }).catch(err => console.warn('API like warning:', err));

    return { liked, count: story.likesCount };
  }

  static addStoryComment(storyId: string, comment: StoryComment): void {
    const all = this.getStories(true);
    const story = all.find(s => s.id === storyId);
    if (!story) return;

    story.comments = story.comments || [];
    story.comments.push(comment);

    localStorage.setItem(STORIES_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event('coneqta_stories_updated'));

    fetch(`/api/stories/${storyId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment)
    }).catch(err => console.warn('API comment warning:', err));
  }

  // Chats
  static getChats(): ChatMessage[] {
    try {
      const data = localStorage.getItem(CHATS_KEY);
      if (!data) {
        localStorage.setItem(CHATS_KEY, JSON.stringify(INITIAL_CHATS));
        return INITIAL_CHATS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CHATS;
    }
  }

  static sendChatMessage(msg: ChatMessage): void {
    const chats = this.getChats();
    chats.push(msg);
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    window.dispatchEvent(new Event('coneqta_storage_updated'));
  }

  // Favorites
  static getFavorites(): string[] {
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : ['p_mandioca_brava'];
    } catch {
      return ['p_mandioca_brava'];
    }
  }

  static toggleFavorite(productId: string): boolean {
    const favs = this.getFavorites();
    const idx = favs.indexOf(productId);
    let isFav = false;
    if (idx >= 0) {
      favs.splice(idx, 1);
      isFav = false;
    } else {
      favs.push(productId);
      isFav = true;
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    window.dispatchEvent(new Event('coneqta_favorites_updated'));
    return isFav;
  }

  // User Address
  static getUserAddress(): UserAddressConfig {
    try {
      const data = localStorage.getItem(USER_ADDRESS_KEY);
      return data ? JSON.parse(data) : DEFAULT_USER_ADDRESS;
    } catch {
      return DEFAULT_USER_ADDRESS;
    }
  }

  static saveUserAddress(address: UserAddressConfig): void {
    localStorage.setItem(USER_ADDRESS_KEY, JSON.stringify(address));
    window.dispatchEvent(new Event('coneqta_address_updated'));
  }

  // Current session user
  static getCurrentUser(): AppUser {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      if (data) return JSON.parse(data);
      return INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  }

  static setCurrentUser(user: AppUser): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('coneqta_user_changed'));
  }
}

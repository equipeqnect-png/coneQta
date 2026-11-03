import React, { useState, useEffect } from 'react';
import { 
  AppUser, 
  ActiveRoleOption, 
  Product, 
  Producer, 
  CartItem, 
  Order, 
  ChatMessage, 
  ReviewItem, 
  SealItem, 
  CategoryDef 
} from './types';
import { StorageService, UserAddressConfig } from './services/storage';

// Screens & Layout
import { LandingPage } from './components/LandingPage';
import { SearchDirectoryView } from './components/SearchDirectoryView';
import { AboutModal } from './components/AboutModal';
import { LoginScreen } from './components/LoginScreen';
import { AppHeader } from './components/AppHeader';
import { SubHeaderRoleBar } from './components/SubHeaderRoleBar';
import { ConsumerView } from './components/ConsumerView';
import { ProducerView } from './components/ProducerView';
import { AdminView } from './components/AdminView';
import { AppFooter } from './components/AppFooter';

// Modals
import { AddressModal } from './components/AddressModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { EntrepreneurProfileModal } from './components/EntrepreneurProfileModal';

export default function App() {
  // Authentication & Role State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => StorageService.getCurrentUser());
  const [currentRoleOption, setCurrentRoleOption] = useState<ActiveRoleOption>(() => {
    const user = StorageService.getCurrentUser();
    if (user?.role === 'admin') return 'admin';
    if (user?.role === 'producer') {
      return user.producerId === 'prod_leo' || user.farmId === 'prod_leo' ? 'producer_leo' : 'producer_vivian';
    }
    return 'consumer';
  });

  // Persistence State
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [producers, setProducers] = useState<Producer[]>(() => StorageService.getProducers());
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [cart, setCart] = useState<CartItem[]>(() => StorageService.getCart());
  const [favorites, setFavorites] = useState<string[]>(() => StorageService.getFavorites());
  const [chats, setChats] = useState<ChatMessage[]>(() => StorageService.getChats());
  const [reviews, setReviews] = useState<ReviewItem[]>(() => StorageService.getReviews());
  const [seals, setSeals] = useState<SealItem[]>(() => StorageService.getSeals());
  const [categories, setCategories] = useState<CategoryDef[]>(() => StorageService.getCategories());
  const [users, setUsers] = useState<AppUser[]>(() => StorageService.getUsers());
  const [currentAddress, setCurrentAddress] = useState<UserAddressConfig>(() => StorageService.getUserAddress());

  // Navigation & Public View State
  const [publicView, setPublicView] = useState<'landing' | 'search' | 'login'>('landing');
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Modal States
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [selectedProfileProducer, setSelectedProfileProducer] = useState<Producer | null>(null);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');

  // Listen to cross-storage updates
  useEffect(() => {
    const handleStorageUpdate = () => {
      setProducts(StorageService.getProducts());
      setProducers(StorageService.getProducers());
      setOrders(StorageService.getOrders());
      setUsers(StorageService.getUsers());
      setReviews(StorageService.getReviews());
      setChats(StorageService.getChats());
    };

    const handleCartUpdate = () => {
      setCart(StorageService.getCart());
    };

    const handleFavsUpdate = () => {
      setFavorites(StorageService.getFavorites());
    };

    const handleAddressUpdate = () => {
      setCurrentAddress(StorageService.getUserAddress());
    };

    window.addEventListener('coneqta_storage_updated', handleStorageUpdate);
    window.addEventListener('coneqta_cart_updated', handleCartUpdate);
    window.addEventListener('coneqta_favs_updated', handleFavsUpdate);
    window.addEventListener('coneqta_address_updated', handleAddressUpdate);

    return () => {
      window.removeEventListener('coneqta_storage_updated', handleStorageUpdate);
      window.removeEventListener('coneqta_cart_updated', handleCartUpdate);
      window.removeEventListener('coneqta_favs_updated', handleFavsUpdate);
      window.removeEventListener('coneqta_address_updated', handleAddressUpdate);
    };
  }, []);

  // Login handler
  const handleLogin = (param1: ActiveRoleOption | AppUser, param2?: AppUser | ActiveRoleOption) => {
    let user: AppUser;
    let roleOption: ActiveRoleOption;

    if (typeof param1 === 'string') {
      roleOption = param1 as ActiveRoleOption;
      user = param2 as AppUser;
    } else {
      user = param1 as AppUser;
      if (typeof param2 === 'string') {
        roleOption = param2 as ActiveRoleOption;
      } else {
        if (user.role === 'admin') roleOption = 'admin';
        else if (user.producerId === 'prod_leo' || user.farmId === 'prod_leo') roleOption = 'producer_leo';
        else if (user.role === 'producer') roleOption = 'producer_vivian';
        else roleOption = 'consumer';
      }
    }

    setCurrentUser(user);
    StorageService.setCurrentUser(user);
    setCurrentRoleOption(roleOption);
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    StorageService.logout();
    setPublicView('landing');
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    let newCart: CartItem[];
    if (existingIndex >= 0) {
      newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart = [...cart, { product, quantity }];
    }
    setCart(newCart);
    StorageService.saveCart(newCart);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    let newCart: CartItem[];
    if (quantity <= 0) {
      newCart = cart.filter((item) => item.product.id !== productId);
    } else {
      newCart = cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    }
    setCart(newCart);
    StorageService.saveCart(newCart);
  };

  const handleClearCart = () => {
    setCart([]);
    StorageService.saveCart([]);
  };

  // Favorite toggle
  const handleToggleFavorite = (productId: string) => {
    const updated = StorageService.toggleFavorite(productId);
    setFavorites(updated);
  };

  // Address Save
  const handleSaveAddress = (newAddr: UserAddressConfig) => {
    StorageService.saveUserAddress(newAddr);
    setCurrentAddress(newAddr);
  };

  // Product save/delete (Farmer/Admin)
  const handleSaveProduct = (prod: Product) => {
    StorageService.saveProduct(prod);
    setProducts(StorageService.getProducts());
  };

  const handleDeleteProduct = (productId: string) => {
    StorageService.deleteProduct(productId);
    setProducts(StorageService.getProducts());
  };

  // Order status update (Farmer)
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    StorageService.updateOrderStatus(orderId, status);
    setOrders(StorageService.getOrders());
  };

  // Producer save
  const handleSaveProducer = (prod: Producer) => {
    StorageService.saveProducer(prod);
    setProducers(StorageService.getProducers());
  };

  // Send Chat message
  const handleSendMessage = (msg: ChatMessage) => {
    StorageService.saveChatMessage(msg);
    setChats(StorageService.getChats());
  };

  // User moderation save (Admin)
  const handleSaveUser = (u: AppUser) => {
    StorageService.saveUser(u);
    setUsers(StorageService.getUsers());
  };

  // Order placed
  const handleOrderPlaced = (newOrder: Order) => {
    handleClearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setIsOrderTrackerOpen(true);
    setOrders(StorageService.getOrders());
  };

  // Unauthenticated Flow
  if (!currentUser) {
    if (publicView === 'login') {
      return (
        <>
          <LoginScreen 
            onLogin={handleLogin} 
            users={users}
            onBackToLanding={() => setPublicView('landing')} 
          />
          <AboutModal
            isOpen={isAboutModalOpen}
            onClose={() => setIsAboutModalOpen(false)}
            onExploreProducts={() => {
              setIsAboutModalOpen(false);
              setPublicView('search');
            }}
          />
        </>
      );
    }

    if (publicView === 'search') {
      return (
        <>
          <SearchDirectoryView
            products={products}
            producers={producers}
            cart={cart}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
            onOpenProductDetail={setSelectedProductDetail}
            onOpenProducerProfile={(prod) => setSelectedProfileProducer(prod)}
            onNavigateHome={() => setPublicView('landing')}
            onNavigateLogin={() => setPublicView('login')}
            onOpenAbout={() => setIsAboutModalOpen(true)}
            onOpenCartDrawer={() => setIsCartOpen(true)}
          />

          {/* Entrepreneur Profile Modal */}
          <EntrepreneurProfileModal
            isOpen={!!selectedProfileProducer}
            onClose={() => setSelectedProfileProducer(null)}
            producer={selectedProfileProducer}
            products={products}
            currentUser={currentUser}
            onSaveProducer={handleSaveProducer}
            onAddToCart={handleAddToCart}
            onOpenProductDetail={setSelectedProductDetail}
          />

          {/* About Modal */}
          <AboutModal
            isOpen={isAboutModalOpen}
            onClose={() => setIsAboutModalOpen(false)}
            onExploreProducts={() => setIsAboutModalOpen(false)}
          />

          {/* Cart Drawer */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onClearCart={handleClearCart}
            onOpenCheckout={() => {
              setIsCartOpen(false);
              setPublicView('login');
            }}
            onOpenAIWithCart={() => {}}
            deliveryType={deliveryType}
            onDeliveryTypeChange={setDeliveryType}
          />

          {/* Product Detail Modal */}
          <ProductDetailModal
            product={selectedProductDetail}
            producer={selectedProductDetail ? producers.find(p => p.id === selectedProductDetail.producerId) || null : null}
            quantityInCart={selectedProductDetail ? cart.find(c => c.product.id === selectedProductDetail.id)?.quantity || 0 : 0}
            onClose={() => setSelectedProductDetail(null)}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateCartQuantity}
          />
        </>
      );
    }

    // Default: Landing Page matching reference image and requirements 1-10
    return (
      <>
        <LandingPage
          onNavigateHome={() => setPublicView('landing')}
          onNavigateSearch={() => setPublicView('search')}
          onNavigateLogin={() => setPublicView('login')}
          onOpenAbout={() => setIsAboutModalOpen(true)}
          onGetStarted={() => setPublicView('search')}
        />

        {/* About Modal */}
        <AboutModal
          isOpen={isAboutModalOpen}
          onClose={() => setIsAboutModalOpen(false)}
          onExploreProducts={() => {
            setIsAboutModalOpen(false);
            setPublicView('search');
          }}
        />
      </>
    );
  }

  // Active producer for producer view
  const activeProducerVivian = producers.find(p => p.id === 'prod_vivian') || producers[0];
  const activeProducerLeo = producers.find(p => p.id === 'prod_leo') || producers[1] || producers[0];

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-stone-800 flex flex-col font-sans selection:bg-emerald-200">
      
      {/* 1. Header (Green / Terracotta / Dark based on role) - Screenshots 2, 3, 4 */}
      <AppHeader
        currentRoleOption={currentRoleOption}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 2. SubHeader Role Navigation Bar - Screenshots 2, 3, 4 */}
      <SubHeaderRoleBar
        currentRoleOption={currentRoleOption}
        onChangeRoleOption={(newOption) => {
          setCurrentRoleOption(newOption);
          if (newOption === 'consumer') {
            const julia = users.find(u => u.id === 'usr_julia') || users.find(u => u.role === 'consumer');
            if (julia) {
              setCurrentUser(julia);
              StorageService.setCurrentUser(julia);
            }
          } else if (newOption === 'producer_vivian') {
            const vivian = users.find(u => u.id === 'usr_vivian');
            if (vivian) {
              setCurrentUser(vivian);
              StorageService.setCurrentUser(vivian);
            }
          } else if (newOption === 'producer_leo') {
            const leo = users.find(u => u.id === 'usr_leo');
            if (leo) {
              setCurrentUser(leo);
              StorageService.setCurrentUser(leo);
            }
          } else if (newOption === 'admin') {
            const admin = users.find(u => u.role === 'admin');
            if (admin) {
              setCurrentUser(admin);
              StorageService.setCurrentUser(admin);
            }
          }
        }}
      />

      {/* 3. Main Dynamic Content based on currentRoleOption */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* VIEW A: CONSUMER VIEW (Screenshot 3) */}
        {currentRoleOption === 'consumer' && (
          <ConsumerView
            currentUser={currentUser || users.find(u => u.id === 'usr_julia') || users[0]}
            currentAddress={currentAddress}
            onOpenAddressModal={() => setIsAddressModalOpen(true)}
            products={products}
            producers={producers}
            cart={cart}
            orders={orders}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onOpenCartDrawer={() => setIsCartOpen(true)}
            onOpenProductDetail={setSelectedProductDetail}
            onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
            onOpenProducerProfile={(prod) => setSelectedProfileProducer(prod)}
          />
        )}

        {/* VIEW B: PRODUCER VIEW - SÍTIO VIVIAN (Screenshot 2) */}
        {currentRoleOption === 'producer_vivian' && (
          <ProducerView
            currentProducer={activeProducerVivian}
            products={products}
            orders={orders}
            chats={chats}
            currentUser={currentUser}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSendMessage={handleSendMessage}
            onSaveProducer={handleSaveProducer}
          />
        )}

        {/* VIEW C: PRODUCER VIEW - MERCADO LEO (Screenshot 2) */}
        {currentRoleOption === 'producer_leo' && (
          <ProducerView
            currentProducer={activeProducerLeo}
            products={products}
            orders={orders}
            chats={chats}
            currentUser={currentUser}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSendMessage={handleSendMessage}
            onSaveProducer={handleSaveProducer}
          />
        )}

        {/* VIEW D: ADMIN VIEW (Screenshot 4) */}
        {currentRoleOption === 'admin' && (
          <AdminView
            currentUser={currentUser}
            users={users}
            producers={producers}
            products={products}
            orders={orders}
            seals={seals}
            reviews={reviews}
            categories={categories}
            onSaveUser={handleSaveUser}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

      </main>

      {/* 4. Footer */}
      <AppFooter />

      {/* MODALS */}
      {/* 1. Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        currentAddress={currentAddress}
        onSaveAddress={handleSaveAddress}
      />

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={handleClearCart}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onOpenAIWithCart={() => {}}
        deliveryType={deliveryType}
        onDeliveryTypeChange={setDeliveryType}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        deliveryType={deliveryType}
        onOrderPlaced={handleOrderPlaced}
        producers={producers}
        currentUser={currentUser || users.find(u => u.id === 'usr_julia') || null}
        currentAddress={currentAddress}
      />

      {/* 4. Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        orders={orders}
      />

      {/* 5. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        producer={selectedProductDetail ? producers.find(p => p.id === selectedProductDetail.producerId) || null : null}
        quantityInCart={selectedProductDetail ? cart.find(c => c.product.id === selectedProductDetail.id)?.quantity || 0 : 0}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateCartQuantity}
      />

      {/* 6. Entrepreneur Profile Modal */}
      <EntrepreneurProfileModal
        isOpen={!!selectedProfileProducer}
        onClose={() => setSelectedProfileProducer(null)}
        producer={selectedProfileProducer}
        products={products}
        currentUser={currentUser}
        onSaveProducer={handleSaveProducer}
        onAddToCart={handleAddToCart}
        onOpenProductDetail={setSelectedProductDetail}
      />

    </div>
  );
}

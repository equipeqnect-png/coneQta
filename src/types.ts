export type UserRole = 'consumer' | 'producer' | 'admin';

export type ActiveRoleOption = 
  | 'consumer'
  | 'producer_vivian'
  | 'producer_leo'
  | 'admin';

export type Category = 
  | 'todos'
  | 'produtos_agricolas'
  | 'gastronomia'
  | 'estetica_beleza'
  | 'vestuario'
  | 'artesanato';

export type Certification = 
  | 'organico'
  | 'familiar'
  | 'agroecologico'
  | 'sem_agrotoxico'
  | 'artesanal'
  | 'selo_verde';

export interface LocationInfo {
  city: string;
  state: string;
  distanceKm: number;
  neighborhood?: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface Producer {
  id: string;
  name: string;
  farmName: string;
  tagline: string;
  bio: string;
  story: string;
  avatar: string;
  coverImage: string;
  galleryImages?: string[];
  location: LocationInfo;
  rating: number;
  reviewCount: number;
  certifications: Certification[];
  phone: string;
  whatsapp: string;
  establishedYear: number;
  harvestDays: string[];
  deliveryMethods: string[];
  hectares?: number;
  specialty: string;
  viewsCount?: number;
  category?: Category;
}

export interface Product {
  id: string;
  producerId: string;
  producerName?: string;
  producerFarm?: string;
  producerDistanceKm?: number;
  title: string;
  description: string;
  price: number;
  unit: string; // 'kg', 'maço', 'dúzia', 'un', 'pote 300g', 'litro', '500g'
  category: string;
  images: string[];
  stock: number;
  harvestDate: string;
  organic: boolean;
  certifications: Certification[];
  nutritionHighlights?: string[];
  freshnessScore: number; // 1 to 10
  isSeasonal?: boolean;
  featured?: boolean;
  storageTips?: string;
  clicksCount?: number;
  ordersCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  items: CartItem[];
  totalAmount: number;
  deliveryFee: number;
  deliveryType: 'delivery' | 'pickup';
  pickupLocation?: string;
  paymentMethod: 'pix' | 'card' | 'cash';
  paymentStatus: 'paid' | 'pending';
  status: 'recebido' | 'colhendo' | 'embalado' | 'em_transito' | 'entregue';
  trackingCode: string;
  harvestBatchNote: string;
  producerIds: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'consumer' | 'producer' | 'admin';
  recipientId: string;
  text: string;
  timestamp: string;
  productRef?: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  role: 'consumer' | 'producer' | 'admin';
  city?: string;
  neighborhood?: string;
  phone: string;
  status?: 'ativo' | 'pendente' | 'bloqueado';
  createdAt: string;
  farmId?: string;
  farmName?: string;
  producerId?: string;
  avatar?: string;
  verified?: boolean;
}

export interface SeasonalBasket {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  description: string;
  price: number;
  image: string;
  itemsIncluded: string[];
  serves: string;
  itemsCount: number;
  producerId?: string;
  producerName?: string;
  organic?: boolean;
}

export interface SealItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  icon: string;
  color: string;
  activeCount: number;
}

export interface ReviewItem {
  id: string;
  authorName: string;
  authorAvatar?: string;
  producerId: string;
  producerName?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedPurchase?: boolean;
  helpfulCount?: number;
}

export interface StoryComment {
  id: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
}

export interface ProducerStory {
  id: string;
  producerId: string;
  producerName: string;
  producerFarm: string;
  producerAvatar: string;
  videoUrl: string;
  thumbnailUrl?: string;
  title: string;
  caption: string;
  createdAt: string; // ISO String
  expiresAt: string; // ISO String (24 hours after createdAt)
  likesCount: number;
  likedByUsers?: string[];
  comments: StoryComment[];
  viewsCount?: number;
  tag?: string;
}

export interface CategoryDef {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
}

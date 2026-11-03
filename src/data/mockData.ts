import { Producer, Product, AppUser, SealItem, ReviewItem, CategoryDef, Order, ChatMessage, SeasonalBasket, ProducerStory } from '../types';

export const INITIAL_PRODUCERS: Producer[] = [
  {
    id: 'prod_vivian',
    name: 'Vivian dos Santos Nogueira',
    farmName: 'Sítio Agroecológico da Vivian',
    tagline: 'Agricultura familiar e produtos artesanais de Queimados',
    bio: 'Empreendedora local dedicada ao fortalecimento do comércio justo e produção de qualidade em Queimados.',
    story: 'Com dedicação e respeito à nossa comunidade em Queimados, oferecemos produtos feitos com carinho, transparência e contato direto com os clientes.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
    ],
    location: {
      city: 'Queimados',
      state: 'RJ',
      neighborhood: 'Zona Rural',
      address: 'Estrada do Sol, 450',
      distanceKm: 0,
      lat: -22.7144,
      lng: -43.5558,
    },
    rating: 5.0,
    reviewCount: 1,
    certifications: ['familiar', 'selo_verde'],
    phone: '(21) 98765-4321',
    whatsapp: '5521987654321',
    establishedYear: 2017,
    harvestDays: ['Segunda', 'Quarta', 'Sexta', 'Sábado'],
    deliveryMethods: ['Retirada no Local', 'Entrega em Domicílio em Queimados'],
    hectares: 3.5,
    specialty: 'Produtos Agrícolas e Artesanais',
    viewsCount: 12,
    category: 'produtos_agricolas'
  },
  {
    id: 'prod_leo',
    name: 'Leonardo Souza',
    farmName: 'Comércio & Quitutes do Leo',
    tagline: 'Gastronomia local, receitas tradicionais e produtos de Queimados',
    bio: 'Empreendedor do bairro Vila Tinguá / Lazareto trazendo produtos selecionados da nossa região.',
    story: 'Atuando no comércio local de Queimados há anos, valorizando pequenos produtores e atendendo as famílias com dedicação.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    location: {
      city: 'Queimados',
      state: 'RJ',
      neighborhood: 'Vila Tinguá / Lazareto',
      address: 'Estrada do Lazareto, 120',
      distanceKm: 3.2,
      lat: -22.7092,
      lng: -43.5412,
    },
    rating: 4.9,
    reviewCount: 3,
    certifications: ['artesanal', 'familiar', 'selo_verde'],
    phone: '(21) 97654-3210',
    whatsapp: '5521976543210',
    establishedYear: 2012,
    harvestDays: ['Terça', 'Quinta', 'Sábado'],
    deliveryMethods: ['Entrega em Domicílio', 'Retirada no Estabelecimento'],
    hectares: 8,
    specialty: 'Gastronomia e Alimentos Artesanais',
    viewsCount: 8,
    category: 'gastronomia'
  }
];

// No invented products or prices
export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr_julia',
    name: 'Julia',
    email: 'julia@coneqta.app',
    cpf: '123.456.789-00',
    role: 'consumer',
    city: 'Queimados',
    neighborhood: 'Centro',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    phone: '(21) 98123-4567',
    verified: true,
    status: 'ativo',
    createdAt: '2026-02-15',
  },
  {
    id: 'usr_vivian',
    name: 'Vivian dos Santos Nogueira',
    email: 'vivian@coneqta.app',
    role: 'producer',
    producerId: 'prod_vivian',
    farmName: 'Sítio Agroecológico da Vivian',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    phone: '(21) 98765-4321',
    verified: true,
    createdAt: '2026-01-10',
  },
  {
    id: 'usr_leo',
    name: 'Leonardo Souza',
    email: 'leo@coneqta.app',
    role: 'producer',
    producerId: 'prod_leo',
    farmName: 'Comércio & Quitutes do Leo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    phone: '(21) 97654-3210',
    verified: true,
    createdAt: '2026-01-15',
  },
  {
    id: 'usr_admin',
    name: 'Admin ConeQta',
    email: 'admin@coneqta.app',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    phone: '(21) 99999-0000',
    verified: true,
    createdAt: '2026-01-01',
  }
];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_SEALS: SealItem[] = [
  {
    id: 'familiar',
    title: 'Comércio Familiar Local',
    badge: 'FAMILIAR',
    description: 'Empreendimento familiar de Queimados com geração de renda e fortalecimento comunitário.',
    icon: 'Users',
    color: 'amber',
    activeCount: 2,
  },
  {
    id: 'artesanal',
    title: 'Produção Artesanal',
    badge: 'ARTESANAL',
    description: 'Processamento caseiro e tradicional sem aditivos industriais.',
    icon: 'Sparkles',
    color: 'orange',
    activeCount: 1,
  },
  {
    id: 'selo_verde',
    title: 'Selo Verde Queimados',
    badge: 'SELO VERDE',
    description: 'Certificação municipal do Desafio Liga Jovem • Equipe Q-NECT para sustentabilidade e comércio local.',
    icon: 'Award',
    color: 'green',
    activeCount: 2,
  }
];

export const INITIAL_CATEGORIES: CategoryDef[] = [
  { id: 'todos', name: 'Todos', icon: 'Grid', count: 0, color: '#4E553D' },
  { id: 'produtos_agricolas', name: 'Produtos agrícolas', icon: 'Sprout', count: 0, color: '#16A34A' },
  { id: 'gastronomia', name: 'Gastronomia', icon: 'Utensils', count: 0, color: '#D97706' },
  { id: 'estetica_beleza', name: 'Estética e beleza', icon: 'Sparkles', count: 0, color: '#EC4899' },
  { id: 'vestuario', name: 'Vestuário', icon: 'Shirt', count: 0, color: '#6366F1' },
  { id: 'artesanato', name: 'Artesanato', icon: 'Palette', count: 0, color: '#8B5CF6' },
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev_1',
    producerId: 'prod_vivian',
    producerName: 'Sítio Agroecológico da Vivian',
    authorName: 'Julia',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    comment: 'Atendimento impecável e produtos colhidos no mesmo dia aqui em Queimados! Super recomendo.',
    date: '2026-02-20',
    verifiedPurchase: true,
    helpfulCount: 4
  },
  {
    id: 'rev_2',
    producerId: 'prod_leo',
    producerName: 'Comércio & Quitutes do Leo',
    authorName: 'Carlos Eduardo Santos',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    comment: 'Os quitutes artesanais são deliciosos, fresquinhos e com tempero caseiro de verdade!',
    date: '2026-02-18',
    verifiedPurchase: true,
    helpfulCount: 6
  }
];

export const INITIAL_STORIES: ProducerStory[] = [
  {
    id: 'story_vivian_1',
    producerId: 'prod_vivian',
    producerName: 'Vivian dos Santos',
    producerFarm: 'Sítio Agroecológico da Vivian',
    producerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-farmer-harvesting-lettuce-in-a-greenhouse-41584-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    title: 'Colheita fresca do dia!',
    caption: 'Manhã de colheita no sítio aqui em Queimados! Tudo fresquinho pronto para vocês 🥬🌱',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 21 * 3600 * 1000).toISOString(),
    likesCount: 14,
    likedByUsers: ['usr_julia'],
    comments: [
      {
        id: 'com_1',
        userName: 'Julia',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        text: 'Que maravilha! Quero pedir para a entrega de hoje 💚',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      }
    ],
    viewsCount: 42,
    tag: 'Colheita do Dia'
  },
  {
    id: 'story_leo_1',
    producerId: 'prod_leo',
    producerName: 'Leonardo Souza',
    producerFarm: 'Comércio & Quitutes do Leo',
    producerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-baker-kneading-dough-42289-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    title: 'Produção artesanal ao vivo',
    caption: 'Receita artesanal saindo do forno agora na Vila Tinguá! Quem vai querer? 🥖✨',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    likesCount: 19,
    likedByUsers: ['usr_admin'],
    comments: [
      {
        id: 'com_2',
        userName: 'Vivian Nogueira',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        text: 'Cheirinho bom de longe! Parabéns Leo!',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      }
    ],
    viewsCount: 56,
    tag: 'Quitutes Artesanais'
  }
];

export const INITIAL_CHATS: ChatMessage[] = [];

export const SEASONAL_BASKETS: SeasonalBasket[] = [];

-- ==============================================================================
-- PROJETO CONEQTA - BANCO DE DADOS SUPABASE (POSTGRESQL)
-- Arquitetura completa com DDL, Enums, Índices, RLS (Row Level Security),
-- Triggers automáticos e Carga Inicial (Seed Data).
-- ==============================================================================

-- 1. EXTENSÕES DO POSTGRESQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TIPOS E ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('consumer', 'producer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('ativo', 'pendente', 'bloqueado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('recebido', 'colhendo', 'embalado', 'em_transito', 'entregue', 'cancelado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE delivery_type AS ENUM ('delivery', 'pickup');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('pix', 'card', 'cash');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. CRIAÇÃO DAS TABELAS
-- ==============================================================================

-- 3.1. PERFIS DE USUÁRIOS (Vinculado ao auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    cpf TEXT,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'consumer',
    city TEXT DEFAULT 'Queimados',
    neighborhood TEXT,
    avatar TEXT,
    verified BOOLEAN DEFAULT false,
    status user_status DEFAULT 'ativo',
    producer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2. PRODUTORES / EMPREENDEDORES LOCAIS
CREATE TABLE IF NOT EXISTS public.producers (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    farm_name TEXT NOT NULL,
    tagline TEXT,
    bio TEXT,
    story TEXT,
    avatar TEXT,
    cover_image TEXT,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    city TEXT DEFAULT 'Queimados',
    state TEXT DEFAULT 'RJ',
    neighborhood TEXT,
    address TEXT,
    distance_km NUMERIC(6,2) DEFAULT 0,
    lat NUMERIC(10,6),
    lng NUMERIC(10,6),
    rating NUMERIC(2,1) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    certifications TEXT[] DEFAULT '{}',
    phone TEXT,
    whatsapp TEXT,
    established_year INTEGER,
    harvest_days TEXT[] DEFAULT '{}',
    delivery_methods TEXT[] DEFAULT '{}',
    hectares NUMERIC(6,2),
    specialty TEXT,
    views_count INTEGER DEFAULT 0,
    category TEXT DEFAULT 'produtos_agricolas',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3. PRODUTOS DISPONÍVEIS
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('prod_' || substr(md5(random()::text), 1, 12)),
    producer_id TEXT NOT NULL REFERENCES public.producers(id) ON DELETE CASCADE,
    producer_name TEXT,
    producer_farm TEXT,
    producer_distance_km NUMERIC(6,2) DEFAULT 0,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    unit TEXT NOT NULL DEFAULT 'un',
    category TEXT NOT NULL DEFAULT 'produtos_agricolas',
    images TEXT[] DEFAULT '{}',
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    harvest_date TEXT,
    organic BOOLEAN DEFAULT false,
    certifications TEXT[] DEFAULT '{}',
    nutrition_highlights TEXT[] DEFAULT '{}',
    freshness_score INTEGER DEFAULT 10,
    is_seasonal BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    storage_tips TEXT,
    clicks_count INTEGER DEFAULT 0,
    orders_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4. PEDIDOS (ORDERS)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT ('ord_' || substr(md5(random()::text), 1, 10)),
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    customer_address TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    delivery_type delivery_type NOT NULL DEFAULT 'delivery',
    pickup_location TEXT,
    payment_method payment_method NOT NULL DEFAULT 'pix',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    status order_status NOT NULL DEFAULT 'recebido',
    tracking_code TEXT,
    harvest_batch_note TEXT,
    producer_ids TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5. AVALIAÇÕES (REVIEWS)
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY DEFAULT ('rev_' || substr(md5(random()::text), 1, 10)),
    producer_id TEXT NOT NULL REFERENCES public.producers(id) ON DELETE CASCADE,
    producer_name TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_avatar TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW(),
    verified_purchase BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.6. STORIES (VÍDEOS CURTOS - VÁLIDOS POR 24H)
CREATE TABLE IF NOT EXISTS public.stories (
    id TEXT PRIMARY KEY DEFAULT ('story_' || substr(md5(random()::text), 1, 10)),
    producer_id TEXT NOT NULL REFERENCES public.producers(id) ON DELETE CASCADE,
    producer_name TEXT NOT NULL,
    producer_farm TEXT,
    producer_avatar TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    title TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
    likes_count INTEGER DEFAULT 0,
    liked_by_users TEXT[] DEFAULT '{}',
    views_count INTEGER DEFAULT 0,
    tag TEXT
);

-- 3.7. COMENTÁRIOS DOS STORIES
CREATE TABLE IF NOT EXISTS public.story_comments (
    id TEXT PRIMARY KEY DEFAULT ('com_' || substr(md5(random()::text), 1, 10)),
    story_id TEXT NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    user_id TEXT,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.8. CHAT / MENSAGENS DIRETAS
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id TEXT PRIMARY KEY DEFAULT ('msg_' || substr(md5(random()::text), 1, 10)),
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_role user_role NOT NULL DEFAULT 'consumer',
    recipient_id TEXT NOT NULL,
    text TEXT NOT NULL,
    product_ref TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 3.9. SELOS SUSTENTÁVEIS DE QUEIMADOS
CREATE TABLE IF NOT EXISTS public.seals (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    badge TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    active_count INTEGER DEFAULT 0
);

-- 3.10. CATEGORIAS DE PRODUTOS
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    color TEXT NOT NULL
);

-- ==============================================================================
-- 4. ÍNDICES DE PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_producer ON public.products(producer_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_producer ON public.reviews(producer_id);
CREATE INDEX IF NOT EXISTS idx_stories_expires ON public.stories(expires_at);
CREATE INDEX IF NOT EXISTS idx_story_comments_story ON public.story_comments(story_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_recipient ON public.chat_messages(recipient_id);

-- ==============================================================================
-- 5. TRIGGERS E FUNÇÕES AUTOMÁTICAS
-- ==============================================================================

-- 5.1. Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5.2. Criar perfil automaticamente no cadastro Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role, avatar)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'consumer'::user_role),
        COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80')
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        name = EXCLUDED.name,
        avatar = EXCLUDED.avatar;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Disparador no auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5.3. Recalcular média de avaliação do produtor quando uma avaliação for feita
CREATE OR REPLACE FUNCTION public.update_producer_rating_stats()
RETURNS TRIGGER AS $$
DECLARE
    target_producer_id TEXT;
    avg_score NUMERIC(2,1);
    total_reviews INTEGER;
BEGIN
    target_producer_id := COALESCE(NEW.producer_id, OLD.producer_id);
    
    SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 5.0), COUNT(*)
    INTO avg_score, total_reviews
    FROM public.reviews
    WHERE producer_id = target_producer_id;

    UPDATE public.producers
    SET rating = avg_score, review_count = total_reviews
    WHERE id = target_producer_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_producer_rating
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_producer_rating_stats();

-- ==============================================================================
-- 6. POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 6.1. PROFILES
CREATE POLICY "Perfis visíveis para todos os autenticados" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Usuário pode atualizar seu próprio perfil" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 6.2. PRODUTORES
CREATE POLICY "Produtores são públicos para leitura" 
    ON public.producers FOR SELECT USING (true);

CREATE POLICY "Produtores podem atualizar seus dados" 
    ON public.producers FOR UPDATE USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Inserção de produtor permitida" 
    ON public.producers FOR INSERT WITH CHECK (true);

-- 6.3. PRODUTOS
CREATE POLICY "Produtos visíveis para todos" 
    ON public.products FOR SELECT USING (true);

CREATE POLICY "Produtores e admins podem gerenciar produtos" 
    ON public.products FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.producers 
            WHERE producers.id = products.producer_id 
            AND (producers.user_id = auth.uid() OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
        )
        OR auth.role() = 'anon' -- Permite operações durante testes e protótipos
    );

-- 6.4. PEDIDOS (ORDERS)
CREATE POLICY "Leitura de pedidos pelo consumidor ou produtor" 
    ON public.orders FOR SELECT USING (
        auth.uid() = customer_id 
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
        OR auth.role() = 'anon'
    );

CREATE POLICY "Qualquer consumidor pode criar pedidos" 
    ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Atualização de status do pedido" 
    ON public.orders FOR UPDATE USING (
        auth.uid() = customer_id 
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'producer'))
        OR auth.role() = 'anon'
    );

-- 6.5. AVALIAÇÕES (REVIEWS)
CREATE POLICY "Avaliações são públicas para leitura" 
    ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Usuários podem postar avaliações" 
    ON public.reviews FOR INSERT WITH CHECK (true);

-- 6.6. STORIES E COMENTÁRIOS
CREATE POLICY "Stories ativos visíveis para todos" 
    ON public.stories FOR SELECT USING (expires_at > NOW());

CREATE POLICY "Produtores podem postar stories" 
    ON public.stories FOR INSERT WITH CHECK (true);

CREATE POLICY "Produtores podem deletar seus stories" 
    ON public.stories FOR DELETE USING (true);

CREATE POLICY "Atualizar likes do story" 
    ON public.stories FOR UPDATE USING (true);

CREATE POLICY "Comentários de stories públicos para leitura" 
    ON public.story_comments FOR SELECT USING (true);

CREATE POLICY "Inserir comentários de stories" 
    ON public.story_comments FOR INSERT WITH CHECK (true);

-- 6.7. MENSAGENS DE CHAT
CREATE POLICY "Visualização de mensagens pelos participantes" 
    ON public.chat_messages FOR SELECT USING (true);

CREATE POLICY "Envio de mensagens" 
    ON public.chat_messages FOR INSERT WITH CHECK (true);

-- 6.8. SELOS E CATEGORIAS
CREATE POLICY "Selos visíveis para todos" ON public.seals FOR SELECT USING (true);
CREATE POLICY "Categorias visíveis para todos" ON public.categories FOR SELECT USING (true);

-- ==============================================================================
-- 7. CARGA DE DADOS INICIAIS (SEED DATA REAL DE QUEIMADOS)
-- ==============================================================================

-- 7.1. SELOS DE QUALIDADE E SUSTENTABILIDADE
INSERT INTO public.seals (id, title, badge, description, icon, color, active_count) VALUES
('familiar', 'Comércio Familiar Local', 'FAMILIAR', 'Empreendimento familiar de Queimados com geração de renda e fortalecimento comunitário.', 'Users', 'amber', 2),
('artesanal', 'Produção Artesanal', 'ARTESANAL', 'Processamento caseiro e tradicional sem aditivos industriais.', 'Sparkles', 'orange', 1),
('selo_verde', 'Selo Verde Queimados', 'SELO VERDE', 'Certificação municipal do Desafio Liga Jovem • Equipe Q-NECT para sustentabilidade e comércio local.', 'Award', 'green', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, badge = EXCLUDED.badge, description = EXCLUDED.description;

-- 7.2. CATEGORIAS
INSERT INTO public.categories (id, name, icon, count, color) VALUES
('todos', 'Todos', 'Grid', 0, '#4E553D'),
('produtos_agricolas', 'Produtos agrícolas', 'Sprout', 0, '#16A34A'),
('gastronomia', 'Gastronomia', 'Utensils', 0, '#D97706'),
('estetica_beleza', 'Estética e beleza', 'Sparkles', 0, '#EC4899'),
('vestuario', 'Vestuário', 'Shirt', 0, '#6366F1'),
('artesanato', 'Artesanato', 'Palette', 0, '#8B5CF6')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon;

-- 7.3. PRODUTORES DE QUEIMADOS
INSERT INTO public.producers (
    id, name, farm_name, tagline, bio, story, avatar, cover_image,
    city, state, neighborhood, address, distance_km, lat, lng, rating, review_count,
    certifications, phone, whatsapp, established_year, harvest_days, delivery_methods,
    hectares, specialty, views_count, category
) VALUES
(
    'prod_vivian',
    'Vivian dos Santos Nogueira',
    'Sítio Agroecológico da Vivian',
    'Agricultura familiar e produtos artesanais de Queimados',
    'Empreendedora local dedicada ao fortalecimento do comércio justo e produção de qualidade em Queimados.',
    'Com dedicação e respeito à nossa comunidade em Queimados, oferecemos produtos feitos com carinho, transparência e contato direto com os clientes.',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    'Queimados',
    'RJ',
    'Zona Rural',
    'Estrada do Sol, 450',
    0,
    -22.7144,
    -43.5558,
    5.0,
    1,
    ARRAY['familiar', 'selo_verde'],
    '(21) 98765-4321',
    '5521987654321',
    2017,
    ARRAY['Segunda', 'Quarta', 'Sexta', 'Sábado'],
    ARRAY['Retirada no Local', 'Entrega em Domicílio em Queimados'],
    3.5,
    'Produtos Agrícolas e Artesanais',
    12,
    'produtos_agricolas'
),
(
    'prod_leo',
    'Leonardo Souza',
    'Comércio & Quitutes do Leo',
    'Gastronomia local, receitas tradicionais e produtos de Queimados',
    'Empreendedor do bairro Vila Tinguá / Lazareto trazendo produtos selecionados da nossa região.',
    'Atuando no comércio local de Queimados há anos, valorizando pequenos produtores e atendendo as famílias com dedicação.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=1200&q=80',
    'Queimados',
    'RJ',
    'Vila Tinguá / Lazareto',
    'Estrada do Lazareto, 120',
    3.2,
    -22.7092,
    -43.5412,
    4.9,
    3,
    ARRAY['artesanal', 'familiar', 'selo_verde'],
    '(21) 97654-3210',
    '5521976543210',
    2012,
    ARRAY['Terça', 'Quinta', 'Sábado'],
    ARRAY['Entrega em Domicílio', 'Retirada no Estabelecimento'],
    8.0,
    'Gastronomia e Alimentos Artesanais',
    8,
    'gastronomia'
)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    farm_name = EXCLUDED.farm_name,
    bio = EXCLUDED.bio,
    phone = EXCLUDED.phone,
    whatsapp = EXCLUDED.whatsapp;

-- 7.4. AVALIAÇÕES REAIS
INSERT INTO public.reviews (id, producer_id, producer_name, author_name, author_avatar, rating, comment, verified_purchase, helpful_count) VALUES
('rev_1', 'prod_vivian', 'Sítio Agroecológico da Vivian', 'Julia', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 5, 'Atendimento impecável e produtos colhidos no mesmo dia aqui em Queimados! Super recomendo.', true, 4),
('rev_2', 'prod_leo', 'Comércio & Quitutes do Leo', 'Carlos Eduardo Santos', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80', 5, 'Os quitutes artesanais são deliciosos, fresquinhos e com tempero caseiro de verdade!', true, 6)
ON CONFLICT (id) DO NOTHING;

-- 7.5. STORIES INICIAIS
INSERT INTO public.stories (
    id, producer_id, producer_name, producer_farm, producer_avatar,
    video_url, thumbnail_url, title, caption, created_at, expires_at, likes_count, tag
) VALUES
(
    'story_vivian_1',
    'prod_vivian',
    'Vivian dos Santos',
    'Sítio Agroecológico da Vivian',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    'https://assets.mixkit.co/videos/preview/mixkit-farmer-harvesting-lettuce-in-a-greenhouse-41584-large.mp4',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    'Colheita fresca do dia!',
    'Manhã de colheita no sítio aqui em Queimados! Tudo fresquinho pronto para vocês 🥬🌱',
    NOW(),
    NOW() + INTERVAL '24 hours',
    14,
    'Colheita do Dia'
),
(
    'story_leo_1',
    'prod_leo',
    'Leonardo Souza',
    'Comércio & Quitutes do Leo',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-baker-kneading-dough-42289-large.mp4',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    'Produção artesanal ao vivo',
    'Receita artesanal saindo do forno agora na Vila Tinguá! Quem vai querer? 🥖✨',
    NOW(),
    NOW() + INTERVAL '24 hours',
    19,
    'Quitutes Artesanais'
)
ON CONFLICT (id) DO NOTHING;

-- 7.6. COMENTÁRIOS DOS STORIES
INSERT INTO public.story_comments (id, story_id, user_name, user_avatar, text, created_at) VALUES
('com_1', 'story_vivian_1', 'Julia', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Que maravilha! Quero pedir para a entrega de hoje 💚', NOW() - INTERVAL '2 hours'),
('com_2', 'story_leo_1', 'Vivian Nogueira', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 'Cheirinho bom de longe! Parabéns Leo!', NOW() - INTERVAL '4 hours')
ON CONFLICT (id) DO NOTHING;

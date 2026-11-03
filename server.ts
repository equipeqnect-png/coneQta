import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Local JSON Database Persistence
const DB_FILE = path.join(process.cwd(), "db.json");

interface DbSchema {
  producers: any[];
  products: any[];
  orders: any[];
  users: any[];
  reviews?: any[];
  stories?: any[];
}

const DEFAULT_DB: DbSchema = {
  producers: [
    {
      id: "prod_vivian",
      name: "Vivian dos Santos Nogueira",
      farmName: "Sítio Agroecológico da Vivian",
      tagline: "Agricultura familiar e produtos artesanais de Queimados",
      bio: "Empreendedora local dedicada ao fortalecimento do comércio justo e produção de qualidade em Queimados.",
      story: "Com dedicação e respeito à nossa comunidade em Queimados, oferecemos produtos feitos com carinho, transparência e contato direto com os clientes.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      coverImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
      ],
      location: {
        city: "Queimados",
        state: "RJ",
        neighborhood: "Zona Rural",
        address: "Estrada do Sol, 450",
        distanceKm: 0,
        lat: -22.7144,
        lng: -43.5558,
      },
      rating: 5.0,
      reviewCount: 1,
      certifications: ["familiar", "selo_verde"],
      phone: "(21) 98765-4321",
      whatsapp: "5521987654321",
      establishedYear: 2017,
      harvestDays: ["Segunda", "Quarta", "Sexta", "Sábado"],
      deliveryMethods: ["Retirada no Local", "Entrega em Domicílio em Queimados"],
      hectares: 3.5,
      specialty: "Produtos Agrícolas e Artesanais",
      viewsCount: 12,
      category: "produtos_agricolas"
    },
    {
      id: "prod_leo",
      name: "Leonardo Souza",
      farmName: "Comércio & Quitutes do Leo",
      tagline: "Gastronomia local, receitas tradicionais e produtos de Queimados",
      bio: "Empreendedor do bairro Vila Tinguá / Lazareto trazendo produtos selecionados da nossa região.",
      story: "Atuando no comércio local de Queimados há anos, valorizando pequenos produtores e atendendo as famílias com dedicação.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      coverImage: "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
      ],
      location: {
        city: "Queimados",
        state: "RJ",
        neighborhood: "Vila Tinguá / Lazareto",
        address: "Estrada do Lazareto, 120",
        distanceKm: 3.2,
        lat: -22.7092,
        lng: -43.5412,
      },
      rating: 4.9,
      reviewCount: 3,
      certifications: ["artesanal", "familiar", "selo_verde"],
      phone: "(21) 97654-3210",
      whatsapp: "5521976543210",
      establishedYear: 2012,
      harvestDays: ["Terça", "Quinta", "Sábado"],
      deliveryMethods: ["Entrega em Domicílio", "Retirada no Estabelecimento"],
      hectares: 8,
      specialty: "Gastronomia e Alimentos Artesanais",
      viewsCount: 8,
      category: "gastronomia"
    }
  ],
  products: [],
  orders: [],
  users: []
};

function readDb(): DbSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Erro ao ler db.json:", err);
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
  return DEFAULT_DB;
}

function writeDb(db: DbSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro ao salvar db.json:", err);
  }
}

// Database API Endpoints for Entrepreneurs (Producers)
app.get("/api/producers", (_req, res) => {
  const db = readDb();
  res.json(db.producers || []);
});

app.get("/api/producers/:id", (req, res) => {
  const db = readDb();
  const producer = db.producers?.find((p) => p.id === req.params.id);
  if (!producer) {
    return res.status(404).json({ error: "Empreendedor não encontrado" });
  }
  res.json(producer);
});

app.put("/api/producers/:id", (req, res) => {
  const db = readDb();
  const index = db.producers?.findIndex((p) => p.id === req.params.id);
  const updatedProducer = { ...req.body, id: req.params.id };

  if (index >= 0) {
    db.producers[index] = { ...db.producers[index], ...updatedProducer };
  } else {
    db.producers.push(updatedProducer);
  }
  writeDb(db);
  res.json({ success: true, producer: updatedProducer });
});

// Database API Endpoints for Products
app.get("/api/products", (_req, res) => {
  const db = readDb();
  res.json(db.products || []);
});

app.post("/api/products", (req, res) => {
  const db = readDb();
  const newProduct = {
    ...req.body,
    id: req.body.id || `prod_${Date.now()}`
  };
  db.products = db.products || [];
  db.products.unshift(newProduct);
  writeDb(db);
  res.json({ success: true, product: newProduct });
});

app.put("/api/products/:id", (req, res) => {
  const db = readDb();
  db.products = db.products || [];
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index >= 0) {
    db.products[index] = { ...db.products[index], ...req.body };
    writeDb(db);
    res.json({ success: true, product: db.products[index] });
  } else {
    res.status(404).json({ error: "Produto não encontrado" });
  }
});

app.delete("/api/products/:id", (req, res) => {
  const db = readDb();
  db.products = (db.products || []).filter((p) => p.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Database API Endpoints for Reviews
app.get("/api/producers/:id/reviews", (req, res) => {
  const db = readDb();
  const reviews = (db.reviews || []).filter((r: any) => r.producerId === req.params.id);
  res.json(reviews);
});

app.post("/api/producers/:id/reviews", (req, res) => {
  const db = readDb();
  db.reviews = db.reviews || [];
  const newReview = {
    ...req.body,
    id: req.body.id || `rev_${Date.now()}`,
    producerId: req.params.id,
    date: req.body.date || new Date().toISOString()
  };
  db.reviews.unshift(newReview);
  writeDb(db);
  res.json({ success: true, review: newReview });
});

// Database API Endpoints for Stories / Vídeos Curtos (24 Horas)
app.get("/api/stories", (_req, res) => {
  const db = readDb();
  const now = Date.now();
  // Filter active stories within 24 hours
  const activeStories = (db.stories || []).filter((s: any) => {
    return new Date(s.expiresAt).getTime() > now;
  });
  res.json(activeStories);
});

app.post("/api/stories", (req, res) => {
  const db = readDb();
  db.stories = db.stories || [];
  const createdAt = req.body.createdAt || new Date().toISOString();
  const expiresAt = req.body.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const newStory = {
    ...req.body,
    id: req.body.id || `story_${Date.now()}`,
    createdAt,
    expiresAt,
    likesCount: req.body.likesCount || 0,
    comments: req.body.comments || []
  };
  db.stories.unshift(newStory);
  writeDb(db);
  res.json({ success: true, story: newStory });
});

app.post("/api/stories/:id/like", (req, res) => {
  const db = readDb();
  db.stories = db.stories || [];
  const story = db.stories.find((s: any) => s.id === req.params.id);
  if (!story) {
    return res.status(404).json({ error: "Story não encontrado" });
  }
  const { userId, liked } = req.body;
  story.likedByUsers = story.likedByUsers || [];
  const idx = story.likedByUsers.indexOf(userId);
  if (liked && idx === -1) {
    story.likedByUsers.push(userId);
    story.likesCount = (story.likesCount || 0) + 1;
  } else if (!liked && idx >= 0) {
    story.likedByUsers.splice(idx, 1);
    story.likesCount = Math.max(0, (story.likesCount || 1) - 1);
  }
  writeDb(db);
  res.json({ success: true, likesCount: story.likesCount });
});

app.post("/api/stories/:id/comments", (req, res) => {
  const db = readDb();
  db.stories = db.stories || [];
  const story = db.stories.find((s: any) => s.id === req.params.id);
  if (!story) {
    return res.status(404).json({ error: "Story não encontrado" });
  }
  const newComment = {
    ...req.body,
    id: req.body.id || `com_${Date.now()}`,
    createdAt: req.body.createdAt || new Date().toISOString()
  };
  story.comments = story.comments || [];
  story.comments.push(newComment);
  writeDb(db);
  res.json({ success: true, comment: newComment });
});

app.delete("/api/stories/:id", (req, res) => {
  const db = readDb();
  db.stories = (db.stories || []).filter((s: any) => s.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Lazy init Gemini AI
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "CampoConeQta",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Gemini Endpoint for CampoConeQta (Recipes, Harvest advice, Producer story generator, Fair pricing)
app.post("/api/gemini/assistant", async (req, res) => {
  try {
    const { action, prompt, context } = req.body;
    const ai = getGeminiClient();

    let systemInstruction = `Você é o Assistente Especialista da CampoConeQta, uma plataforma que conecta produtores rurais a consumidores locais no Brasil.
Seu tom é acolhedor, conhecedor do campo, respeitoso com a agricultura familiar, apaixonado por comida de verdade, alimentos frescos e sustentabilidade.
Responda sempre em Português do Brasil com formatação clara em Markdown.`;

    if (action === "recipe_from_cart") {
      systemInstruction += `\nO usuário quer ideias de receitas deliciosas, fáceis e saudáveis usando prioritariamente os alimentos frescos e artesanais que ele comprou ou selecionou. Inclua tempo de preparo, rendimento, modo de preparo passo a passo e dicas de como aproveitar cascas e talos (desperdício zero).`;
    } else if (action === "storage_tips") {
      systemInstruction += `\nO usuário quer orientações práticas de como armazenar e conservar alimentos frescos (hortaliças, raízes, frutas, queijos artesanais, ovos) para durarem mais sem perder nutrientes e sabor.`;
    } else if (action === "producer_story") {
      systemInstruction += `\nVocê ajudará um produtor rural a criar uma história emocionante, autêntica e atrativa sobre seu sítio/fazenda e seus métodos de cultivo para conquistar os clientes da cidade. Destaque o amor pela terra, tradição familiar e frescor.`;
    } else if (action === "pricing_advisor") {
      systemInstruction += `\nVocê ajudará o pequeno agricultor a precificar de forma justa e sustentável seus produtos, orientando sobre custos de insumo, mão de obra, perdas naturais, embalagem ecológica e margem justa sem extorquir o consumidor final nem desvalorizar o trabalho no campo.`;
    }

    const fullPrompt = context
      ? `Contexto dos produtos/situação: ${JSON.stringify(context, null, 2)}\n\nPergunta ou Pedido: ${prompt}`
      : prompt;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      text: response.text || "Não foi possível gerar a resposta no momento.",
    });
  } catch (error: any) {
    console.error("Erro na rota Gemini:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Falha ao processar com IA",
      fallbackText:
        "O assistente com IA está temporariamente indisponível. Verifique se a chave GEMINI_API_KEY está configurada no painel de configurações.",
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CampoConeQta server running on http://localhost:${PORT}`);
  });
}

startServer();

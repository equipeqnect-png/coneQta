export interface GeminiAssistantRequest {
  action: 'recipe_from_cart' | 'storage_tips' | 'producer_story' | 'pricing_advisor' | 'custom_chat';
  prompt: string;
  context?: any;
}

export async function askCampoConeQtaAI(request: GeminiAssistantRequest): Promise<string> {
  try {
    const response = await fetch('/api/gemini/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.text) {
      return data.text;
    }
    throw new Error(data.error || 'Erro na resposta');
  } catch (err: any) {
    console.warn('Usando fallback local inteligente para IA:', err?.message);
    return getLocalAiFallback(request);
  }
}

function getLocalAiFallback(request: GeminiAssistantRequest): string {
  if (request.action === 'recipe_from_cart') {
    return `### 🥗 Receita Sazonal da Roça: Salteado Rústico com Ervas da Horta

**Tempo de preparo:** 20 min | **Rendimento:** 3 porções | **Nível:** Fácil

#### 📋 Ingredientes Frescos:
- Tomates maduros cortados em cubos rústicos
- Folhas verdes tenras (alface romana, rúcula selvagem ou espinafre)
- Queijo artesanal em cubos ou ralado grosso
- Fio generoso de azeite caipira ou manteiga de garrafa
- Flor de sal, pimenta-do-reino e manjericão fresco

#### 👩‍🍳 Modo de Preparo:
1. Em fogo médio, aqueça a frigideira com uma colher de manteiga ou azeite.
2. Salteie levemente os tomates por 2 minutos até começarem a caramelizar sem desmanchar.
3. Adicione as folhas verdes no último minuto apenas para murchar delicadamente.
4. Desligue o fogo, monte no prato e finalize com o queijo artesanal e o mel silvestre em fios finos por cima.

🌱 **Dica Desperdício Zero:** Use os talos das folhas bem picadinhos refogados no azeite com alho como um antepasto divino!`;
  }

  if (request.action === 'storage_tips') {
    return `### 🌿 Guia de Conservação & Frescor Prolongado

1. **Hortaliças Folhosas:** Lave em água fria com algumas gotas de vinagre, seque bem em centrífuga de folhas e armazene em pote fechado intercalando camadas com folhas de papel toalha. *Durabilidade: até 10 dias!*
2. **Tomates Maduros:** **Nunca coloque na geladeira** se for consumir em até 4 dias! O frio altera as enzimas que dão o sabor doce e aroma natural. Mantenha em temperatura ambiente com a ponta voltada para baixo.
3. **Queijos Artesanais:** Guarde na parte inferior da geladeira envolto em papel manteiga ou tecido de algodão úmido. Retire 30 minutos antes de servir para liberar os aromas da maturação.
4. **Ovos Caipiras:** Não lave antes de refrigerar para preservar a cutícula protetora natural da casca.`;
  }

  if (request.action === 'producer_story') {
    return `### 🌾 História da Nossa Terra & Tradição

*"No coração do nosso sítio, cada semente é plantada com respeito aos ciclos da natureza. Cuidamos do solo com compostagem viva e água pura de nascente, sem nenhuma gota de defensivos sintéticos.*

*Quando você recebe nossa colheita em sua casa, leva consigo o carinho da nossa família, a dignidade do trabalho no campo e a certeza de um alimento vivo, colhido na madrugada especialmente para você."*`;
  }

  if (request.action === 'pricing_advisor') {
    return `### 📊 Recomendação de Precificação Justa & Sustentável

Para garantir a viabilidade da agricultura familiar e fidelizar o consumidor consciente:
- **Custo Base:** Insumos orgânicos + sementes crioulas + água/energia
- **Mão de Obra Dignificada:** Calcule o valor da sua hora de manejo e colheita
- **Margem de Perda no Campo:** Adicione 10% a 15% para intempéries climáticas
- **Embalagem Ecológica e Logística:** Adicione o custo de caixas/sacos biodegradáveis
- **Margem do Produtor Recomendada:** 35% a 45% livre de intermediários (na feira convencional o atravessador fica com até 70% do valor).`;
  }

  return `Obrigado por consultar o **NutriCampo CampoConeQta**. Nossa missão é valorizar a comida de verdade, os produtores rurais locais e a saúde de quem consome!`;
}

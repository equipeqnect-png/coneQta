import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Store, 
  Package, 
  Tag, 
  Award, 
  Star, 
  Map, 
  Shield, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Plus,
  Trash2,
  Edit2,
  MapPin,
  Leaf
} from 'lucide-react';
import { AppUser, Producer, Product, Order, SealItem, ReviewItem, CategoryDef } from '../types';

interface AdminViewProps {
  currentUser: AppUser;
  users: AppUser[];
  producers: Producer[];
  products: Product[];
  orders: Order[];
  seals: SealItem[];
  reviews: ReviewItem[];
  categories: CategoryDef[];
  onSaveUser: (user: AppUser) => void;
  onDeleteProduct: (productId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  users,
  producers,
  products,
  orders,
  seals,
  reviews,
  categories,
  onSaveUser,
  onDeleteProduct,
}) => {
  // Tabs matching Screenshot 4
  const [activeTab, setActiveTab] = useState<
    'relatorios' | 'usuarios' | 'produtores' | 'produtos' | 'categorias' | 'selos' | 'avaliacoes' | 'mapa'
  >('relatorios');

  // Search in users
  const [userSearch, setUserSearch] = useState('');

  // Calculations for stats
  const totalUsersCount = users.length;
  const totalProducersCount = producers.length;
  const totalOrdersCount = orders.length;
  const completedOrdersCount = orders.filter(o => o.status === 'entregue').length;
  const totalVolumeNegotiated = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Filtered users
  const filteredUsers = users.filter(u => {
    const q = (userSearch || '').trim().toLowerCase();
    if (!q) return true;
    const name = (u.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const cpf = (u.cpf || '').toLowerCase();
    return name.includes(q) || email.includes(q) || cpf.includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Hero Banner (#1B261D / Dark Olive) - Matching Screenshot 4 */}
      <div className="bg-[#1B2820] text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-extrabold tracking-widest uppercase text-emerald-300 border border-white/15">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>PAINEL DE MODERAÇÃO E GESTÃO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
            ConeQta Queimados
          </h2>
          <p className="text-xs text-stone-300">
            Gestor do sistema de conexão produtor-consumidor.
          </p>
        </div>

        {/* Right Badge: Administrador Ativo */}
        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-xs">
            A
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-200">
              Administrador Ativo
            </div>
            <div className="text-xs font-bold text-white">
              {currentUser.name}
            </div>
          </div>
        </div>

      </div>

      {/* 2. Admin Navigation Tabs - Matching Screenshot 4 */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center min-w-max border-b border-stone-200/80">
          
          <button
            onClick={() => setActiveTab('relatorios')}
            className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'relatorios'
                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Relatórios & Estatísticas</span>
          </button>

          <button
            onClick={() => setActiveTab('usuarios')}
            className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'usuarios'
                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Usuários</span>
          </button>

          <button
            onClick={() => setActiveTab('produtores')}
            className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'produtores'
                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Produtores</span>
          </button>

          <button
            onClick={() => setActiveTab('produtos')}
            className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'produtos'
                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Produtos</span>
          </button>

          <button
            onClick={() => setActiveTab('categorias')}
            className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'categorias'
                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Categorias</span>
          </button>

          <button
            onClick={() => setActiveTab('selos')}
            className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'selos'
                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Selos</span>
          </button>

          <button
            onClick={() => setActiveTab('avaliacoes')}
            className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'avaliacoes'
                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Avaliações</span>
          </button>

          <button
            onClick={() => setActiveTab('mapa')}
            className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'mapa'
                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Mapa Geográfico</span>
          </button>

        </div>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB: RELATÓRIOS & ESTATÍSTICAS (Screenshot 4 exact layout) */}
      {activeTab === 'relatorios' && (
        <div className="space-y-6">
          
          {/* 4 Stat Cards Row matching Screenshot 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Total de Usuários */}
            <div className="bg-[#F6F8FA] rounded-2xl p-4 sm:p-5 border border-stone-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Total de Usuários</span>
                <span className="text-2xl font-extrabold text-stone-900 leading-tight">{totalUsersCount}</span>
                <span className="text-[11px] text-stone-500 font-medium block mt-0.5">👥 Cadastrados na Cidade</span>
              </div>
            </div>

            {/* Card 2: Total de Produtores */}
            <div className="bg-[#F4F9F5] rounded-2xl p-4 sm:p-5 border border-stone-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Total de Produtores</span>
                <span className="text-2xl font-extrabold text-stone-900 leading-tight">{totalProducersCount}</span>
                <span className="text-[11px] text-stone-500 font-medium block mt-0.5">Agricultura Familiar</span>
              </div>
            </div>

            {/* Card 3: Volume de Pedidos */}
            <div className="bg-[#FFFDF4] rounded-2xl p-4 sm:p-5 border border-stone-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Volume de Pedidos</span>
                <span className="text-2xl font-extrabold text-stone-900 leading-tight">{totalOrdersCount}</span>
                <span className="text-[11px] text-stone-500 font-medium block mt-0.5">☑️ {completedOrdersCount} entregues com sucesso</span>
              </div>
            </div>

            {/* Card 4: Volume Negociado */}
            <div className="bg-[#F0FDF8] rounded-2xl p-4 sm:p-5 border border-stone-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100/70 text-teal-700 flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Volume Negociado</span>
                <span className="text-2xl font-extrabold text-emerald-800 leading-tight">R$ {totalVolumeNegotiated.toFixed(2)}</span>
                <span className="text-[11px] text-stone-500 font-medium block mt-0.5">💰 Transações locais simuladas</span>
              </div>
            </div>

          </div>

          {/* Two Columns Row matching Screenshot 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Col 1: Volume de Pedidos por Período & Produtores mais acessados */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-base font-serif text-stone-900">
                    Volume de Pedidos por Período
                  </h4>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    Histórico Geral
                  </span>
                </div>

                {/* Progress bars matching Screenshot 4 */}
                <div className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex justify-between text-stone-700 font-medium mb-1">
                      <span>Hoje</span>
                      <span className="font-bold">1 pedido (R$ 25,00)</span>
                    </div>
                    <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '40%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-700 font-medium mb-1">
                      <span>Últimos 3 dias</span>
                      <span className="font-bold">2 pedidos (R$ 61,50)</span>
                    </div>
                    <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-700 font-medium mb-1">
                      <span>Últimos 7 dias</span>
                      <span className="font-bold">0 pedidos (R$ 0.00)</span>
                    </div>
                    <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1B2820] rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Produtores mais Acessados matching Screenshot 4 */}
              <div className="pt-4 border-t border-stone-100">
                <h5 className="font-bold text-xs text-stone-800 uppercase tracking-wider mb-3">
                  Produtores mais Acessados
                </h5>
                <div className="space-y-2 text-xs">
                  {producers.map((prod) => (
                    <div key={prod.id} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl">
                      <span className="font-medium text-stone-800">{prod.farmName}</span>
                      <span className="px-2 py-0.5 bg-stone-200 text-stone-700 text-[10px] font-bold rounded-md">
                        {prod.viewsCount || 0} visualizações
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Col 2: Produtos Mais Procurados & Mais Pedidos da Semana */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
              
              <div>
                <h4 className="font-bold text-base font-serif text-stone-900 mb-4">
                  Produtos Mais Procurados (Cliques)
                </h4>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-stone-400">#1</span>
                    <img
                      src={products[0]?.images[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
                      alt="Mandioca Brava"
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <div>
                      <h6 className="font-bold text-xs text-stone-900">{products[0]?.title || 'Mandioca Brava'}</h6>
                      <p className="text-[10px] text-stone-500 capitalize">{products[0]?.category || 'Legumes'}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-stone-200 text-stone-700 text-[10px] font-bold rounded-md">
                    {products[0]?.clicksCount || 0} cliques
                  </span>
                </div>
              </div>

              {/* Mais Pedidos da Semana matching Screenshot 4 */}
              <div className="pt-2">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs uppercase mb-3">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Mais Pedidos da Semana</span>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-stone-200 text-center space-y-1 shadow-2xs">
                  <div className="text-xs text-stone-500 font-medium">
                    {products[0]?.title || 'Mandioca Brava'}
                  </div>
                  <div className="text-3xl font-extrabold text-stone-900 font-serif">
                    {products[0]?.ordersCount || 0}x
                  </div>
                  <div className="text-[10px] text-stone-400">
                    pedidos confirmados
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB: USUÁRIOS */}
      {activeTab === 'usuarios' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-stone-900 text-base font-serif">Gestão de Usuários da Rede</h3>
              <p className="text-xs text-stone-500">Controle de acessos, produtores rurais e munícipes de Queimados.</p>
            </div>
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Buscar por nome, CPF ou email..."
              className="px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Nome / Usuário</th>
                  <th className="py-2.5 px-3">CPF</th>
                  <th className="py-2.5 px-3">Papel</th>
                  <th className="py-2.5 px-3">Bairro</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/80">
                    <td className="py-3 px-3">
                      <div className="font-bold text-stone-900">{u.name}</div>
                      <div className="text-[10px] text-stone-400">{u.email}</div>
                    </td>
                    <td className="py-3 px-3 text-stone-600 font-mono text-[11px]">{u.cpf}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'producer'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role === 'admin' ? 'Administrador' : u.role === 'producer' ? 'Produtor' : 'Consumidor'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-stone-600">{u.neighborhood}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          const updated = { ...u, status: u.status === 'ativo' ? 'bloqueado' : 'ativo' as AppUser['status'] };
                          onSaveUser(updated);
                        }}
                        className="text-[11px] font-bold text-stone-600 hover:text-stone-900 underline"
                      >
                        {u.status === 'ativo' ? 'Bloquear' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: PRODUTORES */}
      {activeTab === 'produtores' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {producers.map((prod) => (
            <div key={prod.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <img src={prod.avatar} alt={prod.name} className="w-14 h-14 object-cover rounded-2xl" />
                <div>
                  <h4 className="font-bold text-sm text-stone-900">{prod.farmName}</h4>
                  <p className="text-xs text-stone-500">{prod.name}</p>
                  <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                    📍 {prod.location.address} • {prod.location.neighborhood}
                  </p>
                </div>
              </div>
              <p className="text-xs text-stone-600 line-clamp-2">{prod.bio}</p>
              <div className="pt-2 flex justify-between items-center text-xs text-stone-500 border-t border-stone-100">
                <span>Avaliação: ⭐ {prod.rating}</span>
                <span>WhatsApp: {prod.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: PRODUTOS */}
      {activeTab === 'produtos' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-stone-900 text-base font-serif">Moderação de Produtos Locais</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt={p.title} className="w-12 h-12 object-cover rounded-xl" />
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">{p.title}</h5>
                    <p className="text-[10px] text-stone-500">{p.producerFarm}</p>
                    <p className="text-xs font-bold text-emerald-800">R$ {p.price.toFixed(2)} /{p.unit}</p>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteProduct(p.id)}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                  title="Remover produto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: CATEGORIAS */}
      {activeTab === 'categorias' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-stone-900 text-base font-serif">Categorias Alimentares Ativas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((c) => (
              <div key={c.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs text-stone-900">{c.name}</h5>
                  <p className="text-[10px] text-stone-500">ID: {c.id}</p>
                </div>
                <span className="px-2.5 py-1 bg-stone-200 text-stone-800 text-xs font-bold rounded-lg">
                  {c.count} itens
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SELOS */}
      {activeTab === 'selos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {seals.map((s) => (
            <div key={s.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900">{s.title}</h4>
                  <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[9px] font-bold uppercase rounded-md">
                    {s.badge}
                  </span>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">{s.description}</p>
              <div className="text-[10px] text-emerald-800 font-bold pt-2 border-t border-stone-100">
                Atribuído a {s.activeCount} propriedades em Queimados
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: AVALIAÇÕES */}
      {activeTab === 'avaliacoes' && (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-stone-900">{r.authorName}</span>
                  <span className="text-[11px] text-stone-500 ml-2">avaliou <strong>{r.producerName}</strong></span>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{r.rating}.0</span>
                </div>
              </div>
              <p className="text-xs text-stone-700 italic">"{r.comment}"</p>
              <div className="text-[10px] text-stone-400">{r.date}</div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: MAPA GEOGRÁFICO */}
      {activeTab === 'mapa' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-base font-serif">Mapeamento Agroecológico de Queimados, RJ</h3>
              <p className="text-xs text-stone-500">Distribuição espacial das propriedades rurais, hortas comunitárias e consumidores.</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
              Zona Rural & Urbana
            </span>
          </div>

          <div className="bg-stone-100 rounded-2xl p-8 border border-stone-200 min-h-[320px] flex flex-col items-center justify-center relative overflow-hidden text-center space-y-4">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#4E553D_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Map points representation */}
            <div className="flex flex-wrap items-center justify-center gap-6 relative z-10">
              <div className="p-4 bg-white rounded-2xl border border-stone-300 shadow-xs text-left max-w-xs">
                <div className="flex items-center gap-2 text-[#D35400] font-bold text-xs">
                  <MapPin className="w-4 h-4" />
                  <span>Sítio Agroecológico da Vivian</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">Estrada do Sol, 450 • Zona Rural</p>
                <p className="text-[10px] text-emerald-700 font-bold mt-1">Mandioca, Folhosas e Ovos</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-300 shadow-xs text-left max-w-xs">
                <div className="flex items-center gap-2 text-[#D35400] font-bold text-xs">
                  <MapPin className="w-4 h-4" />
                  <span>Mercado Leo (Sítio São José)</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">Estrada do Lazareto, 120 • Vila Tinguá</p>
                <p className="text-[10px] text-amber-700 font-bold mt-1">Queijos e Mel Silvestre</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-300 shadow-xs text-left max-w-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <Leaf className="w-4 h-4" />
                  <span>Horta EM Leopoldo Machado</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">Polo Agroecológico Educacional</p>
                <p className="text-[10px] text-blue-700 font-bold mt-1">Ervas & Chás Medicinais</p>
              </div>
            </div>

            <p className="text-xs text-stone-500 relative z-10 max-w-md">
              Queimados possui microbacias e cinturões verdes estratégicos para abastecimento alimentar com baixa pegada de carbono.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

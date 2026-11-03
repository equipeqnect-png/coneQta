import React from 'react';
import { 
  Sparkles, 
  Sprout, 
  Utensils, 
  Scissors, 
  Shirt, 
  Palette, 
  Check, 
  Filter
} from 'lucide-react';
import { Category } from '../types';

interface CategoryFilterProps {
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  onlyOrganic: boolean;
  onToggleOrganic: () => void;
  onlyHarvestedToday: boolean;
  onToggleHarvestedToday: () => void;
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'distance';
  onSortChange: (sort: 'relevance' | 'price_asc' | 'price_desc' | 'distance') => void;
  totalProductsCount: number;
}

const CATEGORIES: { id: Category; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'todos', label: 'Todos', icon: Sparkles },
  { id: 'produtos_agricolas', label: 'Produtos agrícolas', icon: Sprout },
  { id: 'gastronomia', label: 'Gastronomia', icon: Utensils },
  { id: 'estetica_beleza', label: 'Estética e beleza', icon: Scissors },
  { id: 'vestuario', label: 'Vestuário', icon: Shirt },
  { id: 'artesanato', label: 'Artesanato', icon: Palette },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  onlyOrganic,
  onToggleOrganic,
  onlyHarvestedToday,
  onToggleHarvestedToday,
  sortBy,
  onSortChange,
  totalProductsCount,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-800/20 scale-[1.02]'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 hover:border-stone-300'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-stone-500'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary filter & sorting bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-700">
        
        {/* Left: Quick Checkboxes */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="font-semibold text-stone-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filtros:
          </span>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-stone-900 select-none">
            <input
              type="checkbox"
              checked={onlyOrganic}
              onChange={onToggleOrganic}
              className="w-4 h-4 rounded-md accent-emerald-700 cursor-pointer"
            />
            <span className="font-medium text-emerald-900">🌱 Apenas 100% Orgânico</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-stone-900 select-none">
            <input
              type="checkbox"
              checked={onlyHarvestedToday}
              onChange={onToggleHarvestedToday}
              className="w-4 h-4 rounded-md accent-emerald-700 cursor-pointer"
            />
            <span className="font-medium text-amber-900">☀️ Colhido Hoje</span>
          </label>
        </div>

        {/* Right: Results count & Sorting */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-stone-500 font-medium">
            <strong className="text-stone-900">{totalProductsCount}</strong> itens encontrados
          </span>

          <div className="flex items-center gap-1.5 border-l border-stone-200 pl-3">
            <span className="text-stone-500 font-medium">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="relevance">Mais Frescos (Relevância)</option>
              <option value="distance">Mais Próximos (Menor Distância)</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};

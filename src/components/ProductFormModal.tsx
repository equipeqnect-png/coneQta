import React, { useState } from 'react';
import { X, Sparkles, Image, DollarSign, Package } from 'lucide-react';
import { Product, Producer } from '../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  currentProducer: Producer;
  productToEdit?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentProducer,
  productToEdit,
}) => {
  const [title, setTitle] = useState(productToEdit?.title || '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [price, setPrice] = useState(productToEdit ? productToEdit.price.toString() : '');
  const [unit, setUnit] = useState(productToEdit?.unit || 'Kg');
  const [category, setCategory] = useState(productToEdit?.category || 'legumes');
  const [stock, setStock] = useState(productToEdit ? productToEdit.stock.toString() : '20');
  const [harvestDate, setHarvestDate] = useState(productToEdit?.harvestDate || 'Hoje às 06:00h');
  const [imageUrl, setImageUrl] = useState(productToEdit?.images[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80');
  const [organic, setOrganic] = useState(productToEdit ? productToEdit.organic : true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    const newProd: Product = {
      id: productToEdit ? productToEdit.id : `p_${Date.now()}`,
      producerId: currentProducer.id,
      producerName: currentProducer.name,
      producerFarm: currentProducer.farmName,
      producerDistanceKm: currentProducer.location.distanceKm,
      title: title.trim(),
      description: description.trim() || 'Cultivado com carinho e agroecologia no município de Queimados.',
      price: parseFloat(price) || 5.0,
      unit: unit,
      category: category,
      images: [imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'],
      stock: parseInt(stock, 10) || 10,
      harvestDate: harvestDate,
      organic: organic,
      certifications: organic ? ['agroecologico', 'familiar', 'sem_agrotoxico'] : ['familiar', 'artesanal'],
      freshnessScore: 10,
      isSeasonal: false,
      featured: true,
      clicksCount: productToEdit?.clicksCount || 0,
      ordersCount: productToEdit?.ordersCount || 0,
    };

    onSave(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div>
            <h3 className="font-bold text-stone-900 font-serif text-lg">
              {productToEdit ? 'Editar Produto' : 'Cadastrar Novo Alimento'}
            </h3>
            <p className="text-xs text-stone-500">
              Propriedade: {currentProducer.farmName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Nome do Alimento / Produto</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Mandioca Brava, Couve Orgânica, Queijo Frescal"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-hidden focus:border-[#D35400]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Preço (R$)</label>
              <input
                type="number"
                step="0.10"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="5.00"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Unidade de Medida</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 font-bold"
              >
                <option value="Kg">Kg</option>
                <option value="Maço">Maço</option>
                <option value="Dúzia">Dúzia</option>
                <option value="Peça ~500g">Peça ~500g</option>
                <option value="Pote 500g">Pote 500g</option>
                <option value="Unidade">Unidade</option>
                <option value="Caixa">Caixa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 font-bold"
              >
                <option value="legumes">Legumes e Raízes</option>
                <option value="hortalicas">Hortaliças e Folhosas</option>
                <option value="queijos_laticinios">Queijos e Laticínios</option>
                <option value="ovos_aves">Ovos e Aves</option>
                <option value="mel_doces">Mel e Doces</option>
                <option value="chas_ervas">Chás e Ervas</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Estoque Disponível</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="20"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Horário / Lote de Colheita</label>
            <input
              type="text"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              placeholder="Ex: Hoje às 06:00h"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Descrição Curta</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o frescor, variedades e modo de preparo..."
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">URL da Foto</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isOrganic"
              checked={organic}
              onChange={(e) => setOrganic(e.target.checked)}
              className="w-4 h-4 rounded-sm text-[#D35400] focus:ring-[#D35400]"
            />
            <label htmlFor="isOrganic" className="text-xs font-bold text-stone-700 cursor-pointer">
              Cultivo 100% Agroecológico / Sem Agrotóxicos
            </label>
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#D35400] hover:bg-[#BA4A00] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Salvar Alimento
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

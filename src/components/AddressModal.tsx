import React, { useState } from 'react';
import { MapPin, X, Check } from 'lucide-react';
import { UserAddressConfig } from '../services/storage';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: UserAddressConfig;
  onSaveAddress: (newAddr: UserAddressConfig) => void;
}

export const PRESET_LOCATIONS: UserAddressConfig[] = [
  {
    label: 'Sítio Vivian – Sede 🏡',
    address: 'Estrada do Sol, 450',
    neighborhood: 'Zona Rural',
    city: 'Queimados, RJ',
  },
  {
    label: 'Centro de Queimados 🏙️',
    address: 'Rua Olímpia Silva, 210',
    neighborhood: 'Centro',
    city: 'Queimados, RJ',
  },
  {
    label: 'Vila Tinguá / Lazareto 🌿',
    address: 'Estrada do Lazareto, 120',
    neighborhood: 'Vila Tinguá',
    city: 'Queimados, RJ',
  },
  {
    label: 'Vila São João 🏠',
    address: 'Av. Camarim, 102',
    neighborhood: 'Vila São João',
    city: 'Queimados, RJ',
  },
];

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  onSaveAddress,
}) => {
  const [selectedLabel, setSelectedLabel] = useState(currentAddress.label);
  const [customAddress, setCustomAddress] = useState(currentAddress.address);
  const [customNeighborhood, setCustomNeighborhood] = useState(currentAddress.neighborhood);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: UserAddressConfig) => {
    setSelectedLabel(preset.label);
    setCustomAddress(preset.address);
    setCustomNeighborhood(preset.neighborhood);
    onSaveAddress(preset);
    onClose();
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig: UserAddressConfig = {
      label: selectedLabel || 'Meu Endereço 📍',
      address: customAddress,
      neighborhood: customNeighborhood,
      city: 'Queimados, RJ',
    };
    onSaveAddress(newConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-150">
        
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 font-serif text-base">Alterar Local de Entrega</h3>
              <p className="text-[11px] text-stone-500">Recalcula distâncias e fretes para Queimados, RJ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets */}
        <div className="mt-4 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Locais Rápidos em Queimados
          </p>
          {PRESET_LOCATIONS.map((preset) => {
            const isCurrent = currentAddress.label === preset.label;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'border-[#4E553D] bg-stone-50/80 ring-1 ring-[#4E553D]'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-stone-800">{preset.label}</div>
                  <div className="text-[11px] text-stone-500">{preset.address} • {preset.neighborhood}</div>
                </div>
                {isCurrent && <Check className="w-4 h-4 text-[#4E553D]" />}
              </button>
            );
          })}
        </div>

        {/* Custom Form */}
        <form onSubmit={handleSaveCustom} className="mt-5 pt-4 border-t border-stone-100 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Ou digite outro endereço local
          </p>

          <div>
            <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Rua / Estrada e Número</label>
            <input
              type="text"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
              placeholder="Ex: Estrada de Austin, 300"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Bairro em Queimados</label>
            <input
              type="text"
              value={customNeighborhood}
              onChange={(e) => setCustomNeighborhood(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
              placeholder="Ex: Centro, Vila Tinguá, Fátima"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors"
            >
              Fechar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#4E553D] hover:bg-[#404732] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Salvar Endereço
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

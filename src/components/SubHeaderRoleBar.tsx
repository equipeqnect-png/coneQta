import React from 'react';
import { User, Home, Shield, ChevronDown } from 'lucide-react';
import { ActiveRoleOption } from '../types';

interface SubHeaderRoleBarProps {
  currentRoleOption: ActiveRoleOption;
  onChangeRoleOption: (option: ActiveRoleOption) => void;
}

export const SubHeaderRoleBar: React.FC<SubHeaderRoleBarProps> = ({
  currentRoleOption,
  onChangeRoleOption,
}) => {
  const getNavigatingLabel = () => {
    switch (currentRoleOption) {
      case 'admin':
        return {
          icon: <Shield className="w-4 h-4 text-emerald-800" />,
          title: 'Painel de Auditoria (Admin)',
          textColor: 'text-stone-900',
        };
      case 'producer_vivian':
        return {
          icon: <Home className="w-4 h-4 text-[#D35400]" />,
          title: 'Painel do Produtor (Sítio Agroecológico da Vivian)',
          textColor: 'text-[#D35400]',
        };
      case 'producer_leo':
        return {
          icon: <Home className="w-4 h-4 text-[#D35400]" />,
          title: 'Painel do Produtor (Mercado Leo)',
          textColor: 'text-[#D35400]',
        };
      case 'consumer':
      default:
        return {
          icon: <User className="w-4 h-4 text-emerald-800" />,
          title: 'Painel do Consumidor',
          textColor: 'text-emerald-900',
        };
    }
  };

  const navInfo = getNavigatingLabel();

  return (
    <div className="bg-[#FAF9F6] border-b border-stone-200/90 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Left: You are navigating as... */}
        <div>
          <div className="text-[10px] font-bold tracking-widest text-stone-500 uppercase">
            Você está navegando como:
          </div>
          <div className={`flex items-center gap-2 text-sm sm:text-base font-bold font-serif ${navInfo.textColor} mt-0.5`}>
            {navInfo.icon}
            <span>{navInfo.title}</span>
          </div>
        </div>

        {/* Right: Go to dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="role-select" className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
            Ir para:
          </label>
          <div className="relative">
            <select
              id="role-select"
              value={currentRoleOption}
              onChange={(e) => onChangeRoleOption(e.target.value as ActiveRoleOption)}
              className="appearance-none bg-white border border-stone-300 hover:border-stone-400 font-bold text-xs text-stone-800 rounded-lg pl-3 pr-8 py-2 shadow-2xs focus:outline-hidden focus:ring-1 focus:ring-emerald-700 cursor-pointer min-w-[230px]"
            >
              <option value="consumer">Consumidor</option>
              <option value="producer_vivian">Produtor (Sítio Agroecológico da Vivian)</option>
              <option value="producer_leo">Produtor (Mercado Leo)</option>
              <option value="admin">Administrador ADM</option>
            </select>
            <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

      </div>
    </div>
  );
};

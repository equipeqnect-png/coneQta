import React from 'react';
import { Leaf, LogOut, Shield } from 'lucide-react';
import { ActiveRoleOption, AppUser } from '../types';

interface AppHeaderProps {
  currentRoleOption: ActiveRoleOption;
  currentUser: AppUser | null;
  onLogout: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentRoleOption,
  currentUser,
  onLogout,
}) => {
  // Background colors per view:
  // Consumer: Deep Forest Green (#1F6B38)
  // Producer: Terracotta/Deep Orange (#D35400)
  // Admin: Dark Forest/Slate (#162820)
  const getHeaderBg = () => {
    switch (currentRoleOption) {
      case 'producer_vivian':
      case 'producer_leo':
        return 'bg-[#D35400]';
      case 'admin':
        return 'bg-[#162820]';
      case 'consumer':
      default:
        return 'bg-[#1F6B38]';
    }
  };

  const getRoleBadge = () => {
    switch (currentRoleOption) {
      case 'admin':
        return 'ADMINISTRADORA';
      case 'producer_vivian':
      case 'producer_leo':
        return 'PRODUTOR(A)';
      case 'consumer':
      default:
        return 'CONSUMIDORA';
    }
  };

  return (
    <header className={`${getHeaderBg()} text-white transition-colors duration-200 shadow-xs`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Left: Brand Logo & Municipality */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 text-white shadow-xs">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-wider uppercase">
                CONE<span className="text-lime-300">Q</span>TA
              </span>
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-white/90">
              Queimados <span className="text-white/60 font-light">|</span> RJ
            </div>
          </div>
        </div>

        {/* Right: User identity & Sair button */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right hidden xs:block sm:block">
            <div className="font-bold text-xs sm:text-sm text-white">
              {currentUser?.name || 'Usuário'}
            </div>
            <div className="text-[10px] text-white/80 font-bold uppercase tracking-wider flex items-center justify-end gap-1">
              <Shield className="w-3 h-3 text-amber-300" />
              <span>{getRoleBadge()}</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sair da conta"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs font-bold rounded-lg border border-white/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>

      </div>
    </header>
  );
};

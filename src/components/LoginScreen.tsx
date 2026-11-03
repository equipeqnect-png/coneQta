import React, { useState } from 'react';
import { Leaf, User, Lock, ArrowRight, ShieldCheck, Check, ArrowLeft } from 'lucide-react';
import { ActiveRoleOption, AppUser } from '../types';
import { StorageService } from '../services/storage';

interface LoginScreenProps {
  onLogin: (roleOption: ActiveRoleOption, user: AppUser) => void;
  users: AppUser[];
  onBackToLanding?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, users, onBackToLanding }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoNotice, setInfoNotice] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // New registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCpf, setRegCpf] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'consumer' | 'producer'>('consumer');
  const [regNeighborhood, setRegNeighborhood] = useState('Centro');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoNotice('');

    if (!identifier.trim()) {
      setErrorMsg('Por favor, preencha seu CPF ou E-mail cadastrado.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Por favor, informe sua senha de acesso.');
      return;
    }

    const cleanId = identifier.trim().toLowerCase();
    const foundUser = users.find(
      u => (u.cpf || '').toLowerCase() === cleanId ||
           (u.email || '').toLowerCase() === cleanId ||
           (u.name || '').toLowerCase() === cleanId
    );

    if (!foundUser) {
      setErrorMsg('E-mail ou CPF não encontrado. Verifique os dados digitados ou crie sua conta.');
      return;
    }

    if (foundUser.role === 'admin') {
      onLogin('admin', foundUser);
    } else if (foundUser.role === 'producer') {
      if (foundUser.producerId === 'prod_leo' || foundUser.id === 'usr_leo') {
        onLogin('producer_leo', foundUser);
      } else {
        onLogin('producer_vivian', foundUser);
      }
    } else {
      onLogin('consumer', foundUser);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EFEA] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Container matching Screenshot 1 */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-200/80 flex flex-col md:flex-row">
        
        {/* Left Side: Brand Green Section (#1F6B38 matching home page) */}
        <div className="md:w-5/12 bg-[#1F6B38] text-stone-100 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle curved background overlay */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-black/10 pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/25">
                <Leaf className="w-5 h-5 text-lime-300 fill-lime-300/30" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white leading-tight">ConeQta</h1>
                <p className="text-[10px] font-bold tracking-widest text-lime-200/90 uppercase">Queimados, RJ</p>
              </div>
            </div>

            {/* Headline */}
            <div className="pt-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight font-sans">
                Conectando empreendedores de Queimados à população
              </h2>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-8 mt-6 border-t border-white/15 text-[10px] text-emerald-200/80 font-light relative z-10">
            ConeQta © 2026 • Desafio Liga Jovem • Equipe Q-NECT
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-7/12 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Top Bar with Back to Landing button */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold tracking-widest text-emerald-800 uppercase">
                Conectando empreendedores de Queimados à população
              </p>
              {onBackToLanding && (
                <button
                  type="button"
                  id="login-back-to-landing-btn"
                  onClick={onBackToLanding}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Início</span>
                </button>
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-sans mb-6">
              Faça seu login
            </h2>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            {infoNotice && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                <span>{infoNotice}</span>
                <button 
                  type="button" 
                  onClick={() => setInfoNotice('')} 
                  className="text-emerald-900 font-bold ml-2 hover:opacity-75"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* CPF / Email */}
              <div>
                <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                  CPF OU E-MAIL CADASTRADO
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="000.000.000-00 ou seu@email.com"
                    className="w-full px-4 py-3 bg-[#FBFBFA] border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-hidden focus:border-[#1F6B38] focus:ring-1 focus:ring-[#1F6B38] transition-colors pr-10"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                    SENHA DE ACESSO
                  </label>
                  <button
                    type="button"
                    onClick={() => setInfoNotice('Para redefinir sua senha, solicite as instruções enviadas para seu e-mail cadastrado ou contate a administração municipal do ConeQta.')}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#FBFBFA] border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-hidden focus:border-[#1F6B38] focus:ring-1 focus:ring-[#1F6B38] transition-colors pr-10 tracking-widest"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#1F6B38] hover:bg-[#18532B] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                Confirmar e Entrar
              </button>
            </form>

            {/* Create account link */}
            <div className="text-center mt-5 pt-3 border-t border-stone-100">
              <p className="text-xs text-stone-600">
                Não tem cadastro ainda?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(true)}
                  className="font-bold text-[#C87A38] hover:underline cursor-pointer"
                >
                  Crie sua conta aqui!
                </button>
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Modal for Create Account */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <h3 className="text-xl font-bold font-serif text-stone-900 mb-1">Criar Nova Conta no ConeQta</h3>
            <p className="text-xs text-stone-500 mb-5">Junte-se à rede agroecológica e comunitária de Queimados, RJ.</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!regName.trim()) return;
              const newUser: AppUser = {
                id: `usr_${Date.now()}`,
                name: regName.trim(),
                email: regEmail.trim() || `${regName.toLowerCase().replace(/\s+/g, '')}@coneqta.app`,
                cpf: regCpf.trim() || '123.456.789-00',
                phone: regPhone.trim() || '(21) 99999-9999',
                role: regRole,
                city: 'Queimados',
                neighborhood: regNeighborhood,
                status: 'ativo',
                verified: true,
                createdAt: new Date().toLocaleDateString('pt-BR'),
                farmId: regRole === 'producer' ? 'prod_vivian' : undefined,
              };
              StorageService.saveUser(newUser);
              if (regRole === 'producer') {
                onLogin('producer_vivian', newUser);
              } else {
                onLogin('consumer', newUser);
              }
              setIsRegisterOpen(false);
            }} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">E-mail</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="(21) 9..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Tipo de Perfil</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('consumer')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      regRole === 'consumer'
                        ? 'bg-[#1F6B38] text-white border-[#1F6B38]'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    👤 Consumidor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('producer')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      regRole === 'producer'
                        ? 'bg-[#1F6B38] text-white border-[#1F6B38]'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    🏠 Empreendedor / Produtor
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1F6B38] hover:bg-[#18532B] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Criar Conta e Acessar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

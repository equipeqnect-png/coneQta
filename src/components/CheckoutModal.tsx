import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  QrCode, 
  CreditCard, 
  Banknote, 
  Truck, 
  ShieldCheck, 
  Sprout,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order, Producer, AppUser } from '../types';
import { StorageService, UserAddressConfig } from '../services/storage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  deliveryType: 'delivery' | 'pickup';
  onOrderPlaced: (order: Order) => void;
  producers: Producer[];
  currentUser?: AppUser | null;
  currentAddress?: UserAddressConfig | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  deliveryType,
  onOrderPlaced,
  producers,
  currentUser,
  currentAddress,
}) => {
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerAddress, setCustomerAddress] = useState(
    currentAddress ? `${currentAddress.address} - ${currentAddress.neighborhood}, ${currentAddress.city}` : ''
  );
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'cash'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<Order | null>(null);

  // Sync with current user when opening modal
  useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        setCustomerName(currentUser.name);
        setCustomerPhone(currentUser.phone || '');
      }
      if (currentAddress) {
        setCustomerAddress(`${currentAddress.address} - ${currentAddress.neighborhood}, ${currentAddress.city}`);
      }
    }
  }, [isOpen, currentUser, currentAddress]);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = deliveryType === 'delivery' ? 8.00 : 0.00;
  const total = subtotal + deliveryFee;

  const pixCode = `00020126580014BR.GOV.BCB.PIX0136campoconeqta-${Date.now()}520400005303986540${total.toFixed(2)}5802BR5925CAMPO CONEQTA PRODUTORES6009QUEIMADOS62070503***6304ABCD`;

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const producerIds: string[] = Array.from(new Set(cart.map((item) => item.product.producerId)));
      const newOrder: Order = {
        id: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        customerName,
        customerPhone,
        customerAddress: deliveryType === 'delivery' ? customerAddress : 'Retirada na Porteira / Feira',
        items: [...cart],
        totalAmount: total,
        deliveryFee,
        deliveryType,
        paymentMethod,
        paymentStatus: 'paid',
        status: 'colhendo',
        trackingCode: `RASTR-CCQ-${Date.now().toString().slice(-4)}`,
        harvestBatchNote: 'Colheita programada para a madrugada.',
        producerIds,
      };

      StorageService.saveOrder(newOrder);
      setOrderCompleted(newOrder);
      setIsProcessing(false);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#047857', '#10b981', '#f59e0b', '#10b981'],
        });
      } catch (err) {
        console.log('Confetti triggered');
      }

      onOrderPlaced(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-100 flex flex-col p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-serif text-stone-900 text-lg">
                {orderCompleted ? 'Pedido Confirmado no Campo!' : 'Finalizar Pedido Direto do Produtor'}
              </h3>
              <p className="text-xs text-stone-500">Sem atravessadores • 100% Repasse Justo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 text-xl font-bold p-1"
          >
            &times;
          </button>
        </div>

        {/* State: Order Completed with Confetti */}
        {orderCompleted ? (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">
                Código de Rastreio: {orderCompleted.trackingCode}
              </span>
              <h4 className="text-2xl font-bold font-serif text-stone-900 mt-1">
                Colheita Agendada com Sucesso!
              </h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto mt-2 leading-relaxed">
                As famílias produtoras já receberam a sua solicitação. Os alimentos serão colhidos frescos especialmente para você.
              </p>
            </div>

            {/* Summary Box */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between font-bold text-stone-900 pb-1 border-b border-emerald-200/60">
                <span>Pedido #{orderCompleted.id}</span>
                <span className="text-emerald-900">R$ {orderCompleted.totalAmount.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="text-stone-600">
                <span>Destinatário: <strong>{orderCompleted.customerName}</strong> ({orderCompleted.customerPhone})</span>
              </div>
              <div className="text-stone-600">
                <span>Local: <strong>{orderCompleted.customerAddress}</strong></span>
              </div>
              <div className="text-stone-600">
                <span>Pagamento: <strong>{orderCompleted.paymentMethod.toUpperCase()} (Confirmado)</strong></span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={onClose}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-2xl shadow-md transition-all text-xs"
              >
                Acompanhar Minha Colheita
              </button>
            </div>
          </div>
        ) : (
          /* State: Checkout Form */
          <form onSubmit={handleFinishOrder} className="space-y-4 text-xs">
            
            {/* Customer Details */}
            <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <h4 className="font-bold text-stone-800 text-xs">1. Seus Dados de Contato</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {deliveryType === 'delivery' && (
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Endereço de Entrega (Rua, Número, Bairro)</label>
                  <input
                    type="text"
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <h4 className="font-bold text-stone-800 text-xs">2. Forma de Pagamento</h4>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                    paymentMethod === 'pix'
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <QrCode className="w-5 h-5 mb-1 text-emerald-400" />
                  <span className="font-bold text-[11px]">PIX Instantâneo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1 text-emerald-400" />
                  <span className="font-bold text-[11px]">Cartão de Crédito</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                    paymentMethod === 'cash'
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Banknote className="w-5 h-5 mb-1 text-emerald-400" />
                  <span className="font-bold text-[11px]">Pagar na Entrega</span>
                </button>
              </div>

              {/* PIX Details */}
              {paymentMethod === 'pix' && (
                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-stone-700 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span>Chave PIX CampoConeQta (Repasse Direto):</span>
                    <span className="text-[10px] bg-emerald-100 px-2 py-0.5 rounded-md">Sem Taxa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pixCode}
                      className="w-full bg-stone-50 border border-stone-200 p-2 rounded-lg text-[10px] text-stone-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-lg font-bold text-[11px] shrink-0 flex items-center gap-1 shadow-2xs"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-stone-400">
                    O pagamento é reconhecido instantaneamente ao clicar em confirmar abaixo.
                  </p>
                </div>
              )}
            </div>

            {/* Total Summary */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-stone-700 space-y-1">
              <div className="flex justify-between">
                <span>Alimentos Frescos ({cart.length} itens):</span>
                <span className="font-bold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de Frete do Campo:</span>
                <span className="font-bold">{deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-emerald-950 pt-2 border-t border-emerald-200">
                <span>Total Final</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isProcessing ? 'Confirmando com as Famílias Produtoras...' : 'Confirmar e Agendar Colheita'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

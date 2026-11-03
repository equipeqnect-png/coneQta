import React from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Package, 
  Sprout, 
  MapPin, 
  Store,
  Calendar
} from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

const STATUS_STEPS = [
  { id: 'recebido', label: 'Pedido Confirmado', desc: 'Produtor avisado no campo' },
  { id: 'colhendo', label: 'Colheita na Horta / Fazenda', desc: 'Alimentos sendo colhidos frescos' },
  { id: 'embalado', label: 'Embalagem Ecológica', desc: 'Higienizado e pronto em caixas' },
  { id: 'em_transito', label: 'Em Rota de Entrega', desc: 'A caminho da sua casa ou ponto' },
  { id: 'entregue', label: 'Entregue na sua Mesa', desc: 'Comida de verdade entregue!' },
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-100 flex flex-col p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-serif text-stone-900 text-lg">
                Rastreamento da Colheita & Pedidos
              </h3>
              <p className="text-xs text-stone-400">Acompanhe a viagem do alimento do campo até a sua mesa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 text-2xl font-bold p-1"
          >
            &times;
          </button>
        </div>

        {/* Orders list */}
        {orders.length === 0 ? (
          <div className="py-12 text-center text-stone-500 space-y-2">
            <Sprout className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h4 className="font-bold text-stone-800 text-sm">Você ainda não tem pedidos ativos</h4>
            <p className="text-xs text-stone-400">Faça sua primeira compra na feira digital para rastrear a colheita em tempo real!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStepIndex = STATUS_STEPS.findIndex((s) => s.id === order.status);

              return (
                <div key={order.id} className="bg-stone-50 rounded-3xl border border-stone-200 p-5 space-y-4">
                  {/* Order header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900 font-mono">Pedido #{order.id}</span>
                        <span className="text-[11px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                          {order.trackingCode}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-emerald-950 block">
                        R$ {order.totalAmount.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {order.deliveryType === 'delivery' ? `Entrega em: ${order.customerAddress}` : 'Retirada na Feira'}
                      </span>
                    </div>
                  </div>

                  {/* Visual Step by Step Timeline */}
                  <div className="py-2">
                    <div className="relative flex items-center justify-between">
                      {STATUS_STEPS.map((step, idx) => {
                        const isCompleted = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;

                        return (
                          <div key={step.id} className="flex-1 flex flex-col items-center text-center relative group">
                            {/* Connecting Line */}
                            {idx > 0 && (
                              <div className={`absolute top-4 -left-1/2 w-full h-1 -z-0 transition-colors ${
                                idx <= currentStepIndex ? 'bg-emerald-600' : 'bg-stone-200'
                              }`} />
                            )}

                            {/* Dot Icon */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all ${
                              isCurrent
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md animate-bounce'
                                : isCompleted
                                ? 'bg-emerald-700 text-white'
                                : 'bg-stone-200 text-stone-400'
                            }`}>
                              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-stone-400" />}
                            </div>

                            {/* Label */}
                            <span className={`text-[10px] font-bold mt-2 leading-tight ${
                              isCurrent ? 'text-emerald-950 font-black' : isCompleted ? 'text-stone-700' : 'text-stone-400'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="bg-white rounded-2xl p-3 border border-stone-200 text-xs">
                    <span className="font-bold text-stone-500 text-[10px] uppercase block mb-1">Itens deste pedido:</span>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, i) => (
                        <span key={i} className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-lg text-xs font-medium">
                          {item.quantity}x {item.product.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl"
          >
            Fechar Rastreamento
          </button>
        </div>

      </div>
    </div>
  );
};

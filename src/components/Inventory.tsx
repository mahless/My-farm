import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { Warehouse, ArrowDownToLine, ArrowUpFromLine, Edit2, Brain } from 'lucide-react';
import { SmartAssistant } from './SmartAssistant';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

export const Inventory = () => {
  const { state, addInventoryTransaction } = useFarmContext();
  const [activeSubTab, setActiveSubTab] = useState<'manage' | 'assistant'>('manage');
  const [selectedItem, setSelectedItem] = useState(state.inventory[0]?.id || '');
  const [txType, setTxType] = useState<'in' | 'out' | 'set'>('in');
  const [quantity, setQuantity] = useState(0);

  const handleTransaction = () => {
    if (quantity > 0 && selectedItem) {
      addInventoryTransaction(selectedItem, txType, quantity);
      setQuantity(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Toggle */}
      <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-md">
        <button 
          onClick={() => setActiveSubTab('manage')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-base transition-all ${activeSubTab === 'manage' ? 'bg-white text-indigo-700 shadow-sm scale-[1.02]' : 'text-gray-500'}`}
        >
          <Warehouse className={`w-5 h-5 ${activeSubTab === 'manage' ? 'text-indigo-600' : 'text-gray-400'}`} />
          إدارة المخزن
        </button>
        <button 
          onClick={() => setActiveSubTab('assistant')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-base transition-all ${activeSubTab === 'assistant' ? 'bg-white text-indigo-700 shadow-sm scale-[1.02]' : 'text-gray-500'}`}
        >
          <Brain className={`w-5 h-5 ${activeSubTab === 'assistant' ? 'text-indigo-600' : 'text-gray-400'}`} />
          المساعد الذكي
        </button>
      </div>

      {activeSubTab === 'assistant' ? (
        <SmartAssistant />
      ) : (
        <>
          <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-lg shadow-indigo-900/5">
        <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center">
          <Warehouse className="w-6 h-6 ml-2 text-indigo-600" />
          المخزون الحالي
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {state.inventory.map(item => (
            <div key={item.id} className="p-4 bg-white/50 rounded-2xl border border-white/30 text-center shadow-sm">
              <p className="text-base text-gray-600 mb-1 font-bold">{item.nameAr}</p>
              <p className="text-2xl font-black text-indigo-900">{parseFloat(item.quantity.toFixed(1))} <span className="text-sm font-normal text-gray-500">{item.unit}</span></p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl shadow-indigo-900/5">
        <h3 className="text-xl font-black text-gray-800 mb-4">تسجيل حركة مخزن</h3>
        
        <div className="space-y-5">
          <div className="flex gap-2">
            <button 
              onClick={() => setTxType('in')}
              className={`flex-1 py-2.5 rounded-xl font-black text-base flex items-center justify-center transition shadow-sm ${txType === 'in' ? 'bg-green-500 text-white' : 'bg-white/50 text-gray-600'}`}
            >
              <ArrowDownToLine className="w-5 h-5 ml-2" /> وارد
            </button>
            <button 
              onClick={() => setTxType('out')}
              className={`flex-1 py-2.5 rounded-xl font-black text-base flex items-center justify-center transition shadow-sm ${txType === 'out' ? 'bg-red-500 text-white' : 'bg-white/50 text-gray-600'}`}
            >
              <ArrowUpFromLine className="w-5 h-5 ml-2" /> منصرف
            </button>
            <button 
              onClick={() => setTxType('set')}
              className={`flex-1 py-2.5 rounded-xl font-black text-base flex items-center justify-center transition shadow-sm ${txType === 'set' ? 'bg-blue-500 text-white' : 'bg-white/50 text-gray-600'}`}
            >
              <Edit2 className="w-5 h-5 ml-2" /> تعديل
            </button>
          </div>

          <div>
            <label className="block text-base font-black text-gray-700 mb-1.5 ml-1">الصنف</label>
            <select 
              value={selectedItem} 
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full p-3 rounded-xl border border-white/40 bg-white/60 focus:ring-2 focus:ring-indigo-500 outline-none text-base font-bold shadow-sm"
            >
              {state.inventory.map(item => (
                <option key={item.id} value={item.id}>{item.nameAr}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-base font-black text-gray-700 mb-1.5 ml-1">الكمية</label>
            <input 
              type="number" 
              min="0" 
              value={quantity} 
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              className="w-full p-3 rounded-xl border border-white/40 bg-white/60 focus:ring-2 focus:ring-indigo-500 outline-none text-base font-bold shadow-sm"
            />
          </div>

          <button 
            onClick={handleTransaction}
            className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30 active:scale-95"
          >
            تسجيل الحركة
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-black text-gray-800 mb-4">آخر الحركات</h3>
        <div className="space-y-3">
          {state.transactions.slice(0, 5).map(tx => {
            const item = state.inventory.find(i => i.id === tx.itemId);
            return (
              <div key={tx.id} className="flex justify-between items-center p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-md shadow-gray-900/5">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full shadow-sm ${
                    tx.type === 'in' ? 'bg-green-100 text-green-600' : 
                    tx.type === 'out' ? 'bg-red-100 text-red-600' : 
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {tx.type === 'in' ? <ArrowDownToLine className="w-5 h-5" /> : 
                     tx.type === 'out' ? <ArrowUpFromLine className="w-5 h-5" /> : 
                     <Edit2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-black text-gray-800 text-lg leading-tight">{item?.nameAr}</p>
                    <p className="text-xs text-gray-500 font-bold">{format(parseISO(tx.date), 'dd MMM yyyy - HH:mm', { locale: ar })}</p>
                    {tx.notes && <p className="text-[10px] text-gray-500 mt-1 font-medium">{tx.notes}</p>}
                  </div>
                </div>
                <div className={`text-xl font-black ${
                  tx.type === 'in' ? 'text-green-600' : 
                  tx.type === 'out' ? 'text-red-600' : 
                  'text-blue-600'
                }`}>
                  {tx.type === 'in' ? '+' : tx.type === 'out' ? '-' : '='}{parseFloat(tx.quantity.toFixed(1))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
        </>
      )}
    </div>
  );
};

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
        <div className="space-y-10">
          <section>
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-xl font-black text-gray-800 flex items-center">
                <Warehouse className="w-6 h-6 ml-2 text-indigo-600" />
                المخزون الحالي
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {state.inventory.map(item => (
                <div key={item.id} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 text-center shadow-sm">
                  <p className="text-sm text-gray-500 mb-1 font-bold">{item.nameAr}</p>
                  <p className="text-2xl font-black text-indigo-900 leading-none">{parseFloat(item.quantity.toFixed(1))} <span className="text-[10px] font-normal text-gray-400">{item.unit}</span></p>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-emerald-300 mx-2" />

          {/* Registration Section (styled title only) */}
          <section className="pt-6">
            <h3 className="text-xl font-black text-gray-800 mb-4 px-1">تسجيل حركة مخزن</h3>
            
            <div className="space-y-5">
              <div className="flex gap-2">
                <button 
                  onClick={() => setTxType('in')}
                  className={`flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center transition shadow-sm ${txType === 'in' ? 'bg-green-600 text-white shadow-green-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
                >
                  <ArrowDownToLine className="w-4 h-4 ml-2" /> وارد
                </button>
                <button 
                  onClick={() => setTxType('out')}
                  className={`flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center transition shadow-sm ${txType === 'out' ? 'bg-red-600 text-white shadow-red-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
                >
                  <ArrowUpFromLine className="w-4 h-4 ml-2" /> منصرف
                </button>
                <button 
                  onClick={() => setTxType('set')}
                  className={`flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center transition shadow-sm ${txType === 'set' ? 'bg-blue-600 text-white shadow-blue-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
                >
                  <Edit2 className="w-4 h-4 ml-2" /> تعديل
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 mr-2 font-bold">الصنف</label>
                  <select 
                    value={selectedItem} 
                    onChange={(e) => setSelectedItem(e.target.value)}
                    className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold shadow-sm"
                  >
                    {state.inventory.map(item => (
                      <option key={item.id} value={item.id}>{item.nameAr}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 mr-2 font-bold">الكمية</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold shadow-sm"
                  />
                </div>
              </div>

              <button 
                onClick={handleTransaction}
                className="w-full py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                تأكيد العملية
              </button>
            </div>
          </section>

          <div className="h-px bg-emerald-300 mx-2" />

          <section className="pt-6">
            <h3 className="text-xl font-black text-gray-800 mb-4 px-1">آخر الحركات</h3>
            <div className="space-y-3">
              {(() => {
                const grouped: any[] = [];
                const processedMeals = new Set();

                state.transactions.forEach(tx => {
                  if (tx.mealMetadata) {
                    const mealKey = `${tx.date.split('T')[0]}_${tx.mealMetadata.category}_${tx.mealMetadata.purpose}_${tx.mealMetadata.timeSlot}`;
                    if (!processedMeals.has(mealKey)) {
                      grouped.push({ rowType: 'meal', ...tx });
                      processedMeals.add(mealKey);
                    }
                  } else {
                    grouped.push({ rowType: 'single', ...tx });
                  }
                });

                return grouped.slice(0, 10).map(item => (
                  <TransactionRow key={item.id} item={item} inventory={state.inventory} />
                ));
              })()}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

const TransactionRow: React.FC<{ item: any; inventory: any[] }> = ({ item, inventory }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMeal = item.rowType === 'meal';

  if (!isMeal) {
    const invItem = inventory.find(i => i.id === item.itemId);
    return (
      <div className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            item.type === 'in' ? 'bg-green-50 text-green-600' : 
            item.type === 'out' ? 'bg-red-50 text-red-600' : 
            'bg-blue-50 text-blue-600'
          }`}>
            {item.type === 'in' ? <ArrowDownToLine className="w-5 h-5" /> : 
             item.type === 'out' ? <ArrowUpFromLine className="w-5 h-5" /> : 
             <Edit2 className="w-5 h-5" />}
          </div>
          <div>
            <p className="font-black text-gray-800 text-base leading-tight">{invItem?.nameAr}</p>
            <p className="text-[10px] text-gray-400 font-bold">{format(parseISO(item.date), 'dd MMM yyyy - HH:mm', { locale: ar })}</p>
          </div>
        </div>
        <div className={`text-lg font-black ${
          item.type === 'in' ? 'text-green-600' : 
          item.type === 'out' ? 'text-red-500' : 
          'text-blue-600'
        }`}>
          {item.type === 'in' ? '+' : item.type === 'out' ? '-' : '='}{parseFloat(item.quantity.toFixed(1))}
        </div>
      </div>
    );
  }

  const m = item.mealMetadata;
  const categoryAr = m.category === 'cattle' ? 'المواشي' : m.category === 'small' ? 'الأغنام' : 'الكل';
  const purposeAr = m.purpose === 'milking' ? 'حلاب' : m.purpose === 'fattening' ? 'تسمين' : '';
  const timeAr = m.timeSlot === 'morning' ? 'صباحاً' : 'مساءً';
  
  const title = `وجبة ${categoryAr} ${purposeAr} ${timeAr}`;

  return (
    <div className="overflow-hidden border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center p-3 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-3 text-right">
          <div className="p-2.5 rounded-xl bg-green-50 text-green-600">
            <Warehouse className="w-5 h-5" />
          </div>
          <div>
            <p className="font-black text-gray-800 text-base leading-tight">{title}</p>
            <p className="text-[10px] text-gray-400 font-bold">{format(parseISO(item.date), 'dd MMM yyyy - HH:mm', { locale: ar })}</p>
          </div>
        </div>
        <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          <ArrowDownToLine className="w-4 h-4 text-gray-400" />
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 space-y-1.5 animate-in slide-in-from-top duration-200">
          {m.breakdown.map((b: any, i: number) => (
            <div key={i} className="flex justify-between items-center text-xs font-bold text-gray-500 bg-gray-50/50 p-2 rounded-xl border border-gray-100">
              <span>{b.nameAr}</span>
              <span className="text-green-600">-{b.quantity.toFixed(1)} {b.unit}</span>
            </div>
          ))}
          <div className="pt-1 text-[9px] text-gray-400 font-medium italic">
            * تم خصم الكميات من المخزن تلقائياً
          </div>
        </div>
      )}
    </div>
  );
};

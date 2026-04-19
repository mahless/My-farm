import React from 'react';
import { useFarmContext } from '../context/FarmContext';
import { Brain, TrendingUp, Clock, AlertTriangle, CheckCircle, Info, Sprout, Wheat, Beef } from 'lucide-react';

export const SmartAssistant = () => {
  const { state, calculateDynamicFeed } = useFarmContext();

  // --- 1. Yield Predictions ---
  // Constants: Expected yield per Qirat (قيراط) in Kg
  const YIELD_PER_QIRAT = {
    alfalfa: 1250, // Total season (4-5 cuts)
    corn: 625,     // Corn Silage
    wheat: 125,    // Wheat Straw (تبن)
    beans: 65      // White Beans (dry seeds)
  };

  let expectedAlfalfa = 0;
  let expectedSilage = 0;
  let expectedStraw = 0;
  let expectedBeans = 0;

  state.plantedCrops.forEach(crop => {
    if (crop.cropType === 'alfalfa') expectedAlfalfa += crop.area * YIELD_PER_QIRAT.alfalfa;
    if (crop.cropType === 'corn') expectedSilage += crop.area * YIELD_PER_QIRAT.corn;
    if (crop.cropType === 'wheat') expectedStraw += crop.area * YIELD_PER_QIRAT.wheat;
    if (crop.cropType === 'beans') expectedBeans += crop.area * YIELD_PER_QIRAT.beans;
  });

  // --- 2. Daily Consumption ---
  let totalAnimals = 0;
  state.livestock.forEach(animal => totalAnimals += animal.count);
  
  // Use default dynamic feed (all active) for baseline predictions
  const { alfalfa: dailyAlfalfa, silage: dailySilage, concentrate: dailyConcentrate, straw: dailyStraw } = calculateDynamicFeed();

  // --- 3. Inventory Status ---
  const getInventory = (id: string) => state.inventory.find(i => i.id === id)?.quantity || 0;
  const alfalfaQty = getInventory('i1');
  const silageQty = getInventory('i2');
  const concentrateQty = getInventory('i3');
  const strawQty = getInventory('i4');

  const daysAlfalfa = dailyAlfalfa > 0 ? Math.floor(alfalfaQty / dailyAlfalfa) : 0;
  const daysSilage = dailySilage > 0 ? Math.floor(silageQty / dailySilage) : 0;
  const daysStraw = dailyStraw > 0 ? Math.floor(strawQty / dailyStraw) : 0;
  const daysConcentrate = dailyConcentrate > 0 ? Math.floor(concentrateQty / dailyConcentrate) : 0;

  // Determine main forage strategy based on inventory
  const isWinterStrategy = alfalfaQty > 0 || expectedAlfalfa > 0;

  const formatKg = (kg: number) => {
    if (kg >= 1000) return `${parseFloat((kg / 1000).toFixed(1))} طن`;
    return `${parseFloat(kg.toFixed(1))} كجم`;
  };

  const getStatusColor = (days: number) => {
    if (days === 0) return 'text-red-600 bg-red-100 border-red-200';
    if (days < 7) return 'text-amber-600 bg-amber-100 border-amber-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };

  return (
    <div className="space-y-10 pb-6 animate-in fade-in duration-500">
      {/* Yield Predictions */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-1">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="text-xl font-black text-gray-800">توقعات الإنتاج الربيعي</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 flex flex-col items-center text-center shadow-sm">
            <div className="bg-white p-2 rounded-xl border border-green-50 shadow-xs mb-3">
              <Sprout className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-[10px] text-gray-400 mb-1 font-bold">البرسيم الأخضر</span>
            <span className="text-lg font-black text-green-700">{formatKg(expectedAlfalfa)}</span>
            <span className="text-[9px] text-gray-400 mt-1 italic">طوال الموسم</span>
          </div>
          <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 flex flex-col items-center text-center shadow-sm">
            <div className="bg-white p-2 rounded-xl border border-amber-50 shadow-xs mb-3">
              <Wheat className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-[10px] text-gray-400 mb-1 font-bold">سيلاج الذرة</span>
            <span className="text-lg font-black text-amber-700">{formatKg(expectedSilage)}</span>
            <span className="text-[9px] text-gray-400 mt-1 italic">عند الحصاد</span>
          </div>
          <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 flex flex-col items-center text-center shadow-sm">
            <div className="bg-white p-2 rounded-xl border border-orange-50 shadow-xs mb-3">
              <Wheat className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-[10px] text-gray-400 mb-1 font-bold">تبن القمح</span>
            <span className="text-lg font-black text-orange-700">{formatKg(expectedStraw)}</span>
            <span className="text-[9px] text-gray-400 mt-1 italic">عند الحصاد</span>
          </div>
          <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 flex flex-col items-center text-center shadow-sm">
            <div className="bg-white p-2 rounded-xl border border-teal-50 shadow-xs mb-3">
              <Sprout className="w-5 h-5 text-teal-500" />
            </div>
            <span className="text-[10px] text-gray-400 mb-1 font-bold">بذور الفاصوليا</span>
            <span className="text-lg font-black text-teal-700">{formatKg(expectedBeans)}</span>
            <span className="text-[9px] text-gray-400 mt-1 italic">بذور جافة</span>
          </div>
        </div>
      </section>

      <div className="h-px bg-emerald-300 mx-2" />

      {/* Inventory Radar */}
      {totalAnimals > 0 && (
        <section className="pt-6">
          <div className="flex items-center gap-2 mb-4 px-1">
            <Clock className="w-5 h-5 text-purple-600" />
            <h3 className="text-xl font-black text-gray-800">مؤشر نفاذ المخزون</h3>
          </div>
          
          <div className="space-y-2">
            {[
              { name: isWinterStrategy ? 'البرسيم الأخضر' : 'سيلاج الذرة', days: isWinterStrategy ? daysAlfalfa : daysSilage, qty: isWinterStrategy ? alfalfaQty : silageQty },
              { name: 'التبن القمح', days: daysStraw, qty: strawQty },
              { name: 'العلف المركز', days: daysConcentrate, qty: concentrateQty }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-50/50 p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                  <p className="font-black text-gray-800 text-sm">{item.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold">المتاح فعلياً: {formatKg(item.qty)}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black ${getStatusColor(item.days)}`}>
                  {item.days > 0 ? `يكفي ${item.days} يوم` : 'نفذ الرصيد!'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="h-px bg-emerald-300 mx-2" />

      {/* Recommendations */}
      <section className="pt-6 px-1">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-teal-600" />
          <h3 className="text-xl font-black text-gray-800">توصيات وبدائل</h3>
        </div>
        <div className="space-y-3">
          {(!isWinterStrategy && silageQty === 0 && expectedSilage === 0) && (
            <div className="flex gap-3 bg-red-50/50 p-4 rounded-2xl border border-red-100/50">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-xs text-red-900 leading-relaxed font-bold">
                تحذير: لا يوجد رصيد أخضر أو ماليء. يجب توفير بديل (دريس أو قش) فوراً لتجنب مشاكل هضمية للقطيع.
              </p>
            </div>
          )}
          
          {(daysConcentrate < 7 && totalAnimals > 0) && (
            <div className="flex gap-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-900 leading-relaxed font-bold">
                تنبيه: العلف المركز يقترب من النفاذ. قم بطلب الكمية الجديدة لتفادي انخفاض إدرار اللبن.
              </p>
            </div>
          )}

          <div className="flex gap-3 bg-teal-50/50 p-4 rounded-2xl border border-teal-100/50">
            <CheckCircle className="w-5 h-5 text-teal-500 shrink-0" />
            <p className="text-xs text-teal-900 leading-relaxed font-bold">
              في حال نقص البرسيم، اعتمد على السيلاج مع تعويض البروتين بزيادة كسب الصويا في العلطة المركزة.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

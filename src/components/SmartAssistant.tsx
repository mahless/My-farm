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
    <div className="space-y-6 pb-6 animate-in fade-in duration-500">
      {/* Yield Predictions */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/40">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          توقعات الإنتاج من الزراعة الحالية
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-xl border border-green-100 shadow-md shadow-green-900/5 flex flex-col items-center text-center">
            <Sprout className="w-6 h-6 text-green-500 mb-2" />
            <span className="text-xs text-gray-500 mb-1">إجمالي البرسيم المتوقع</span>
            <span className="font-black text-green-700">{formatKg(expectedAlfalfa)}</span>
            <span className="text-[9px] text-gray-400 mt-1">طوال الموسم (4-5 حشات)</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-md shadow-amber-900/5 flex flex-col items-center text-center">
            <Wheat className="w-6 h-6 text-amber-500 mb-2" />
            <span className="text-xs text-gray-500 mb-1">سيلاج الذرة المتوقع</span>
            <span className="font-black text-amber-700">{formatKg(expectedSilage)}</span>
            <span className="text-[9px] text-gray-400 mt-1">عند الحصاد للسيلاج</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-orange-100 shadow-md shadow-orange-900/5 flex flex-col items-center text-center">
            <Wheat className="w-6 h-6 text-orange-500 mb-2" />
            <span className="text-xs text-gray-500 mb-1">تبن القمح المتوقع</span>
            <span className="font-black text-orange-700">{formatKg(expectedStraw)}</span>
            <span className="text-[9px] text-gray-400 mt-1">عند الحصاد</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-teal-100 shadow-md shadow-teal-900/5 flex flex-col items-center text-center">
            <Sprout className="w-6 h-6 text-teal-500 mb-2" />
            <span className="text-xs text-gray-500 mb-1">الفاصوليا المتوقعة</span>
            <span className="font-black text-teal-700">{formatKg(expectedBeans)}</span>
            <span className="text-[9px] text-gray-400 mt-1">بذور جافة</span>
          </div>
        </div>
      </div>

      {/* Inventory Radar */}
      {totalAnimals > 0 && (
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-xl shadow-indigo-900/5 border border-white/40">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-purple-600" />
            مؤشر نفاذ المخزون
          </h3>
          
          <div className="space-y-3">
            {[
              { name: isWinterStrategy ? 'البرسيم الأخضر' : 'سيلاج الذرة', days: isWinterStrategy ? daysAlfalfa : daysSilage, qty: isWinterStrategy ? alfalfaQty : silageQty },
              { name: 'التبن', days: daysStraw, qty: strawQty },
              { name: 'العلف المركز', days: daysConcentrate, qty: concentrateQty }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-md shadow-gray-900/5">
                <div>
                  <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">المتاح: {formatKg(item.qty)}</p>
                </div>
                <div className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusColor(item.days)}`}>
                  {item.days > 0 ? `يكفي ${item.days} يوم` : 'نفذ الرصيد'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-xl shadow-indigo-900/5 border border-white/40">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-teal-600" />
          توصيات وبدائل ذكية
        </h3>
        <div className="space-y-3">
          {(!isWinterStrategy && silageQty === 0 && expectedSilage === 0) && (
            <div className="flex gap-3 bg-red-50 p-3 rounded-xl border border-red-100">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-900 leading-relaxed">
                <strong>تحذير:</strong> لا يوجد سيلاج أو برسيم متاح. يجب شراء علف ماليء (دريس أو سيلاج) فوراً لتجنب مشاكل الهضم للقطيع.
              </p>
            </div>
          )}
          
          {(daysConcentrate < 7 && totalAnimals > 0) && (
            <div className="flex gap-3 bg-amber-50 p-3 rounded-xl border border-amber-100">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong>تنبيه:</strong> العلف المركز سينفذ خلال أقل من أسبوع. قم بطلب كمية جديدة للحفاظ على معدلات إنتاج اللبن واللحم.
              </p>
            </div>
          )}

          <div className="flex gap-3 bg-teal-50 p-3 rounded-xl border border-teal-100">
            <CheckCircle className="w-5 h-5 text-teal-500 shrink-0" />
            <p className="text-sm text-teal-900 leading-relaxed">
              <strong>بدائل غذائية:</strong> في حال نقص البرسيم الأخضر، يمكنك الاعتماد على سيلاج الذرة كبديل ممتاز للطاقة، مع تعويض نقص البروتين بزيادة نسبة كسب الصويا أو القطن في العلف المركز.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

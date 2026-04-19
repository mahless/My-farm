import React from 'react';
import { useFarmContext } from '../context/FarmContext';
import { Sprout, Beef, Home as HomeIcon, Calendar, ArrowRight } from 'lucide-react';
import { format, parseISO, isToday, isFuture } from 'date-fns';
import { ar } from 'date-fns/locale';

export const Home = ({ onNavigate }: { onNavigate: (tab: any) => void }) => {
  const { state } = useFarmContext();

  const activeCrops = state.plantedCrops;
  const totalLivestock = state.livestock.reduce((sum, l) => sum + l.count, 0);
  
  const pendingTasks = state.tasks.filter(t => t.status === 'pending');
  const todayTasksCount = pendingTasks.filter(t => isToday(parseISO(t.dueDate))).length;

  return (
    <div className="space-y-4 pb-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-3xl text-white shadow-xl shadow-green-900/20 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1">مرحباً بك في مزرعتك 👋</h2>
          <p className="text-green-50 opacity-90 text-sm">لديك {todayTasksCount} تنبيهات يومية هامة لليوم</p>
        </div>
        <HomeIcon className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
      </div>

      <div className="h-px bg-emerald-300 mx-2" />

      {/* Main Stats Grid */}
      <div className="space-y-8 mt-4">
        {/* Crops Summary */}
        <section>
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-green-600" />
              المحاصيل الحالية
            </h3>
            <span className="text-green-600 text-[10px] font-black">{activeCrops.length} محصول</span>
          </div>
          
          {activeCrops.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-2 italic font-bold">لا توجد محاصيل مزروعة حالياً</p>
          ) : (
            <div className="space-y-2">
              {activeCrops.map(crop => {
                const bp = state.cropBestPractices.find(b => b.cropType === crop.cropType);
                return (
                  <div key={crop.id} className="flex items-center justify-between py-3 border-b border-gray-100/50 last:border-0 px-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50/50 rounded-xl flex items-center justify-center text-xl shadow-inner border border-gray-100">
                        {crop.cropType === 'wheat' ? '🌾' : crop.cropType === 'corn' ? '🌽' : crop.cropType === 'potato' ? '🥔' : crop.cropType === 'beans' ? '🌱' : '🍀'}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800 leading-none mb-1">{bp?.nameAr || 'محصول'}</p>
                        <p className="text-[10px] text-gray-400 font-bold">منذ {format(parseISO(crop.sowingDate), 'dd MMM', { locale: ar })}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-base font-black text-green-600">{crop.area} ق</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <button 
            onClick={() => onNavigate('crops')}
            className="w-full mt-3 flex items-center justify-center gap-2 text-[11px] font-black text-green-600 p-2.5 bg-green-50/50 rounded-xl hover:bg-green-100 transition border border-green-100/50"
          >
            إدارة المحاصيل <ArrowRight className="w-3 h-3" />
          </button>
        </section>

        <div className="h-px bg-emerald-300 mx-2" />

        {/* Livestock Summary */}
        <section>
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Beef className="w-5 h-5 text-indigo-600" />
              قطيع المزرعة
            </h3>
            <span className="text-indigo-600 text-[10px] font-black">{totalLivestock} رأس</span>
          </div>

          <div className="space-y-5">
            {/* 1. Cattle (Machiya) - Buffalo & Cows */}
            {(state.livestock.some(l => l.type === 'buffalo' || l.type === 'cow')) && (
              <div className="space-y-3">
                <p className="text-[11px] font-black text-gray-400 border-r-2 border-indigo-200 pr-2 leading-none">الماشية</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Milking Cattle Column */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-blue-500 uppercase px-1">الحلاب</p>
                    <div className="space-y-2">
                      {state.livestock.filter(l => (l.type === 'buffalo' || l.type === 'cow') && l.purpose === 'milking').length > 0 ? (
                        state.livestock.filter(l => (l.type === 'buffalo' || l.type === 'cow') && l.purpose === 'milking').map(l => (
                          <div key={l.id} className="p-2.5 bg-blue-50/30 rounded-2xl border border-blue-100/30 text-center">
                            <div className="text-xl mb-0.5">{l.type === 'buffalo' ? '🐃' : '🐄'}</div>
                            <p className="text-[10px] font-black text-gray-600 truncate">{l.nameAr}</p>
                            <p className="text-lg font-black text-blue-800 leading-none">{l.count}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[9px] text-gray-400 text-center italic py-2">لا يوجد</p>
                      )}
                    </div>
                  </div>

                  {/* Fattening Cattle Column */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-orange-500 uppercase px-1">التسمين</p>
                    <div className="space-y-2">
                      {state.livestock.filter(l => (l.type === 'buffalo' || l.type === 'cow') && l.purpose === 'fattening').length > 0 ? (
                        state.livestock.filter(l => (l.type === 'buffalo' || l.type === 'cow') && l.purpose === 'fattening').map(l => (
                          <div key={l.id} className="p-2.5 bg-orange-50/30 rounded-2xl border border-orange-100/30 text-center">
                            <div className="text-xl mb-0.5">{l.type === 'buffalo' ? '🐃' : '🐄'}</div>
                            <p className="text-[10px] font-black text-gray-600 truncate">{l.nameAr}</p>
                            <p className="text-lg font-black text-orange-800 leading-none">{l.count}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[9px] text-gray-400 text-center italic py-2">لا يوجد</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Small Ruminants - Sheep & Goats */}
            {state.livestock.some(l => l.type === 'sheep' || l.type === 'goat') && (
              <div className="space-y-2">
                <p className="text-[11px] font-black text-gray-400 border-r-2 border-indigo-200 pr-2 leading-none">الأغنام والماعز</p>
                <div className="grid grid-cols-2 gap-2">
                  {state.livestock.filter(l => l.type === 'sheep' || l.type === 'goat').map(l => (
                    <div key={l.id} className="p-3 bg-indigo-50/30 rounded-2xl border border-indigo-100/30 text-center">
                      <div className="text-xl mb-0.5">{l.type === 'sheep' ? '🐑' : '🐐'}</div>
                      <p className="text-[10px] font-black text-gray-600 truncate">{l.nameAr}</p>
                      <p className="text-lg font-black text-indigo-800 leading-none mb-0.5">{l.count}</p>
                      <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-wide opacity-70">{l.purpose === 'milking' ? 'إنتاج' : 'تسمين'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => onNavigate('livestock')}
            className="w-full mt-4 flex items-center justify-center gap-2 text-[11px] font-black text-indigo-600 p-2.5 bg-indigo-50/50 rounded-xl hover:bg-indigo-100 transition border border-indigo-100/50"
          >
            إدارة الإنتاج الحيواني <ArrowRight className="w-3 h-3" />
          </button>
        </section>
      </div>

      <div className="h-px bg-emerald-300 mx-2 mt-4" />

      {/* Quick Action - Tasks Preview */}
      <section className="pt-4">
        <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 mb-3 px-1">
          <Calendar className="w-5 h-5 text-amber-600" />
          نظرة على المهام
        </h3>
        {pendingTasks.length > 0 ? (
          <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex-1">
              <p className="text-sm font-black text-gray-800 leading-tight mb-1">{pendingTasks[0].titleAr}</p>
              <p className="text-[10px] text-gray-400 font-bold">موعدها {format(parseISO(pendingTasks[0].dueDate), 'dd MMMM', { locale: ar })}</p>
            </div>
            <button 
              onClick={() => onNavigate('tasks')}
              className="px-4 py-2 bg-amber-500 text-white text-[11px] font-black rounded-xl shadow-lg shadow-amber-500/30 active:scale-95 transition-all"
            >
              عرض الكل
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm py-4 italic font-bold">لا توجد مهام حالية</p>
        )}
      </section>
    </div>
  );
};

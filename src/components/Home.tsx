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
    <div className="space-y-6 pb-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-3xl text-white shadow-xl shadow-green-900/20 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1">مرحباً بك في مزرعتك 👋</h2>
          <p className="text-green-50 opacity-90 text-sm">لديك {todayTasksCount} مهام متبقية لليوم</p>
        </div>
        <HomeIcon className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-4">
        {/* Crops Summary */}
        <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-lg shadow-green-900/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <Sprout className="w-6 h-6 text-green-600" />
              المحاصيل الحالية
            </h3>
            <span className="bg-green-100 text-green-700 text-xs font-black px-2.5 py-1 rounded-full">
              {activeCrops.length} محصول
            </span>
          </div>
          
          {activeCrops.length === 0 ? (
            <p className="text-center text-gray-500 text-base py-4 italic">لا توجد محاصيل مزروعة حالياً</p>
          ) : (
            <div className="space-y-3">
              {activeCrops.map(crop => {
                const bp = state.cropBestPractices.find(b => b.cropType === crop.cropType);
                return (
                  <div key={crop.id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl">
                        {crop.cropType === 'wheat' ? '🌾' : crop.cropType === 'corn' ? '🌽' : crop.cropType === 'potato' ? '🥔' : crop.cropType === 'beans' ? '🌱' : '🍀'}
                      </div>
                      <div>
                        <p className="text-base font-black text-gray-800">{bp?.nameAr || 'محصول'}</p>
                        <p className="text-xs text-gray-500 font-bold">منذ {format(parseISO(crop.sowingDate), 'dd MMM', { locale: ar })}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-black text-green-700">{crop.area} قيراط</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <button 
            onClick={() => onNavigate('crops')}
            className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-black text-green-700 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition"
          >
            إدارة المحاصيل <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Livestock Summary */}
        <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-lg shadow-indigo-900/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <Beef className="w-6 h-6 text-indigo-600" />
              قطيع المزرعة
            </h3>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-black px-2.5 py-1 rounded-full">
              {totalLivestock} رأس
            </span>
          </div>

          <div className="space-y-6">
            {/* 1. Cattle (Machiya) - Buffalo & Cows */}
            {(state.livestock.some(l => l.type === 'buffalo' || l.type === 'cow')) && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-1">
                  <span className="text-sm font-black text-gray-700 underline underline-offset-4 decoration-indigo-200">الماشية (جاموس وبقر)</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Milking Cattle Column */}
                  <div className="space-y-2">
                    <p className="text-xs font-black text-blue-600 mr-1 uppercase">قسم الحلاب</p>
                    <div className="space-y-2">
                      {state.livestock.filter(l => (l.type === 'buffalo' || l.type === 'cow') && l.purpose === 'milking').length > 0 ? (
                        state.livestock.filter(l => (l.type === 'buffalo' || l.type === 'cow') && l.purpose === 'milking').map(l => (
                          <div key={l.id} className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-center shadow-sm">
                            <div className="text-2xl mb-1">{l.type === 'buffalo' ? '🐃' : '🐄'}</div>
                            <p className="text-xs font-black text-gray-800 truncate">{l.nameAr}</p>
                            <p className="text-xl font-black text-blue-900">{l.count}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 text-center italic py-2">لا يوجد</p>
                      )}
                    </div>
                  </div>

                  {/* Fattening Cattle Column */}
                  <div className="space-y-2">
                    <p className="text-xs font-black text-orange-600 mr-1 uppercase">قسم التسمين</p>
                    <div className="space-y-2">
                      {state.livestock.filter(l => (l.type === 'buffalo' || l.type === 'cow') && l.purpose === 'fattening').length > 0 ? (
                        state.livestock.filter(l => (l.type === 'buffalo' || l.type === 'cow') && l.purpose === 'fattening').map(l => (
                          <div key={l.id} className="p-3 bg-orange-50/50 rounded-xl border border-orange-100 text-center shadow-sm">
                            <div className="text-2xl mb-1">{l.type === 'buffalo' ? '🐃' : '🐄'}</div>
                            <p className="text-xs font-black text-gray-800 truncate">{l.nameAr}</p>
                            <p className="text-xl font-black text-orange-900">{l.count}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 text-center italic py-2">لا يوجد</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Small Ruminants - Sheep & Goats */}
            {state.livestock.some(l => l.type === 'sheep' || l.type === 'goat') && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-1">
                  <span className="text-sm font-black text-gray-700 underline underline-offset-4 decoration-indigo-200">الأغنام والماعز</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {state.livestock.filter(l => l.type === 'sheep' || l.type === 'goat').map(l => (
                    <div key={l.id} className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-center shadow-sm">
                      <div className="text-2xl mb-1">{l.type === 'sheep' ? '🐑' : '🐐'}</div>
                      <p className="text-sm font-black text-gray-800 truncate">{l.nameAr}</p>
                      <p className="text-2xl font-black text-indigo-900 leading-none my-1">{l.count}</p>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide">({l.purpose === 'milking' ? 'إنتاج' : 'تسمين'})</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => onNavigate('livestock')}
            className="w-full mt-6 flex items-center justify-center gap-2 text-sm font-black text-indigo-700 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
          >
            إدارة الإنتاج الحيواني <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Action - Tasks Preview */}
      <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg">
        <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 mb-4">
          <Calendar className="w-6 h-6 text-amber-600" />
          نظرة على المهام
        </h3>
        {pendingTasks.length > 0 ? (
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-base font-black text-gray-800 leading-tight mb-1">{pendingTasks[0].titleAr}</p>
              <p className="text-sm text-gray-500 font-bold">موعدها {format(parseISO(pendingTasks[0].dueDate), 'dd MMMM', { locale: ar })}</p>
            </div>
            <button 
              onClick={() => onNavigate('tasks')}
              className="px-5 py-2.5 bg-amber-500 text-white text-sm font-black rounded-xl shadow-lg shadow-amber-500/30 active:scale-95"
            >
              عرض الكل
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-base italic">لا توجد مهام حالية</p>
        )}
      </div>
    </div>
  );
};

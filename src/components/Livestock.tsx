import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { Beef, Plus, Minus, CheckCircle2, Utensils, Trash2, Milk, Tag, Scale, Syringe } from 'lucide-react';
import { LivestockType, LivestockPurpose } from '../types';

export const Livestock = () => {
  const { 
    state, 
    calculateFeedPurchasesNeeded, 
    updateLivestockCount, 
    calculateDynamicFeed, 
    consumeDailyFeed,
    addLivestock,
    deleteLivestock,
    toggleFeedingLog,
    startVetProgram
  } = useFarmContext();
  
  const [forecastDays, setForecastDays] = useState(30);
  const [consumedToday, setConsumedToday] = useState(false);
  const [feedError, setFeedError] = useState(false);
  const [vetAdded, setVetAdded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [feedPurpose, setFeedPurpose] = useState<LivestockPurpose | 'all'>('all');
  const [feedCategory, setFeedCategory] = useState<'cattle' | 'small' | 'all'>('all');
  const [mealTimeSlot, setMealTimeSlot] = useState<'morning' | 'evening'>('morning');
  
  const [newAnimal, setNewAnimal] = useState<{
    type: LivestockType;
    purpose: LivestockPurpose;
    nameAr: string;
    count: number;
    weight: number;
  }>({
    type: 'buffalo',
    purpose: 'milking',
    nameAr: '',
    count: 1,
    weight: 500
  });

  const [activeFeeds, setActiveFeeds] = useState({
    alfalfa: true,
    silage: true,
    concentrate: true,
    straw: true
  });

  const deficit = calculateFeedPurchasesNeeded(forecastDays);
  const feedAmounts = calculateDynamicFeed(activeFeeds, feedPurpose, feedCategory);

  const today = new Date().toISOString().split('T')[0];
  const morningFed = state.feedingLogs?.some(l => l.date === today && l.timeSlot === 'morning' && l.animalCategory === feedCategory) || false;
  const eveningFed = state.feedingLogs?.some(l => l.date === today && l.timeSlot === 'evening' && l.animalCategory === feedCategory) || false;

  const handleConsume = () => {
    const success = consumeDailyFeed(feedAmounts, { category: feedCategory, purpose: feedPurpose, timeSlot: mealTimeSlot });
    
    if (success) {
      // Toggle log if not already marked
      const isAlreadyFed = mealTimeSlot === 'morning' ? morningFed : eveningFed;
      if (!isAlreadyFed && feedCategory !== 'all') {
        toggleFeedingLog(feedCategory as any, mealTimeSlot);
      }

      setConsumedToday(true);
      setTimeout(() => setConsumedToday(false), 3000);
      setFeedError(false);
    } else {
      setFeedError(true);
      setTimeout(() => setFeedError(false), 5000);
    }
  };

  const handleAddAnimal = () => {
    if (newAnimal.nameAr.trim()) {
      addLivestock(newAnimal.type, newAnimal.purpose, newAnimal.nameAr, newAnimal.count, newAnimal.weight);
      setShowAddForm(false);
      setNewAnimal({ type: 'buffalo', purpose: 'milking', nameAr: '', count: 1, weight: 500 });
    }
  };

  const milkingAnimals = state.livestock.filter(l => l.purpose === 'milking');
  const fatteningAnimals = state.livestock.filter(l => l.purpose === 'fattening');

  return (
    <div className="space-y-8">
      {/* Feed Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <h3 className="text-xl font-black text-gray-800 flex items-center shrink-0">
            <Utensils className="w-6 h-6 ml-2 text-green-600" />
            التغذية الذكية
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={feedCategory}
              onChange={(e) => setFeedCategory(e.target.value as any)}
              className="flex-1 sm:flex-none text-[10px] font-bold p-1.5 bg-gray-50 border border-green-200 rounded-lg text-green-800 outline-none"
            >
              <option value="all">الكل</option>
              <option value="cattle">المواشي</option>
              <option value="small">الأغنام</option>
            </select>
            <select 
              value={feedPurpose}
              onChange={(e) => setFeedPurpose(e.target.value as any)}
              className="flex-1 sm:flex-none text-[10px] font-bold p-1.5 bg-gray-50 border border-green-200 rounded-lg text-green-800 outline-none"
            >
              <option value="all">كامل الغرض</option>
              <option value="milking">حلاب</option>
              <option value="fattening">تسمين</option>
            </select>
          </div>
        </div>

        {/* Feeding Tracker - Morning/Evening */}
        {feedCategory !== 'all' && (
          <div className="space-y-1.5 mb-2 px-1">
            <label className="text-[10px] text-gray-500 mr-2 font-black">سجل الوجبة:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMealTimeSlot('morning')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl text-[10px] font-black transition-all ${
                  mealTimeSlot === 'morning' 
                    ? 'bg-amber-50 text-amber-800 border-2 border-amber-400 shadow-sm' 
                    : 'bg-gray-50 text-gray-400 border border-gray-100'
                }`}
              >
                {morningFed && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                وجبة الصباح
              </button>
              <button
                onClick={() => setMealTimeSlot('evening')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl text-[10px] font-black transition-all ${
                  mealTimeSlot === 'evening' 
                    ? 'bg-amber-50 text-amber-800 border-2 border-amber-400 shadow-sm' 
                    : 'bg-gray-50 text-gray-400 border border-gray-100'
                }`}
              >
                {eveningFed && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                وجبة المساء
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {/* Alfalfa */}
          <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveFeeds(prev => ({ ...prev, alfalfa: !prev.alfalfa }))}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${activeFeeds.alfalfa ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
              <span className={`font-black text-sm ${activeFeeds.alfalfa ? 'text-gray-800' : 'text-gray-400 line-through'}`}>برسيم أخضر</span>
            </div>
            <span className={`font-black text-base ${activeFeeds.alfalfa ? 'text-green-700' : 'text-gray-400'}`}>
              {feedAmounts.alfalfa.toFixed(1)} كجم
            </span>
          </div>

          {/* Silage */}
          <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveFeeds(prev => ({ ...prev, silage: !prev.silage }))}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${activeFeeds.silage ? 'bg-amber-500 justify-end' : 'bg-gray-300 justify-start'}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
              <span className={`font-black text-sm ${activeFeeds.silage ? 'text-gray-800' : 'text-gray-400 line-through'}`}>سيلاج ذرة</span>
            </div>
            <span className={`font-black text-base ${activeFeeds.silage ? 'text-amber-700' : 'text-gray-400'}`}>
              {feedAmounts.silage.toFixed(1)} كجم
            </span>
          </div>

          {/* Concentrate */}
          <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveFeeds(prev => ({ ...prev, concentrate: !prev.concentrate }))}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${activeFeeds.concentrate ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
              <span className={`font-black text-sm ${activeFeeds.concentrate ? 'text-gray-800' : 'text-gray-400 line-through'}`}>علف مركز</span>
            </div>
            <span className={`font-black text-base ${activeFeeds.concentrate ? 'text-blue-700' : 'text-gray-400'}`}>
              {feedAmounts.concentrate.toFixed(1)} كجم
            </span>
          </div>

          {/* Straw */}
          <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveFeeds(prev => ({ ...prev, straw: !prev.straw }))}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${activeFeeds.straw ? 'bg-orange-500 justify-end' : 'bg-gray-300 justify-start'}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
              <span className={`font-black text-sm ${activeFeeds.straw ? 'text-gray-800' : 'text-gray-400 line-through'}`}>تبن قمح</span>
            </div>
            <span className={`font-black text-base ${activeFeeds.straw ? 'text-orange-700' : 'text-gray-400'}`}>
              {feedAmounts.straw.toFixed(1)} كجم
            </span>
          </div>
        </div>

        <button
          onClick={handleConsume}
          disabled={consumedToday || Object.values(activeFeeds).every(v => !v)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl text-base font-black transition-all active:scale-95 shadow-sm ${
            consumedToday 
              ? 'bg-green-50 text-green-600 border border-green-100' 
              : Object.values(activeFeeds).every(v => !v)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-green-600 text-white shadow-lg shadow-green-600/20 hover:bg-green-700'
          }`}
        >
          {consumedToday ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              تم الحفظ وخصم الكميات
            </>
          ) : (
            'اعتماد وخصم كمية اليوم'
          )}
        </button>

        {feedError && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-black text-center animate-in fade-in slide-in-from-bottom-2">
            تم إيقاف الخصم! لا توجد كمية كافية في المخزن من بعض الأعلاف المحددة.
          </div>
        )}
      </section>
      
      <div className="h-px bg-emerald-300 mx-2" />

      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-black text-gray-800 flex items-center">
            <Beef className="w-6 h-6 ml-2 text-rose-600" />
            إدارة القطيع
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                startVetProgram('all');
                setVetAdded(true);
                setTimeout(() => setVetAdded(false), 3000);
              }}
              className="p-2.5 bg-indigo-50 text-indigo-600 rounded-full shadow-sm border border-indigo-100 active:scale-95 transition-all hover:bg-indigo-100"
              title="تفعيل برنامج التحصينات البيطرية"
            >
              <Syringe className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-2.5 bg-rose-500 text-white rounded-full shadow-lg active:scale-95 transition-all"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {vetAdded && (
          <div className="p-3 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-sm font-black text-center animate-in fade-in zoom-in-95">
            تم إضافة جدول التحصينات للقطيع في قسم المهام!
          </div>
        )}

        {showAddForm && (
          <div className="p-5 bg-gray-50/80 rounded-2xl border border-rose-100/50 space-y-5 animate-in slide-in-from-top duration-300">
            <h4 className="font-black text-gray-800 text-base">إضافة حيوانات جديدة</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 mr-2 font-bold">النوع</label>
                <select 
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold"
                  value={newAnimal.type}
                  onChange={e => setNewAnimal({...newAnimal, type: e.target.value as LivestockType})}
                >
                  <option value="buffalo">جاموس</option>
                  <option value="cow">بقر</option>
                  <option value="sheep">أغنام</option>
                  <option value="goat">ماعز</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 mr-2 font-bold">التصنيف</label>
                <select 
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold"
                  value={newAnimal.purpose}
                  onChange={e => setNewAnimal({...newAnimal, purpose: e.target.value as LivestockPurpose})}
                >
                  <option value="milking">حلاب</option>
                  <option value="fattening">تسمين</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 mr-2 font-bold">الاسم التعريفي</label>
              <input 
                type="text"
                placeholder="اسم للتعريف"
                className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold"
                value={newAnimal.nameAr}
                onChange={e => setNewAnimal({...newAnimal, nameAr: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 mr-2 font-bold">العدد</label>
                <input 
                  type="number"
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold"
                  value={newAnimal.count}
                  onChange={e => setNewAnimal({...newAnimal, count: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 mr-2 font-bold">الوزن (كجم)</label>
                <input 
                  type="number"
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold"
                  value={newAnimal.weight}
                  onChange={e => setNewAnimal({...newAnimal, weight: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <button 
              onClick={handleAddAnimal}
              className="w-full py-3.5 bg-rose-600 text-white rounded-xl font-black text-sm shadow-md hover:bg-rose-700 transition"
            >
              إضافة للقطيع
            </button>
          </div>
        )}
        
        <div className="space-y-8">
          {/* Milking Section */}
          {milkingAnimals.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1 border-r-4 border-blue-400 pr-2">
                <Milk className="w-5 h-5 text-blue-500" />
                <h4 className="text-sm font-black text-gray-700">قسم الحلاب</h4>
              </div>
              <div className="grid gap-4">
                {milkingAnimals.map(animal => (
                  <AnimalCard key={animal.id} animal={animal} updateLivestockCount={updateLivestockCount} deleteLivestock={deleteLivestock} />
                ))}
              </div>
            </div>
          )}

          {/* Fattening Section */}
          {fatteningAnimals.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1 border-r-4 border-orange-400 pr-2">
                <Scale className="w-5 h-5 text-orange-500" />
                <h4 className="text-sm font-black text-gray-700">قسم التسمين</h4>
              </div>
              <div className="grid gap-4">
                {fatteningAnimals.map(animal => (
                  <AnimalCard key={animal.id} animal={animal} updateLivestockCount={updateLivestockCount} deleteLivestock={deleteLivestock} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      <div className="h-px bg-emerald-300 mx-2" />
      
      <section className="pt-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <label className="block text-sm font-black text-gray-700">حساب العجز لفترة</label>
          <span className="font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-xl text-xs">{forecastDays} يوم</span>
        </div>
        <input 
          type="range" 
          min="7" 
          max="90" 
          value={forecastDays} 
          onChange={(e) => setForecastDays(parseInt(e.target.value))}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500 transition-all mb-4"
        />
        <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100 flex justify-between items-center shadow-sm">
          <span className="text-xs font-black text-gray-600">العجز المتوقع:</span>
          <span className="text-2xl font-black text-red-500">{parseFloat(deficit.toFixed(1))} <span className="text-sm font-normal">كجم</span></span>
        </div>
      </section>
    </div>
  );
};

interface AnimalCardProps {
  animal: any;
  updateLivestockCount: (id: string, count: number) => void;
  deleteLivestock: (id: string) => void;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal, updateLivestockCount, deleteLivestock }) => (
  <div className="flex flex-col p-3 bg-white/50 rounded-xl border border-white/30 shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <div className="flex gap-2">
        <div className={`p-2.5 rounded-lg ${animal.purpose === 'milking' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
          <Tag className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-black text-gray-800 text-base">{animal.nameAr}</h4>
          <p className="text-xs text-gray-600 font-bold">متوسط الوزن: {animal.averageWeightKg} كجم</p>
        </div>
      </div>
      <button 
        onClick={() => deleteLivestock(animal.id)}
        className="p-1 px-2 text-gray-300 hover:text-red-500 transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
    
    <div className="flex items-center justify-between border-t border-white/40 pt-3 mt-2">
      <div className="text-xs text-gray-500 font-black">
        الاستهلاك: {(animal.count * animal.averageWeightKg * animal.dailyDryMatterPercent).toFixed(1)} كجم/يوم
      </div>
      <div className="flex items-center gap-3 bg-white/60 rounded-xl p-1.5">
        <button 
          onClick={() => updateLivestockCount(animal.id, animal.count + 1)}
          className="p-1.5 bg-white rounded-lg shadow-sm text-green-600 hover:bg-green-50 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
        </button>
        <span className="font-black w-8 text-center text-gray-800 text-base">{animal.count}</span>
        <button 
          onClick={() => updateLivestockCount(animal.id, animal.count - 1)}
          className="p-1.5 bg-white rounded-lg shadow-sm text-red-600 hover:bg-red-50 transition active:scale-95"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

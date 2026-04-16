import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { Beef, Plus, Minus, CheckCircle2, Utensils, Trash2, Milk, Tag, Scale } from 'lucide-react';
import { LivestockType, LivestockPurpose } from '../types';

export const Livestock = () => {
  const { 
    state, 
    calculateFeedPurchasesNeeded, 
    updateLivestockCount, 
    calculateDynamicFeed, 
    consumeDailyFeed,
    addLivestock,
    deleteLivestock
  } = useFarmContext();
  
  const [forecastDays, setForecastDays] = useState(30);
  const [consumedToday, setConsumedToday] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [feedPurpose, setFeedPurpose] = useState<LivestockPurpose | 'all'>('all');
  
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
  const feedAmounts = calculateDynamicFeed(activeFeeds, feedPurpose);

  const handleConsume = () => {
    consumeDailyFeed(feedAmounts);
    setConsumedToday(true);
    setTimeout(() => setConsumedToday(false), 3000);
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
    <div className="space-y-6">
      {/* Feed Section - Keep existing logic */}
      <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl shadow-green-900/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-xl font-black text-gray-800 flex items-center shrink-0">
            <Utensils className="w-6 h-6 ml-2 text-green-600" />
            التغذية الذكية
          </h3>
          <select 
            value={feedPurpose}
            onChange={(e) => setFeedPurpose(e.target.value as any)}
            className="text-xs font-bold p-2 bg-white/60 border border-green-200 rounded-lg text-green-800 focus:ring-1 focus:ring-green-500 outline-none"
          >
            <option value="all">كامل القطيع</option>
            <option value="milking">قسم الحلاب فقط</option>
            <option value="fattening">قسم التسمين فقط</option>
          </select>
        </div>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed font-medium">
          قم بإلغاء تفعيل أي صنف غير متوفر اليوم، وسيقوم المساعد بإعادة حساب الكميات وتوزيعها على الأصناف المتاحة.
        </p>

        <div className="space-y-3 mb-5">
          {/* Alfalfa */}
          <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-white/40 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveFeeds(prev => ({ ...prev, alfalfa: !prev.alfalfa }))}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${activeFeeds.alfalfa ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
              <span className={`font-black text-base ${activeFeeds.alfalfa ? 'text-gray-800' : 'text-gray-400 line-through'}`}>برسيم أخضر</span>
            </div>
            <span className={`font-black text-lg ${activeFeeds.alfalfa ? 'text-green-700' : 'text-gray-400'}`}>
              {feedAmounts.alfalfa.toFixed(1)} كجم
            </span>
          </div>

          {/* Silage */}
          <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-white/40 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveFeeds(prev => ({ ...prev, silage: !prev.silage }))}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${activeFeeds.silage ? 'bg-amber-500 justify-end' : 'bg-gray-300 justify-start'}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
              <span className={`font-black text-base ${activeFeeds.silage ? 'text-gray-800' : 'text-gray-400 line-through'}`}>سيلاج ذرة</span>
            </div>
            <span className={`font-black text-lg ${activeFeeds.silage ? 'text-amber-700' : 'text-gray-400'}`}>
              {feedAmounts.silage.toFixed(1)} كجم
            </span>
          </div>

          {/* Concentrate */}
          <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-white/40 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveFeeds(prev => ({ ...prev, concentrate: !prev.concentrate }))}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${activeFeeds.concentrate ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
              <span className={`font-black text-base ${activeFeeds.concentrate ? 'text-gray-800' : 'text-gray-400 line-through'}`}>علف مركز</span>
            </div>
            <span className={`font-black text-lg ${activeFeeds.concentrate ? 'text-blue-700' : 'text-gray-400'}`}>
              {feedAmounts.concentrate.toFixed(1)} كجم
            </span>
          </div>

          {/* Straw */}
          <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-white/40 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveFeeds(prev => ({ ...prev, straw: !prev.straw }))}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${activeFeeds.straw ? 'bg-orange-500 justify-end' : 'bg-gray-300 justify-start'}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
              <span className={`font-black text-base ${activeFeeds.straw ? 'text-gray-800' : 'text-gray-400 line-through'}`}>تبن قمح</span>
            </div>
            <span className={`font-black text-lg ${activeFeeds.straw ? 'text-orange-700' : 'text-gray-400'}`}>
              {feedAmounts.straw.toFixed(1)} كجم
            </span>
          </div>
        </div>

        <button
          onClick={handleConsume}
          disabled={consumedToday || Object.values(activeFeeds).every(v => !v)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-base font-black transition-all active:scale-95 ${
            consumedToday 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : Object.values(activeFeeds).every(v => !v)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white shadow-md shadow-green-600/20 hover:bg-green-700'
          }`}
        >
          {consumedToday ? (
            <>
              <CheckCircle2 className="w-6 h-6" />
              تم الحفظ وخصم الكميات
            </>
          ) : (
            'اعتماد وخصم كمية اليوم'
          )}
        </button>
      </div>

      <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl shadow-blue-900/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black text-gray-800 flex items-center">
            <Beef className="w-6 h-6 ml-2 text-rose-600" />
            إدارة القطيع
          </h3>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2.5 bg-rose-500 text-white rounded-full shadow-lg active:scale-95 transition-all"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {showAddForm && (
          <div className="mb-6 p-5 bg-white/80 rounded-2xl border border-rose-100 space-y-5 animate-in slide-in-from-top duration-300">
            <h4 className="font-black text-gray-800 text-base">إضافة حيوانات جديدة</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 mr-2">النوع</label>
                <select 
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
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
                <label className="text-[10px] text-gray-500 mr-2">التصنيف</label>
                <select 
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  value={newAnimal.purpose}
                  onChange={e => setNewAnimal({...newAnimal, purpose: e.target.value as LivestockPurpose})}
                >
                  <option value="milking">حلاب (إنتاج لبن)</option>
                  <option value="fattening">تسمين (إنتاج لحم)</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 mr-2">الاسم (مثلاً: عجول تسمين 2024)</label>
              <input 
                type="text"
                placeholder="اسم للتعريف"
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                value={newAnimal.nameAr}
                onChange={e => setNewAnimal({...newAnimal, nameAr: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 mr-2">العدد</label>
                <input 
                  type="number"
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  value={newAnimal.count}
                  onChange={e => setNewAnimal({...newAnimal, count: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 mr-2">متوسط الوزن (كجم)</label>
                <input 
                  type="number"
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  value={newAnimal.weight}
                  onChange={e => setNewAnimal({...newAnimal, weight: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <button 
              onClick={handleAddAnimal}
              className="w-full py-2 bg-rose-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-rose-700 transition"
            >
              إضافة للقطيع
            </button>
          </div>
        )}
        
        <div className="space-y-6">
          {/* Milking Section */}
          {milkingAnimals.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Milk className="w-4 h-4 text-blue-500" />
                <h4 className="text-sm font-black text-gray-700">قسم الحلاب</h4>
              </div>
              {milkingAnimals.map(animal => (
                <AnimalCard key={animal.id} animal={animal} updateLivestockCount={updateLivestockCount} deleteLivestock={deleteLivestock} />
              ))}
            </div>
          )}

          {/* Fattening Section */}
          {fatteningAnimals.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Scale className="w-4 h-4 text-orange-500" />
                <h4 className="text-sm font-black text-gray-700">قسم التسمين</h4>
              </div>
              {fatteningAnimals.map(animal => (
                <AnimalCard key={animal.id} animal={animal} updateLivestockCount={updateLivestockCount} deleteLivestock={deleteLivestock} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-lg shadow-amber-900/5">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">حساب العجز لفترة (أيام)</label>
          <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg text-sm">{forecastDays} يوم</span>
        </div>
        <input 
          type="range" 
          min="7" 
          max="90" 
          value={forecastDays} 
          onChange={(e) => setForecastDays(parseInt(e.target.value))}
          className="w-full accent-amber-600 mb-4"
        />
        <div className="bg-white/60 rounded-xl p-3 border border-white/40 flex justify-between items-center">
          <span className="text-sm font-bold text-gray-700">العجز المتوقع:</span>
          <span className="text-xl font-black text-red-600">{parseFloat(deficit.toFixed(1))} <span className="text-sm font-normal">كجم</span></span>
        </div>
      </div>
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

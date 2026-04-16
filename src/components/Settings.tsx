import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { Settings as SettingsIcon, Save, Edit3, Info, Scale } from 'lucide-react';
import { CropType } from '../types';

export const Settings = () => {
  const { state, updateCropMilestone, updateLivestockParams } = useFarmContext();
  const [selectedCrop, setSelectedCrop] = useState<CropType>('wheat');
  const [targetQuantity, setTargetQuantity] = useState<number>(1000);
  const [showFormulaInfo, setShowFormulaInfo] = useState<boolean>(false);

  const activeCropBP = state.cropBestPractices.find(bp => bp.cropType === selectedCrop);

  const calcAmount = (basePerTon: number) => {
    const amount = (basePerTon / 1000) * targetQuantity;
    return parseFloat(amount.toFixed(1));
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50/80 backdrop-blur-md p-4 rounded-xl border border-blue-100 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800 leading-relaxed">
          البيانات الافتراضية هنا مخصصة <strong>للتربة الطينية السمراء في الدلتا (جيدة الصرف)</strong> بناءً على أحدث توصيات مركز البحوث الزراعية. 
          تتميز هذه التربة باحتفاظها بالرطوبة، مما يباعد بين فترات الري. يمكنك تعديل الأرقام لتناسب أرضك.
        </p>
      </div>

      {/* Crop Settings */}
      <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl shadow-green-900/5">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Edit3 className="w-5 h-5 ml-2 text-green-600" />
          تعديل مواعيد الزراعة والممارسات
        </h3>
        
        <div className="mb-4">
          <select 
            value={selectedCrop} 
            onChange={(e) => setSelectedCrop(e.target.value as CropType)}
            className="w-full p-2 rounded-lg border border-white/30 bg-white/50 focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-700"
          >
            {state.cropBestPractices.map(bp => (
              <option key={bp.cropType} value={bp.cropType}>{bp.nameAr}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {activeCropBP?.milestones.map(ms => (
            <div key={ms.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-white/30 shadow-md shadow-gray-900/5">
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-800">{ms.titleAr}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">بعد</span>
                <input 
                  type="number" 
                  value={ms.daysAfterSowing}
                  onChange={(e) => updateCropMilestone(selectedCrop, ms.id, parseInt(e.target.value) || 0)}
                  className="w-16 p-1 text-center rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-green-500 outline-none"
                />
                <span className="text-xs text-gray-500">يوم</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Livestock Settings */}
      <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl shadow-rose-900/5">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Edit3 className="w-5 h-5 ml-2 text-rose-600" />
          تعديل معايير الماشية
        </h3>
        
        <div className="space-y-4">
          {state.livestock.map(animal => (
            <div key={animal.id} className="p-4 bg-white/50 rounded-xl border border-white/30 space-y-3 shadow-md shadow-gray-900/5">
              <h4 className="font-bold text-gray-800 border-b border-gray-200 pb-2">{animal.nameAr}</h4>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">متوسط الوزن (كجم)</label>
                <input 
                  type="number" 
                  value={animal.averageWeightKg}
                  onChange={(e) => updateLivestockParams(animal.id, parseInt(e.target.value) || 0, animal.dailyDryMatterPercent)}
                  className="w-20 p-1 text-center rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">نسبة المادة الجافة يومياً (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={parseFloat((animal.dailyDryMatterPercent * 100).toFixed(1))}
                  onChange={(e) => updateLivestockParams(animal.id, animal.averageWeightKg, (parseFloat(e.target.value) || 0) / 100)}
                  className="w-20 p-1 text-center rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feed Formula Settings */}
      <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl shadow-amber-900/5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Scale className="w-5 h-5 ml-2 text-amber-600" />
            تركيبة العلف الصحيحة
          </h3>
          <button 
            onClick={() => setShowFormulaInfo(!showFormulaInfo)} 
            className={`p-1.5 rounded-lg transition-colors ${showFormulaInfo ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          تركيبة اقتصادية وعالية الفائدة تعتمد على كيزان الذرة الكاملة (بالغلاف والقلاحة) والردة، مع إضافات ضرورية لرفع نسبة البروتين وتحسين الهضم.
        </p>

        {showFormulaInfo && (
          <div className="mb-4 p-4 bg-amber-50/80 backdrop-blur-sm rounded-xl border border-amber-200 text-sm text-gray-700 space-y-3 animate-in fade-in slide-in-from-top-2">
            <h4 className="font-bold text-amber-800">فوائد مكونات التركيبة:</h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs">
              <li><strong>كيزان الذرة الكاملة:</strong> مصدر ممتاز ورخيص للطاقة، والقلاحة والغلاف يوفران أليافاً تمنع مشاكل الهضم (اللكْمة).</li>
              <li><strong>الردة الخشنة:</strong> مصدر جيد للفوسفور والألياف، وتساعد في هضم الذرة.</li>
              <li><strong>كسب فول الصويا (44%):</strong> السر في التركيبة! الذرة والردة فقيرتان في البروتين، وكسب الصويا يرفع نسبة البروتين لتناسب التسمين أو الحلاب.</li>
              <li><strong>المولاس:</strong> يعطي طاقة سريعة، يفتح شهية الحيوان (طعمه حلو)، ويمنع تطاير غبار العلف.</li>
            </ul>
            <h4 className="font-bold text-amber-800 mt-3">فوائد الإضافات:</h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs">
              <li><strong>بيكربونات الصوديوم:</strong> لمعادلة حموضة الكرش ومنع اللكمة (مهم جداً مع الذرة).</li>
              <li><strong>الحجر الجيري:</strong> لتعويض نقص الكالسيوم في الذرة والردة.</li>
              <li><strong>ملح الطعام:</strong> للأملاح وفتح الشهية.</li>
              <li><strong>الأملاح والفيتامينات:</strong> لتعويض أي نقص في العناصر الصغرى.</li>
              <li><strong>مضاد السموم الفطرية:</strong> لحماية الحيوان من أي عفن قد يكون موجوداً في كيزان الذرة.</li>
            </ul>
          </div>
        )}

        <div className="mb-4 flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/40 shadow-sm">
          <label className="text-sm font-bold text-gray-700 whitespace-nowrap">الكمية المطلوبة (كجم):</label>
          <input
            type="number"
            min="1"
            value={targetQuantity}
            onChange={(e) => setTargetQuantity(parseFloat(e.target.value) || 0)}
            className="w-full p-2 text-center rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-amber-500 outline-none font-black text-amber-700 text-lg"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl border border-white/40 shadow-sm">
            <span className="font-bold text-sm text-gray-800">كيزان ذرة كاملة مفرومة</span>
            <span className="font-black text-amber-700">{calcAmount(550)} كجم</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl border border-white/40 shadow-sm">
            <span className="font-bold text-sm text-gray-800">ردة خشنة</span>
            <span className="font-black text-amber-700">{calcAmount(200)} كجم</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl border border-white/40 shadow-sm">
            <div className="flex flex-col">
              <span className="font-bold text-sm text-gray-800">كسب فول صويا (44%)</span>
              <span className="text-[10px] text-gray-500">مصدر البروتين الأساسي</span>
            </div>
            <span className="font-black text-amber-700">{calcAmount(150)} كجم</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl border border-white/40 shadow-sm">
            <div className="flex flex-col">
              <span className="font-bold text-sm text-gray-800">مولاس</span>
              <span className="text-[10px] text-gray-500">للطاقة وربط الغبار</span>
            </div>
            <span className="font-black text-amber-700">{calcAmount(50)} كجم</span>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200/50">
            <h4 className="text-sm font-bold text-gray-700 mb-2">إضافات هامة جداً:</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/50 p-2 rounded-lg text-center border border-white/30">
                <span className="block text-xs text-gray-600 mb-1">بيكربونات صوديوم</span>
                <span className="font-bold text-sm text-gray-800">{calcAmount(15)} كجم</span>
              </div>
              <div className="bg-white/50 p-2 rounded-lg text-center border border-white/30">
                <span className="block text-xs text-gray-600 mb-1">حجر جيري (بودرة بلاط)</span>
                <span className="font-bold text-sm text-gray-800">{calcAmount(15)} كجم</span>
              </div>
              <div className="bg-white/50 p-2 rounded-lg text-center border border-white/30">
                <span className="block text-xs text-gray-600 mb-1">ملح طعام</span>
                <span className="font-bold text-sm text-gray-800">{calcAmount(10)} كجم</span>
              </div>
              <div className="bg-white/50 p-2 rounded-lg text-center border border-white/30">
                <span className="block text-xs text-gray-600 mb-1">أملاح وفيتامينات</span>
                <span className="font-bold text-sm text-gray-800">{calcAmount(5)} كجم</span>
              </div>
              <div className="bg-white/50 p-2 rounded-lg text-center border border-white/30 col-span-2">
                <span className="block text-xs text-gray-600 mb-1">مضاد سموم فطرية</span>
                <span className="font-bold text-sm text-gray-800">{calcAmount(5)} كجم</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

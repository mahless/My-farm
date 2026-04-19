import React, { useState, useEffect, useRef } from 'react';
import { Settings } from './Settings';
import { Backup } from './Backup';
import { cropDiseases } from '../data/cropDiseases';
import { X, ShieldAlert, Bug, Droplets, Leaf, Timer, Info, ChevronDown, ChevronUp, Calendar, Tractor, Sprout, Droplet, FlaskConical, Scissors, Database } from 'lucide-react';

interface FarmerProfileProps {
  onClose: () => void;
}

type Tab = 'settings' | 'instructions' | 'backup';

export const FarmerProfile: React.FC<FarmerProfileProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('instructions');
  const [selectedCrop, setSelectedCrop] = useState<string>('wheat');
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top when internal tab changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [activeTab]);

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[100] flex justify-end">
      <div className="w-full max-w-md bg-gradient-to-br from-green-50 to-emerald-100 h-[100dvh] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-white/40 p-4 pt-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center text-4xl shadow-lg shadow-green-900/10">
              <span className="drop-shadow-md">👨‍🌾</span>
            </div>
            <div>
              <h2 className="font-black text-gray-800 text-xl">ملف المزارع</h2>
              <p className="text-sm text-gray-500 font-bold">الإعدادات والإرشادات الزراعية</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white rounded-full text-gray-500 hover:text-gray-800 shadow-sm transition-colors active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-4 gap-2 bg-white/40 border-b border-white/40 shrink-0 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('instructions')}
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-black text-sm transition-all active:scale-95 ${
              activeTab === 'instructions' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-white/60 text-gray-600 hover:bg-white'
            }`}
          >
            إرشادات
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl font-black text-sm transition-all active:scale-95 ${
              activeTab === 'settings' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-white/60 text-gray-600 hover:bg-white'
            }`}
          >
            الإعدادات
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-black text-sm transition-all active:scale-95 ${
              activeTab === 'backup' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white/60 text-gray-600 hover:bg-white'
            }`}
          >
            نسخ احتياطي
          </button>
        </div>

        {/* Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 pb-safe hide-scrollbar">
          {activeTab === 'settings' ? (
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-xl shadow-green-900/5 border border-white/40">
              <Settings />
            </div>
          ) : activeTab === 'backup' ? (
            <Backup />
          ) : (
            <div className="space-y-6">
              {/* Crop Selector */}
              <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar">
                {Object.entries(cropDiseases).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedCrop(key);
                      setShowAdditionalDetails(false);
                    }}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-base font-black transition-all active:scale-95 ${
                      selectedCrop === key
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {data.nameAr}
                  </button>
                ))}
              </div>

              <div className="h-px bg-emerald-300 mx-2" />

              {/* Diseases List */}
              <div className="space-y-5">
                <h3 className="font-black text-gray-800 flex items-center gap-2 text-lg">
                  <ShieldAlert className="w-6 h-6 text-amber-500" />
                  أشهر الأمراض والآفات ({cropDiseases[selectedCrop].nameAr})
                </h3>
                
                {cropDiseases[selectedCrop].diseases.map((disease) => (
                  <div key={disease.id} className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-900/5 border border-gray-100">
                    <h4 className="font-black text-red-700 flex items-center gap-2 mb-4 text-xl">
                      <Bug className="w-6 h-6" />
                      {disease.nameAr}
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-base">
                        <p className="font-black text-amber-800 mb-1 flex items-center gap-1">
                          <Leaf className="w-5 h-5" />
                          الأعراض:
                        </p>
                        <p className="text-amber-900 leading-relaxed font-bold">{disease.symptoms}</p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-base">
                        <p className="font-black text-blue-800 mb-1 flex items-center gap-1">
                          <ShieldAlert className="w-5 h-5" />
                          طريقة المكافحة:
                        </p>
                        <p className="text-blue-900 leading-relaxed font-bold">{disease.treatment}</p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-base">
                        <p className="font-black text-purple-800 mb-1 flex items-center gap-1">
                          <Droplets className="w-5 h-5" />
                          أفضل المبيدات المرشحة:
                        </p>
                        <p className="text-purple-900 leading-relaxed font-black">{disease.pesticides}</p>
                      </div>

                      {disease.phi && (
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                          <p className="font-black text-red-800 mb-1 flex items-center gap-1 text-base">
                            <Timer className="w-5 h-5" />
                            فترة الأمان (PHI):
                          </p>
                          <p className="text-red-900 leading-relaxed text-sm font-black">
                            {disease.phi}
                            <span className="block mt-1 text-[11px] opacity-75 font-bold">
                              * هي الفترة التي يجب أن تمر بين رش المبيد وحصاد المحصول تجنباً للتسمم.
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="h-px bg-emerald-300 mx-2" />

                {/* Additional Details Section */}
                {cropDiseases[selectedCrop].additionalDetails && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
                      className="w-full flex items-center justify-between bg-emerald-600 text-white p-5 rounded-2xl shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
                    >
                      <span className="font-black text-base flex items-center gap-2">
                        <Info className="w-6 h-6" />
                        تفاصيل إضافية عن المحصول
                      </span>
                      {showAdditionalDetails ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                    </button>

                    {showAdditionalDetails && (
                      <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
                          <h4 className="font-black text-emerald-800 flex items-center gap-2 mb-2 text-base">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                            ميعاد الزراعة المناسب
                          </h4>
                          <p className="text-base text-gray-700 leading-relaxed font-bold">{cropDiseases[selectedCrop].additionalDetails.plantingTime}</p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
                          <h4 className="font-black text-amber-800 flex items-center gap-2 mb-2 text-base">
                            <Tractor className="w-5 h-5 text-amber-600" />
                            تجهيز التربة
                          </h4>
                          <p className="text-base text-gray-700 leading-relaxed font-bold">{cropDiseases[selectedCrop].additionalDetails.soilPrep}</p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
                          <h4 className="font-black text-green-800 flex items-center gap-2 mb-2 text-base">
                            <Sprout className="w-5 h-5 text-green-600" />
                            طريقة الزراعة والتقاوي
                          </h4>
                          <p className="text-base text-gray-700 leading-relaxed font-bold">{cropDiseases[selectedCrop].additionalDetails.plantingMethod}</p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
                          <h4 className="font-black text-blue-800 flex items-center gap-2 mb-2 text-base">
                            <Droplet className="w-5 h-5 text-blue-600" />
                            نظام الري (غمر - أراضي طينية)
                          </h4>
                          <p className="text-base text-gray-700 leading-relaxed font-bold">{cropDiseases[selectedCrop].additionalDetails.irrigation}</p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
                          <h4 className="font-black text-purple-800 flex items-center gap-2 mb-2 text-base">
                            <FlaskConical className="w-5 h-5 text-purple-600" />
                            التسميد والبرنامج الغذائي
                          </h4>
                          <p className="text-base text-gray-700 leading-relaxed font-bold">{cropDiseases[selectedCrop].additionalDetails.fertilization}</p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
                          <h4 className="font-black text-orange-800 flex items-center gap-2 mb-2 text-base">
                            <Scissors className="w-5 h-5 text-orange-600" />
                            الحصاد
                          </h4>
                          <p className="text-base text-gray-700 leading-relaxed font-bold">{cropDiseases[selectedCrop].additionalDetails.harvest}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

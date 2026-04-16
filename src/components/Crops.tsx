import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { CropType } from '../types';
import { Sprout, Plus, X, CheckCircle, Circle, Clock, Trash2, FlaskConical, Tractor } from 'lucide-react';
import { HarvestModal } from './HarvestModal';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

export const Crops = () => {
  const { state, plantCrop, deletePlantedCrop } = useFarmContext();
  const [selectedCrop, setSelectedCrop] = useState<CropType>('wheat');
  const [area, setArea] = useState<number>(1);
  const [detailsCropId, setDetailsCropId] = useState<string | null>(null);
  const [harvestingCropId, setHarvestingCropId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePlant = () => {
    plantCrop(selectedCrop, area);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setArea(1); // Reset area after planting
  };

  const detailsCrop = state.plantedCrops.find(c => c.id === detailsCropId);
  const detailsCropBP = detailsCrop ? state.cropBestPractices.find(b => b.cropType === detailsCrop.cropType) : null;
  const cropTasks = detailsCrop 
    ? state.tasks.filter(t => t.plantedCropId === detailsCrop.id).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    : [];

  return (
    <div className="space-y-6">
      <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl shadow-green-900/5">
        <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center">
          <Sprout className="w-6 h-6 ml-2 text-green-600" />
          زراعة محصول جديد
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-base font-black text-gray-700 mb-1.5 ml-1">نوع المحصول</label>
            <select 
              value={selectedCrop} 
              onChange={(e) => setSelectedCrop(e.target.value as CropType)}
              className="w-full p-3 rounded-xl border border-white/40 bg-white/60 focus:ring-2 focus:ring-green-500 outline-none text-base font-bold"
            >
              {state.cropBestPractices.map(bp => (
                <option key={bp.cropType} value={bp.cropType}>{bp.nameAr}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-base font-black text-gray-700 mb-1.5 ml-1">المساحة (بالقيراط)</label>
            <input 
              type="number" 
              min="1" 
              step="1"
              value={area} 
              onChange={(e) => setArea(parseInt(e.target.value) || 0)}
              className="w-full p-3 rounded-xl border border-white/40 bg-white/60 focus:ring-2 focus:ring-green-500 outline-none text-base font-bold"
            />
          </div>

          <button 
            onClick={handlePlant}
            className="w-full py-3.5 bg-green-600 text-white rounded-2xl font-black text-lg hover:bg-green-700 transition flex items-center justify-center shadow-lg shadow-green-600/30 active:scale-95"
          >
            <Plus className="w-6 h-6 ml-2" />
            تأكيد الزراعة
          </button>

          {showSuccess && (
            <div className="p-3 bg-green-100 text-green-800 rounded-xl text-base font-black flex items-center justify-center transition-all duration-300">
              <CheckCircle className="w-6 h-6 ml-2" />
              تمت الزراعة بنجاح!
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-black text-gray-800 mb-4">المحاصيل الحالية</h3>
        <div className="grid gap-4">
          {state.plantedCrops.map(crop => {
            const bp = state.cropBestPractices.find(b => b.cropType === crop.cropType);
            return (
              <div 
                key={crop.id} 
                onClick={() => {
                  setDetailsCropId(crop.id);
                  setConfirmDelete(false);
                }}
                className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-lg shadow-green-900/5 flex justify-between items-center cursor-pointer hover:bg-white/60 transition active:scale-95"
              >
                <div>
                  <h4 className="font-black text-gray-800 text-xl leading-none mb-1">{bp?.nameAr}</h4>
                  <p className="text-base text-gray-600 font-bold">المساحة: {crop.area} قيراط</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-tight">تاريخ الزراعة</p>
                  <p className="text-base font-black text-gray-800 leading-none">
                    {format(parseISO(crop.sowingDate), 'dd MMM yyyy', { locale: ar })}
                  </p>
                </div>
              </div>
            );
          })}
          {state.plantedCrops.length === 0 && (
            <p className="text-gray-500 text-center py-6 text-lg italic">لا توجد محاصيل مزروعة حالياً.</p>
          )}
        </div>
      </div>

      {/* Crop Details Modal */}
      {detailsCropId && detailsCrop && detailsCropBP && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-green-50/50">
              <div>
                <h3 className="text-xl font-black text-green-900">{detailsCropBP.nameAr}</h3>
                <p className="text-sm text-green-700">
                  تاريخ الزراعة: {format(parseISO(detailsCrop.sowingDate), 'dd MMMM yyyy', { locale: ar })}
                </p>
              </div>
              <button 
                onClick={() => setDetailsCropId(null)}
                className="p-2 bg-white rounded-full text-gray-500 hover:text-gray-800 shadow-md active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1 space-y-6">
              {/* Quick Harvest Action */}
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-orange-900">هل حان وقت الحصاد؟</h4>
                    <p className="text-xs text-orange-700">يمكنك إنهاء دورة المحصول وإضافته للمخزن الآن.</p>
                  </div>
                  <button 
                    onClick={() => setHarvestingCropId(detailsCropId)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-md hover:bg-orange-600 transition active:scale-95 flex items-center gap-2"
                  >
                    <Tractor className="w-4 h-4" />
                    حصاد الآن
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 mb-2">الجدول الزمني للمحصول</h4>
                <div className="relative border-r-2 border-green-200 pr-4 space-y-6 mr-2">
                {cropTasks.map((task, index) => {
                  const isCompleted = task.status === 'completed';
                  const isPostponed = task.postponedDays && task.postponedDays > 0;
                  
                  let fertInfo = task.fertilizerInfo;
                  if (!fertInfo && detailsCropBP) {
                    const milestone = detailsCropBP.milestones.find(m => m.title === task.title);
                    if (milestone?.fertilizerInfo) {
                      fertInfo = {
                        type: milestone.fertilizerInfo.type,
                        amountKg: parseFloat(((milestone.fertilizerInfo.amountPerFeddanKg / 24) * detailsCrop.area).toFixed(1))
                      };
                    }
                  }
                  
                  return (
                    <div key={task.id} className="relative">
                      {/* Timeline Dot */}
                      <div className={`absolute -right-[25px] top-1 w-5 h-5 rounded-full flex items-center justify-center bg-white border-2 ${isCompleted ? 'border-green-500 text-green-500' : 'border-gray-300 text-gray-300'}`}>
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-3 h-3 fill-current" />}
                      </div>
                      
                      <div className={`p-3 rounded-xl border ${isCompleted ? 'bg-green-50/50 border-green-100' : 'bg-white border-gray-100 shadow-md shadow-gray-900/5'}`}>
                        <h5 className={`font-bold text-sm ${isCompleted ? 'text-green-800 line-through opacity-70' : 'text-gray-800'}`}>
                          {task.titleAr}
                        </h5>
                        
                        {fertInfo && (
                          <div className={`mt-2 p-2 rounded-lg text-xs ${isCompleted ? 'bg-green-100/50 text-green-700' : 'bg-purple-50 border border-purple-100'}`}>
                            <div className="flex items-center gap-1 mb-1">
                              <FlaskConical className={`w-3 h-3 ${isCompleted ? 'text-green-600' : 'text-purple-600'}`} />
                              <span className={`font-bold ${isCompleted ? 'text-green-800' : 'text-purple-800'}`}>توصية التسميد</span>
                            </div>
                            <p className={isCompleted ? 'text-green-700' : 'text-purple-700'}>النوع: {fertInfo.type}</p>
                            <p className={isCompleted ? 'text-green-700' : 'text-purple-700'}>الكمية: {fertInfo.amountKg} كجم</p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          <p className={`text-xs ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                            {format(parseISO(task.dueDate), 'dd MMM yyyy', { locale: ar })}
                          </p>
                          {isPostponed && !isCompleted && (
                            <span className="flex items-center text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md">
                              <Clock className="w-3 h-3 ml-1" />
                              مؤجلة
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

            {/* Delete Footer */}
            <div className="p-4 border-t border-gray-200 bg-white/50">
              {!confirmDelete ? (
                <button 
                  onClick={() => setConfirmDelete(true)}
                  className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition flex items-center justify-center"
                >
                  <Trash2 className="w-5 h-5 ml-2" />
                  حذف المحصول
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      deletePlantedCrop(detailsCrop.id);
                      setDetailsCropId(null);
                      setConfirmDelete(false);
                    }}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
                  >
                    نعم، احذف المحصول
                  </button>
                  <button 
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition"
                  >
                    تراجع
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {harvestingCropId && (
        <HarvestModal 
          cropId={harvestingCropId} 
          onClose={() => {
            setHarvestingCropId(null);
            setDetailsCropId(null);
          }} 
        />
      )}
    </div>
  );
};

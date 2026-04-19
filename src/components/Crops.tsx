import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { CropType } from '../types';
import { Sprout, Plus, CheckCircle, Circle, Clock, Trash2, Tractor } from 'lucide-react';
import { HarvestModal } from './HarvestModal';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';

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

  return (
    <div className="space-y-6">
      <section className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl shadow-green-900/5">
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
      </section>
      
      <div className="h-px bg-emerald-300 mx-2" />

      <section>
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-xl font-black text-gray-800">المحاصيل الحالية</h3>
          <span className="bg-green-100 text-green-700 text-xs font-black px-2 py-1 rounded-full">{state.plantedCrops.length}</span>
        </div>
        <div className="grid gap-4">
          {state.plantedCrops.map(crop => {
            const isExpanded = detailsCropId === crop.id;
            const bp = state.cropBestPractices.find(b => b.cropType === crop.cropType);
            const cropTasks = state.tasks
              .filter(t => t.plantedCropId === crop.id)
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

            return (
              <div 
                key={crop.id} 
                className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg shadow-green-900/5 overflow-hidden transition-all duration-300"
              >
                <div 
                  onClick={() => {
                    setDetailsCropId(isExpanded ? null : crop.id);
                    setConfirmDelete(false);
                  }}
                  className={`p-5 flex justify-between items-center cursor-pointer hover:bg-white/60 transition active:scale-[0.99] ${isExpanded ? 'bg-white/60' : ''}`}
                >
                  <div className="flex-1">
                    <h4 className="font-black text-gray-800 text-xl leading-none mb-1">{bp?.nameAr}</h4>
                    <p className="text-base text-gray-600 font-bold">المساحة: {crop.area} قيراط</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-left hidden sm:block">
                      <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-tight">تاريخ الزراعة</p>
                      <p className="text-sm font-black text-gray-800 leading-none">
                        {format(parseISO(crop.sowingDate), 'dd MMM yyyy', { locale: ar })}
                      </p>
                    </div>
                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <Plus className={`w-5 h-5 ${isExpanded ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <div className="p-5 border-t border-white/40 space-y-6">
                        <div className="space-y-4">
                          <h4 className="font-bold text-gray-800 mb-2 text-sm">الجدول الزمني للمحصول</h4>
                          <div className="relative border-r-2 border-green-200 pr-4 space-y-6 mr-2">
                            {cropTasks.map((task) => {
                              const isCompleted = task.status === 'completed';
                              const isPostponed = task.postponedDays && task.postponedDays > 0;
                              
                              let fertInfo = task.fertilizerInfo;
                              if (!fertInfo && bp) {
                                const milestoneId = task.id.split('_').pop();
                                const milestone = bp.milestones.find(m => m.id === milestoneId);
                                if (milestone?.fertilizerInfo) {
                                  fertInfo = {
                                    type: milestone.fertilizerInfo.type,
                                    amountKg: parseFloat(((milestone.fertilizerInfo.amountPerFeddanKg / 24) * crop.area).toFixed(1))
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
                                      {fertInfo && (
                                        <span className="text-indigo-600 mr-1">
                                           {" "}+ {fertInfo.amountKg} كجم {fertInfo.type}
                                        </span>
                                      )}
                                    </h5>
                                    
                                    <div className="flex items-center gap-2 mt-2 text-[10px]">
                                      <p className={isCompleted ? 'text-green-600' : 'text-gray-500'}>
                                        {format(parseISO(task.dueDate), 'dd MMM yyyy', { locale: ar })}
                                      </p>
                                      {isPostponed && !isCompleted && (
                                        <span className="flex items-center bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md font-bold text-[8px]">
                                          <Clock className="w-2.5 h-2.5 ml-1" />
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

                        {/* Delete Section */}
                        <div className="pt-4 border-t border-gray-100">
                          {!confirmDelete ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDelete(true);
                              }}
                              className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition flex items-center justify-center"
                            >
                              <Trash2 className="w-4 h-4 ml-2" />
                              حذف المحصول
                            </button>
                          ) : (
                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deletePlantedCrop(crop.id);
                                  setDetailsCropId(null);
                                  setConfirmDelete(false);
                                }}
                                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition"
                              >
                                نعم، احذف
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDelete(false);
                                }}
                                className="flex-1 py-2.5 bg-gray-200 text-gray-800 rounded-xl font-bold text-sm hover:bg-gray-300 transition"
                              >
                                تراجع
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          {state.plantedCrops.length === 0 && (
            <p className="text-gray-500 text-center py-6 text-lg italic">لا توجد محاصيل مزروعة حالياً.</p>
          )}
        </div>
      </section>

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

import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CheckCircle, Clock, Calendar, FlaskConical, Tractor, Syringe } from 'lucide-react';
import { cn } from '../lib/utils';
import { HarvestModal } from './HarvestModal';

export const DailyTasks = () => {
  const { state, completeTask, handleTaskDelay } = useFarmContext();
  const [postponeDays, setPostponeDays] = useState<Record<string, number>>({});
  const [harvestingCropId, setHarvestingCropId] = useState<string | null>(null);

  const pendingTasks = state.tasks
    .filter(t => t.status === 'pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const todayTasks = pendingTasks.filter(t => isToday(parseISO(t.dueDate)) || isPast(parseISO(t.dueDate)));
  const upcomingTasks = pendingTasks.filter(t => !isToday(parseISO(t.dueDate)) && !isPast(parseISO(t.dueDate))).slice(0, 5);

  const handlePostpone = (taskId: string) => {
    const days = postponeDays[taskId] || 1;
    handleTaskDelay(taskId, days);
    setPostponeDays(prev => ({ ...prev, [taskId]: 1 }));
  };

  const TaskCard: React.FC<{ task: any, isUrgent: boolean }> = ({ task, isUrgent }) => {
    const isLivestockTask = !!task.livestockCategory;
    const crop = state.plantedCrops.find(c => c.id === task.plantedCropId);
    const bp = crop ? state.cropBestPractices.find(b => b.cropType === crop.cropType) : null;
    const cropName = bp ? bp.nameAr : (isLivestockTask ? '' : 'محصول غير معروف');
    
    const tagText = isLivestockTask 
      ? (task.livestockCategory === 'cattle' ? 'قطيع الماشية' : task.livestockCategory === 'small' ? 'قطيع الأغنام' : 'القطيع كامل')
      : cropName;
    
    let fertInfo = task.fertilizerInfo;
    if (!isLivestockTask && !fertInfo && crop && bp) {
      const milestoneId = task.id.split('_').pop();
      const milestone = bp.milestones.find(m => m.id === milestoneId);
      if (milestone?.fertilizerInfo) {
        fertInfo = {
          type: milestone.fertilizerInfo.type,
          amountKg: parseFloat(((milestone.fertilizerInfo.amountPerFeddanKg / 24) * crop.area).toFixed(1))
        };
      }
    }

    const handleComplete = (taskId: string, type: string, cropId: string) => {
      if (type === 'harvest' && cropId) {
        setHarvestingCropId(cropId);
        completeTask(taskId);
      } else {
        completeTask(taskId);
      }
    };

    return (
      <div className={cn(
        "p-4 rounded-2xl mb-4 border transition-all active:scale-[0.98] shadow-sm",
        isUrgent ? "bg-red-50/50 border-red-100" : "bg-gray-50/50 border-gray-100"
      )}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                "text-[10px] font-black px-2 py-0.5 rounded-lg border flex items-center gap-1 shadow-xs",
                isLivestockTask ? "bg-rose-50 text-rose-700 border-rose-100" : "bg-white text-green-700 border-green-100"
              )}>
                {task.type === 'harvest' && <Tractor className="w-3 h-3" />}
                {task.type === 'vaccination' && <Syringe className="w-3 h-3" />}
                {tagText}
              </span>
              {crop && !isLivestockTask && (
                <span className="text-[10px] text-gray-400 font-bold">
                  {crop.area} قيراط
                </span>
              )}
            </div>
            <h4 className="font-black text-gray-800 text-lg leading-tight">
              {task.titleAr}
              {fertInfo && (
                <span className="text-indigo-600 mr-1">
                  {" "}+ {fertInfo.amountKg} كجم {fertInfo.type}
                </span>
              )}
            </h4>
            <div className="flex items-center mt-2 gap-3">
              <p className="text-[10px] text-gray-400 font-bold flex items-center">
                <Calendar className="w-3 h-3 ml-1" />
                {format(parseISO(task.dueDate), 'dd MMMM yyyy', { locale: ar })}
              </p>
              {task.postponedDays > 0 && (
                <span className="text-[10px] text-amber-600 font-black bg-amber-50 px-1.5 rounded-md">
                  تم التأجيل {task.postponedDays} يوم
                </span>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => handleComplete(task.id, task.type, task.plantedCropId)}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-2xl transition shadow-lg shrink-0",
              task.type === 'harvest' ? "bg-orange-500 text-white shadow-orange-500/20" : "bg-green-600 text-white shadow-green-600/20"
            )}
          >
            <CheckCircle className="w-6 h-6" />
          </button>
        </div>
      
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[10px] text-gray-400 font-black">تأجيل لظروف طارئة؟</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden h-8">
              <input 
                type="number" 
                min="1" 
                max="14"
                value={postponeDays[task.id] || 1}
                onChange={(e) => setPostponeDays(prev => ({ ...prev, [task.id]: parseInt(e.target.value) || 1 }))}
                className="w-10 text-center text-xs font-black outline-none"
              />
              <span className="px-2 text-[10px] text-gray-400 border-r border-gray-100 font-bold">يوم</span>
            </div>
            <button 
              onClick={() => handlePostpone(task.id)}
              className="h-8 px-3 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition flex items-center text-[10px] font-black"
            >
              <Clock className="w-3 h-3 ml-1" />
              تأجيل
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="w-2 h-6 bg-red-500 rounded-full" />
          <h3 className="text-xl font-black text-gray-800">عاجل اليوم</h3>
        </div>
        
        {todayTasks.length === 0 ? (
          <div className="p-10 text-center bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200">
            <CheckCircle className="w-10 h-10 text-green-500/20 mx-auto mb-3" />
            <p className="text-gray-400 font-black text-sm">لا توجد مهام عاجلة. يوم مثمر!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {todayTasks.map(task => <TaskCard key={task.id} task={task} isUrgent={true} />)}
          </div>
        )}
      </section>

      <div className="h-px bg-emerald-300 mx-2" />

      <section className="pt-6">
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="w-2 h-6 bg-blue-500 rounded-full" />
          <h3 className="text-xl font-black text-gray-800">الجدول القادم</h3>
        </div>

        {upcomingTasks.length === 0 ? (
          <div className="p-8 text-center bg-gray-50/30 rounded-[2rem] border border-gray-100">
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">لا توجد مهام قريبة</p>
          </div>
        ) : (
          <div className="space-y-1">
            {upcomingTasks.map(task => <TaskCard key={task.id} task={task} isUrgent={false} />)}
          </div>
        )}
      </section>

      {harvestingCropId && (
        <HarvestModal cropId={harvestingCropId} onClose={() => setHarvestingCropId(null)} />
      )}
    </div>
  );
};

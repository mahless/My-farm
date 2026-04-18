import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CheckCircle, Clock, Calendar, FlaskConical, Tractor } from 'lucide-react';
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
    const crop = state.plantedCrops.find(c => c.id === task.plantedCropId);
    const bp = crop ? state.cropBestPractices.find(b => b.cropType === crop.cropType) : null;
    const cropName = bp ? bp.nameAr : 'محصول غير معروف';
    
    let fertInfo = task.fertilizerInfo;
    if (!fertInfo && crop && bp) {
      const milestone = bp.milestones.find(m => m.title === task.title);
      if (milestone?.fertilizerInfo) {
        fertInfo = {
          type: milestone.fertilizerInfo.type,
          amountKg: parseFloat(((milestone.fertilizerInfo.amountPerFeddanKg / 24) * crop.area).toFixed(1))
        };
      }
    }

    const handleComplete = (taskId: string, type: string, cropId: string) => {
      if (type === 'harvest') {
        setHarvestingCropId(cropId);
        completeTask(taskId);
      } else {
        completeTask(taskId);
      }
    };

    return (
      <div className={cn(
        "p-4 rounded-xl mb-3 backdrop-blur-md border border-white/20 shadow-lg shadow-green-900/5 transition-all active:scale-[0.98]",
        isUrgent ? "bg-red-500/10 border-red-500/30" : "bg-white/40"
      )}>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
                {task.type === 'harvest' && <Tractor className="w-3 h-3" />}
                {cropName}
              </span>
              {crop && (
                <span className="text-[10px] text-gray-500">
                  {crop.area} قيراط
                </span>
              )}
            </div>
            <h4 className="font-bold text-gray-800">{task.titleAr}</h4>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <Calendar className="w-3 h-3 ml-1" />
              {format(parseISO(task.dueDate), 'dd MMMM yyyy', { locale: ar })}
            </p>
            {task.postponedDays > 0 && (
              <span className="text-xs text-amber-600 mt-1 block">
                تم التأجيل {task.postponedDays} يوم
              </span>
            )}
            
            {fertInfo && (
              <div className="mt-2 p-2 bg-purple-50/80 border border-purple-100 rounded-lg text-xs w-fit">
                <div className="flex items-center gap-1 mb-1">
                  <FlaskConical className="w-3 h-3 text-purple-600" />
                  <span className="font-bold text-purple-800">توصية التسميد</span>
                </div>
                <p className="text-purple-700">النوع: {fertInfo.type}</p>
                <p className="text-purple-700">الكمية: {fertInfo.amountKg} كجم</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col items-center gap-1">
              <button 
                onClick={() => handleComplete(task.id, task.type, task.plantedCropId)}
                className={cn(
                  "p-2 rounded-full transition shadow-md",
                  task.type === 'harvest' ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-green-500 text-white hover:bg-green-600"
                )}
                title="إتمام المهمة"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      
        <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
          <span className="text-xs text-gray-600">تأجيل بسبب الطقس؟</span>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              min="1" 
              max="14"
              value={postponeDays[task.id] || 1}
              onChange={(e) => setPostponeDays(prev => ({ ...prev, [task.id]: parseInt(e.target.value) || 1 }))}
              className="w-12 text-center text-sm rounded-md border-gray-300 bg-white/50"
            />
            <button 
              onClick={() => handlePostpone(task.id)}
              className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition flex items-center"
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
    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <span className="w-2 h-2 rounded-full bg-red-500 ml-2"></span>
          مهام اليوم والمتأخرة
        </h3>
        {todayTasks.length === 0 ? (
          <div className="p-6 text-center bg-white/30 rounded-xl border border-white/20">
            <p className="text-gray-500">لا توجد مهام عاجلة اليوم. عمل رائع!</p>
          </div>
        ) : (
          todayTasks.map(task => <TaskCard key={task.id} task={task} isUrgent={true} />)
        )}
      </section>

      <section>
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <span className="w-2 h-2 rounded-full bg-blue-500 ml-2"></span>
          المهام القادمة
        </h3>
        {upcomingTasks.length === 0 ? (
          <div className="p-6 text-center bg-white/30 rounded-xl border border-white/20">
            <p className="text-gray-500">لا توجد مهام قادمة قريباً.</p>
          </div>
        ) : (
          upcomingTasks.map(task => <TaskCard key={task.id} task={task} isUrgent={false} />)
        )}
      </section>

      {harvestingCropId && (
        <HarvestModal cropId={harvestingCropId} onClose={() => setHarvestingCropId(null)} />
      )}
    </div>
  );
};

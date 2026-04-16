import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { X, CheckCircle, Scale, PenLine } from 'lucide-react';
import { ar } from 'date-fns/locale';

export const HarvestModal = ({ cropId, onClose }: { cropId: string, onClose: () => void }) => {
  const { state, harvestCrop } = useFarmContext();
  const [yieldQty, setYieldQty] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  const crop = state.plantedCrops.find(c => c.id === cropId);
  const bp = crop ? state.cropBestPractices.find(b => b.cropType === crop.cropType) : null;

  if (!crop || !bp) return null;

  const handleHarvest = () => {
    const qty = typeof yieldQty === 'string' ? parseFloat(yieldQty) : yieldQty;
    if (qty > 0) {
      harvestCrop(cropId, qty, notes);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 bg-green-600 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black">حصاد المحصول 🌾</h3>
            <p className="text-green-100 text-xs opacity-90">{bp.nameAr} - مساحة {crop.area} قيراط</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-100">
            <p className="text-sm text-green-800 font-bold mb-1">مبروك على الحصاد! 🥳</p>
            <p className="text-xs text-green-700">يرجى إدخال الإنتاجية الفعلية لإضافتها للمخزن وأرشفة المحصول.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Scale className="w-4 h-4 text-green-600" />
              الإنتاجية الفعلية (كجم)
            </label>
            <input 
              type="number" 
              value={yieldQty}
              onChange={(e) => setYieldQty(e.target.value ? parseFloat(e.target.value) : '')}
              placeholder="مثلاً: 500"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-2xl font-black text-green-700 focus:ring-2 focus:ring-green-500 outline-none transition"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <PenLine className="w-4 h-4 text-green-600" />
              ملاحظات الحصاد
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: جودة ممتازة، تأثر ببعض الحرارة..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none h-20 resize-none"
            />
          </div>

          <button 
            onClick={handleHarvest}
            disabled={!yieldQty || yieldQty <= 0}
            className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-600/30 hover:bg-green-700 transition active:scale-[0.98] disabled:opacity-50"
          >
            تأكيد الحصاد وإتمام الدورة
          </button>
        </div>
      </div>
    </div>
  );
};

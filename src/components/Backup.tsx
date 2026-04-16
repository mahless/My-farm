import React, { useRef, useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { Download, Upload, Database, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

export const Backup = () => {
  const { exportBackup, importBackup, resetData } = useFarmContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const success = importBackup(content);
        if (success) {
          setImportStatus('success');
          setTimeout(() => setImportStatus('idle'), 3000);
        } else {
          setImportStatus('error');
          setTimeout(() => setImportStatus('idle'), 3000);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    resetData();
    setShowConfirmReset(false);
    window.location.reload(); // Refresh to ensure all states are clean
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl shadow-green-900/5">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Database className="w-5 h-5 ml-2 text-indigo-600" />
          النسخ الاحتياطي للبيانات
        </h3>
        
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          يمكنك حفظ نسخة من جميع بيانات مزرعتك (المحاصيل، الماشية، المخزن، والمالية) على ذاكرة الهاتف واستعادتها في أي وقت.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {/* Export Button */}
          <button 
            onClick={exportBackup}
            className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-lg hover:bg-green-700 transition flex items-center justify-center shadow-lg shadow-green-600/30 active:scale-95"
          >
            حفظ نسخه احتياطيه
          </button>

          {/* Import Button */}
          <div className="relative">
            <input 
              type="file" 
              accept=".json"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition flex items-center justify-center shadow-lg shadow-indigo-600/30 active:scale-95"
            >
              استعادة نسخه احتياطيه
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {importStatus === 'success' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <span className="font-bold">تم استعادة البيانات بنجاح!</span>
          </div>
        )}

        {importStatus === 'error' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <span className="font-bold">فشل الاستيراد. تأكد من أن الملف صحيح.</span>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50/80 backdrop-blur-md p-5 rounded-2xl border border-red-100 shadow-xl shadow-red-900/5">
        <h3 className="text-lg font-bold text-red-800 mb-2 flex items-center">
          <Trash2 className="w-5 h-5 ml-2 text-red-600" />
          منطقة الخطر
        </h3>
        <p className="text-xs text-red-700 mb-4 font-bold">
          سيتم مسح جميع البيانات المسجلة نهائياً (المحاصيل، الماشية، المخزن، المالية) وإعادة التطبيق للحالة الأولية.
        </p>

        {!showConfirmReset ? (
          <button 
            onClick={() => setShowConfirmReset(true)}
            className="w-full py-3 bg-white text-red-600 border-2 border-red-200 rounded-xl font-black text-base hover:bg-red-50 transition active:scale-95"
          >
            مسح جميع البيانات والبدء من جديد
          </button>
        ) : (
          <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <p className="text-sm font-black text-red-900 text-center">هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-2">
              <button 
                onClick={handleReset}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black text-base shadow-lg shadow-red-600/20 active:scale-95"
              >
                نعم، امسح كل شيء
              </button>
              <button 
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-black text-base active:scale-95"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-amber-50/80 backdrop-blur-sm p-4 rounded-xl border border-amber-100 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 leading-relaxed">
          <strong>ملاحظة هامة:</strong> عند استيراد نسخة احتياطية، سيتم مسح البيانات الحالية واستبدالها ببيانات النسخة المستوردة. يرجى التأكد من حفظ نسخة من بياناتك الحالية إذا كانت هامة.
        </p>
      </div>
    </div>
  );
};

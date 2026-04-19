import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { Wallet, TrendingUp, TrendingDown, ArrowDownToLine, ArrowUpFromLine, Receipt } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { FinancialCategory, FinancialTransactionType } from '../types';

export const Finance = () => {
  const { state, addFinancialTransaction } = useFarmContext();
  const [type, setType] = useState<FinancialTransactionType>('expense');
  const [category, setCategory] = useState<FinancialCategory>('feed');
  const [amount, setAmount] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (numAmount > 0) {
      addFinancialTransaction(type, category, numAmount, notes);
      setAmount('');
      setNotes('');
    }
  };

  const transactions = state.financialTransactions || [];
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const categoryLabels: Record<FinancialCategory, string> = {
    feed: 'أعلاف',
    fertilizer: 'أسمدة ومبيدات',
    labor: 'عمالة',
    equipment: 'معدات وصيانة',
    wheat_sales: 'بيع قمح',
    corn_sales: 'بيع ذره',
    potato_sales: 'بيع بطاطس',
    beans_sales: 'بيع فاصوليا',
    milk_sales: 'بيع البان',
    other: 'أخرى'
  };

  return (
    <div className="space-y-8">
      {/* Summary Section */}
      <section className="space-y-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-6 rounded-3xl border border-blue-100 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-black text-blue-800 mb-1 opacity-80">الرصيد الحالي (صافي الربح)</p>
            <p className={`text-4xl font-black ${balance >= 0 ? 'text-blue-900' : 'text-red-600'}`}>
              {balance.toLocaleString()} <span className="text-sm font-normal">ج.م</span>
            </p>
          </div>
          <div className="bg-white/40 p-3.5 rounded-2xl border border-white/50 shadow-inner">
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50/50 p-4 rounded-3xl border border-green-100/50 shadow-sm">
            <div className="flex items-center text-green-700 mb-1 opacity-70">
              <TrendingUp className="w-4 h-4 ml-1.5" />
              <h3 className="font-black text-[10px] uppercase">الإيرادات</h3>
            </div>
            <p className="text-xl font-black text-gray-800">{totalIncome.toLocaleString()} <span className="text-[10px] font-normal">ج.م</span></p>
          </div>

          <div className="bg-red-50/50 p-4 rounded-3xl border border-red-100/50 shadow-sm">
            <div className="flex items-center text-red-700 mb-1 opacity-70">
              <TrendingDown className="w-4 h-4 ml-1.5" />
              <h3 className="font-black text-[10px] uppercase">المصروفات</h3>
            </div>
            <p className="text-xl font-black text-gray-800">{totalExpense.toLocaleString()} <span className="text-[10px] font-normal">ج.م</span></p>
          </div>
        </div>
      </section>

      <div className="h-px bg-emerald-300 mx-2" />

      {/* Add Transaction Form */}
      <section className="pt-6">
        <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center px-1">
          <Receipt className="w-6 h-6 ml-2 text-indigo-600" />
          تسجيل حركة مالية
        </h3>
        
        <div className="space-y-5">
          <div className="flex gap-2">
            <button 
              onClick={() => { setType('income'); setCategory('wheat_sales'); }}
              className={`flex-1 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center transition shadow-sm ${type === 'income' ? 'bg-green-600 text-white shadow-green-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
            >
              <ArrowDownToLine className="w-4 h-4 ml-2" /> إيراد
            </button>
            <button 
              onClick={() => { setType('expense'); setCategory('feed'); }}
              className={`flex-1 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center transition shadow-sm ${type === 'expense' ? 'bg-red-600 text-white shadow-red-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
            >
              <ArrowUpFromLine className="w-4 h-4 ml-2" /> مصروف
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 mr-2 font-black">المبلغ (ج.م)</label>
              <input 
                type="number" 
                min="0" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : '')}
                className="w-full p-3.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-black text-indigo-900 text-lg shadow-sm"
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 mr-2 font-black">التصنيف</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value as FinancialCategory)}
                className="w-full p-3.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold shadow-sm"
              >
                {type === 'income' ? (
                  <>
                    <option value="wheat_sales">بيع قمح</option>
                    <option value="corn_sales">بيع ذره</option>
                    <option value="potato_sales">بيع بطاطس</option>
                    <option value="beans_sales">بيع فاصوليا</option>
                    <option value="milk_sales">بيع البان</option>
                    <option value="other">ايرادات أخرى</option>
                  </>
                ) : (
                  <>
                    <option value="feed">أعلاف</option>
                    <option value="fertilizer">أسمدة ومبيدات</option>
                    <option value="labor">عمالة</option>
                    <option value="equipment">معدات وصيانة</option>
                    <option value="other">مصروفات أخرى</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 mr-2 font-black">ملاحظات إضافية</label>
            <input 
              type="text" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium shadow-sm"
              placeholder="وصف مختصر للحركة..."
            />
          </div>

          <button 
            onClick={handleAdd}
            disabled={!amount || amount <= 0}
            className="w-full py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            حفظ الحركة المالية
          </button>
        </div>
      </section>

      <div className="h-px bg-emerald-300 mx-2" />

      {/* Transaction History */}
      <section className="pt-6">
        <h3 className="text-xl font-black text-gray-800 mb-4 px-1">سجل الحركات المالية</h3>
        <div className="space-y-1">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8 italic font-bold">لا توجد حركات مالية مسجلة بعد.</p>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0 px-1">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${tx.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {tx.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-black text-gray-800 text-base leading-tight">{categoryLabels[tx.category]}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{format(parseISO(tx.date), 'dd MMM yyyy', { locale: ar })}</p>
                    {tx.notes && <p className="text-[9px] text-gray-500 mt-0.5 font-medium italic">"{tx.notes}"</p>}
                  </div>
                </div>
                <div className={`text-lg font-black ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()} <span className="text-[10px] font-normal">ج.م</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

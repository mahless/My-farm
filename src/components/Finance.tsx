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
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-md p-6 rounded-2xl border border-white/30 shadow-lg shadow-blue-900/5 flex items-center justify-between">
          <div>
            <p className="text-base font-black text-blue-800 mb-1">الرصيد الحالي (صافي الربح)</p>
            <p className={`text-3xl font-black ${balance >= 0 ? 'text-blue-900' : 'text-red-600'}`}>
              {balance.toLocaleString()} <span className="text-sm font-normal">ج.م</span>
            </p>
          </div>
          <div className="bg-white/50 p-4 rounded-full">
            <Wallet className="w-9 h-9 text-blue-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md p-5 rounded-2xl border border-white/30 shadow-lg shadow-green-900/5">
          <div className="flex items-center text-green-800 mb-2">
            <TrendingUp className="w-6 h-6 ml-2" />
            <h3 className="font-black text-base">الإيرادات</h3>
          </div>
          <p className="text-2xl font-black text-gray-800">{totalIncome.toLocaleString()} <span className="text-xs font-normal">ج.م</span></p>
        </div>

        <div className="bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-md p-5 rounded-2xl border border-white/30 shadow-lg shadow-red-900/5">
          <div className="flex items-center text-red-800 mb-2">
            <TrendingDown className="w-6 h-6 ml-2" />
            <h3 className="font-black text-base">المصروفات</h3>
          </div>
          <p className="text-2xl font-black text-gray-800">{totalExpense.toLocaleString()} <span className="text-xs font-normal">ج.م</span></p>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl shadow-indigo-900/5">
        <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center">
          <Receipt className="w-6 h-6 ml-2 text-indigo-600" />
          تسجيل حركة مالية
        </h3>
        
        <div className="space-y-5">
          <div className="flex gap-2">
            <button 
              onClick={() => { setType('income'); setCategory('wheat_sales'); }}
              className={`flex-1 py-2.5 rounded-xl font-black text-base flex items-center justify-center transition shadow-sm ${type === 'income' ? 'bg-green-500 text-white' : 'bg-white/50 text-gray-600'}`}
            >
              <ArrowDownToLine className="w-5 h-5 ml-2" /> إيراد
            </button>
            <button 
              onClick={() => { setType('expense'); setCategory('feed'); }}
              className={`flex-1 py-2.5 rounded-xl font-black text-base flex items-center justify-center transition shadow-sm ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-white/50 text-gray-600'}`}
            >
              <ArrowUpFromLine className="w-5 h-5 ml-2" /> مصروف
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-base font-black text-gray-700 mb-1.5 ml-1">المبلغ (ج.م)</label>
              <input 
                type="number" 
                min="0" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : '')}
                className="w-full p-3 rounded-xl border border-white/40 bg-white/60 focus:ring-2 focus:ring-indigo-500 outline-none font-black text-indigo-900 text-lg shadow-sm"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-base font-black text-gray-700 mb-1.5 ml-1">التصنيف</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value as FinancialCategory)}
                className="w-full p-3 rounded-xl border border-white/40 bg-white/60 focus:ring-2 focus:ring-indigo-500 outline-none text-base font-bold shadow-sm"
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

          <div>
            <label className="block text-base font-black text-gray-700 mb-1.5 ml-1">ملاحظات (اختياري)</label>
            <input 
              type="text" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-white/40 bg-white/60 focus:ring-2 focus:ring-indigo-500 outline-none text-base font-medium shadow-sm"
              placeholder="مثال: بيع طن قمح، شراء أعلاف..."
            />
          </div>

          <button 
            onClick={handleAdd}
            disabled={!amount || amount <= 0}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            تسجيل الحركة
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-xl font-black text-gray-800 mb-4">سجل الحركات المالية</h3>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 text-lg py-6 italic">لا توجد حركات مالية مسجلة بعد.</p>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="flex justify-between items-center p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-md shadow-gray-900/5">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full shadow-sm ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {tx.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-black text-gray-800 text-lg leading-tight">{categoryLabels[tx.category]}</p>
                    <p className="text-xs text-gray-500 font-bold">{format(parseISO(tx.date), 'dd MMM yyyy', { locale: ar })}</p>
                    {tx.notes && <p className="text-[10px] text-gray-600 mt-1 font-medium">{tx.notes}</p>}
                  </div>
                </div>
                <div className={`text-xl font-black ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()} <span className="text-xs font-normal">ج.م</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

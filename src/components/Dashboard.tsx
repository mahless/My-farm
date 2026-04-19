import React, { useState, useEffect, useRef } from 'react';
import { Home } from './Home';
import { DailyTasks } from './Tasks';
import { Crops } from './Crops';
import { Livestock } from './Livestock';
import { Inventory } from './Inventory';
import { Finance } from './Finance';
import { FarmerProfile } from './FarmerProfile';
import { Tractor, Sprout, Beef, Warehouse, CalendarCheck, WifiOff, Wallet, Home as HomeIcon } from 'lucide-react';
import { useMobileApp } from '../hooks/useMobileApp';

type Tab = 'home' | 'tasks' | 'crops' | 'livestock' | 'inventory' | 'finance';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showProfile, setShowProfile] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Reset scroll to top when tab changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [activeTab]);

  // Initialize mobile app features (hardware back button, offline status)
  const { isOnline } = useMobileApp(
    activeTab,
    setActiveTab,
    showProfile, // modalsOpen
    () => setShowProfile(false) // closeModals
  );

  const tabs = [
    { id: 'home', label: 'الرئيسية', icon: HomeIcon },
    { id: 'tasks', label: 'المهام', icon: CalendarCheck },
    { id: 'crops', label: 'المحاصيل', icon: Sprout },
    { id: 'livestock', label: 'الماشية', icon: Beef },
    { id: 'inventory', label: 'المخزن', icon: Warehouse },
    { id: 'finance', label: 'المالية', icon: Wallet },
  ] as const;

  return (
    <div className="h-[100dvh] w-full flex flex-col pt-2 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 font-sans overflow-hidden" dir="rtl">
      {/* Safe Area Spacer for Notch */}
      <div className="h-safe w-full bg-white/40 shrink-0" />
      
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-red-500 text-white text-xs font-bold py-3 px-4 flex items-center justify-center gap-2 pt-2 z-[60] pt-safe">
          <WifiOff className="w-3 h-3" />
          أنت غير متصل بالإنترنت. التطبيق يعمل في وضع عدم الاتصال.
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/40 z-50 px-4 py-4 shadow-md shrink-0">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-2 rounded-xl shadow-inner">
              <Tractor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-green-900 tracking-tight leading-none mb-1">مزرعتي</h1>
              <p className="text-sm text-green-700 font-medium">إدارة ذكية متكاملة</p>
            </div>
          </div>
          <button 
            onClick={() => setShowProfile(true)}
            className="w-14 h-14 rounded-full bg-white border border-white/50 shadow-xl shadow-green-900/10 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95"
          >
            <span className="text-3xl drop-shadow-md">👨‍🌾</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main ref={mainRef} className="flex-1 overflow-y-auto px-3 py-4 pb-24 hide-scrollbar">
        <div className="max-w-md mx-auto bg-white/40 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/40 shadow-2xl shadow-green-900/10 min-h-full">
          {activeTab === 'home' && <Home onNavigate={setActiveTab} />}
          {activeTab === 'tasks' && <DailyTasks />}
          {activeTab === 'crops' && <Crops />}
          {activeTab === 'livestock' && <Livestock />}
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'finance' && <Finance />}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white/90 backdrop-blur-xl border-t border-white/40 pb-safe pt-2 px-2 z-50 shrink-0 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="max-w-md mx-auto flex justify-between items-center">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex flex-col items-center p-2 transition-all duration-300 flex-1 ${
                  isActive ? 'text-green-600 scale-110' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className={`p-1.5 rounded-xl mb-0.5 ${isActive ? 'bg-green-100' : 'bg-transparent'}`}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[11px] font-black ${isActive ? 'text-green-700' : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Farmer Profile Modal */}
      {showProfile && (
        <FarmerProfile onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
};

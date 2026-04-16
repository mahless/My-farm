import { useEffect, useState } from 'react';
import { App } from '@capacitor/app';

export const useMobileApp = (
  activeTab: string, 
  setActiveTab: (tab: any) => void,
  modalsOpen: boolean,
  closeModals: () => void
) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Handle Android Hardware Back Button
    const setupBackButton = async () => {
      await App.addListener('backButton', ({ canGoBack }) => {
        if (modalsOpen) {
          // 1. Close any open modals first
          closeModals();
        } else if (activeTab !== 'tasks') {
          // 2. If not on the main tab, go back to main tab
          setActiveTab('tasks');
        } else {
          // 3. If on main tab and no modals open, do not exit app (per user request)
          // Normally we might call App.exitApp() here, but rule 5 says "لا يغلق التطبيق"
          console.log('Back button pressed on main screen - ignoring to prevent accidental exit');
        }
      });
    };

    setupBackButton();

    return () => {
      App.removeAllListeners();
    };
  }, [activeTab, modalsOpen, setActiveTab, closeModals]);

  return { isOnline };
};

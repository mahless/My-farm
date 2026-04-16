import { useState, useEffect, useCallback } from 'react';
import { addDays, parseISO, isSameDay, startOfDay, differenceInDays } from 'date-fns';
import { 
  FarmState, PlantedCrop, Task, Livestock, 
  InventoryItem, InventoryTransaction, Season, CropType,
  FinancialTransactionType, FinancialCategory, FinancialTransaction,
  LivestockType, LivestockPurpose
} from '../types';
import { cropBestPractices } from '../data/bestPractices';

const STORAGE_KEY = 'farm_manager_state';
const CURRENT_VERSION = 11;

const initialState: FarmState = {
  version: CURRENT_VERSION,
  seasons: [
    { id: 's1', name: 'Winter 2026', nameAr: 'شتوي 2026', startDate: new Date().toISOString() }
  ],
  currentSeasonId: 's1',
  plantedCrops: [],
  tasks: [],
  livestock: [
    { id: 'l1', type: 'buffalo', purpose: 'milking', nameAr: 'جاموس مصري', count: 2, averageWeightKg: 500, dailyDryMatterPercent: 0.03 },
    { id: 'l2', type: 'sheep', purpose: 'fattening', nameAr: 'أغنام (برقي/رحماني)', count: 10, averageWeightKg: 45, dailyDryMatterPercent: 0.035 }
  ],
  inventory: [
    { id: 'i1', name: 'Green Alfalfa', nameAr: 'برسيم أخضر', type: 'feed', quantity: 0, unit: 'Kg' },
    { id: 'i2', name: 'Corn Silage', nameAr: 'سيلاج ذرة', type: 'feed', quantity: 0, unit: 'Kg' },
    { id: 'i3', name: 'Concentrate Feed', nameAr: 'علف مركز', type: 'feed', quantity: 0, unit: 'Kg' },
    { id: 'i4', name: 'Wheat Straw', nameAr: 'تبن قمح', type: 'feed', quantity: 0, unit: 'Kg' },
    { id: 'i5', name: 'White Beans', nameAr: 'فاصوليا بيضاء', type: 'crop', quantity: 0, unit: 'Kg' },
    { id: 'i6', name: 'Wheat', nameAr: 'قمح', type: 'crop', quantity: 0, unit: 'Kg' },
    { id: 'i7', name: 'Potato', nameAr: 'بطاطس', type: 'crop', quantity: 0, unit: 'Kg' }
  ],
  transactions: [],
  financialTransactions: [],
  cropBestPractices: cropBestPractices
};

export const useFarmManager = () => {
  const [state, setState] = useState<FarmState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration for older saves or version mismatch
        if (parsed.version !== CURRENT_VERSION) {
          parsed.cropBestPractices = cropBestPractices;
          
          // Reset inventory to 0 for version 6 migration
          if (!parsed.version || parsed.version < 6) {
            if (parsed.inventory && Array.isArray(parsed.inventory)) {
              parsed.inventory = parsed.inventory.map((item: any) => ({ ...item, quantity: 0 }));
            }
          }
          
          // Version 7 migration: Update i1 to Green Alfalfa and add Wheat Straw
          if (!parsed.version || parsed.version < 7) {
            if (parsed.inventory && Array.isArray(parsed.inventory)) {
              const i1 = parsed.inventory.find((i: any) => i.id === 'i1');
              if (i1) {
                i1.name = 'Green Alfalfa';
                i1.nameAr = 'برسيم أخضر';
              }
              if (!parsed.inventory.find((i: any) => i.id === 'i4')) {
                parsed.inventory.push({ id: 'i4', name: 'Wheat Straw', nameAr: 'تبن قمح', type: 'feed', quantity: 0, unit: 'Kg' });
              }
            }
          }
          
          // Version 9 migration: Add missing crops (Beans, Wheat, Potato)
          if (!parsed.version || parsed.version < 9) {
            if (parsed.inventory && Array.isArray(parsed.inventory)) {
              if (!parsed.inventory.find((i: any) => i.id === 'i5')) {
                parsed.inventory.push({ id: 'i5', name: 'White Beans', nameAr: 'فاصوليا بيضاء', type: 'crop', quantity: 0, unit: 'Kg' });
              }
              if (!parsed.inventory.find((i: any) => i.id === 'i6')) {
                parsed.inventory.push({ id: 'i6', name: 'Wheat', nameAr: 'قمح', type: 'crop', quantity: 0, unit: 'Kg' });
              }
              if (!parsed.inventory.find((i: any) => i.id === 'i7')) {
                parsed.inventory.push({ id: 'i7', name: 'Potato', nameAr: 'بطاطس', type: 'crop', quantity: 0, unit: 'Kg' });
              }
            }
          }
          
          // Version 11 migration: Force reset to ensure new features like categories and missing crops appear
          if (!parsed.version || parsed.version < 11) {
            return initialState;
          }
          
          parsed.version = CURRENT_VERSION;
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse farm state', e);
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // --- Crop & Task Logic ---

  const plantCrop = useCallback((cropType: CropType, area: number) => {
    if (!state.currentSeasonId) return;

    const newCrop: PlantedCrop = {
      id: `pc_${Date.now()}`,
      cropType,
      sowingDate: new Date().toISOString(),
      area,
      seasonId: state.currentSeasonId
    };

    const bestPractice = state.cropBestPractices.find(bp => bp.cropType === cropType);
    const newTasks: Task[] = [];

    if (bestPractice) {
      bestPractice.milestones.forEach(ms => {
        let taskFertInfo = undefined;
        if (ms.fertilizerInfo) {
          // Calculate amount based on Qirat (1 Feddan = 24 Qirat)
          const amountKg = parseFloat(((ms.fertilizerInfo.amountPerFeddanKg / 24) * area).toFixed(1));
          taskFertInfo = {
            type: ms.fertilizerInfo.type,
            amountKg: amountKg
          };
        }

        newTasks.push({
          id: `t_${Date.now()}_${ms.id}`,
          plantedCropId: newCrop.id,
          title: ms.title,
          titleAr: ms.titleAr,
          dueDate: addDays(new Date(), ms.daysAfterSowing).toISOString(),
          type: ms.type,
          status: 'pending',
          fertilizerInfo: taskFertInfo
        });
      });
    }

    setState(prev => ({
      ...prev,
      plantedCrops: [...prev.plantedCrops, newCrop],
      tasks: [...prev.tasks, ...newTasks]
    }));
  }, [state.currentSeasonId]);

  const deletePlantedCrop = useCallback((cropId: string) => {
    setState(prev => ({
      ...prev,
      plantedCrops: prev.plantedCrops.filter(c => c.id !== cropId),
      tasks: prev.tasks.filter(t => t.plantedCropId !== cropId)
    }));
  }, []);

  const postponeTask = useCallback((taskId: string, days: number) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            dueDate: addDays(parseISO(t.dueDate), days).toISOString(),
            postponedDays: (t.postponedDays || 0) + days
          };
        }
        return t;
      })
    }));
  }, []);

  const completeTask = useCallback((taskId: string) => {
    setState(prev => {
      const taskToComplete = prev.tasks.find(t => t.id === taskId);
      if (!taskToComplete) return prev;

      const today = startOfDay(new Date());
      const scheduledDate = startOfDay(parseISO(taskToComplete.dueDate));
      const diffDays = differenceInDays(today, scheduledDate);

      return {
        ...prev,
        tasks: prev.tasks.map(t => {
          if (t.id === taskId) {
            return { ...t, status: 'completed' };
          }
          // Shift subsequent pending tasks for the same crop
          if (
            t.plantedCropId === taskToComplete.plantedCropId &&
            t.status === 'pending' &&
            parseISO(t.dueDate) >= parseISO(taskToComplete.dueDate)
          ) {
            return {
              ...t,
              dueDate: addDays(parseISO(t.dueDate), diffDays).toISOString()
            };
          }
          return t;
        })
      };
    });
  }, []);

  // --- Livestock & Feed Logic ---

  const calculateDailyFeedNeeds = useCallback(() => {
    let totalDryMatterKg = 0;
    state.livestock.forEach(animal => {
      totalDryMatterKg += animal.count * animal.averageWeightKg * animal.dailyDryMatterPercent;
    });
    return totalDryMatterKg;
  }, [state.livestock]);

  const calculateFeedPurchasesNeeded = useCallback((days: number = 30) => {
    const dailyNeeds = calculateDailyFeedNeeds();
    const totalNeeds = dailyNeeds * days;
    
    // Simple assumption: all feed inventory contributes to Dry Matter. 
    // In reality, moisture content varies (Silage ~30% DM, Hay ~85% DM).
    // For this prototype, we'll sum up 'feed' inventory directly or apply a rough average DM%.
    const currentFeedInventory = state.inventory
      .filter(i => i.type === 'feed')
      .reduce((sum, item) => sum + item.quantity, 0);

    const deficit = totalNeeds - currentFeedInventory;
    return deficit > 0 ? deficit : 0;
  }, [calculateDailyFeedNeeds, state.inventory]);

  const updateLivestockCount = useCallback((id: string, newCount: number) => {
    setState(prev => ({
      ...prev,
      livestock: prev.livestock.map(animal => 
        animal.id === id ? { ...animal, count: Math.max(0, newCount) } : animal
      )
    }));
  }, []);

  const calculateDynamicFeed = useCallback((activeFeeds = { alfalfa: true, silage: true, concentrate: true, straw: true }) => {
    const totalDM = calculateDailyFeedNeeds();

    // Relative weights for distribution (based on typical ratios)
    const weights = {
      alfalfa: 31,
      silage: 31,
      concentrate: 24,
      straw: 14
    };

    // Dry Matter percentages
    const dmPercent = {
      alfalfa: 0.20,
      silage: 0.30,
      concentrate: 0.90,
      straw: 0.90
    };

    let activeWeightSum = 0;
    if (activeFeeds.alfalfa) activeWeightSum += weights.alfalfa;
    if (activeFeeds.silage) activeWeightSum += weights.silage;
    if (activeFeeds.concentrate) activeWeightSum += weights.concentrate;
    if (activeFeeds.straw) activeWeightSum += weights.straw;

    if (activeWeightSum === 0) return { alfalfa: 0, silage: 0, concentrate: 0, straw: 0 };

    const getFresh = (key: 'alfalfa' | 'silage' | 'concentrate' | 'straw') => {
      if (!activeFeeds[key]) return 0;
      const allocatedDM = totalDM * (weights[key] / activeWeightSum);
      return allocatedDM / dmPercent[key];
    };

    return {
      alfalfa: getFresh('alfalfa'),
      silage: getFresh('silage'),
      concentrate: getFresh('concentrate'),
      straw: getFresh('straw')
    };
  }, [calculateDailyFeedNeeds]);

  const consumeDailyFeed = useCallback((amounts: { alfalfa: number, silage: number, concentrate: number, straw: number }) => {
    setState(prev => {
      const updatedInventory = prev.inventory.map(item => {
        if (item.id === 'i1') return { ...item, quantity: Math.max(0, item.quantity - amounts.alfalfa) };
        if (item.id === 'i2') return { ...item, quantity: Math.max(0, item.quantity - amounts.silage) };
        if (item.id === 'i3') return { ...item, quantity: Math.max(0, item.quantity - amounts.concentrate) };
        if (item.id === 'i4') return { ...item, quantity: Math.max(0, item.quantity - amounts.straw) };
        return item;
      });

      const newTransactions: InventoryTransaction[] = [];
      const date = new Date().toISOString();
      
      if (amounts.alfalfa > 0) newTransactions.push({ id: `tx_a_${Date.now()}`, itemId: 'i1', type: 'out', quantity: amounts.alfalfa, date, notes: 'استهلاك يومي للقطيع' });
      if (amounts.silage > 0) newTransactions.push({ id: `tx_s_${Date.now()}`, itemId: 'i2', type: 'out', quantity: amounts.silage, date, notes: 'استهلاك يومي للقطيع' });
      if (amounts.concentrate > 0) newTransactions.push({ id: `tx_c_${Date.now()}`, itemId: 'i3', type: 'out', quantity: amounts.concentrate, date, notes: 'استهلاك يومي للقطيع' });
      if (amounts.straw > 0) newTransactions.push({ id: `tx_w_${Date.now()}`, itemId: 'i4', type: 'out', quantity: amounts.straw, date, notes: 'استهلاك يومي للقطيع' });

      return {
        ...prev,
        inventory: updatedInventory,
        transactions: [...newTransactions, ...prev.transactions]
      };
    });
  }, []);

  const updateLivestockParams = useCallback((id: string, averageWeightKg: number, dailyDryMatterPercent: number) => {
    setState(prev => ({
      ...prev,
      livestock: prev.livestock.map(animal => 
        animal.id === id ? { ...animal, averageWeightKg, dailyDryMatterPercent } : animal
      )
    }));
  }, []);

  const updateCropMilestone = useCallback((cropType: CropType, milestoneId: string, daysAfterSowing: number) => {
    setState(prev => ({
      ...prev,
      cropBestPractices: prev.cropBestPractices.map(bp => {
        if (bp.cropType === cropType) {
          return {
            ...bp,
            milestones: bp.milestones.map(ms => 
              ms.id === milestoneId ? { ...ms, daysAfterSowing } : ms
            )
          };
        }
        return bp;
      })
    }));
  }, []);

  // --- Inventory Logic ---

  const addInventoryTransaction = useCallback((itemId: string, type: 'in' | 'out' | 'set', quantity: number, notes?: string) => {
    const newTransaction: InventoryTransaction = {
      id: `tx_${Date.now()}`,
      itemId,
      type,
      quantity,
      date: new Date().toISOString(),
      notes
    };

    setState(prev => {
      const updatedInventory = prev.inventory.map(item => {
        if (item.id === itemId) {
          let newQuantity = item.quantity;
          if (type === 'in') newQuantity += quantity;
          else if (type === 'out') newQuantity -= quantity;
          else if (type === 'set') newQuantity = quantity;
          
          return { ...item, quantity: Math.max(0, newQuantity) };
        }
        return item;
      });

      return {
        ...prev,
        inventory: updatedInventory,
        transactions: [newTransaction, ...prev.transactions]
      };
    });
  }, []);

  // --- Financial Logic ---

  const addFinancialTransaction = useCallback((type: FinancialTransactionType, category: FinancialCategory, amount: number, notes?: string) => {
    const newTransaction: FinancialTransaction = {
      id: `fin_${Date.now()}`,
      type,
      category,
      amount,
      date: new Date().toISOString(),
      notes
    };

    setState(prev => ({
      ...prev,
      financialTransactions: [newTransaction, ...(prev.financialTransactions || [])]
    }));
  }, []);

  const deleteLivestock = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      livestock: prev.livestock.filter(l => l.id !== id)
    }));
  }, []);

  const addLivestock = useCallback((type: LivestockType, purpose: LivestockPurpose, nameAr: string, count: number, weight: number) => {
    const newItem: Livestock = {
      id: `l_${Date.now()}`,
      type,
      purpose,
      nameAr,
      count,
      averageWeightKg: weight,
      dailyDryMatterPercent: type === 'sheep' || type === 'goat' ? 0.035 : 0.03
    };
    setState(prev => ({
      ...prev,
      livestock: [...prev.livestock, newItem]
    }));
  }, []);

  const harvestCrop = useCallback((cropId: string, yieldQuantity: number, notes?: string) => {
    setState(prev => {
      const crop = prev.plantedCrops.find(c => c.id === cropId);
      if (!crop) return prev;

      const bp = prev.cropBestPractices.find(b => b.cropType === crop.cropType);
      const cropNameAr = bp?.nameAr || 'محصول';

      // 1. Find or Create Inventory Item
      let inventoryItem = prev.inventory.find(item => 
        item.type === 'crop' && (item.nameAr === cropNameAr || item.id === `i_${crop.cropType}`)
      );

      let newInventory = [...prev.inventory];
      let itemId = inventoryItem?.id;

      if (!inventoryItem) {
        itemId = `i_${crop.cropType}`;
        inventoryItem = {
          id: itemId,
          name: crop.cropType,
          nameAr: cropNameAr,
          type: 'crop',
          quantity: 0,
          unit: 'Kg'
        };
        newInventory.push(inventoryItem);
      }

      // 2. Update Inventory Quantity
      newInventory = newInventory.map(item => 
        item.id === itemId ? { ...item, quantity: item.quantity + yieldQuantity } : item
      );

      // 3. Create Transaction
      const newTransaction: InventoryTransaction = {
        id: `tx_h_${Date.now()}`,
        itemId: itemId!,
        type: 'in',
        quantity: yieldQuantity,
        date: new Date().toISOString(),
        notes: notes || `حصاد من مساحة ${crop.area} قيراط`
      };

      // 4. Archive Crop (remove from active list)
      return {
        ...prev,
        inventory: newInventory,
        transactions: [newTransaction, ...prev.transactions],
        plantedCrops: prev.plantedCrops.filter(c => c.id !== cropId),
        tasks: prev.tasks.filter(t => t.plantedCropId !== cropId)
      };
    });
  }, []);

  const exportBackup = useCallback(() => {
    const dataStr = JSON.stringify(state);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `مزرعتي_نسخة_احتياطية_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [state]);

  const importBackup = useCallback((jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed && typeof parsed === 'object' && parsed.version) {
        setState(parsed);
        localStorage.setItem(STORAGE_KEY, jsonData);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }, []);

  const resetData = useCallback(() => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    state,
    plantCrop,
    deletePlantedCrop,
    postponeTask,
    completeTask,
    calculateDailyFeedNeeds,
    calculateFeedPurchasesNeeded,
    updateLivestockCount,
    updateLivestockParams,
    addLivestock,
    deleteLivestock,
    calculateDynamicFeed,
    consumeDailyFeed,
    updateCropMilestone,
    addInventoryTransaction,
    addFinancialTransaction,
    harvestCrop,
    exportBackup,
    importBackup,
    resetData
  };
};

export const resetDataState = () => {
  return initialState;
};

export type CropType = 'wheat' | 'corn' | 'potato' | 'alfalfa' | 'beans';
export type LivestockType = 'buffalo' | 'cow' | 'sheep' | 'goat';
export type LivestockPurpose = 'milking' | 'fattening';
export type TaskType = 'irrigation' | 'fertilization' | 'harvest' | 'other';
export type TaskStatus = 'pending' | 'completed' | 'postponed';
export type InventoryItemType = 'feed' | 'crop' | 'fertilizer' | 'other';
export type TransactionType = 'in' | 'out' | 'set';
export type FinancialTransactionType = 'income' | 'expense';
export type FinancialCategory = 'feed' | 'fertilizer' | 'labor' | 'equipment' | 'other' | 'wheat_sales' | 'corn_sales' | 'potato_sales' | 'beans_sales' | 'milk_sales';

export interface FinancialTransaction {
  id: string;
  type: FinancialTransactionType;
  category: FinancialCategory;
  amount: number;
  date: string; // ISO String
  notes?: string;
}

export interface FertilizerInfo {
  type: string;
  amountPerFeddanKg: number;
}

export interface TaskFertilizerInfo {
  type: string;
  amountKg: number;
}

export interface Milestone {
  id: string;
  title: string;
  titleAr: string;
  daysAfterSowing: number;
  type: TaskType;
  description?: string;
  descriptionAr?: string;
  fertilizerInfo?: FertilizerInfo;
}

export interface CropBestPractice {
  cropType: CropType;
  nameAr: string;
  milestones: Milestone[];
}

export interface PlantedCrop {
  id: string;
  cropType: CropType;
  sowingDate: string; // ISO String
  area: number; // in Qirat
  seasonId: string;
}

export interface Task {
  id: string;
  plantedCropId?: string;
  title: string;
  titleAr: string;
  dueDate: string; // ISO String
  type: TaskType;
  status: TaskStatus;
  postponedDays?: number;
  description?: string;
  descriptionAr?: string;
  fertilizerInfo?: TaskFertilizerInfo;
}

export interface Livestock {
  id: string;
  type: LivestockType;
  purpose: LivestockPurpose;
  nameAr: string;
  count: number;
  averageWeightKg: number;
  dailyDryMatterPercent: number; // e.g., 0.025 for 2.5% of body weight
}

export interface InventoryItem {
  id: string;
  name: string;
  nameAr: string;
  type: InventoryItemType;
  quantity: number; // in Kg
  unit: string;
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  type: TransactionType;
  quantity: number;
  date: string; // ISO String
  notes?: string;
}

export interface Season {
  id: string;
  name: string;
  nameAr: string;
  startDate: string; // ISO String
  endDate?: string; // ISO String
}

export interface FarmState {
  version?: number;
  seasons: Season[];
  currentSeasonId: string | null;
  plantedCrops: PlantedCrop[];
  tasks: Task[];
  livestock: Livestock[];
  inventory: InventoryItem[];
  transactions: InventoryTransaction[];
  financialTransactions: FinancialTransaction[];
  cropBestPractices: CropBestPractice[];
}

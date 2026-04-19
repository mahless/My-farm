import { TaskType } from '../types';

export interface VetMilestone {
  id: string;
  titleAr: string;
  title: string;
  daysAfterTrigger: number;
  type: TaskType;
  animalCategory: 'cattle' | 'small' | 'all';
}

/**
 * جدول التحصينات البيطرية الدوري
 * المصدر: الإرشاد البيطري المصري
 */
export const VET_REFERENCE: VetMilestone[] = [
  { id: 'v_1', title: 'Vaccination', titleAr: 'تحصين الحمى القلاعية والوادي المتصدع', daysAfterTrigger: 10, type: 'vaccination', animalCategory: 'all' },
  { id: 'v_2', title: 'Deworming', titleAr: 'تجريع ديدان كبدية ومعوية', daysAfterTrigger: 30, type: 'other', animalCategory: 'all' },
  { id: 'v_3', title: 'Vaccination', titleAr: 'تحصين الجدري', daysAfterTrigger: 60, type: 'vaccination', animalCategory: 'small' }, // للأغنام
  { id: 'v_4', title: 'Vaccination', titleAr: 'جرعة تنشيطية: الحمى القلاعية', daysAfterTrigger: 190, type: 'vaccination', animalCategory: 'all' },
  { id: 'v_5', title: 'Deworming', titleAr: 'تجريع ديدان دوري', daysAfterTrigger: 120, type: 'other', animalCategory: 'all' },
];

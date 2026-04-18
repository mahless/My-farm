import { CropBestPractice } from '../types';

/**
 * البيانات العلمية المعتمدة للري والتسميد في التربة الطينية السمراء
 * المصدر: مركز البحوث الزراعية (ARC) - مصر
 */
export const AGRI_REFERENCE: CropBestPractice[] = [
  {
    cropType: 'wheat',
    nameAr: 'القمح',
    milestones: [
      { id: 'w_1', title: 'Prepare & Base Fert', titleAr: 'تجهيز الأرض وسماد أساس', daysAfterSowing: 0, type: 'fertilization' },
      { id: 'w_2', title: 'Mohaya Irrigation', titleAr: 'رية المحاياة (تنشيط)', daysAfterSowing: 21, type: 'irrigation' },
      { id: 'w_3', title: 'First Fert (Nitrogen)', titleAr: 'الدفعة الأولى سماد (آزوت)', daysAfterSowing: 25, type: 'fertilization' },
      { id: 'w_4', title: 'Second Irrigation', titleAr: 'الرية الثانية', daysAfterSowing: 45, type: 'irrigation' },
      { id: 'w_5', title: 'Second Fert', titleAr: 'الدفعة الثانية سماد', daysAfterSowing: 50, type: 'fertilization' },
      { id: 'w_6', title: 'Third Irrigation', titleAr: 'الرية الثالثة (طرد سنابل)', daysAfterSowing: 75, type: 'irrigation' },
      { id: 'w_7', title: 'Fourth Irrigation', titleAr: 'الرية الرابعة (امتلاء حبوب)', daysAfterSowing: 105, type: 'irrigation' },
      { id: 'w_8', title: 'Harvest', titleAr: 'الحصاد', daysAfterSowing: 155, type: 'harvest' }
    ]
  },
  {
    cropType: 'corn',
    nameAr: 'الذرة الشامية',
    milestones: [
      { id: 'c_1', title: 'Sowing & Mohaya', titleAr: 'زراعة ورية المحاياة', daysAfterSowing: 0, type: 'irrigation' },
      { id: 'c_2', title: 'Thinning & First Fert', titleAr: 'خف وعزيق وسماد أول', daysAfterSowing: 21, type: 'fertilization' },
      { id: 'c_3', title: 'Second Irrigation', titleAr: 'الرية الثانية', daysAfterSowing: 35, type: 'irrigation' },
      { id: 'c_4', title: 'Second Fert & Third Irrig', titleAr: 'سماد ثاني ورية ثالثة', daysAfterSowing: 50, type: 'irrigation' },
      { id: 'c_5', title: 'Fourth Irrigation', titleAr: 'الرية الرابعة (تزهير)', daysAfterSowing: 65, type: 'irrigation' },
      { id: 'c_6', title: 'Fifth Irrigation', titleAr: 'الرية الخامسة', daysAfterSowing: 80, type: 'irrigation' },
      { id: 'c_7', title: 'Harvest', titleAr: 'الحصاد', daysAfterSowing: 110, type: 'harvest' }
    ]
  },
  {
    cropType: 'potato',
    nameAr: 'البطاطس',
    milestones: [
      { id: 'p_1', title: 'Sowing & First Irrig', titleAr: 'زراعة ورية أولى', daysAfterSowing: 0, type: 'irrigation' },
      { id: 'p_2', title: 'Second Irrig & Nitrogen', titleAr: 'رية ثانية وسماد آزوت', daysAfterSowing: 20, type: 'irrigation' },
      { id: 'p_3', title: 'Hoeing & Potassium', titleAr: 'عزيق وسماد بوتاسيوم', daysAfterSowing: 40, type: 'fertilization' },
      { id: 'p_4', title: 'Third Irrigation', titleAr: 'رية ثالثة', daysAfterSowing: 55, type: 'irrigation' },
      { id: 'p_5', title: 'Fourth Irrig & Hilling', titleAr: 'رية رابعة وتغطية درنات', daysAfterSowing: 75, type: 'irrigation' },
      { id: 'p_6', title: 'Stop Irrigation', titleAr: 'توقف الري (نضج)', daysAfterSowing: 100, type: 'irrigation' },
      { id: 'p_7', title: 'Harvest', titleAr: 'الحصاد', daysAfterSowing: 115, type: 'harvest' }
    ]
  },
  {
    cropType: 'alfalfa',
    nameAr: 'البرسيم المسقاوي',
    milestones: [
      { id: 'a_1', title: 'Sowing & Phos Fert', titleAr: 'زراعة وسماد فوسفات', daysAfterSowing: 0, type: 'fertilization' },
      { id: 'a_2', title: 'Mohaya Irrigation', titleAr: 'رية المحاياة', daysAfterSowing: 10, type: 'irrigation' },
      { id: 'a_3', title: 'First Cut', titleAr: 'الحشة الأولى', daysAfterSowing: 45, type: 'harvest' },
      { id: 'a_4', title: 'Post-Cut Irrigation', titleAr: 'ري بعد الحش والسماد', daysAfterSowing: 50, type: 'irrigation' },
      { id: 'a_5', title: 'Second Cut', titleAr: 'الحشة الثانية', daysAfterSowing: 75, type: 'harvest' },
      { id: 'a_6', title: 'Post-Second Cut Irrig', titleAr: 'ري بعد الحشة الثانية', daysAfterSowing: 80, type: 'irrigation' },
      { id: 'a_7', title: 'Third Cut', titleAr: 'الحشة الثالثة', daysAfterSowing: 105, type: 'harvest' },
      { id: 'a_8', title: 'Post-Third Cut Irrig', titleAr: 'ري بعد الحشة الثالثة', daysAfterSowing: 110, type: 'irrigation' }
    ]
  }
];

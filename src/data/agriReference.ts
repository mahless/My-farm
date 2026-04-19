import { CropBestPractice } from '../types';

/**
 * البيانات العلمية المعتمدة للري والتسميد في التربة الطينية جيدة الصرف (الدلتا)
 * المصدر: نشرات قطاع الإرشاد الزراعي - وزارة الزراعة المصرية
 */
export const AGRI_REFERENCE: CropBestPractice[] = [
  {
    cropType: 'wheat',
    nameAr: 'القمح',
    milestones: [
      { id: 'w_1', title: 'Prepare & Base Fert', titleAr: 'تجهيز الأرض (الزراعة: منتصف نوفمبر)', daysAfterSowing: 0, type: 'fertilization', fertilizerInfo: { type: 'سماد بلدي + سوبر فوسفات', amountPerFeddanKg: 150 } },
      { id: 'w_2', title: 'Mohaya Irrigation & Fert', titleAr: 'الرية الأولى (المحاياة) وتفريع', daysAfterSowing: 25, type: 'irrigation', fertilizerInfo: { type: 'نترات نشادر (الدفعة الأولى)', amountPerFeddanKg: 100 } },
      { id: 'w_3', title: 'Second Irrigation & Fert', titleAr: 'الرية الثانية (طرد السنابل)', daysAfterSowing: 55, type: 'irrigation', fertilizerInfo: { type: 'نترات نشادر (الدفعة الثانية)', amountPerFeddanKg: 100 } },
      { id: 'w_4', title: 'Third Irrigation', titleAr: 'الرية الثالثة', daysAfterSowing: 85, type: 'irrigation' },
      { id: 'w_5', title: 'Fourth Irrigation', titleAr: 'الرية الرابعة (فترة الامتلاء)', daysAfterSowing: 115, type: 'irrigation' },
      { id: 'w_6', title: 'Harvest', titleAr: 'الحصاد', daysAfterSowing: 160, type: 'harvest' }
    ]
  },
  {
    cropType: 'corn',
    nameAr: 'الذرة الشامية',
    milestones: [
      { id: 'c_1', title: 'Sowing', titleAr: 'زراعة ورية الزراعة (مايو/يونيو)', daysAfterSowing: 0, type: 'irrigation', fertilizerInfo: { type: 'سوبر فوسفات', amountPerFeddanKg: 200 } },
      { id: 'c_2', title: 'Thinning & First Fert', titleAr: 'الخف ورية المحاياة', daysAfterSowing: 21, type: 'fertilization', fertilizerInfo: { type: 'يوريا (الدفعة الأولى)', amountPerFeddanKg: 130 } },
      { id: 'c_3', title: 'Second Irrigation & Fert', titleAr: 'الرية الثانية', daysAfterSowing: 35, type: 'irrigation', fertilizerInfo: { type: 'يوريا (الدفعة الثانية)', amountPerFeddanKg: 130 } },
      { id: 'c_4', title: 'Third Irrigation', titleAr: 'الرية الثالثة', daysAfterSowing: 50, type: 'irrigation' },
      { id: 'c_5', title: 'Fourth Irrigation', titleAr: 'الرية الرابعة (تزهير)', daysAfterSowing: 65, type: 'irrigation' },
      { id: 'c_6', title: 'Fifth Irrigation', titleAr: 'الرية الخامسة (امتلاء الحبوب)', daysAfterSowing: 80, type: 'irrigation' },
      { id: 'c_7', title: 'Harvest', titleAr: 'الحصاد', daysAfterSowing: 110, type: 'harvest' }
    ]
  },
  {
    cropType: 'potato',
    nameAr: 'البطاطس',
    milestones: [
      { id: 'p_1', title: 'Sowing & Base Fert', titleAr: 'الزراعة (عروة صيفي/شتوي)', daysAfterSowing: 0, type: 'fertilization', fertilizerInfo: { type: 'سماد بلدي + سوبر فوسفات', amountPerFeddanKg: 200 } },
      { id: 'p_2', title: 'Mohaya Irrig & Nitrogen', titleAr: 'رية المحاياة وتسميد نتروجين', daysAfterSowing: 21, type: 'irrigation', fertilizerInfo: { type: 'نترات نشادر', amountPerFeddanKg: 100 } },
      { id: 'p_3', title: 'Hoeing & Potassium', titleAr: 'عزيق وتسميد بوتاسيوم', daysAfterSowing: 35, type: 'fertilization', fertilizerInfo: { type: 'سلفات بوتاسيوم', amountPerFeddanKg: 50 } },
      { id: 'p_4', title: 'Third Irrigation & Nitrogen', titleAr: 'رية ثالثة', daysAfterSowing: 45, type: 'irrigation', fertilizerInfo: { type: 'نترات نشادر', amountPerFeddanKg: 100 } },
      { id: 'p_5', title: 'Fourth Irrig & Hilling', titleAr: 'رية رابعة وتغطية (صب الدرنات)', daysAfterSowing: 60, type: 'irrigation', fertilizerInfo: { type: 'سلفات بوتاسيوم', amountPerFeddanKg: 50 } },
      { id: 'p_6', title: 'Stop Irrigation', titleAr: 'توقف الري (للنضج الكامل)', daysAfterSowing: 100, type: 'irrigation' },
      { id: 'p_7', title: 'Harvest', titleAr: 'الحصاد', daysAfterSowing: 115, type: 'harvest' }
    ]
  },
  {
    cropType: 'alfalfa',
    nameAr: 'البرسيم المسقاوي',
    milestones: [
      { id: 'a_1', title: 'Sowing & Phos Fert', titleAr: 'الزراعة والتجهيز (أكتوبر/نوفمبر)', daysAfterSowing: 0, type: 'fertilization', fertilizerInfo: { type: 'سوبر فوسفات ناعم', amountPerFeddanKg: 150 } },
      { id: 'a_2', title: 'Mohaya Irrigation', titleAr: 'رية المحاياة (تنشيطية العقد الجذرية)', daysAfterSowing: 15, type: 'irrigation', fertilizerInfo: { type: 'يوريا (تنشيطي)', amountPerFeddanKg: 20 } },
      { id: 'a_3', title: 'First Cut', titleAr: 'الحشة الأولى', daysAfterSowing: 60, type: 'harvest' },
      { id: 'a_4', title: 'Post-Cut Irrigation', titleAr: 'ري بعد الحشة الأولى', daysAfterSowing: 65, type: 'irrigation' },
      { id: 'a_5', title: 'Second Cut', titleAr: 'الحشة الثانية', daysAfterSowing: 100, type: 'harvest' },
      { id: 'a_6', title: 'Post-Second Cut Irrig', titleAr: 'ري بعد الحشة الثانية', daysAfterSowing: 105, type: 'irrigation' },
      { id: 'a_7', title: 'Third Cut', titleAr: 'الحشة الثالثة', daysAfterSowing: 140, type: 'harvest' },
      { id: 'a_8', title: 'Final Cut/Seed', titleAr: 'الحشة الأخيره/ترك للرباية', daysAfterSowing: 175, type: 'harvest' }
    ]
  },
  {
    cropType: 'beans',
    nameAr: 'الفاصوليا البيضاء',
    milestones: [
      { id: 'b_1', title: 'Sowing & Base Fert', titleAr: 'زراعة ورية الزراعة', daysAfterSowing: 0, type: 'fertilization', fertilizerInfo: { type: 'تلقيح بكتيري + سوبر فوسفات', amountPerFeddanKg: 150 } },
      { id: 'b_2', title: 'Mohaya Irrigation', titleAr: 'رية المحاياة (تنشيط)', daysAfterSowing: 21, type: 'irrigation', fertilizerInfo: { type: 'نترات نشادر', amountPerFeddanKg: 50 } },
      { id: 'b_3', title: 'Second Irrigation', titleAr: 'الرية الثانية (بداية التزهير)', daysAfterSowing: 35, type: 'irrigation' },
      { id: 'b_4', title: 'Third Irrigation', titleAr: 'الرية الثالثة (تكون العقد)', daysAfterSowing: 50, type: 'irrigation', fertilizerInfo: { type: 'سلفات بوتاسيوم', amountPerFeddanKg: 24 } },
      { id: 'b_5', title: 'Fourth Irrigation', titleAr: 'الرية الرابعة', daysAfterSowing: 65, type: 'irrigation' },
      { id: 'b_6', title: 'Harvest', titleAr: 'الحصاد وتقليع الفاصوليا', daysAfterSowing: 90, type: 'harvest' }
    ]
  }
];

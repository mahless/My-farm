import { CropBestPractice } from '../types';

// بيانات معتمدة ومحدثة من مركز البحوث الزراعية (ARC) للتربة الطينية السمراء في الدلتا (جيدة الصرف)
// تتميز التربة الطينية باحتفاظها بالرطوبة لفترات أطول، مما يباعد بين فترات الري مقارنة بالأراضي الرملية.
export const cropBestPractices: CropBestPractice[] = [
  {
    cropType: 'wheat',
    nameAr: 'القمح',
    milestones: [
      { id: 'w_m0', title: 'Baladi Fertilizer', titleAr: 'إضافة السماد البلدي (أثناء تجهيز الأرض للزراعة)', daysAfterSowing: 0, type: 'fertilization' },
      { id: 'w_m1', title: 'First Irrigation & Fert', titleAr: 'رية المحاياة + الدفعة الأولى آزوت', daysAfterSowing: 25, type: 'irrigation', fertilizerInfo: { type: 'يوريا 46.5% (يفضل في الرية الأولى لبطء تحلله)', amountPerFeddanKg: 75 } },
      { id: 'w_m2', title: 'Second Irrigation & Fert', titleAr: 'الرية الثانية + الدفعة الثانية والأخيرة آزوت', daysAfterSowing: 55, type: 'irrigation', fertilizerInfo: { type: 'نترات نشادر 33.5% (يفضل لسرعة امتصاصه)', amountPerFeddanKg: 100 } },
      { id: 'w_m3', title: 'Third Irrigation', titleAr: 'الرية الثالثة (مرحلة طرد السنابل)', daysAfterSowing: 85, type: 'irrigation' },
      { id: 'w_m4', title: 'Fourth Irrigation (Weaning)', titleAr: 'الرية الرابعة (رية الفطام - يراعى إيقاف الري قبل الحصاد)', daysAfterSowing: 115, type: 'irrigation' },
      { id: 'w_m5', title: 'Harvest', titleAr: 'الحصاد', daysAfterSowing: 155, type: 'harvest' },
    ],
  },
  {
    cropType: 'corn',
    nameAr: 'الذرة',
    milestones: [
      { id: 'c_m0', title: 'Baladi Fertilizer', titleAr: 'إضافة السماد البلدي (أثناء تجهيز الأرض)', daysAfterSowing: 0, type: 'fertilization' },
      { id: 'c_m1', title: 'Thinning & First Fert', titleAr: 'خف النباتات + الدفعة الأولى آزوت', daysAfterSowing: 18, type: 'fertilization', fertilizerInfo: { type: 'يوريا 46.5%', amountPerFeddanKg: 100 } },
      { id: 'c_m2', title: 'First Irrigation (Mohaya)', titleAr: 'رية المحاياة', daysAfterSowing: 21, type: 'irrigation' },
      { id: 'c_m3', title: 'Second Fert & Irrigation', titleAr: 'الدفعة الثانية آزوت + الرية الثانية', daysAfterSowing: 35, type: 'irrigation', fertilizerInfo: { type: 'نترات نشادر 33.5%', amountPerFeddanKg: 150 } },
      { id: 'c_m4', title: 'Third Irrigation', titleAr: 'الرية الثالثة', daysAfterSowing: 50, type: 'irrigation' },
      { id: 'c_m5', title: 'Fourth Irrigation', titleAr: 'الرية الرابعة (مرحلة التزهير)', daysAfterSowing: 65, type: 'irrigation' },
      { id: 'c_m6', title: 'Harvest', titleAr: 'الحصاد', daysAfterSowing: 115, type: 'harvest' },
    ],
  },
  {
    cropType: 'potato',
    nameAr: 'البطاطس',
    milestones: [
      { id: 'p_m0', title: 'Baladi Fertilizer', titleAr: 'إضافة السماد البلدي (أثناء تجهيز الأرض)', daysAfterSowing: 0, type: 'fertilization' },
      { id: 'p_m1', title: 'First Irrigation & Fert', titleAr: 'رية المحاياة + الدفعة الأولى آزوت', daysAfterSowing: 18, type: 'irrigation', fertilizerInfo: { type: 'نترات نشادر 33.5% (يمنع استخدام اليوريا للبطاطس)', amountPerFeddanKg: 150 } },
      { id: 'p_m2', title: 'Second Irrigation', titleAr: 'الرية الثانية', daysAfterSowing: 30, type: 'irrigation' },
      { id: 'p_m3', title: 'Third Irrigation & Potassium', titleAr: 'الرية الثالثة + إضافة البوتاسيوم', daysAfterSowing: 45, type: 'irrigation', fertilizerInfo: { type: 'سلفات بوتاسيوم (ضروري لتحجيم الدرنات)', amountPerFeddanKg: 50 } },
      { id: 'p_m4', title: 'Fourth Irrigation', titleAr: 'الرية الرابعة', daysAfterSowing: 60, type: 'irrigation' },
      { id: 'p_m5', title: 'Stop Irrigation', titleAr: 'التصويم (منع الري لزيادة صلابة القشرة)', daysAfterSowing: 95, type: 'irrigation' },
      { id: 'p_m6', title: 'Harvest', titleAr: 'الحصاد', daysAfterSowing: 110, type: 'harvest' },
    ],
  },
  {
    cropType: 'alfalfa',
    nameAr: 'البرسيم',
    milestones: [
      { id: 'a_m0', title: 'Super Phosphate', titleAr: 'إضافة سوبر فوسفات (أثناء تجهيز الأرض)', daysAfterSowing: 0, type: 'fertilization', fertilizerInfo: { type: 'سوبر فوسفات أحادي', amountPerFeddanKg: 150 } },
      { id: 'a_m1', title: 'First Irrigation', titleAr: 'رية المحاياة + جرعة تنشيطية', daysAfterSowing: 10, type: 'irrigation', fertilizerInfo: { type: 'نترات نشادر (جرعة تنشيطية فقط)', amountPerFeddanKg: 50 } },
      { id: 'a_m2', title: 'First Cut', titleAr: 'الحشة الأولى', daysAfterSowing: 45, type: 'harvest' },
      { id: 'a_m3', title: 'Irrigation after First Cut', titleAr: 'الري بعد الحشة الأولى', daysAfterSowing: 52, type: 'irrigation' },
      { id: 'a_m4', title: 'Second Cut', titleAr: 'الحشة الثانية', daysAfterSowing: 75, type: 'harvest' },
      { id: 'a_m5', title: 'Irrigation after Second Cut', titleAr: 'الري بعد الحشة الثانية', daysAfterSowing: 82, type: 'irrigation' },
      { id: 'a_m6', title: 'Third Cut', titleAr: 'الحشة الثالثة', daysAfterSowing: 105, type: 'harvest' },
      { id: 'a_m7', title: 'Irrigation after Third Cut', titleAr: 'الري بعد الحشة الثالثة', daysAfterSowing: 112, type: 'irrigation' },
      { id: 'a_m8', title: 'Fourth Cut', titleAr: 'الحشة الرابعة', daysAfterSowing: 135, type: 'harvest' },
    ],
  },
  {
    cropType: 'beans',
    nameAr: 'الفاصوليا البيضاء',
    milestones: [
      { id: 'b_m0', title: 'Sowing', titleAr: 'الزراعة ورية الزراعة', daysAfterSowing: 0, type: 'irrigation' },
      { id: 'b_m1', title: 'First Irrigation', titleAr: 'رية المحاياة والعزيق + الدفعة الأولى آزوت', daysAfterSowing: 18, type: 'irrigation', fertilizerInfo: { type: 'يوريا 46.5% أو نترات نشادر', amountPerFeddanKg: 50 } },
      { id: 'b_m2', title: 'Flowering', titleAr: 'بداية التزهير والرية الثانية', daysAfterSowing: 35, type: 'irrigation', fertilizerInfo: { type: 'سلفات بوتاسيوم', amountPerFeddanKg: 25 } },
      { id: 'b_m3', title: 'Pod Formation', titleAr: 'تكوين القرون والرية الثالثة', daysAfterSowing: 55, type: 'irrigation' },
      { id: 'b_m4', title: 'Pod Filling', titleAr: 'امتلاء القرون والرية الأخيرة', daysAfterSowing: 75, type: 'irrigation' },
      { id: 'b_m5', title: 'Harvest', titleAr: 'الحصاد والتقليع', daysAfterSowing: 100, type: 'harvest' },
    ],
  },
];

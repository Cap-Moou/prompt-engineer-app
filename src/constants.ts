import { CategoryKey } from './types';

export const IMAGE_MODELS = [
  "GOOGLE NANO BANANA PRO",
  "GOOGLE NANO BANANA2",
  "SEEDREAM 5 LITE",
  "SEEDREAM 4.5",
  "FLUX.2 PRO",
  "FLUX.2 MAX",
  "FLUX.2 FLEX",
  "CINEMATIC"
];

export const VIDEO_MODELS = [
  "SEEDANCE 2.0",
  "SEEDANCE 2.0 FAST",
  "SEEDANCE 1.5 PRO",
  "KLING 3.0",
  "KLING 3.0 MOTION CONTROL",
  "GROK",
  "GROK 4.1",
  "KLING 2.6",
  "KLING 2.6 MOTION CONTROL",
  "KLING 2.5",
  "GOOGLE VEO 3.1",
  "GOOGLE VEO 3.1 FAST",
  "GOOGLE VEO 3.1 LITE",
  "RUNWAY GEN-4.5",
  "RUNWAY ACT TWO",
  "PIXVERSE 6",
  "PIXVERSE 5.5",
  "WAN 2.6",
  "HAILUO 2.3"
];

export const CATEGORIES: Record<CategoryKey, { titleAr: string; titleEn: string; options: { ar: string; en: string }[] }> = {
  videoStyle: {
    titleAr: 'ستايل الفيديو (Video Style)',
    titleEn: 'Video Style',
    options: [
      { ar: 'واقعي فائق', en: 'Ultra Realistic' },
      { ar: 'ديزني بيكسار', en: 'Disney Pixar' },
      { ar: 'كرتوني 3D', en: '3D Cartoon' },
      { ar: 'أنمي ياباني', en: 'Japanese Anime' },
      { ar: 'سايبربانك', en: 'Cyberpunk' },
      { ar: 'سريالي', en: 'Surreal' },
      { ar: 'وثائقي', en: 'Documentary' },
      { ar: 'رسم زيتي', en: 'Oil Painting' },
      { ar: 'فن الطين', en: 'Claymation' },
      { ar: 'ستوب موشن', en: 'Stop Motion' },
      { ar: 'بكسل آرت', en: 'Pixel Art' },
      { ar: 'ريترو VHS', en: 'Retro VHS' }
    ]
  },
  environment: {
    titleAr: 'وصف المشهد والجو العام (Environment)',
    titleEn: 'Environment',
    options: [
      { ar: 'نهاري مشمس', en: 'Sunny Day' },
      { ar: 'غروب ذهبي', en: 'Golden Sunset' },
      { ar: 'ليل نيون', en: 'Neon Night' },
      { ar: 'ممطر', en: 'Rainy' },
      { ar: 'ضبابي', en: 'Foggy' },
      { ar: 'عاصفة ثلجية', en: 'Blizzard' },
      { ar: 'فضاء', en: 'Space' },
      { ar: 'غابة سحرية', en: 'Magical Forest' },
      { ar: 'بيئة تراثية', en: 'Heritage Environment' },
      { ar: 'بيئة مستقبلية', en: 'Futuristic Environment' },
      { ar: 'داخل غرفة', en: 'Indoors' },
      { ar: 'تحت الماء', en: 'Underwater' }
    ]
  },
  cameraMotion: {
    titleAr: 'حركة الكاميرا (Camera Motion)',
    titleEn: 'Camera Motion',
    options: [
      { ar: 'Cinematic Pan', en: 'Cinematic Pan' },
      { ar: 'Tilt Up/Down', en: 'Tilt Up/Down' },
      { ar: 'Dolly Zoom', en: 'Dolly Zoom' },
      { ar: 'Drone Orbit', en: 'Drone Orbit' },
      { ar: 'Tracking Shot', en: 'Tracking Shot' },
      { ar: 'Crane Shot', en: 'Crane Shot' },
      { ar: 'Handheld Shake', en: 'Handheld Shake' },
      { ar: 'Bird’s Eye View', en: 'Bird’s Eye View' },
      { ar: 'Dutch Angle', en: 'Dutch Angle' },
      { ar: 'First-Person POV', en: 'First-Person POV' }
    ]
  },
  lighting: {
    titleAr: 'هندسة الإضاءة (Lighting)',
    titleEn: 'Lighting',
    options: [
      { ar: 'إضاءة ريم Rim Lighting', en: 'Rim Lighting' },
      { ar: 'إضاءة درامية Chiaroscuro', en: 'Dramatic Chiaroscuro' },
      { ar: 'ألوان نيون', en: 'Neon Colors' },
      { ar: 'ضوء القمر', en: 'Moonlight' },
      { ar: 'إضاءة استوديو ناعمة', en: 'Soft Studio Lighting' },
      { ar: 'إضاءة شروق الشمس', en: 'Sunrise Lighting' },
      { ar: 'إضاءة شموع', en: 'Candlelight' },
      { ar: 'إضاءة علوية حادة', en: 'Harsh Overhead Lighting' }
    ]
  },
  visualVfx: {
    titleAr: 'المؤثرات البصرية (Visual VFX)',
    titleEn: 'Visual VFX',
    options: [
      { ar: 'غبار متطاير', en: 'Flying Dust' },
      { ar: 'شرر نار', en: 'Fire Sparks' },
      { ar: 'وهج عدسة Lens Flare', en: 'Lens Flare' },
      { ar: 'دخان كثيف', en: 'Thick Smoke' },
      { ar: 'أمطار رقمية', en: 'Digital Rain' },
      { ar: 'انفجارات بطيئة', en: 'Slow Explosions' },
      { ar: 'تسريب ضوئي', en: 'Light Leaks' },
      { ar: 'انعكاسات زجاجية', en: 'Glass Reflections' },
      { ar: 'تشوه زمني', en: 'Time Distortion' }
    ]
  },
  soundSfx: {
    titleAr: 'المؤثرات الصوتية (Sound SFX)',
    titleEn: 'Sound SFX',
    options: [
      { ar: 'أصوات طبيعة', en: 'Nature Sounds' },
      { ar: 'ضجيج مدينة', en: 'City Noise' },
      { ar: 'موسيقى ملحمية', en: 'Epic Music' },
      { ar: 'خيال علمي', en: 'Sci-Fi' },
      { ar: 'صمت درامي', en: 'Dramatic Silence' },
      { ar: 'أصوات محيطية 8D', en: '8D Spatial Audio' },
      { ar: 'تأثيرات حركية', en: 'Movement Effects' }
    ]
  },
  dialect: {
    titleAr: 'الحوار واللهجة (Dialect)',
    titleEn: 'Dialect',
    options: [
      { ar: 'الفصحى', en: 'Modern Standard Arabic' },
      { ar: 'مصرية', en: 'Egyptian' },
      { ar: 'سعودية', en: 'Saudi' },
      { ar: 'إماراتية', en: 'Emirati' },
      { ar: 'عراقية', en: 'Iraqi' },
      { ar: 'لبنانية', en: 'Lebanese' },
      { ar: 'كويتية', en: 'Kuwaiti' },
      { ar: 'أردنية', en: 'Jordanian' },
      { ar: 'مغربية', en: 'Moroccan' },
      { ar: 'جزائرية', en: 'Algerian' },
      { ar: 'تونسية', en: 'Tunisian' },
      { ar: 'ليبية', en: 'Libyan' },
      { ar: 'سودانية', en: 'Sudanese' },
      { ar: 'يمنية', en: 'Yemeni' },
      { ar: 'إنجليزية', en: 'English' },
      { ar: 'فرنسية', en: 'French' }
    ]
  }
};

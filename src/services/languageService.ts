/* ═══════════════════════════════════════════════════════════════════ */
/* ── AURA LIVE VOICE CHAT — REAL-TIME LOCALIZATION & I18N SERVICE ── */
/* ═══════════════════════════════════════════════════════════════════ */

export interface SupportedLanguage {
  code: string; // 'en' | 'ur' | 'ar' | 'bn' | 'hi' | 'es' | 'fr' | 'tr'
  locale: string; // 'en_US' | 'ur_PK' | etc.
  name: string; // English name: 'English (US)'
  nativeName: string; // Native name: 'اردو'
  flag: string; // Emoji or country flag
  direction: 'ltr' | 'rtl';
  isEnabled: boolean;
  sortOrder: number;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    code: 'en',
    locale: 'en_US',
    name: 'English (US)',
    nativeName: 'English (US)',
    flag: '🇺🇸',
    direction: 'ltr',
    isEnabled: true,
    sortOrder: 1,
  },
  {
    code: 'ur',
    locale: 'ur_PK',
    name: 'Urdu',
    nativeName: 'اردو',
    flag: '🇵🇰',
    direction: 'rtl',
    isEnabled: true,
    sortOrder: 2,
  },
  {
    code: 'ar',
    locale: 'ar_SA',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    direction: 'rtl',
    isEnabled: true,
    sortOrder: 3,
  },
  {
    code: 'bn',
    locale: 'bn_BD',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇧🇩',
    direction: 'ltr',
    isEnabled: true,
    sortOrder: 4,
  },
  {
    code: 'hi',
    locale: 'hi_IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    direction: 'ltr',
    isEnabled: true,
    sortOrder: 5,
  },
  {
    code: 'es',
    locale: 'es_ES',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    direction: 'ltr',
    isEnabled: true,
    sortOrder: 6,
  },
  {
    code: 'fr',
    locale: 'fr_FR',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    direction: 'ltr',
    isEnabled: true,
    sortOrder: 7,
  },
  {
    code: 'tr',
    locale: 'tr_TR',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    direction: 'ltr',
    isEnabled: true,
    sortOrder: 8,
  },
];

/* ── 📚 CENTRAL TRANSLATION DICTIONARIES ── */
export const TRANSLATION_DICTIONARIES: Record<string, Record<string, string>> = {
  en: {
    // Top Bar & Common
    'app.name': 'Auralive',
    'common.back': 'Back',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.online': 'Online',
    'common.offline': 'Offline',
    'common.typing': 'typing...',
    'common.search': 'Search',
    'common.unread': 'Unread',
    'common.send': 'Send',
    'common.delete': 'Delete',
    'common.logout': 'Log Out',
    'common.version': 'Version 2.4.1 (Premium)',

    // Settings
    'settings.title': 'Settings',
    'settings.account_security': 'Account Security',
    'settings.privacy_controls': 'Privacy Controls',
    'settings.notifications': 'Notification Settings',
    'settings.language': 'Select Language',
    'settings.theme': 'Luxury Visual Theme',
    'settings.help': 'Help & Support',

    // Select Language
    'language.select_title': 'Select Language',
    'language.app_languages': 'App Languages',
    'language.changed_success': 'Language changed successfully to {language}.',
    'language.restart_notice': 'All screens and layout directions updated in real-time.',

    // Privacy Controls
    'privacy.title': 'Privacy Controls',
    'privacy.visibility_status': 'Visibility & Status',
    'privacy.hide_online': 'Hide Online Status',
    'privacy.hide_online_desc': 'Hide your green presence indicator across chat, profile, and discovery feeds.',
    'privacy.hide_distance': 'Hide Nearby Distance',
    'privacy.hide_distance_desc': 'Prevent your precise distance from displaying in Moments and nearby searches.',
    'privacy.hide_vip': 'Hide Noble / VIP Badge',
    'privacy.hide_vip_desc': 'Conceal VIP and Noble level badge while maintaining full account tier benefits.',
    'privacy.blocked_users': 'Blocked Users List',
    'privacy.muted_users': 'Muted Users List',
    'privacy.unblock': 'Unblock',
    'privacy.unmute': 'Unmute',

    // Notifications
    'notifications.title': 'Notification Settings',
    'notifications.push_alerts': 'Push Alerts',
    'notifications.following_live': 'Following Live Alerts',
    'notifications.following_live_desc': 'Receive push alerts when broadcasters you follow start a live stream.',
    'notifications.direct_messages': 'Direct Messages',
    'notifications.direct_messages_desc': 'Get notified when friends send you 1-on-1 chat messages.',
    'notifications.gift_alerts': 'Gift Received Alerts',
    'notifications.gift_alerts_desc': 'Alerts when other users send you virtual gifts and diamonds.',
    'notifications.sound_vibration': 'Sound & Vibration',
    'notifications.sound_vibration_desc': 'Play audio chimes and haptic pulses for incoming alerts.',
    'notifications.history': 'Notification Center',

    // Chat & Messages
    'chat.title': 'Messages',
    'chat.type_message': 'Type a message...',
    'chat.voice_note': 'Hold to record voice note',
    'chat.send_gift': 'Send Gift',
    'chat.block_user': 'Block User',
    'chat.unblock_user': 'Unblock User',

    // Live Room
    'live.title': 'Live Voice Lounge',
    'live.join': 'Join Room',
    'live.leave': 'Leave Room',
    'live.host': 'Host',
    'live.followers': 'Followers',
    'live.fans': 'Fans',
  },

  ur: {
    // Top Bar & Common
    'app.name': 'آورا لائیو',
    'common.back': 'واپس',
    'common.save': 'محفوظ کریں',
    'common.cancel': 'منسوخ کریں',
    'common.close': 'بند کریں',
    'common.confirm': 'تصدیق کریں',
    'common.online': 'آن لائن',
    'common.offline': 'آف لائن',
    'common.typing': 'ٹائپ کر رہے ہیں...',
    'common.search': 'تلاش کریں',
    'common.unread': 'نہ پڑھے گئے',
    'common.send': 'ارسال کریں',
    'common.delete': 'حذف کریں',
    'common.logout': 'لاگ آؤٹ',
    'common.version': 'ورژن 2.4.1 (پریمیم)',

    // Settings
    'settings.title': 'ترتیبات (Settings)',
    'settings.account_security': 'اکاؤنٹ سیکیورٹی',
    'settings.privacy_controls': 'پرائیویسی کنٹرولز',
    'settings.notifications': 'اطلاعات کی ترتیبات',
    'settings.language': 'زبان منتخب کریں (Select Language)',
    'settings.theme': 'پرتعیش تھیم',
    'settings.help': 'مدد اور رہنمائی',

    // Select Language
    'language.select_title': 'زبان منتخب کریں (Select Language)',
    'language.app_languages': 'ایپلی کیشن کی زبانیں',
    'language.changed_success': 'زبان کامیابی کے ساتھ {language} میں تبدیل کر دی گئی۔',
    'language.restart_notice': 'تمام اسکرینز اور لے آؤٹ ڈائریکشن فوری طور پر اپڈیٹ ہو گئے۔',

    // Privacy Controls
    'privacy.title': 'پرائیویسی کنٹرولز',
    'privacy.visibility_status': 'حیثیت اور مرئیت',
    'privacy.hide_online': 'آن لائن اسٹیٹس چھپائیں',
    'privacy.hide_online_desc': 'چیٹ، پروفائل اور ڈسکوری فیڈز میں اپنا سبز ایکٹو انڈیکیٹر چھپائیں۔',
    'privacy.hide_distance': 'قریبی فاصلہ چھپائیں',
    'privacy.hide_distance_desc': 'مومنٹس اور قریبی سرچ میں اپنا درست فاصلہ ظاہر ہونے سے روکیں۔',
    'privacy.hide_vip': 'نوبل / وی آئی پی بیج چھپائیں',
    'privacy.hide_vip_desc': 'اکاؤنٹ کے مکمل مراعات برقرار رکھتے ہوئے عوامی سطح پر بیج چھپائیں۔',
    'privacy.blocked_users': 'بلاک شدہ صارفین کی فہرست',
    'privacy.muted_users': 'میوٹ شدہ صارفین کی فہرست',
    'privacy.unblock': 'ان بلاک کریں',
    'privacy.unmute': 'ان میوٹ کریں',

    // Notifications
    'notifications.title': 'اطلاعات کی ترتیبات',
    'notifications.push_alerts': 'پش الرٹس',
    'notifications.following_live': 'فالو کردہ ہوسٹ لائیو الرٹس',
    'notifications.following_live_desc': 'جب آپ کا فالو کردہ براڈکاسٹر لائیو آئے تو پش الرٹ حاصل کریں۔',
    'notifications.direct_messages': 'براہ راست پیغامات',
    'notifications.direct_messages_desc': 'جب دوست آپ کو ون آن ون چیٹ میسج بھیجیں تو مطلع ہوں۔',
    'notifications.gift_alerts': 'تحفہ موصولی الرٹس',
    'notifications.gift_alerts_desc': 'جب دیگر صارفین آپ کو ڈائمنڈز اور تحائف بھیجیں تو الرٹ موصول ہوں۔',
    'notifications.sound_vibration': 'آواز اور وائبریشن',
    'notifications.sound_vibration_desc': 'آنے والی اطلاعات کے لیے آڈیو چائم اور وائبریشن فعال کریں۔',
    'notifications.history': 'اطلاعاتی مرکز',

    // Chat & Messages
    'chat.title': 'پیغامات',
    'chat.type_message': 'پیغام لکھیں...',
    'chat.voice_note': 'آواز ریکارڈ کرنے کے لیے دبا کر رکھیں',
    'chat.send_gift': 'تحفہ بھیجیں',
    'chat.block_user': 'صارف کو بلاک کریں',
    'chat.unblock_user': 'صارف کو ان بلاک کریں',

    // Live Room
    'live.title': 'لائیو وائس لاؤنج',
    'live.join': 'روم میں شامل ہوں',
    'live.leave': 'روم سے نکلیں',
    'live.host': 'ہوسٹ',
    'live.followers': 'فالورز',
    'live.fans': 'مداح',
  },

  ar: {
    // Top Bar & Common
    'app.name': 'أورا لايف',
    'common.back': 'رجوع',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.close': 'إغلاق',
    'common.confirm': 'تأكيد',
    'common.online': 'متصل الآن',
    'common.offline': 'غير متصل',
    'common.typing': 'يكتب الآن...',
    'common.search': 'بحث',
    'common.unread': 'غير مقروء',
    'common.send': 'إرسال',
    'common.delete': 'حذف',
    'common.logout': 'تسجيل الخروج',
    'common.version': 'الإصدار 2.4.1 (المميز)',

    // Settings
    'settings.title': 'الإعدادات',
    'settings.account_security': 'أمان الحساب',
    'settings.privacy_controls': 'عناصر التحكم في الخصوصية',
    'settings.notifications': 'إعدادات الإشعارات',
    'settings.language': 'اختيار اللغة',
    'settings.theme': 'المظهر الفاخر',
    'settings.help': 'المساعدة والدعم',

    // Select Language
    'language.select_title': 'اختيار اللغة (Select Language)',
    'language.app_languages': 'لغات التطبيق',
    'language.changed_success': 'تم تغيير اللغة بنجاح إلى {language}.',
    'language.restart_notice': 'تم تحديث جميع الشاشات واتجاه التنسيق فوريًا.',

    // Privacy Controls
    'privacy.title': 'عناصر التحكم في الخصوصية',
    'privacy.visibility_status': 'الحالة والرؤية',
    'privacy.hide_online': 'إخفاء حالة الاتصال',
    'privacy.hide_online_desc': 'إخفاء نقطة الاتصال الخضراء في المحادثات والملف الشخصي.',
    'privacy.hide_distance': 'إخفاء المسافة القريبة',
    'privacy.hide_distance_desc': 'منع ظهور المسافة الدقيقة في اللحظات وعمليات البحث.',
    'privacy.hide_vip': 'إخفاء شارة النبلاء / VIP',
    'privacy.hide_vip_desc': 'إخفاء الشارة مع الاحتفاظ بكافة مزايا المستوى.',
    'privacy.blocked_users': 'قائمة المحظورين',
    'privacy.muted_users': 'قائمة المكتومين',
    'privacy.unblock': 'إلغاء الحظر',
    'privacy.unmute': 'إلغاء الكتم',

    // Notifications
    'notifications.title': 'إعدادات الإشعارات',
    'notifications.push_alerts': 'التنبيهات الفورية',
    'notifications.following_live': 'تنبيهات البث المباشر للمتابعين',
    'notifications.following_live_desc': 'تلقي تنبيهات عند بدء المضيفين المتابعين للبث.',
    'notifications.direct_messages': 'الرسائل المباشرة',
    'notifications.direct_messages_desc': 'إشعارات عند تلقي رسائل دردشة خاصة جديدة.',
    'notifications.gift_alerts': 'تنبيهات استلام الهدايا',
    'notifications.gift_alerts_desc': 'تنبيه عند إرسال المستخدمين هدايا وماسات إليك.',
    'notifications.sound_vibration': 'الصوت والاهتزاز',
    'notifications.sound_vibration_desc': 'تشغيل الرنين ونبضات الاهتزاز للإشعارات الواردة.',
    'notifications.history': 'مركز الإشعارات',

    // Chat & Messages
    'chat.title': 'الرسائل',
    'chat.type_message': 'اكتب رسالة...',
    'chat.voice_note': 'اضغط باستمرار لتسجيل صوتي',
    'chat.send_gift': 'إرسال هدية',
    'chat.block_user': 'حظر المستخدم',
    'chat.unblock_user': 'إلغاء حظر المستخدم',

    // Live Room
    'live.title': 'غرفة الصوت المباشرة',
    'live.join': 'انضم للغرفة',
    'live.leave': 'مغادرة الغرفة',
    'live.host': 'المضيف',
    'live.followers': 'المتابعون',
    'live.fans': 'المعجبون',
  },

  bn: {
    'app.name': 'অরালিস্ট লাইভ',
    'common.back': 'ফিরে যান',
    'common.save': 'সংরক্ষণ করুন',
    'common.cancel': 'বাতিল করুন',
    'common.close': 'বন্ধ করুন',
    'common.confirm': 'নিশ্চিত করুন',
    'common.online': 'অনলাইন',
    'common.offline': 'অফলাইন',
    'common.search': 'অনুসন্ধান করুন',
    'common.send': 'পাঠান',
    'common.delete': 'মুছুন',
    'common.logout': 'লগআউট',
    'settings.title': 'সেটিংস',
    'settings.language': 'ভাষা নির্বাচন করুন',
    'language.select_title': 'ভাষা নির্বাচন করুন (Select Language)',
    'language.app_languages': 'অ্যাপের ভাষাসমূহ',
    'language.changed_success': 'ভাষা সফলভাবে {language}-এ পরিবর্তিত হয়েছে।',
    'chat.title': 'বার্তা',
    'chat.type_message': 'একটি বার্তা লিখুন...',
  },

  hi: {
    'app.name': 'ऑरा लाइव',
    'common.back': 'वापस',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.close': 'बंद करें',
    'common.confirm': 'पुष्टि करें',
    'common.online': 'ऑनलाइन',
    'common.offline': 'ऑफ़लाइन',
    'common.search': 'खोजें',
    'common.send': 'भेजें',
    'common.delete': 'हटाएं',
    'common.logout': 'लॉग आउट',
    'settings.title': 'सेटिंग्स',
    'settings.language': 'भाषा चुनें',
    'language.select_title': 'भाषा चुनें (Select Language)',
    'language.app_languages': 'ऐप भाषाएँ',
    'language.changed_success': 'भाषा सफलतापूर्वक {language} में बदल दी गई।',
    'chat.title': 'संदेश',
    'chat.type_message': 'संदेश लिखें...',
  },

  es: {
    'app.name': 'Auralive',
    'common.back': 'Atrás',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.close': 'Cerrar',
    'common.confirm': 'Confirmar',
    'common.online': 'En línea',
    'common.offline': 'Desconectado',
    'common.search': 'Buscar',
    'common.send': 'Enviar',
    'common.delete': 'Eliminar',
    'common.logout': 'Cerrar sesión',
    'settings.title': 'Ajustes',
    'settings.language': 'Seleccionar idioma',
    'language.select_title': 'Seleccionar idioma (Select Language)',
    'language.app_languages': 'Idiomas de la aplicación',
    'language.changed_success': 'Idioma cambiado con éxito a {language}.',
    'chat.title': 'Mensajes',
    'chat.type_message': 'Escribe un mensaje...',
  },

  fr: {
    'app.name': 'Auralive',
    'common.back': 'Retour',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.close': 'Fermer',
    'common.confirm': 'Confirmer',
    'common.online': 'En ligne',
    'common.offline': 'Hors ligne',
    'common.search': 'Rechercher',
    'common.send': 'Envoyer',
    'common.delete': 'Supprimer',
    'common.logout': 'Déconnexion',
    'settings.title': 'Paramètres',
    'settings.language': 'Choisir la langue',
    'language.select_title': 'Choisir la langue (Select Language)',
    'language.app_languages': "Langues de l'application",
    'language.changed_success': 'Langue changée avec succès en {language}.',
    'chat.title': 'Messages',
    'chat.type_message': 'Écrivez un message...',
  },

  tr: {
    'app.name': 'Auralive',
    'common.back': 'Geri',
    'common.save': 'Kaydet',
    'common.cancel': 'İptal',
    'common.close': 'Kapat',
    'common.confirm': 'Onayla',
    'common.online': 'Çevrimiçi',
    'common.offline': 'Çevrimdışı',
    'common.search': 'Ara',
    'common.send': 'Gönder',
    'common.delete': 'Sil',
    'common.logout': 'Çıkış Yap',
    'settings.title': 'Ayarlar',
    'settings.language': 'Dil Seçin',
    'language.select_title': 'Dil Seçin (Select Language)',
    'language.app_languages': 'Uygulama Dilleri',
    'language.changed_success': 'Dil başarıyla {language} olarak değiştirildi.',
    'chat.title': 'Mesajlar',
    'chat.type_message': 'Bir mesaj yazın...',
  },
};

const STORAGE_KEY = 'AURALIVE_LANGUAGE_DB_V2';
const CHANNEL_NAME = 'AURALIVE_LANGUAGE_CHANNEL_V2';

/* ── 🚀 LANGUAGE & LOCALIZATION CLASS ── */
class LanguageEngineService {
  private currentLanguageCode: string = 'en';
  private supportedLanguages: SupportedLanguage[] = [...SUPPORTED_LANGUAGES];
  private customTranslations: Record<string, Record<string, string>> = {};
  private listeners: Set<() => void> = new Set();
  private channel: BroadcastChannel | null = null;

  constructor() {
    this.initBroadcast();
    this.load();
    this.applyDirection();
  }

  private initBroadcast() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'LANGUAGE_SYNC') {
            this.load();
            this.applyDirection();
            this.notify(false);
          }
        };
      } catch (e) {
        console.warn('Language BroadcastChannel init failed', e);
      }
    }
  }

  private notify(broadcast: boolean = true) {
    this.save();
    this.applyDirection();
    if (broadcast && this.channel) {
      try {
        this.channel.postMessage({ type: 'LANGUAGE_SYNC', timestamp: Date.now() });
      } catch (e) {
        console.error(e);
      }
    }
    this.listeners.forEach(fn => {
      try { fn(); } catch (e) { console.error(e); }
    });
  }

  private load() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.currentLanguageCode) {
            this.currentLanguageCode = parsed.currentLanguageCode;
          }
          if (parsed.supportedLanguages) {
            this.supportedLanguages = parsed.supportedLanguages;
          }
          if (parsed.customTranslations) {
            this.customTranslations = parsed.customTranslations;
          }
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load language database', e);
    }
    this.currentLanguageCode = 'en';
    this.supportedLanguages = [...SUPPORTED_LANGUAGES];
    this.save();
  }

  private save() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const payload = {
          currentLanguageCode: this.currentLanguageCode,
          supportedLanguages: this.supportedLanguages,
          customTranslations: this.customTranslations,
          lastUpdated: new Date().toISOString(),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (e) {
      console.warn('Failed to save language database', e);
    }
  }

  private applyDirection() {
    if (typeof document !== 'undefined' && document.documentElement) {
      const current = this.getCurrentLanguage();
      document.documentElement.dir = current.direction;
      document.documentElement.lang = current.code;
    }
  }

  /* ── 1. LANGUAGE QUERIES & SWITCHING ── */
  public getSupportedLanguages(): SupportedLanguage[] {
    return [...this.supportedLanguages];
  }

  public getCurrentLanguageCode(): string {
    return this.currentLanguageCode;
  }

  public getCurrentLanguage(): SupportedLanguage {
    const found = this.supportedLanguages.find(l => l.code === this.currentLanguageCode && l.isEnabled);
    return found || this.supportedLanguages[0];
  }

  public isRTL(): boolean {
    return this.getCurrentLanguage().direction === 'rtl';
  }

  public setLanguage(code: string): SupportedLanguage {
    const target = this.supportedLanguages.find(l => l.code === code && l.isEnabled);
    if (!target) {
      console.warn(`Language ${code} is not supported or disabled.`);
      return this.getCurrentLanguage();
    }

    this.currentLanguageCode = code;
    this.notify(true);
    return target;
  }

  /* ── 2. TRANSLATION STRING RESOLVER WITH SAFE FALLBACK & VARIABLES ── */
  public t(key: string, variables?: Record<string, string | number>): string {
    const lang = this.currentLanguageCode;
    
    // Check Custom Admin Override -> Language Dictionary -> English Fallback -> Raw Key
    let template = 
      this.customTranslations[lang]?.[key] || 
      TRANSLATION_DICTIONARIES[lang]?.[key] || 
      this.customTranslations['en']?.[key] || 
      TRANSLATION_DICTIONARIES['en']?.[key] || 
      key;

    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        template = template.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }

    return template;
  }

  /* ── 3. ADMIN LOCALIZATION MANAGEMENT ── */
  public toggleLanguageEnabled(code: string): boolean {
    const lang = this.supportedLanguages.find(l => l.code === code);
    if (lang && lang.code !== 'en') {
      lang.isEnabled = !lang.isEnabled;
      this.notify(true);
      return lang.isEnabled;
    }
    return true;
  }

  public updateTranslation(langCode: string, key: string, value: string): void {
    if (!this.customTranslations[langCode]) {
      this.customTranslations[langCode] = {};
    }
    this.customTranslations[langCode][key] = value;
    this.notify(true);
  }

  /* ── 4. REACTIVE SUBSCRIPTION ── */
  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const languageEngine = new LanguageEngineService();
export const t = (key: string, vars?: Record<string, string | number>) => languageEngine.t(key, vars);

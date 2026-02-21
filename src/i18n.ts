import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "home": "Home",
      "prayer": "Prayer",
      "quran": "Quran",
      "zakat": "Zakat",
      "profile": "Profile",
      "ramadhan_mode": "Marhaban Ya Ramadhan",
      "next_prayer": "Next Prayer",
      "fasting_countdown": "Iftar Countdown",
      "imsak_countdown": "Imsak Countdown",
      "daily_verse": "Daily Verse",
      "prayer_times": "Prayer Times",
      "calculate_zakat": "Calculate Zakat",
      "ai_fiqih": "AI Fiqih Assistant",
      "ibadah_tracker": "Ibadah Tracker",
      "settings": "Settings",
      "logout": "Logout",
      "login": "Login",
      "register": "Register"
    }
  },
  id: {
    translation: {
      "home": "Beranda",
      "prayer": "Jadwal Sholat",
      "quran": "Al-Qur'an",
      "zakat": "Zakat",
      "profile": "Profil",
      "ramadhan_mode": "Marhaban Ya Ramadhan",
      "next_prayer": "Sholat Berikutnya",
      "fasting_countdown": "Hitung Mundur Buka Puasa",
      "imsak_countdown": "Hitung Mundur Imsak",
      "daily_verse": "Ayat Hari Ini",
      "prayer_times": "Waktu Sholat",
      "calculate_zakat": "Hitung Zakat",
      "ai_fiqih": "Asisten AI Fiqih",
      "ibadah_tracker": "Pelacak Ibadah",
      "settings": "Pengaturan",
      "logout": "Keluar",
      "login": "Masuk",
      "register": "Daftar"
    }
  },
  ar: {
    translation: {
      "home": "الرئيسية",
      "prayer": "الصلاة",
      "quran": "القرآن",
      "zakat": "الزكاة",
      "profile": "الملف الشخصي",
      "ramadhan_mode": "مرحباً يا رمضان",
      "next_prayer": "الصلاة القادمة",
      "fasting_countdown": "تنازلي للإفطار",
      "imsak_countdown": "تنازلي للإمساك",
      "daily_verse": "آية اليوم",
      "prayer_times": "أوقات الصلاة",
      "calculate_zakat": "حساب الزكاة",
      "ai_fiqih": "مساعد الفقه الذكي",
      "ibadah_tracker": "متابع العبادات",
      "settings": "الإعدادات",
      "logout": "تسجيل الخروج",
      "login": "تسجيل الدخول",
      "register": "إنشاء حساب"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

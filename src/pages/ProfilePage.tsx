import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Globe, Shield, LogOut, ChevronRight, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="p-4 pb-24 space-y-6">
      <h1 className="text-2xl font-bold">{t('profile')}</h1>

      {/* User Card */}
      <div className="bg-primary p-6 rounded-3xl text-white flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
          <UserIcon size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold">{user?.name || 'Guest User'}</h2>
          <p className="text-sm opacity-80">{user?.email || 'Sign in to sync data'}</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-primary" />
              <span className="font-medium">Language</span>
            </div>
            <select 
              onChange={(e) => changeLanguage(e.target.value)}
              value={i18n.language}
              className="bg-transparent text-sm font-bold text-primary focus:outline-none"
            >
              <option value="en">English</option>
              <option value="id">Indonesia</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between" onClick={toggleTheme}>
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-primary" />
              <span className="font-medium">Dark Mode</span>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-gray-200'}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-primary" />
              <span className="font-medium">Privacy Policy</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>

        <button 
          onClick={logout}
          className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl font-bold flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          {t('logout')}
        </button>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-gray-400">Ramadhan Global v1.0.0</p>
        <p className="text-[10px] text-gray-400">Made with ❤️ for the Ummah</p>
      </div>
    </div>
  );
};

export default ProfilePage;

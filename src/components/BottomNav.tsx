import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Clock, BookOpen, Calculator, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BottomNav = () => {
  const { t } = useTranslation();

  const navItems = [
    { icon: Home, label: t('home'), path: '/' },
    { icon: Clock, label: t('prayer'), path: '/prayer' },
    { icon: BookOpen, label: t('quran'), path: '/quran' },
    { icon: Calculator, label: t('zakat'), path: '/zakat' },
    { icon: User, label: t('profile'), path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card-light dark:bg-card-dark border-t border-gray-200 dark:border-gray-800 px-2 py-2 flex justify-around items-center z-50 safe-area-bottom">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          <item.icon size={20} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;

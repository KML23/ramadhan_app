import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Bell, MapPin, Clock, Search, Navigation, X } from 'lucide-react';
import { getHijriDate } from '../lib/utils';
import { useTheme } from '../hooks/useTheme';
import { useLocation } from '../hooks/useLocation';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { location, setLocation, useCurrentLocation } = useLocation();
  const [hijri, setHijri] = useState<any>(null);
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    getHijriDate().then(setHijri);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatFullDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const dateString = date.toLocaleDateString(i18n.language, options);
    const timeString = date.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Get GMT offset
    const offset = -date.getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const gmtString = `GMT${offset >= 0 ? '+' : '-'}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    return { dateString, timeString, gmtString };
  };

  const { dateString, timeString, gmtString } = formatFullDate(currentTime);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${location.latitude}&longitude=${location.longitude}&method=2`);
        const data = await res.json();
        setPrayerTimes(data.data.timings);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };
    fetchPrayerTimes();
  }, [location]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`);
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const selectCity = (cityData: any) => {
    setLocation({
      city: cityData.display_name.split(',')[0],
      country: cityData.display_name.split(',').pop().trim(),
      latitude: parseFloat(cityData.lat),
      longitude: parseFloat(cityData.lon),
      isCustom: true,
    });
    setShowLocationPicker(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const isRamadhan = hijri?.month?.number === 9;

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-primary">Ramadhan Global</h1>
          <div className="mt-1 space-y-0.5">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {dateString}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="font-mono font-bold text-primary">{timeString}</span>
              <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{gmtString}</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">
              {hijri ? `${hijri.day} ${hijri.month.en} ${hijri.year}H` : 'Loading Hijri...'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-xl bg-white dark:bg-card-dark shadow-sm border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary transition-all active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="p-2.5 rounded-xl bg-white dark:bg-card-dark shadow-sm border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary transition-all active:scale-95">
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Ramadhan Banner */}
      {isRamadhan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary p-6 rounded-2xl text-white relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-1">{t('ramadhan_mode')}</h2>
            <p className="text-sm opacity-90">May your fasting be blessed.</p>
          </div>
          <div className="absolute right-[-20px] top-[-20px] opacity-20">
            <Moon size={120} />
          </div>
        </motion.div>
      )}

      {/* Prayer Times Card */}
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            {t('prayer_times')}
          </h3>
          <button 
            onClick={() => setShowLocationPicker(true)}
            className="text-xs text-primary font-medium flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg"
          >
            <MapPin size={12} /> {location.city}
          </button>
        </div>
        
        {prayerTimes ? (
          <div className="grid grid-cols-5 gap-2">
            {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => (
              <div key={p} className="flex flex-col items-center p-2 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                <span className="text-[10px] text-gray-500 uppercase">{p}</span>
                <span className="text-sm font-bold">{prayerTimes[p]}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-16 flex items-center justify-center text-gray-400">Loading times...</div>
        )}
      </div>

      {/* Daily Verse */}
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="font-semibold mb-3 text-sm text-gray-500 uppercase tracking-wider">{t('daily_verse')}</h3>
        <p className="arabic-text text-xl text-right mb-2 leading-loose">
          إِنَّ مَعَ الْعُسْرِ يُسْرًا
        </p>
        <p className="text-sm italic text-gray-600 dark:text-gray-400">
          "Indeed, with hardship [will be] ease." (Ash-Sharh: 6)
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50">
          <h4 className="font-bold text-primary mb-1">{t('ibadah_tracker')}</h4>
          <p className="text-xs text-blue-600 dark:text-blue-400">Track your daily progress</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
          <h4 className="font-bold text-emerald-600 dark:text-emerald-400">{t('ai_fiqih')}</h4>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">Ask anything about Fiqih</p>
        </div>
      </div>
      {/* Location Picker Modal */}
      <AnimatePresence>
        {showLocationPicker && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLocationPicker(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-white dark:bg-card-dark rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Set Location</h3>
                <button onClick={() => setShowLocationPicker(false)} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => { useCurrentLocation(); setShowLocationPicker(false); }}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20"
                >
                  <Navigation size={20} />
                  Use Current Location
                </button>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search city manually..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((result, i) => (
                    <button
                      key={i}
                      onClick={() => selectCity(result)}
                      className="w-full text-left p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    >
                      <p className="font-medium text-sm">{result.display_name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;

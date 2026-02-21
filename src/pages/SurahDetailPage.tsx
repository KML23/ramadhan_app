import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Play, Bookmark, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

const SurahDetailPage = () => {
  const { number } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [surah, setSurah] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        // Fetch Arabic text and English translation
        const [arRes, enRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani`),
          fetch(`https://api.alquran.cloud/v1/surah/${number}/editions/en.asad`)
        ]);
        
        const arData = await arRes.json();
        const enData = await enRes.json();

        setSurah({
          ...arData.data[0],
          englishAyahs: enData.data[0].ayahs
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching surah:', error);
      }
    };

    fetchSurah();
  }, [number]);

  if (loading) {
    return (
      <div className="p-4 flex flex-col gap-4">
        <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="pb-24 min-h-screen bg-gray-50 dark:bg-bg-dark">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="font-bold">{surah.englishName}</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{surah.revelationType} • {surah.numberOfAyahs} Ayahs</p>
        </div>
        <button className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
          <Bookmark size={20} />
        </button>
      </div>

      {/* Banner */}
      <div className="p-4">
        <div className="bg-primary p-8 rounded-3xl text-white text-center relative overflow-hidden shadow-lg shadow-primary/20">
          <h2 className="text-3xl font-bold mb-2">{surah.englishName}</h2>
          <p className="opacity-80 mb-4">{surah.englishNameTranslation}</p>
          <div className="h-[1px] w-24 bg-white/30 mx-auto mb-4" />
          <p className="arabic-text text-2xl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          
          <div className="absolute top-[-20px] left-[-20px] opacity-10">
            <Play size={120} />
          </div>
        </div>
      </div>

      {/* Ayahs */}
      <div className="p-4 space-y-6">
        {surah.ayahs.map((ayah: any, index: number) => (
          <motion.div
            key={ayah.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold">
                {ayah.numberInSurah}
              </div>
              <div className="flex gap-4 text-primary">
                <Share2 size={18} />
                <Play size={18} />
                <Bookmark size={18} />
              </div>
            </div>
            
            <p className="arabic-text text-3xl text-right leading-[2.5] mb-6 dark:text-gray-100">
              {ayah.text}
            </p>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {surah.englishAyahs[index].text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SurahDetailPage;

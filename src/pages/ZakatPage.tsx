import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, Info } from 'lucide-react';
import { motion } from 'motion/react';

const ZakatPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'fitrah' | 'maal' | 'emas'>('fitrah');
  const [amount, setAmount] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const val = parseFloat(amount);
    if (isNaN(val)) return;

    if (activeTab === 'fitrah') {
      // Assuming 3.5 liters or 2.5kg of rice, or equivalent money
      setResult(val * 45000); // Example price per person
    } else {
      setResult(val * 0.025);
    }
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      <h1 className="text-2xl font-bold">{t('zakat')}</h1>

      <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {(['fitrah', 'maal', 'emas'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setResult(null); setAmount(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            {activeTab === 'fitrah' ? 'Number of People' : 'Total Wealth Amount'}
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
        >
          <Calculator size={20} />
          {t('calculate_zakat')}
        </button>

        {result !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-primary/10 rounded-xl border border-primary/20 text-center"
          >
            <p className="text-sm text-primary font-medium mb-1">Total Zakat to Pay</p>
            <p className="text-3xl font-bold text-primary">
              {activeTab === 'fitrah' ? `Rp ${result.toLocaleString()}` : `Rp ${result.toLocaleString()}`}
            </p>
          </motion.div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex gap-3">
        <Info className="text-primary shrink-0" size={20} />
        <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
          {activeTab === 'fitrah' 
            ? "Zakat Fitrah is obligatory for every Muslim who has excess food for the day and night of Eid al-Fitr."
            : "Zakat Maal is 2.5% of your total wealth if it has reached the Nisab (threshold) and has been held for one lunar year (Hawl)."}
        </p>
      </div>
    </div>
  );
};

export default ZakatPage;

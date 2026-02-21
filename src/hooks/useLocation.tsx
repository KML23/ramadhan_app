import React, { createContext, useContext, useState, useEffect } from 'react';

interface Location {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  isCustom: boolean;
}

interface LocationContextType {
  location: Location;
  setLocation: (loc: Location) => void;
  useCurrentLocation: () => Promise<void>;
}

const defaultLocation: Location = {
  city: 'Jakarta',
  country: 'Indonesia',
  latitude: -6.2088,
  longitude: 106.8456,
  isCustom: false,
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<Location>(() => {
    const saved = localStorage.getItem('user_location');
    return saved ? JSON.parse(saved) : defaultLocation;
  });

  const setLocation = (loc: Location) => {
    setLocationState(loc);
    localStorage.setItem('user_location', JSON.stringify(loc));
  };

  const useCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await res.json();
          setLocation({
            city: data.city || data.locality || 'Unknown',
            country: data.countryName || 'Unknown',
            latitude,
            longitude,
            isCustom: false,
          });
        } catch (error) {
          setLocation({
            city: 'Current Location',
            country: '',
            latitude,
            longitude,
            isCustom: false,
          });
        }
      },
      (error) => {
        alert('Unable to retrieve your location: ' + error.message);
      }
    );
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, useCurrentLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within LocationProvider');
  return context;
};

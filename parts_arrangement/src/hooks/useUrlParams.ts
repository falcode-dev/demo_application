import { useState, useEffect } from 'react';
import { getPartsNumberFromUrl } from '../utils/navigation';

export const useUrlParams = () => {
  const [partsNumber, setPartsNumber] = useState<string | null>(null);

  useEffect(() => {
    const partsNum = getPartsNumberFromUrl();
    setPartsNumber(partsNum);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const partsNum = getPartsNumberFromUrl();
      setPartsNumber(partsNum);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return partsNumber;
};


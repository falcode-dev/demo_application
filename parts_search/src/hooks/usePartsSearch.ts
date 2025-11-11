import { useState } from 'react';
import { searchParts, type PartsSearchResult } from '../services/mockData';
import { openPartsDetail } from '../utils/navigation';

export const usePartsSearch = () => {
  const [bu, setBu] = useState<string>('');
  const [partsNumber, setPartsNumber] = useState<string>('');
  const [partsName, setPartsName] = useState<string>('');
  const [results, setResults] = useState<PartsSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const searchResults = await searchParts({
        bu: bu || undefined,
        partsNumber: partsNumber || undefined,
        partsName: partsName || undefined,
      });
      setResults(searchResults);
    } catch (error) {
      console.error('検索エラー:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setHasSearched(false);
    setResults([]);
    setBu('');
    setPartsNumber('');
    setPartsName('');
  };

  const handlePartsNumberClick = (partsNumber: string) => {
    openPartsDetail(partsNumber);
  };

  return {
    bu,
    setBu,
    partsNumber,
    setPartsNumber,
    partsName,
    setPartsName,
    results,
    loading,
    hasSearched,
    handleSearch,
    handleReset,
    handlePartsNumberClick,
  };
};


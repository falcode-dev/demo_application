import { useState } from 'react';
import { searchParts, type PartsSearchResult } from '../services/mockData';
import { openPartsDetail } from '../utils/navigation';
import { useToastContext } from '../contexts/ToastContext';
import { useTranslation } from 'react-i18next';

export const usePartsSearch = () => {
  const { t } = useTranslation();
  const { success } = useToastContext();
  const [bu, setBu] = useState<string>('');
  const [partsNumber, setPartsNumber] = useState<string>('');
  const [partsName, setPartsName] = useState<string>('');
  const [results, setResults] = useState<PartsSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedParts, setSelectedParts] = useState<Set<string>>(new Set());
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [shouldResetOrderModal, setShouldResetOrderModal] = useState<boolean>(false);

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
    setSelectedParts(new Set());
    setBu('');
    setPartsNumber('');
    setPartsName('');
  };

  const handleCheckboxChange = (partsNumber: string) => {
    const newSelected = new Set(selectedParts);
    if (newSelected.has(partsNumber)) {
      newSelected.delete(partsNumber);
    } else {
      newSelected.add(partsNumber);
    }
    setSelectedParts(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedParts(new Set(results.map(r => r.partsNumber)));
    } else {
      setSelectedParts(new Set());
    }
  };

  const handleOpenOrderModal = () => {
    setIsConfirmModalOpen(false);
    setIsOrderModalOpen(true);
  };

  const handleOpenConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleConfirm = () => {
    setIsConfirmModalOpen(false);
    setIsOrderModalOpen(false);
    setSelectedParts(new Set());
    setShouldResetOrderModal(true);
    success(t('partsSearch.orderSuccess'));
    setTimeout(() => {
      setShouldResetOrderModal(false);
    }, 0);
  };

  const handleCloseOrderModal = () => {
    setIsConfirmModalOpen(false);
    setIsOrderModalOpen(false);
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
    selectedParts,
    isOrderModalOpen,
    isConfirmModalOpen,
    shouldResetOrderModal,
    handleSearch,
    handleReset,
    handleCheckboxChange,
    handleSelectAll,
    handleOpenOrderModal,
    handleOpenConfirmModal,
    handleCloseConfirmModal,
    handleConfirm,
    handleCloseOrderModal,
    handlePartsNumberClick,
  };
};


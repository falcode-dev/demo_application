import { useState, useEffect, useCallback } from 'react';
import {
  getPartsDetail,
  getInventoryInfo,
  getAlternativeParts,
  type PartsDetail as PartsDetailType,
  type InventoryInfo,
  type AlternativePart,
} from '../services/mockData';
import { openPartsDetail } from '../utils/navigation';
import { closePage } from '../utils/powerApps';

export const usePartsDetail = (partsNumber: string) => {
  const [detail, setDetail] = useState<PartsDetailType | null>(null);
  const [inventory, setInventory] = useState<InventoryInfo[]>([]);
  const [alternativeParts, setAlternativeParts] = useState<AlternativePart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inventoryLoading, setInventoryLoading] = useState<boolean>(false);
  const [region, setRegion] = useState<string>('JP');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [detailData, alternativeData] = await Promise.all([
          getPartsDetail(partsNumber),
          getAlternativeParts(partsNumber),
        ]);
        setDetail(detailData);
        setAlternativeParts(alternativeData);
      } catch (error) {
        console.error('データ取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [partsNumber]);

  const loadInventory = useCallback(async () => {
    setInventoryLoading(true);
    try {
      const inventoryData = await getInventoryInfo(partsNumber, region);
      setInventory(inventoryData);
    } catch (error) {
      console.error('在庫情報取得エラー:', error);
    } finally {
      setInventoryLoading(false);
    }
  }, [partsNumber, region]);

  useEffect(() => {
    if (partsNumber) {
      loadInventory();
    }
  }, [partsNumber, region, loadInventory]);

  const handleAlternativePartsClick = (altPartsNumber: string) => {
    openPartsDetail(altPartsNumber);
  };

  const handleClose = () => {
    closePage();
  };

  return {
    detail,
    inventory,
    alternativeParts,
    loading,
    inventoryLoading,
    region,
    setRegion,
    loadInventory,
    handleAlternativePartsClick,
    handleClose,
  };
};


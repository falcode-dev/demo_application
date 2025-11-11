import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Select, Modal, Input } from '../components';
import type { SelectOption } from '../components';
import { getPartsReturnData, type PartsReturnRow } from '../services/mockData';
import { useToastContext } from '../contexts/ToastContext';
import { FiAlertCircle } from 'react-icons/fi';
import styles from './PartsRegistration.module.css';

export const PartsRegistration = () => {
  const { t } = useTranslation();
  const { success } = useToastContext();
  const [results, setResults] = useState<PartsReturnRow[]>([]);
  const [selectedReturnIndex, setSelectedReturnIndex] = useState<number | null>(null);
  const [isReturning, setIsReturning] = useState<boolean>(false);

  // 初期データの読み込み
  useEffect(() => {
    const loadData = async () => {
      const data = await getPartsReturnData();
      setResults(data);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (results.length === 0) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const partsNumberParam = params.get('partsNumber');

    if (partsNumberParam) {
      const matchedIndex = results.findIndex(
        (item) => item.partsNumber === partsNumberParam
      );

      if (matchedIndex !== -1 && matchedIndex !== selectedReturnIndex) {
        setSelectedReturnIndex(matchedIndex);
        return;
      }
    }

    if (selectedReturnIndex === null) {
      setSelectedReturnIndex(0);
    }
  }, [results, selectedReturnIndex]);

  const selectedParts = selectedReturnIndex !== null ? results[selectedReturnIndex] : null;

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
        </div>
        <div>
          {selectedParts ? (
            <ReturnInfoModal
              isOpen
              onClose={() => { }}
              partsData={selectedParts}
              onRegister={(_returnData) => {
                if (selectedReturnIndex === null) {
                  return;
                }
                const newResults = [...results];
                newResults[selectedReturnIndex].isReturned = true;
                setResults(newResults);
                success(t('partsReturn.registration.success'));
              }}
              isReturning={isReturning}
              setIsReturning={setIsReturning}
              onCloseModal={() => { }}
              renderAsScreen
            />
          ) : (
            <p>{t('partsReturn.registration.loading')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// 返却情報モーダル
interface ReturnInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  partsData: PartsReturnRow;
  onRegister: (data: ReturnData) => void;
  isReturning: boolean;
  setIsReturning: (value: boolean) => void;
  onCloseModal: () => void;
  renderAsScreen?: boolean;
}

interface ReturnData {
  returnItems: ReturnItem[];
  returnDestination: string;
}

interface ReturnItem {
  number: number;
  returnQuantity: number;
  packageStatus: string;
  returnReason: string;
  wmsBatchNumber: string;
}

const ReturnInfoModal = ({
  isOpen,
  onClose,
  partsData,
  onRegister,
  isReturning,
  setIsReturning,
  onCloseModal,
  renderAsScreen = false,
}: ReturnInfoModalProps) => {
  const { t } = useTranslation();
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [returnDestination, setReturnDestination] = useState<string>('');

  const createInitialReturnItems = useCallback(() => {
    const rowsCount = 2;
    return Array.from({ length: rowsCount }, (_, i) => ({
      number: i + 1,
      returnQuantity: 0,
      packageStatus: '',
      returnReason: '',
      wmsBatchNumber: '',
    }));
  }, [partsData]);

  // モーダルが開かれたときに残数量に応じて返却項目を初期化
  useEffect(() => {
    if ((renderAsScreen || isOpen) && partsData) {
      setReturnItems(createInitialReturnItems());
      setReturnDestination('');
    } else if (!renderAsScreen && !isOpen) {
      setReturnItems([]);
      setReturnDestination('');
    }
  }, [isOpen, partsData, renderAsScreen, createInitialReturnItems]);

  if (!renderAsScreen && !isOpen) {
    return null;
  }

  const packageStatusOptions: SelectOption[] = [
    { value: '', label: t('partsReturn.registration.modal.packageStatusOptions.default') },
    { value: 'unopened', label: t('partsReturn.registration.modal.packageStatusOptions.unopened') },
    { value: 'opened', label: t('partsReturn.registration.modal.packageStatusOptions.opened') },
  ];

  const returnDestinationOptions: SelectOption[] = [
    { value: '', label: t('partsReturn.registration.modal.returnDestinationOptions.default') },
    { value: 'warehouseA', label: t('partsReturn.registration.modal.returnDestinationOptions.warehouseA') },
    { value: 'warehouseB', label: t('partsReturn.registration.modal.returnDestinationOptions.warehouseB') },
    { value: 'warehouseC', label: t('partsReturn.registration.modal.returnDestinationOptions.warehouseC') },
  ];


  // 返却数量変更
  const handleReturnQuantityChange = (index: number, value: string) => {
    // 数値のみ許可し、3桁まで制限
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 3);
    const newItems = [...returnItems];
    if (numericValue === '') {
      // 空の場合は0に設定
      newItems[index].returnQuantity = 0;
    } else {
      const numValue = parseInt(numericValue, 10);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 999) {
        newItems[index].returnQuantity = numValue;
      }
    }
    setReturnItems(newItems);
  };

  // 返却項目の更新（数量以外）
  const handleReturnItemChange = (
    index: number,
    field: keyof ReturnItem,
    value: string | number
  ) => {
    const newItems = [...returnItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setReturnItems(newItems);
  };

  // 登録処理
  const handleRegister = async () => {
    setIsReturning(true);
    try {
      // シミュレート用の遅延
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const returnData: ReturnData = {
        returnItems,
        returnDestination,
      };

      onRegister(returnData);

      if (renderAsScreen) {
        setReturnItems(createInitialReturnItems());
        setReturnDestination('');
      } else {
        // フォームをリセット（モーダルが閉じられるので不要だが、念のため）
        setReturnItems([]);
        setReturnDestination('');
      }

      // ローディング状態を解除
      setIsReturning(false);

      // ローディングが終わったらモーダルを閉じる
      onCloseModal();
    } catch (error) {
      console.error('返却エラー:', error);
      setIsReturning(false);
    }
  };

  const handleCancel = () => {
    if (renderAsScreen) {
      setReturnItems(createInitialReturnItems());
      setReturnDestination('');
      return;
    }
    onClose();
  };

  const footerClassName = renderAsScreen
    ? `${styles.modalFooter} ${styles.modalFooterStandalone}`
    : styles.modalFooter;

  const footer = (
    <div className={footerClassName}>
      <Button variant="sub" onClick={handleCancel} disabled={isReturning}>
        {t('partsReturn.registration.modal.footer.cancel')}
      </Button>
      <Button variant="default" onClick={handleRegister} loading={isReturning}>
        {t('partsReturn.registration.modal.footer.register')}
      </Button>
    </div>
  );

  const content = (
    <>
      <div className={styles.returnModalContent}>
        {/* 選択したパーツ情報 */}
        <div className={styles.selectedPartsInfo}>
          <div className={styles.selectedPartsInfoRow}>
            <span className={styles.selectedPartsLabel}>{t('partsReturn.registration.modal.labels.partsNumber')}:</span>
            <span>{partsData.partsNumber}</span>
          </div>
          <div className={styles.selectedPartsInfoRow}>
            <span className={styles.selectedPartsLabel}>{t('partsReturn.registration.modal.labels.arrangementQuantity')}:</span>
            <span>{partsData.arrangementQuantity}</span>
          </div>
          <div className={styles.selectedPartsInfoRow}>
            <span className={styles.selectedPartsLabel}>{t('partsReturn.registration.modal.labels.partsName')}:</span>
            <span>{partsData.partsName}</span>
          </div>
          <div className={styles.selectedPartsInfoRow}>
            <span className={styles.selectedPartsLabel}>{t('partsReturn.registration.modal.labels.shippingWarehouse')}:</span>
            <span>{partsData.shippingWarehouse || '-'}</span>
          </div>
        </div>

        {/* 返却情報入力ヘッダー */}
        <div className={styles.returnInfoHeader}>
          <h3 className={styles.returnInfoTitle}>{t('partsReturn.registration.modal.headerTitle')}</h3>
          <FiAlertCircle className={styles.alertIcon} />
          <p className={styles.returnInfoMessage}>
            {t('partsReturn.registration.modal.headerMessage')}
          </p>
        </div>

        {/* 返却項目テーブル */}
        <div className={styles.returnItemsTable}>
          <table className={styles.returnTable}>
            <thead>
              <tr>
                <th>{t('partsReturn.registration.modal.table.number')}</th>
                <th>{t('partsReturn.registration.modal.table.returnQuantity')}</th>
                <th>{t('partsReturn.registration.modal.table.packageStatus')}</th>
                <th>{t('partsReturn.registration.modal.table.returnReason')}</th>
                <th>{t('partsReturn.registration.modal.table.wmsBatchNumber')}</th>
              </tr>
            </thead>
            <tbody>
              {returnItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.number}</td>
                  <td>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={3}
                      value={item.returnQuantity !== undefined && item.returnQuantity !== 0 ? item.returnQuantity : ''}
                      onChange={(e) => handleReturnQuantityChange(index, e.target.value)}
                      onBlur={(e) => {
                        // フォーカスが外れた時、空の場合は0を表示
                        if (e.target.value === '') {
                          handleReturnQuantityChange(index, '0');
                        }
                      }}
                      className={styles.quantityInput}
                    />
                  </td>
                  <td>
                    <Select
                      options={packageStatusOptions}
                      value={item.packageStatus}
                      onChange={(e) =>
                        handleReturnItemChange(index, 'packageStatus', e.target.value)
                      }
                      placeholder={t('partsReturn.registration.modal.placeholders.packageStatus')}
                      style={{ minWidth: '150px' }}
                    />
                  </td>
                  <td>
                    <Input
                      value={item.returnReason}
                      onChange={(e) =>
                        handleReturnItemChange(index, 'returnReason', e.target.value)
                      }
                      placeholder={t('partsReturn.registration.modal.placeholders.returnReason')}
                      style={{ minWidth: '200px' }}
                    />
                  </td>
                  <td>
                    <Input
                      value={item.wmsBatchNumber}
                      onChange={(e) =>
                        handleReturnItemChange(index, 'wmsBatchNumber', e.target.value)
                      }
                      placeholder={t('partsReturn.registration.modal.placeholders.wmsBatchNumber')}
                      style={{ minWidth: '150px' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 返却先選択 */}
        <div className={styles.returnDestinationField}>
          <Select
            label={t('partsReturn.registration.modal.labels.returnDestination')}
            options={returnDestinationOptions}
            value={returnDestination}
            onChange={(e) => setReturnDestination(e.target.value)}
            placeholder={t('partsReturn.registration.modal.placeholders.returnDestination')}
            fullWidth
          />
        </div>
      </div>
      {renderAsScreen && footer}
    </>
  );

  if (renderAsScreen) {
    return <>{content}</>;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('partsReturn.registration.modal.title')}
      footer={footer}
      size="large"
    >
      {content}
    </Modal>
  );
};

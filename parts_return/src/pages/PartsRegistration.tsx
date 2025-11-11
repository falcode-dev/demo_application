import { useState, useEffect, useCallback } from 'react';
import { Button, Select, Modal, Input } from '../components';
import type { SelectOption } from '../components';
import { getPartsReturnData, type PartsReturnRow } from '../services/mockData';
import { useToastContext } from '../contexts/ToastContext';
import { FiAlertCircle } from 'react-icons/fi';
import styles from './PartsRegistration.module.css';

export const PartsRegistration = () => {
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
                success('パーツ返却が登録されました');
              }}
              isReturning={isReturning}
              setIsReturning={setIsReturning}
              onCloseModal={() => { }}
              renderAsScreen
            />
          ) : (
            <p>パーツ情報を読み込み中です...</p>
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
    { value: '', label: '選択してください' },
    { value: '未開封', label: '未開封' },
    { value: '開封済み', label: '開封済み' },
  ];

  const returnDestinationOptions: SelectOption[] = [
    { value: '', label: '選択してください' },
    { value: '倉庫A', label: '倉庫A' },
    { value: '倉庫B', label: '倉庫B' },
    { value: '倉庫C', label: '倉庫C' },
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
        キャンセル
      </Button>
      <Button variant="default" onClick={handleRegister} loading={isReturning}>
        登録
      </Button>
    </div>
  );

  const content = (
    <>
      <div className={styles.returnModalContent}>
        {/* 選択したパーツ情報 */}
        <div className={styles.selectedPartsInfo}>
          <div className={styles.selectedPartsInfoRow}>
            <span className={styles.selectedPartsLabel}>パーツ番号：</span>
            <span>{partsData.partsNumber}</span>
          </div>
          <div className={styles.selectedPartsInfoRow}>
            <span className={styles.selectedPartsLabel}>手配数：</span>
            <span>{partsData.arrangementQuantity}</span>
          </div>
          <div className={styles.selectedPartsInfoRow}>
            <span className={styles.selectedPartsLabel}>パーツ名：</span>
            <span>{partsData.partsName}</span>
          </div>
          <div className={styles.selectedPartsInfoRow}>
            <span className={styles.selectedPartsLabel}>出荷元倉庫：</span>
            <span>{partsData.shippingWarehouse || '-'}</span>
          </div>
        </div>

        {/* 返却情報入力ヘッダー */}
        <div className={styles.returnInfoHeader}>
          <h3 className={styles.returnInfoTitle}>返却情報入力</h3>
          <FiAlertCircle className={styles.alertIcon} />
          <p className={styles.returnInfoMessage}>
            各パーツの開封状況と返却理由を個別に入力してください。例：1個は開封済み未使用、1個は未開封・手配ミス
          </p>
        </div>

        {/* 返却項目テーブル */}
        <div className={styles.returnItemsTable}>
          <table className={styles.returnTable}>
            <thead>
              <tr>
                <th>＃</th>
                <th>返却数量</th>
                <th>パッケージ開封状況</th>
                <th>返却理由</th>
                <th>WMSバッチ番号</th>
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
                      placeholder="選択してください"
                      style={{ minWidth: '150px' }}
                    />
                  </td>
                  <td>
                    <Input
                      value={item.returnReason}
                      onChange={(e) =>
                        handleReturnItemChange(index, 'returnReason', e.target.value)
                      }
                      placeholder="返却理由を入力"
                      style={{ minWidth: '200px' }}
                    />
                  </td>
                  <td>
                    <Input
                      value={item.wmsBatchNumber}
                      onChange={(e) =>
                        handleReturnItemChange(index, 'wmsBatchNumber', e.target.value)
                      }
                      placeholder="WMSバッチ番号を入力"
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
            label="返却先"
            options={returnDestinationOptions}
            value={returnDestination}
            onChange={(e) => setReturnDestination(e.target.value)}
            placeholder="選択してください"
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
      title="返却情報入力"
      footer={footer}
      size="large"
    >
      {content}
    </Modal>
  );
};

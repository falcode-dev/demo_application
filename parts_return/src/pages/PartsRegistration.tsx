import { useState, useEffect } from 'react';
import { Button, Select, Toast, Modal, Input } from '../components';
import type { SelectOption } from '../components';
import { getPartsReturnData, type PartsReturnRow } from '../services/mockData';
import { FiAlertCircle } from 'react-icons/fi';
import styles from './PartsRegistration.module.css';

// パーツ番号をクリックした時の処理
const handlePartsNumberClick = (partsNumber: string) => {
  // 常に別タブでパーツ詳細画面を開く（元の登録画面はそのまま）
  const detailUrl = `${window.location.origin}${window.location.pathname}?partsNumber=${encodeURIComponent(partsNumber)}`;
  window.open(detailUrl, '_blank');
};

export const PartsRegistration = () => {
  const [results, setResults] = useState<PartsReturnRow[]>([]);
  const [selectedReturnIndex, setSelectedReturnIndex] = useState<number | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState<boolean>(false);
  const [isReturning, setIsReturning] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 初期データの読み込み
  useEffect(() => {
    const loadData = async () => {
      const data = await getPartsReturnData();
      setResults(data);
    };
    loadData();
  }, []);

  // 返却モーダルを開く
  const handleOpenReturnModal = (index: number) => {
    setSelectedReturnIndex(index);
    setIsReturnModalOpen(true);
  };

  // 返却モーダルを閉じる
  const handleCloseReturnModal = () => {
    setIsReturnModalOpen(false);
    setSelectedReturnIndex(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>パーツ返却</h2>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.tableWrapper}>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th>パーツ番号</th>
                  <th>パーツ名</th>
                  <th>手配数</th>
                  <th>使用数</th>
                  <th>残数量</th>
                  <th>リクエスト番号</th>
                  <th>NCDR番号</th>
                  <th>オーダー元</th>
                  <th>WO#</th>
                  <th>オーダーステージ</th>
                  <th>配送番号</th>
                  <th>予定納期</th>
                  <th>BU</th>
                  <th>拠点</th>
                  <th>顧客名</th>
                  <th>作業予定日</th>
                  <th>アクション</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, index) => (
                  <tr
                    key={index}
                    className={item.isReturned ? styles.isReturned : ''}
                  >
                    <td>
                      <button
                        className={styles.partsNumberLink}
                        onClick={() => handlePartsNumberClick(item.partsNumber)}
                      >
                        {item.partsNumber}
                      </button>
                    </td>
                    <td>{item.partsName}</td>
                    <td>{item.arrangementQuantity}</td>
                    <td>{item.usedQuantity}</td>
                    <td>{item.remainingQuantity}</td>
                    <td>{item.requestNumber}</td>
                    <td>{item.ncdrNumber}</td>
                    <td>{item.orderSource}</td>
                    <td>{item.woNumber}</td>
                    <td>{item.orderStage}</td>
                    <td>{item.shippingNumber}</td>
                    <td>{item.scheduledDeliveryDate}</td>
                    <td>{item.bu}</td>
                    <td>{item.site}</td>
                    <td>{item.customerName}</td>
                    <td>{item.scheduledWorkDate}</td>
                    <td>
                      <Button
                        variant="sub"
                        onClick={() => handleOpenReturnModal(index)}
                        disabled={item.isReturned}
                        className={styles.returnButton}
                      >
                        返却
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 返却情報モーダル */}
      {selectedReturnIndex !== null && (
        <ReturnInfoModal
          isOpen={isReturnModalOpen}
          onClose={handleCloseReturnModal}
          partsData={results[selectedReturnIndex]}
          onRegister={(returnData) => {
            // 返却処理
            const newResults = [...results];
            newResults[selectedReturnIndex].isReturned = true;
            setResults(newResults);
            setToastMessage('パーツ返却が登録されました');
            setIsReturnModalOpen(false);
            setSelectedReturnIndex(null);
          }}
          isReturning={isReturning}
          setIsReturning={setIsReturning}
          onCloseModal={handleCloseReturnModal}
        />
      )}

      {/* トースト通知 */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastMessage.includes('エラー') ? 'error' : 'success'}
          duration={5000}
          onClose={() => setToastMessage(null)}
          position="top-center"
        />
      )}
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
}: ReturnInfoModalProps) => {
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [returnDestination, setReturnDestination] = useState<string>('');

  // モーダルが開かれたときに残数量に応じて返却項目を初期化
  useEffect(() => {
    if (isOpen && partsData) {
      const remainingQuantity = partsData.remainingQuantity;
      const initialItems: ReturnItem[] = Array.from({ length: remainingQuantity }, (_, i) => ({
        number: i + 1,
        returnQuantity: 0,
        packageStatus: '',
        returnReason: '',
        wmsBatchNumber: '',
      }));
      setReturnItems(initialItems);
      setReturnDestination('');
    } else if (!isOpen) {
      setReturnItems([]);
      setReturnDestination('');
    }
  }, [isOpen, partsData]);

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

      // フォームをリセット（モーダルが閉じられるので不要だが、念のため）
      setReturnItems([]);
      setReturnDestination('');

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
    onClose();
  };

  const footer = (
    <div className={styles.modalFooter}>
      <Button variant="sub" onClick={handleCancel} disabled={isReturning}>
        キャンセル
      </Button>
      <Button variant="default" onClick={handleRegister} loading={isReturning}>
        登録
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="返却情報入力"
      footer={footer}
      size="large"
    >
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
    </Modal>
  );
};

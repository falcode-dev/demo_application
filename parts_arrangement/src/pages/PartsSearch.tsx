import { useState, useEffect } from 'react';
import { Button, Input, Select, Spinner, Modal, DatePicker } from '../components';
import type { SelectOption } from '../components';
import { searchParts, buOptions, type PartsSearchResult } from '../services/mockData';
import { FiCheckCircle } from 'react-icons/fi';
import styles from './PartsSearch.module.css';

interface PartsSearchProps {
  onPartsNumberClick?: (partsNumber: string) => void;
}

export const PartsSearch = ({ }: PartsSearchProps) => {
  const [bu, setBu] = useState<string>('');
  const [partsNumber, setPartsNumber] = useState<string>('');
  const [partsName, setPartsName] = useState<string>('');
  const [results, setResults] = useState<PartsSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedParts, setSelectedParts] = useState<Set<string>>(new Set());
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

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

  // OrderModalを開く
  const handleOpenOrderModal = () => {
    setIsConfirmModalOpen(false); // 念のため確認モーダルを閉じる
    setIsOrderModalOpen(true);
  };

  // 確認モーダルを開く
  const handleOpenConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  // 確認モーダルを閉じる
  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  // 確認モーダルでOKを押した時
  const handleConfirm = () => {
    setIsConfirmModalOpen(false);
    setIsOrderModalOpen(false);
    setSelectedParts(new Set());
  };

  // OrderModalを閉じる（確認モーダルも閉じる）
  const handleCloseOrderModal = () => {
    setIsConfirmModalOpen(false);
    setIsOrderModalOpen(false);
  };

  // PowerApps環境かどうかを検出
  const isPowerAppsEnvironment = () => {
    try {
      // PowerAppsのWEBリソースとして表示されている場合、parentにXrmオブジェクトがある
      return window.parent !== window && (window.parent as any).Xrm !== undefined;
    } catch (e) {
      // クロスオリジンの場合はエラーになるが、iframe内であることは確認できる
      return window.parent !== window;
    }
  };

  const handlePartsNumberClick = (partsNumber: string) => {
    // 常に別タブでパーツ詳細画面を開く（元の検索画面はそのまま）
    const detailUrl = `${window.location.origin}${window.location.pathname}?partsNumber=${encodeURIComponent(partsNumber)}`;

    if (isPowerAppsEnvironment()) {
      // PowerApps環境の場合、親フレームにメッセージを送信
      try {
        // Xrm APIが利用可能な場合
        if ((window.parent as any).Xrm?.Navigation?.openUrl) {
          (window.parent as any).Xrm.Navigation.openUrl(detailUrl, { openInNewWindow: true });
        } else {
          // フォールバック: postMessageを使用
          window.parent.postMessage({
            type: 'openUrl',
            url: detailUrl,
            target: '_blank'
          }, '*');
        }
      } catch (e) {
        // エラーが発生した場合は通常のwindow.openを使用
        window.open(detailUrl, '_blank');
      }
    } else {
      // 通常のWeb環境の場合、別タブで開く（元の検索画面はそのまま）
      window.open(detailUrl, '_blank');
    }
    // onPartsNumberClickは呼び出さない（元の検索画面をそのままにするため）
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>パーツ検索</h1>

      <div className={styles.searchForm}>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <Select
              label="BU"
              options={buOptions as SelectOption[]}
              value={bu}
              onChange={(e) => setBu(e.target.value)}
              placeholder="選択してください"
            />
          </div>
          <div className={styles.formField}>
            <Input
              label="パーツ番号"
              value={partsNumber}
              onChange={(e) => setPartsNumber(e.target.value)}
              placeholder="パーツ番号を入力"
            />
          </div>
          <div className={styles.formField}>
            <Input
              label="パーツ名称／型式（英）"
              value={partsName}
              onChange={(e) => setPartsName(e.target.value)}
              placeholder="パーツ名称を入力"
            />
          </div>
        </div>

        <div className={styles.buttonRow}>
          <Button variant="default" onClick={handleSearch} disabled={loading}>
            検索
          </Button>
          <Button variant="sub" onClick={handleReset} disabled={loading}>
            リセット
          </Button>
        </div>
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <Spinner size="large" variant="primary" label="検索中..." />
        </div>
      )}

      {!loading && hasSearched && (
        <div className={styles.resultsContainer}>
          <div className={styles.resultsHeader}>
            <p className={styles.resultsCount}>
              検索結果: {results.length}件
            </p>
          </div>
          {results.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.resultsTable}>
                <thead>
                  <tr>
                    <th>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={selectedParts.size > 0 && selectedParts.size === results.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedParts(new Set(results.map(r => r.partsNumber)));
                            } else {
                              setSelectedParts(new Set());
                            }
                          }}
                        />
                        <span className={styles.checkmark}></span>
                      </label>
                    </th>
                    <th>BU</th>
                    <th>パーツ番号</th>
                    <th>パーツ名称／型式（英）</th>
                    <th>ユニット</th>
                    <th>シグナルコード</th>
                    <th>販売ステータス</th>
                    <th>インテルフラグ</th>
                    <th>消耗品フラグ</th>
                    <th>備考</th>
                    <th>区分</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={selectedParts.has(item.partsNumber)}
                            onChange={() => handleCheckboxChange(item.partsNumber)}
                          />
                          <span className={styles.checkmark}></span>
                        </label>
                      </td>
                      <td>{item.bu}</td>
                      <td>
                        <button
                          className={styles.partsNumberLink}
                          onClick={() => handlePartsNumberClick(item.partsNumber)}
                        >
                          {item.partsNumber}
                        </button>
                      </td>
                      <td>{item.partsName}</td>
                      <td>{item.unit}</td>
                      <td>{item.signalCode}</td>
                      <td>{item.salesStatus}</td>
                      <td>{item.intelFlag}</td>
                      <td>{item.consumableFlag}</td>
                      <td>{item.remarks}</td>
                      <td>{item.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.noResults}>
              <p>検索結果がありません</p>
            </div>
          )}
        </div>
      )}

      {!loading && hasSearched && results.length > 0 && (
        <div className={styles.actionButtonContainer}>
          <Button
            variant="default"
            onClick={handleOpenOrderModal}
            disabled={selectedParts.size === 0}
          >
            有償パーツ手配
          </Button>
        </div>
      )}

      {/* パーツ手配作成モーダル */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrderModal}
        selectedPartsNumbers={Array.from(selectedParts)}
        results={results}
        onConfirm={handleOpenConfirmModal}
        isConfirmModalOpen={isConfirmModalOpen}
        onCloseConfirmModal={handleCloseConfirmModal}
      />

      {/* 確認画面モーダル */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

// パーツ手配作成モーダル
interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPartsNumbers: string[];
  results: PartsSearchResult[];
  onConfirm: () => void;
  isConfirmModalOpen?: boolean;
  onCloseConfirmModal?: () => void;
}

const OrderModal = ({ isOpen, onClose, selectedPartsNumbers, results, onConfirm, isConfirmModalOpen, onCloseConfirmModal }: OrderModalProps) => {
  const [partsOrderCopy, setPartsOrderCopy] = useState<string>('');
  const [soNumber, setSoNumber] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [subCategory, setSubCategory] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [woLinkedSo, setWoLinkedSo] = useState<string>('');
  const [deliveryType, setDeliveryType] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const selectedParts = results.filter(r => selectedPartsNumbers.includes(r.partsNumber));

  // 数量の初期化（初期は空のまま）
  useEffect(() => {
    // 新しく選択されたパーツのみ、数量が未設定の場合は空（undefined）のままにする
    selectedParts.forEach(part => {
      if (!(part.partsNumber in quantities)) {
        // 初期値は設定しない（空のまま）
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPartsNumbers]);

  const handleQuantityChange = (partsNumber: string, value: string) => {
    // 数値のみ許可し、3桁まで制限
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 3);
    if (numericValue === '') {
      // 空の場合は0に設定
      setQuantities(prev => ({
        ...prev,
        [partsNumber]: 0
      }));
    } else {
      const numValue = parseInt(numericValue, 10);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 999) {
        setQuantities(prev => ({
          ...prev,
          [partsNumber]: numValue
        }));
      }
    }
  };

  const subCategoryOptions: SelectOption[] = [
    { value: '', label: '選択してください' },
    { value: 'sub1', label: 'サブカテゴリ1' },
    { value: 'sub2', label: 'サブカテゴリ2' },
    { value: 'sub3', label: 'サブカテゴリ3' },
  ];

  const categoryOptions: SelectOption[] = [
    { value: '', label: '選択してください' },
    { value: 'cat1', label: 'カテゴリ1' },
    { value: 'cat2', label: 'カテゴリ2' },
    { value: 'cat3', label: 'カテゴリ3' },
  ];

  const deliveryTypeOptions: SelectOption[] = [
    { value: '', label: '選択してください' },
    { value: 'type1', label: '通常配送' },
    { value: 'type2', label: '速達' },
    { value: 'type3', label: '当日配送' },
  ];

  // キャンセルボタンの処理
  const handleCancel = () => {
    // 確認モーダルが開いている場合は確認モーダルのみ閉じる
    if (isConfirmModalOpen && onCloseConfirmModal) {
      onCloseConfirmModal();
    } else {
      // そうでない場合はOrderModalを閉じる
      onClose();
    }
  };

  const footer = (
    <div className={styles.modalFooter}>
      <Button variant="sub" onClick={handleCancel}>
        キャンセル
      </Button>
      <Button variant="default" onClick={onConfirm}>
        確認画面
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="パーツ手配の作成"
      footer={footer}
      size="large"
      closeOnOverlayClick={!isConfirmModalOpen}
      closeOnEscape={!isConfirmModalOpen}
      hideOverlay={isConfirmModalOpen}
    >
      <div className={styles.orderModalContent}>
        <div className={styles.orderForm}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input
                label="パーツオーダのコピー"
                value={partsOrderCopy}
                onChange={(e) => setPartsOrderCopy(e.target.value)}
                placeholder="パーツオーダのコピーを入力"
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Input
                label="SO番号"
                value={soNumber}
                onChange={(e) => setSoNumber(e.target.value)}
                placeholder="SO番号を入力"
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <DatePicker
                label="客先納入希望日"
                value={deliveryDate}
                onChange={setDeliveryDate}
                placeholder="日付を選択"
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Select
                label="サブカテゴリ"
                options={subCategoryOptions}
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="選択してください"
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input
                label="顧客名"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="顧客名を入力"
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Select
                label="カテゴリ"
                options={categoryOptions}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="選択してください"
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input
                label="WOに連携されたSO"
                value={woLinkedSo}
                onChange={(e) => setWoLinkedSo(e.target.value)}
                placeholder="WOに連携されたSOを入力"
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Select
                label="配送タイプ"
                options={deliveryTypeOptions}
                value={deliveryType}
                onChange={(e) => setDeliveryType(e.target.value)}
                placeholder="選択してください"
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.textareaLabel}>メモ</label>
              <textarea
                className={styles.textarea}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="メモを入力"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className={styles.selectedPartsList}>
          <h3 className={styles.selectedPartsTitle}>選択したパーツ</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th>BU</th>
                  <th>パーツ番号</th>
                  <th>パーツ名称／型式（英）</th>
                  <th>ユニット</th>
                  <th>シグナルコード</th>
                  <th>販売ステータス</th>
                  <th>インテルフラグ</th>
                  <th>消耗品フラグ</th>
                  <th>備考</th>
                  <th>区分</th>
                  <th>個数</th>
                </tr>
              </thead>
              <tbody>
                {selectedParts.map((item, index) => (
                  <tr key={index}>
                    <td>{item.bu}</td>
                    <td>{item.partsNumber}</td>
                    <td>{item.partsName}</td>
                    <td>{item.unit}</td>
                    <td>{item.signalCode}</td>
                    <td>{item.salesStatus}</td>
                    <td>{item.intelFlag}</td>
                    <td>{item.consumableFlag}</td>
                    <td>{item.remarks}</td>
                    <td>{item.category}</td>
                    <td>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={3}
                        value={quantities[item.partsNumber] !== undefined ? quantities[item.partsNumber] : ''}
                        onChange={(e) => handleQuantityChange(item.partsNumber, e.target.value)}
                        onBlur={(e) => {
                          // フォーカスが外れた時、空の場合は0を表示
                          if (e.target.value === '') {
                            handleQuantityChange(item.partsNumber, '0');
                          }
                        }}
                        className={styles.quantityInput}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// 確認画面モーダル
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm }: ConfirmModalProps) => {
  const footer = (
    <div className={styles.modalFooter}>
      <Button variant="sub" onClick={onClose}>
        キャンセル
      </Button>
      <Button variant="default" onClick={onConfirm}>
        OK
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      footer={footer}
      size="small"
      showCloseButton={false}
      higherZIndex={true}
    >
      <div className={styles.confirmModalContent}>
        <div className={styles.confirmHeader}>
          <FiCheckCircle className={styles.confirmIcon} />
          <h2 className={styles.confirmTitle}>パーツ手配の確認</h2>
        </div>
        <div className={styles.confirmMessage}>
          <p>選択済みのパーツを手配します。</p>
          <p>よろしいですか？</p>
        </div>
      </div>
    </Modal>
  );
};


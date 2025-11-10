import { useState, useEffect } from 'react';
import { Button, Select, Modal, Input, Spinner, Toast } from '../components';
import type { SelectOption } from '../components';
import { searchParts, buOptions, type PartsSearchResult } from '../services/mockData';
import { FiX } from 'react-icons/fi';
import styles from './PartsRegistration.module.css';

// パーツ番号をクリックした時の処理
const handlePartsNumberClick = (partsNumber: string) => {
  // 常に別タブでパーツ詳細画面を開く（元の登録画面はそのまま）
  const detailUrl = `${window.location.origin}${window.location.pathname}?partsNumber=${encodeURIComponent(partsNumber)}`;

  // PowerApps環境でも通常のWeb環境でも、window.openでタブを開く
  // PowerAppsのWebリソース内からwindow.openを呼び出すと、ブラウザのタブで開かれる
  window.open(detailUrl, '_blank');
};

interface RegistrationRow extends PartsSearchResult {
  checked: boolean;
  consumptionQuantity: number | undefined;
  billingCategory?: string;
  partsCategory?: string;
  hasError?: boolean;
  isDisabled?: boolean;
  quantityError?: boolean;
  billingCategoryError?: boolean;
  partsCategoryError?: boolean;
}


export const PartsRegistration = () => {
  // セクションの状態
  const [upperBu, setUpperBu] = useState<string>('');
  const [upperCustomerSite, setUpperCustomerSite] = useState<string>('');
  const [upperOrderSource, setUpperOrderSource] = useState<string>('');
  const [results, setResults] = useState<RegistrationRow[]>([]);

  // パーツ検索モーダルの状態
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  // トースト通知の状態
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // パーツ検索モーダルを開く
  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  // パーツ検索モーダルを閉じる
  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  // 請求区分の選択肢
  const billingCategoryOptions: SelectOption[] = [
    { value: '', label: '選択してください' },
    { value: '有償', label: '有償' },
    { value: '無償', label: '無償' },
    { value: '保証', label: '保証' },
  ];

  // 全件チェック/解除
  const handleSelectAll = () => {
    const allChecked = results.every(item => item.checked || item.isDisabled);
    const newResults = results.map(item => {
      if (item.isDisabled) {
        return item; // 非活性の行は変更しない
      }
      return {
        ...item,
        checked: !allChecked,
        hasError: false, // チェックを変更したらエラーをクリア
      };
    });
    setResults(newResults);
  };

  // チェックボックス変更
  const handleCheckboxChange = (index: number) => {
    const newResults = [...results];
    if (newResults[index].isDisabled) {
      return; // 非活性の行は変更不可
    }
    newResults[index].checked = !newResults[index].checked;
    newResults[index].hasError = false; // チェックを変更したらエラーをクリア
    setResults(newResults);
  };

  // 消費数量変更
  const handleQuantityChange = (index: number, value: string) => {
    if (results[index].isDisabled) {
      return; // 非活性の行は変更不可
    }
    // 数値のみ許可し、3桁まで制限
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 3);
    const newResults = [...results];
    if (numericValue === '') {
      // 空の場合は0に設定
      newResults[index].consumptionQuantity = 0;
    } else {
      const numValue = parseInt(numericValue, 10);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 999) {
        newResults[index].consumptionQuantity = numValue;
        // 数値を入力したらチェックボックスをオンにする
        newResults[index].checked = true;
      }
    }
    newResults[index].hasError = false; // 値を変更したらエラーをクリア
    setResults(newResults);
  };

  // 請求区分変更
  const handleBillingCategoryChange = (index: number, value: string) => {
    if (results[index].isDisabled) {
      return; // 非活性の行は変更不可
    }
    const newResults = [...results];
    newResults[index].billingCategory = value;
    // 選択肢を選んだらチェックボックスをオンにする
    if (value !== '') {
      newResults[index].checked = true;
    }
    newResults[index].hasError = false; // 値を変更したらエラーをクリア
    setResults(newResults);
  };


  // タグのクリック処理（オンオフ）
  const handleTagClick = (type: 'bu' | 'customerSite' | 'orderSource') => {
    if (type === 'bu') {
      if (upperBu) {
        setUpperBu('');
      } else {
        // 最初の有効なBUを設定（空でない最初の値）
        const firstBu = buOptions.find(opt => opt.value !== '');
        if (firstBu) {
          setUpperBu(firstBu.value);
        }
      }
    } else if (type === 'customerSite') {
      if (upperCustomerSite) {
        setUpperCustomerSite('');
      } else {
        setUpperCustomerSite('顧客拠点1');
      }
    } else if (type === 'orderSource') {
      if (upperOrderSource) {
        setUpperOrderSource('');
      } else {
        setUpperOrderSource('オーダ元1');
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* セクション */}
      <div className={styles.upperSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>パーツ実績登録（事前受注・FE手配・マイグレ）</h2>
          <div className={styles.headerRight}>
            <Button
              variant="default"
              onClick={handleOpenSearchModal}
            >
              パーツ検索
            </Button>
          </div>
        </div>

        <div className={styles.tagsContainer}>
          <div
            className={`${styles.tag} ${upperBu ? styles.tagActive : ''}`}
            onClick={() => handleTagClick('bu')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTagClick('bu');
              }
            }}
          >
            <span className={styles.tagText}>BU: {upperBu || '未選択'}</span>
            {upperBu && (
              <button
                type="button"
                className={styles.tagClose}
                onClick={(e) => {
                  e.stopPropagation();
                  setUpperBu('');
                }}
                aria-label="BUタグを削除"
              >
                <FiX />
              </button>
            )}
          </div>
          <div
            className={`${styles.tag} ${upperCustomerSite ? styles.tagActive : ''}`}
            onClick={() => handleTagClick('customerSite')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTagClick('customerSite');
              }
            }}
          >
            <span className={styles.tagText}>顧客拠点: {upperCustomerSite || '未選択'}</span>
            {upperCustomerSite && (
              <button
                type="button"
                className={styles.tagClose}
                onClick={(e) => {
                  e.stopPropagation();
                  setUpperCustomerSite('');
                }}
                aria-label="顧客拠点タグを削除"
              >
                <FiX />
              </button>
            )}
          </div>
          <div
            className={`${styles.tag} ${upperOrderSource ? styles.tagActive : ''}`}
            onClick={() => handleTagClick('orderSource')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTagClick('orderSource');
              }
            }}
          >
            <span className={styles.tagText}>オーダ元: {upperOrderSource || '未選択'}</span>
            {upperOrderSource && (
              <button
                type="button"
                className={styles.tagClose}
                onClick={(e) => {
                  e.stopPropagation();
                  setUpperOrderSource('');
                }}
                aria-label="オーダ元タグを削除"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.tableWrapper}>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th className={styles.checkboxColumn}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={results.length > 0 && results.every(item => item.checked || item.isDisabled)}
                        onChange={handleSelectAll}
                        className={styles.checkboxInput}
                      />
                      <span className={styles.checkboxCustom}></span>
                    </label>
                  </th>
                  <th>BU</th>
                  <th>パーツ番号</th>
                  <th>パーツ名称／型式（英）</th>
                  <th className={styles.quantityColumn}>消費数量</th>
                  <th className={styles.billingColumn}>請求区分</th>
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
                  <tr
                    key={index}
                    className={`${item.hasError ? styles.hasError : ''} ${item.isDisabled ? styles.isDisabled : ''}`}
                  >
                    <td className={styles.checkboxColumn}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => handleCheckboxChange(index)}
                          disabled={item.isDisabled}
                          className={styles.checkboxInput}
                        />
                        <span className={styles.checkboxCustom}></span>
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
                    <td className={styles.quantityColumn}>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={3}
                        value={item.consumptionQuantity !== undefined ? item.consumptionQuantity : ''}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        onBlur={(e) => {
                          // フォーカスが外れた時、空の場合は0を表示
                          if (e.target.value === '') {
                            handleQuantityChange(index, '0');
                          }
                        }}
                        disabled={item.isDisabled}
                        className={`${styles.quantityInput} ${item.quantityError && !item.isDisabled ? styles.inputError : ''}`}
                      />
                    </td>
                    <td className={styles.billingColumn}>
                      <Select
                        options={billingCategoryOptions}
                        value={item.billingCategory || ''}
                        onChange={(e) => handleBillingCategoryChange(index, e.target.value)}
                        disabled={item.isDisabled}
                        style={{ minWidth: '120px' }}
                      />
                    </td>
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
        </div>
      </div>

      {/* パーツ検索モーダル */}
      <PartsSearchModal
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        onRegister={(selectedParts) => {
          // 選択されたパーツを実績に追加
          const newRows: RegistrationRow[] = selectedParts.map(part => ({
            ...part,
            checked: true,
            consumptionQuantity: 0,
            billingCategory: '',
            hasError: false,
            isDisabled: false,
          }));
          setResults([...results, ...newRows]);
          // トースト通知を表示
          setToastMessage(`${selectedParts.length}件のパーツが登録されました`);
        }}
        onCloseModal={handleCloseSearchModal}
      />

      {/* トースト通知 */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          duration={5000}
          onClose={() => setToastMessage(null)}
          position="top-center"
        />
      )}
    </div>
  );
};

// パーツ検索モーダル
interface PartsSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (selectedParts: PartsSearchResult[]) => void;
  onCloseModal: () => void; // モーダルを閉じる関数を追加
}

const PartsSearchModal = ({ isOpen, onClose, onRegister, onCloseModal }: PartsSearchModalProps) => {
  const [bu, setBu] = useState<string>('');
  const [partsNumber, setPartsNumber] = useState<string>('');
  const [partsName, setPartsName] = useState<string>('');
  const [results, setResults] = useState<PartsSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedParts, setSelectedParts] = useState<Set<string>>(new Set());
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  // モーダルが閉じられたときに検索結果をリセット
  useEffect(() => {
    if (!isOpen) {
      setHasSearched(false);
      setResults([]);
      setSelectedParts(new Set());
      setBu('');
      setPartsNumber('');
      setPartsName('');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
    setLoading(false);
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

  const handlePartsNumberClick = (partsNumber: string) => {
    // 常に別タブでパーツ詳細画面を開く
    const detailUrl = `${window.location.origin}${window.location.pathname}?partsNumber=${encodeURIComponent(partsNumber)}`;
    window.open(detailUrl, '_blank');
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      // シミュレート用の遅延
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const selectedPartsList = results.filter(r => selectedParts.has(r.partsNumber));
      onRegister(selectedPartsList);

      // ローディング状態を解除
      setIsRegistering(false);

      // モーダルを閉じる前にリセット
      handleReset();

      // ローディングが終わったらモーダルを閉じる（PartsRequestModalと同じ方法）
      onCloseModal();
    } catch (error) {
      console.error('登録エラー:', error);
      setIsRegistering(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const footer = (
    <div className={styles.modalFooter}>
      <Button variant="sub" onClick={handleCancel}>
        キャンセル
      </Button>
      <Button
        variant="default"
        onClick={handleRegister}
        disabled={selectedParts.size === 0 || isRegistering}
        loading={isRegistering}
      >
        登録
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="パーツ検索"
      footer={footer}
      size="large"
    >
      <div className={styles.searchModalContent}>
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
            <div className={styles.buttonRow}>
              <Button variant="default" onClick={handleSearch} disabled={loading}>
                検索
              </Button>
              <Button variant="sub" onClick={handleReset} disabled={loading}>
                リセット
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.resultsContainer}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <Spinner size="large" variant="primary" label="検索中..." />
            </div>
          ) : hasSearched ? (
            <>
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
            </>
          ) : (
            <div className={styles.noResults}>
              <p>検索条件を入力して検索してください</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};


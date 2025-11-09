import { useState, useEffect, useRef } from 'react';
import { Button, Select, Toast } from '../components';
import type { SelectOption } from '../components';
import { searchParts, buOptions, type PartsSearchResult } from '../services/mockData';
import { FiX } from 'react-icons/fi';
import styles from './PartsRegistration.module.css';

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

// パーツ番号をクリックした時の処理
const handlePartsNumberClick = (partsNumber: string) => {
  // 常に別タブでパーツ詳細画面を開く（元の登録画面はそのまま）
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
    // 通常のWeb環境の場合、別タブで開く（元の登録画面はそのまま）
    window.open(detailUrl, '_blank');
  }
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

interface ValidationError {
  partsNumber: string;
  partsName: string;
  errors: string[];
}

export const PartsRegistration = () => {
  // 上部セクションの状態
  const [upperSelection, setUpperSelection] = useState<string>('');
  const [upperBu, setUpperBu] = useState<string>('');
  const [upperCustomerSite, setUpperCustomerSite] = useState<string>('');
  const [upperOrderSource, setUpperOrderSource] = useState<string>('');
  const [upperResults, setUpperResults] = useState<RegistrationRow[]>([]);

  // 下部セクションの状態
  const [lowerResults, setLowerResults] = useState<RegistrationRow[]>([]);

  // 確定処理のローディング状態
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  
  // エラー状態
  const [hasValidationError, setHasValidationError] = useState<boolean>(false);
  
  // トースト通知の状態
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // エラー行への参照
  const upperErrorRefs = useRef<{ [key: number]: HTMLTableRowElement | null }>({});
  const lowerErrorRefs = useRef<{ [key: number]: HTMLTableRowElement | null }>({});

  // モックデータの読み込み（初期表示用）
  useEffect(() => {
    const loadInitialData = async () => {
      const searchResults = await searchParts({});
      const upperData: RegistrationRow[] = searchResults.map(item => ({
        ...item,
        checked: false,
        consumptionQuantity: undefined,
        billingCategory: '',
      }));
      const lowerData: RegistrationRow[] = searchResults.map(item => ({
        ...item,
        checked: false,
        consumptionQuantity: undefined,
        billingCategory: '',
        partsCategory: '',
      }));
      setUpperResults(upperData);
      setLowerResults(lowerData);
    };
    loadInitialData();
  }, []);

  // 請求区分の選択肢
  const billingCategoryOptions: SelectOption[] = [
    { value: '', label: '選択してください' },
    { value: '有償', label: '有償' },
    { value: '無償', label: '無償' },
    { value: '保証', label: '保証' },
  ];

  // パーツ区分の選択肢
  const partsCategoryOptions: SelectOption[] = [
    { value: '', label: '選択してください' },
    { value: '顧客提供', label: '顧客提供' },
    { value: '預託在庫', label: '預託在庫' },
  ];

  // 上部セクションの全件チェック/解除
  const handleUpperSelectAll = () => {
    const allChecked = upperResults.every(item => item.checked || item.isDisabled);
    const newResults = upperResults.map(item => {
      if (item.isDisabled) {
        return item; // 非活性の行は変更しない
      }
      return {
        ...item,
        checked: !allChecked,
        hasError: false, // チェックを変更したらエラーをクリア
      };
    });
    setUpperResults(newResults);
    setHasValidationError(false);
  };

  // 上部セクションのチェックボックス変更
  const handleUpperCheckboxChange = (index: number) => {
    const newResults = [...upperResults];
    if (newResults[index].isDisabled) {
      return; // 非活性の行は変更不可
    }
    newResults[index].checked = !newResults[index].checked;
    newResults[index].hasError = false; // チェックを変更したらエラーをクリア
    setUpperResults(newResults);
    setHasValidationError(false);
  };

  // 上部セクションの消費数量変更
  const handleUpperQuantityChange = (index: number, value: string) => {
    if (upperResults[index].isDisabled) {
      return; // 非活性の行は変更不可
    }
    // 数値のみ許可し、3桁まで制限
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 3);
    const newResults = [...upperResults];
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
    setUpperResults(newResults);
    setHasValidationError(false);
  };

  // 上部セクションの請求区分変更
  const handleUpperBillingCategoryChange = (index: number, value: string) => {
    if (upperResults[index].isDisabled) {
      return; // 非活性の行は変更不可
    }
    const newResults = [...upperResults];
    newResults[index].billingCategory = value;
    // 選択肢を選んだらチェックボックスをオンにする
    if (value !== '') {
      newResults[index].checked = true;
    }
    newResults[index].hasError = false; // 値を変更したらエラーをクリア
    setUpperResults(newResults);
    setHasValidationError(false);
  };

  // 下部セクションの全件チェック/解除
  const handleLowerSelectAll = () => {
    const allChecked = lowerResults.every(item => item.checked || item.isDisabled);
    const newResults = lowerResults.map(item => {
      if (item.isDisabled) {
        return item; // 非活性の行は変更しない
      }
      return {
        ...item,
        checked: !allChecked,
        hasError: false, // チェックを変更したらエラーをクリア
      };
    });
    setLowerResults(newResults);
    setHasValidationError(false);
  };

  // 下部セクションのチェックボックス変更
  const handleLowerCheckboxChange = (index: number) => {
    const newResults = [...lowerResults];
    if (newResults[index].isDisabled) {
      return; // 非活性の行は変更不可
    }
    newResults[index].checked = !newResults[index].checked;
    newResults[index].hasError = false; // チェックを変更したらエラーをクリア
    setLowerResults(newResults);
    setHasValidationError(false);
  };

  // 下部セクションの消費数量変更
  const handleLowerQuantityChange = (index: number, value: string) => {
    if (lowerResults[index].isDisabled) {
      return; // 非活性の行は変更不可
    }
    // 数値のみ許可し、3桁まで制限
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 3);
    const newResults = [...lowerResults];
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
    setLowerResults(newResults);
    setHasValidationError(false);
  };

  // 下部セクションのパーツ区分変更
  const handleLowerPartsCategoryChange = (index: number, value: string) => {
    if (lowerResults[index].isDisabled) {
      return; // 非活性の行は変更不可
    }
    const newResults = [...lowerResults];
    newResults[index].partsCategory = value;
    // 選択肢を選んだらチェックボックスをオンにする
    if (value !== '') {
      newResults[index].checked = true;
    }
    newResults[index].hasError = false; // 値を変更したらエラーをクリア
    setLowerResults(newResults);
    setHasValidationError(false);
  };

  // 下部セクションの請求区分変更
  const handleLowerBillingCategoryChange = (index: number, value: string) => {
    if (lowerResults[index].isDisabled) {
      return; // 非活性の行は変更不可
    }
    const newResults = [...lowerResults];
    newResults[index].billingCategory = value;
    // 選択肢を選んだらチェックボックスをオンにする
    if (value !== '') {
      newResults[index].checked = true;
    }
    newResults[index].hasError = false; // 値を変更したらエラーをクリア
    setLowerResults(newResults);
    setHasValidationError(false);
  };

  // チェックONかつ値が全て入力されている行があるかチェック
  const hasValidCheckedRow = (): boolean => {
    const hasValidUpperRow = upperResults.some(row => {
      if (!row.checked || row.isDisabled) {
        return false;
      }
      const hasValidQuantity = row.consumptionQuantity !== undefined && row.consumptionQuantity > 0;
      const hasValidBillingCategory = row.billingCategory && row.billingCategory !== '';
      return hasValidQuantity && hasValidBillingCategory;
    });

    const hasValidLowerRow = lowerResults.some(row => {
      if (!row.checked || row.isDisabled) {
        return false;
      }
      const hasValidQuantity = row.consumptionQuantity !== undefined && row.consumptionQuantity > 0;
      const hasValidBillingCategory = row.billingCategory && row.billingCategory !== '';
      const hasValidPartsCategory = row.partsCategory && row.partsCategory !== '';
      return hasValidQuantity && hasValidBillingCategory && hasValidPartsCategory;
    });

    return hasValidUpperRow || hasValidLowerRow;
  };

  // バリデーション処理
  const validateRows = (rows: RegistrationRow[], isUpper: boolean): { isValid: boolean; errorCount: number; errors: ValidationError[] } => {
    let hasError = false;
    let errorCount = 0;
    const validationErrors: ValidationError[] = [];
    
    const updatedRows = rows.map(row => {
      if (row.checked && !row.isDisabled) {
        const errors: string[] = [];
        let rowHasError = false;
        
        // チェックありで値が0、または選択肢が「選択してください」の場合はエラー
        const isQuantityZero = row.consumptionQuantity === undefined || row.consumptionQuantity === 0;
        const isBillingCategoryEmpty = !row.billingCategory || row.billingCategory === '';
        const isPartsCategoryEmpty = !isUpper && (!row.partsCategory || row.partsCategory === '');
        
        if (isQuantityZero) {
          errors.push('消費数量が0です');
          rowHasError = true;
        }
        if (isBillingCategoryEmpty) {
          errors.push('請求区分が未選択です');
          rowHasError = true;
        }
        if (isPartsCategoryEmpty) {
          errors.push('パーツ区分が未選択です');
          rowHasError = true;
        }
        
        if (rowHasError) {
          hasError = true;
          errorCount++;
          validationErrors.push({
            partsNumber: row.partsNumber,
            partsName: row.partsName,
            errors: errors
          });
          return { 
            ...row, 
            hasError: true,
            quantityError: isQuantityZero,
            billingCategoryError: isBillingCategoryEmpty,
            partsCategoryError: isPartsCategoryEmpty
          };
        }
      }
      return { 
        ...row, 
        hasError: false,
        quantityError: false,
        billingCategoryError: false,
        partsCategoryError: false
      };
    });
    
    if (isUpper) {
      setUpperResults(updatedRows);
    } else {
      setLowerResults(updatedRows);
    }
    
    return { isValid: !hasError, errorCount, errors: validationErrors };
  };
  
  // 最初のエラー行までスクロール
  const scrollToFirstError = () => {
    // 上部セクションのエラーをチェック
    for (let i = 0; i < upperResults.length; i++) {
      if (upperResults[i].hasError && upperErrorRefs.current[i]) {
        upperErrorRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
    // 下部セクションのエラーをチェック
    for (let i = 0; i < lowerResults.length; i++) {
      if (lowerResults[i].hasError && lowerErrorRefs.current[i]) {
        lowerErrorRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
  };

  // 確定ボタンの処理
  const handleConfirm = async () => {
    setHasValidationError(false);
    setToastMessage(null);
    
    // バリデーション
    const upperValidation = validateRows(upperResults, true);
    const lowerValidation = validateRows(lowerResults, false);
    
    if (!upperValidation.isValid || !lowerValidation.isValid) {
      setHasValidationError(true);
      const allErrors = [...upperValidation.errors, ...lowerValidation.errors];
      const totalErrors = allErrors.length;
      
      // エラーメッセージを構築
      let errorMessage = `${totalErrors}件のエラーがあります：\n\n`;
      errorMessage += '【入力ルール】\n';
      errorMessage += '・消費数量: 0~999 の数値を入力してください\n';
      errorMessage += '・請求区分: 選択してください\n';
      if (lowerValidation.errors.length > 0) {
        errorMessage += '・パーツ区分: 選択してください\n';
      }
      errorMessage += '\n【エラー詳細】\n';
      allErrors.forEach((error, index) => {
        errorMessage += `${index + 1}. ${error.partsNumber} (${error.partsName})\n`;
        error.errors.forEach(err => {
          errorMessage += `   - ${err}\n`;
        });
        if (index < allErrors.length - 1) {
          errorMessage += '\n';
        }
      });
      
      setToastMessage(errorMessage);
      
      // 少し遅延してからスクロール（トーストが表示された後）
      setTimeout(() => {
        scrollToFirstError();
      }, 100);
      
      return;
    }
    
    setIsConfirming(true);
    try {
      // シミュレート用の遅延
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // 確定後、チェックがONの行を非活性にする
      const updatedUpperResults = upperResults.map(row => 
        row.checked ? { ...row, checked: true, isDisabled: true, hasError: false } : row
      );
      const updatedLowerResults = lowerResults.map(row => 
        row.checked ? { ...row, checked: true, isDisabled: true, hasError: false } : row
      );
      
      setUpperResults(updatedUpperResults);
      setLowerResults(updatedLowerResults);
      
      console.log('確定処理', { upperResults: updatedUpperResults, lowerResults: updatedLowerResults });
      // TODO: 実際の確定処理を実装
    } catch (error) {
      console.error('確定処理エラー:', error);
    } finally {
      setIsConfirming(false);
    }
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
      {/* 上部セクション */}
      <div className={styles.upperSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>パーツ実績登録（事前受注・FE手配・マイグレ）</h2>
          <div className={styles.headerRight}>
            <Select
              options={[
                { value: '', label: '選択してください' },
                { value: '事前受注', label: '事前受注' },
                { value: 'FE手配', label: 'FE手配' },
                { value: 'マイグレ', label: 'マイグレ' },
              ]}
              value={upperSelection}
              onChange={(e) => setUpperSelection(e.target.value)}
              style={{ minWidth: '150px' }}
            />
            <Button 
              variant="default" 
              onClick={handleConfirm} 
              loading={isConfirming} 
              disabled={isConfirming || !hasValidCheckedRow()}
            >
              確定
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
                        checked={upperResults.length > 0 && upperResults.every(item => item.checked || item.isDisabled)}
                        onChange={handleUpperSelectAll}
                        className={styles.checkboxInput}
                      />
                      <span className={styles.checkboxCustom}></span>
                    </label>
                  </th>
                  <th className={styles.quantityColumn}>消費数量</th>
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
                  <th className={styles.billingColumn}>請求区分</th>
                </tr>
              </thead>
              <tbody>
                {upperResults.map((item, index) => (
                  <tr 
                    key={index}
                    ref={(el) => { if (item.hasError) upperErrorRefs.current[index] = el; }}
                    className={`${item.hasError ? styles.hasError : ''} ${item.isDisabled ? styles.isDisabled : ''}`}
                  >
                    <td className={styles.checkboxColumn}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => handleUpperCheckboxChange(index)}
                          disabled={item.isDisabled}
                          className={styles.checkboxInput}
                        />
                        <span className={styles.checkboxCustom}></span>
                      </label>
                    </td>
                    <td className={styles.quantityColumn}>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={3}
                        value={item.consumptionQuantity !== undefined ? item.consumptionQuantity : ''}
                        onChange={(e) => handleUpperQuantityChange(index, e.target.value)}
                        onBlur={(e) => {
                          // フォーカスが外れた時、空の場合は0を表示
                          if (e.target.value === '') {
                            handleUpperQuantityChange(index, '0');
                          }
                        }}
                        disabled={item.isDisabled}
                        className={`${styles.quantityInput} ${item.quantityError && !item.isDisabled ? styles.inputError : ''}`}
                      />
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
                    <td className={styles.billingColumn}>
                      <Select
                        options={billingCategoryOptions}
                        value={item.billingCategory || ''}
                        onChange={(e) => handleUpperBillingCategoryChange(index, e.target.value)}
                        disabled={item.isDisabled}
                        style={{ minWidth: '120px' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 下部セクション */}
      <div className={styles.lowerSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>パーツ実績登録（顧客提供・預託在庫）</h2>
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
                        checked={lowerResults.length > 0 && lowerResults.every(item => item.checked || item.isDisabled)}
                        onChange={handleLowerSelectAll}
                        className={styles.checkboxInput}
                      />
                      <span className={styles.checkboxCustom}></span>
                    </label>
                  </th>
                  <th className={styles.quantityColumn}>消費数量</th>
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
                  <th className={styles.categoryColumn}>パーツ区分</th>
                  <th className={styles.billingColumn}>請求区分</th>
                </tr>
              </thead>
              <tbody>
                {lowerResults.map((item, index) => (
                  <tr 
                    key={index}
                    ref={(el) => { if (item.hasError) lowerErrorRefs.current[index] = el; }}
                    className={`${item.hasError ? styles.hasError : ''} ${item.isDisabled ? styles.isDisabled : ''}`}
                  >
                    <td className={styles.checkboxColumn}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => handleLowerCheckboxChange(index)}
                          disabled={item.isDisabled}
                          className={styles.checkboxInput}
                        />
                        <span className={styles.checkboxCustom}></span>
                      </label>
                    </td>
                    <td className={styles.quantityColumn}>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={3}
                        value={item.consumptionQuantity !== undefined ? item.consumptionQuantity : ''}
                        onChange={(e) => handleLowerQuantityChange(index, e.target.value)}
                        onBlur={(e) => {
                          // フォーカスが外れた時、空の場合は0を表示
                          if (e.target.value === '') {
                            handleLowerQuantityChange(index, '0');
                          }
                        }}
                        disabled={item.isDisabled}
                        className={`${styles.quantityInput} ${item.quantityError && !item.isDisabled ? styles.inputError : ''}`}
                      />
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
                    <td className={styles.categoryColumn}>
                      <Select
                        options={partsCategoryOptions}
                        value={item.partsCategory || ''}
                        onChange={(e) => handleLowerPartsCategoryChange(index, e.target.value)}
                        disabled={item.isDisabled}
                        style={{ minWidth: '120px' }}
                      />
                    </td>
                    <td className={styles.billingColumn}>
                      <Select
                        options={billingCategoryOptions}
                        value={item.billingCategory || ''}
                        onChange={(e) => handleLowerBillingCategoryChange(index, e.target.value)}
                        disabled={item.isDisabled}
                        style={{ minWidth: '120px' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* トースト通知 */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="error"
          duration={5000}
          onClose={() => setToastMessage(null)}
          position="top-center"
        />
      )}
    </div>
  );
};


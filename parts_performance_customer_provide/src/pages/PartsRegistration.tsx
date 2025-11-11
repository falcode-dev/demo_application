import { useState } from 'react';
import { Button, Select, Modal, Input, SidePanel } from '../components';
import type { SelectOption } from '../components';
import type { PartsSearchResult } from '../services/mockData';
import { openPartsDetail } from '../utils/navigation';
import { useToastContext } from '../contexts/ToastContext';
import { buOptions, customerSiteOptions, orderSourceOptions } from '../services/mockData';
import { FiX, FiFilter } from 'react-icons/fi';
import styles from './PartsRegistration.module.css';

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
  customerSite?: string;
  orderSource?: string;
}

export const PartsRegistration = () => {
  const { success } = useToastContext();
  const [upperBu, setUpperBu] = useState<string>('');
  const [upperCustomerSite, setUpperCustomerSite] = useState<string>('');
  const [upperOrderSource, setUpperOrderSource] = useState<string>('');
  const [allResults, setAllResults] = useState<RegistrationRow[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);
  const [tempBu, setTempBu] = useState<string>('');
  const [tempCustomerSite, setTempCustomerSite] = useState<string>('');
  const [tempOrderSource, setTempOrderSource] = useState<string>('');

  const results = allResults.filter((item) => {
    if (upperBu && item.bu !== upperBu) return false;
    if (upperCustomerSite && item.customerSite !== upperCustomerSite) return false;
    if (upperOrderSource && item.orderSource !== upperOrderSource) return false;
    return true;
  });

  const handleOpenRequestModal = () => {
    setIsRequestModalOpen(true);
  };

  const handleCloseRequestModal = () => {
    setIsRequestModalOpen(false);
  };

  const handleOpenFilterPanel = () => {
    setTempBu(upperBu);
    setTempCustomerSite(upperCustomerSite);
    setTempOrderSource(upperOrderSource);
    setIsFilterPanelOpen(true);
  };

  const handleCloseFilterPanel = () => {
    setIsFilterPanelOpen(false);
  };

  const handleApplyFilter = () => {
    setUpperBu(tempBu);
    setUpperCustomerSite(tempCustomerSite);
    setUpperOrderSource(tempOrderSource);
    setIsFilterPanelOpen(false);
  };

  const handleClearFilter = (type: 'bu' | 'customerSite' | 'orderSource') => {
    if (type === 'bu') {
      setUpperBu('');
    } else if (type === 'customerSite') {
      setUpperCustomerSite('');
    } else if (type === 'orderSource') {
      setUpperOrderSource('');
    }
  };

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

  const handleSelectAll = () => {
    const allChecked = results.every(item => item.checked || item.isDisabled);
    const newResults = allResults.map(item => {
      if (item.isDisabled) {
        return item;
      }
      const matchesFilter =
        (!upperBu || item.bu === upperBu) &&
        (!upperCustomerSite || item.customerSite === upperCustomerSite) &&
        (!upperOrderSource || item.orderSource === upperOrderSource);

      if (matchesFilter) {
        return {
          ...item,
          checked: !allChecked,
          hasError: false,
        };
      }
      return item;
    });
    setAllResults(newResults);
  };

  const handleCheckboxChange = (index: number) => {
    const resultItem = results[index];
    const actualIndex = allResults.findIndex(item =>
      item.partsNumber === resultItem.partsNumber &&
      item.bu === resultItem.bu
    );
    if (actualIndex === -1 || allResults[actualIndex].isDisabled) {
      return;
    }

    const newResults = [...allResults];
    newResults[actualIndex].checked = !newResults[actualIndex].checked;
    newResults[actualIndex].hasError = false;
    setAllResults(newResults);
  };

  const handleQuantityChange = (index: number, value: string) => {
    const resultItem = results[index];
    const actualIndex = allResults.findIndex(item =>
      item.partsNumber === resultItem.partsNumber &&
      item.bu === resultItem.bu
    );
    if (actualIndex === -1 || allResults[actualIndex].isDisabled) {
      return;
    }
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 3);
    const newResults = [...allResults];
    if (numericValue === '') {
      newResults[actualIndex].consumptionQuantity = 0;
    } else {
      const numValue = parseInt(numericValue, 10);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 999) {
        newResults[actualIndex].consumptionQuantity = numValue;
        newResults[actualIndex].checked = true;
      }
    }
    newResults[actualIndex].hasError = false;
    setAllResults(newResults);
  };

  const handlePartsCategoryChange = (index: number, value: string) => {
    const resultItem = results[index];
    const actualIndex = allResults.findIndex(item =>
      item.partsNumber === resultItem.partsNumber &&
      item.bu === resultItem.bu
    );
    if (actualIndex === -1 || allResults[actualIndex].isDisabled) {
      return;
    }
    const newResults = [...allResults];
    newResults[actualIndex].partsCategory = value;
    if (value !== '') {
      newResults[actualIndex].checked = true;
    }
    newResults[actualIndex].hasError = false;
    setAllResults(newResults);
  };

  const handleBillingCategoryChange = (index: number, value: string) => {
    const resultItem = results[index];
    const actualIndex = allResults.findIndex(item =>
      item.partsNumber === resultItem.partsNumber &&
      item.bu === resultItem.bu
    );
    if (actualIndex === -1 || allResults[actualIndex].isDisabled) {
      return;
    }
    const newResults = [...allResults];
    newResults[actualIndex].billingCategory = value;
    if (value !== '') {
      newResults[actualIndex].checked = true;
    }
    newResults[actualIndex].hasError = false;
    setAllResults(newResults);
  };


  const handlePartsNumberClick = (partsNumber: string) => {
    openPartsDetail(partsNumber);
  };

  return (
    <div className={styles.container}>
      <div className={styles.lowerSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>パーツ実績登録（顧客提供・預託在庫）</h2>
          <div className={styles.headerRight}>
            <button
              className={styles.filterButton}
              onClick={handleOpenFilterPanel}
              disabled={allResults.length === 0}
              aria-label="フィルターを編集する"
            >
              <FiFilter />
              <span className={styles.filterButtonText}>フィルターを編集する</span>
            </button>
            <Button
              variant="default"
              onClick={handleOpenRequestModal}
            >
              パーツリクエスト登録
            </Button>
          </div>
        </div>

        <div className={styles.tagsContainer}>
          {upperBu && (
            <div className={`${styles.tag} ${styles.tagActive}`}>
              <span className={styles.tagText}>BU：{upperBu}</span>
              <button
                type="button"
                className={styles.tagClose}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearFilter('bu');
                }}
                aria-label="BUタグを削除"
              >
                <FiX />
              </button>
            </div>
          )}
          {upperCustomerSite && (
            <div className={`${styles.tag} ${styles.tagActive}`}>
              <span className={styles.tagText}>顧客拠点：{upperCustomerSite}</span>
              <button
                type="button"
                className={styles.tagClose}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearFilter('customerSite');
                }}
                aria-label="顧客拠点タグを削除"
              >
                <FiX />
              </button>
            </div>
          )}
          {upperOrderSource && (
            <div className={`${styles.tag} ${styles.tagActive}`}>
              <span className={styles.tagText}>オーダ元：{upperOrderSource}</span>
              <button
                type="button"
                className={styles.tagClose}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearFilter('orderSource');
                }}
                aria-label="オーダ元タグを削除"
              >
                <FiX />
              </button>
            </div>
          )}
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
                  <th className={styles.categoryColumn}>パーツ区分</th>
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
                    <td className={styles.categoryColumn}>
                      <Select
                        options={partsCategoryOptions}
                        value={item.partsCategory || ''}
                        onChange={(e) => handlePartsCategoryChange(index, e.target.value)}
                        disabled={item.isDisabled}
                        style={{ minWidth: '120px' }}
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

      {/* パーツリクエスト登録モーダル */}
      <PartsRequestModal
        isOpen={isRequestModalOpen}
        onClose={handleCloseRequestModal}
        onRegister={(requestData) => {
          // 登録されたデータを実績に追加
          const newRow: RegistrationRow = {
            bu: requestData.bu || '',
            partsNumber: requestData.partsNumber || '',
            partsName: requestData.name || '',
            unit: requestData.shippingUnit || '',
            signalCode: requestData.signalCode || '',
            salesStatus: requestData.salesPossibleStatus || '',
            intelFlag: '',
            consumableFlag: '',
            remarks: requestData.comment || '',
            category: requestData.product || '',
            checked: true,
            consumptionQuantity: requestData.orderQuantity || requestData.quantity || 0,
            billingCategory: '',
            partsCategory: '顧客提供',
            hasError: false,
            isDisabled: false,
          };
          const newRowWithFilter: RegistrationRow = {
            ...newRow,
            customerSite: upperCustomerSite || undefined,
            orderSource: upperOrderSource || undefined,
          };
          setAllResults([...allResults, newRowWithFilter]);
          success('パーツリクエストが登録されました');
        }}
        isRegistering={isRegistering}
        setIsRegistering={setIsRegistering}
        onCloseModal={handleCloseRequestModal}
      />

      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={handleCloseFilterPanel}
        bu={tempBu}
        customerSite={tempCustomerSite}
        orderSource={tempOrderSource}
        onBuChange={setTempBu}
        onCustomerSiteChange={setTempCustomerSite}
        onOrderSourceChange={setTempOrderSource}
        onApply={handleApplyFilter}
      />
    </div>
  );
};

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  bu: string;
  customerSite: string;
  orderSource: string;
  onBuChange: (value: string) => void;
  onCustomerSiteChange: (value: string) => void;
  onOrderSourceChange: (value: string) => void;
  onApply: () => void;
}

const FilterPanel = ({
  isOpen,
  onClose,
  bu,
  customerSite,
  orderSource,
  onBuChange,
  onCustomerSiteChange,
  onOrderSourceChange,
  onApply,
}: FilterPanelProps) => {
  const buOptionsWithEmpty: SelectOption[] = [
    { value: '', label: '選択してください' },
    ...buOptions,
  ];

  const customerSiteOptionsWithEmpty: SelectOption[] = [
    { value: '', label: '選択してください' },
    ...customerSiteOptions,
  ];

  const orderSourceOptionsWithEmpty: SelectOption[] = [
    { value: '', label: '選択してください' },
    ...orderSourceOptions,
  ];

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="フィルターを編集する"
      position="right"
      width="400px"
    >
      <div className={styles.filterPanelContent}>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <Select
              label="BU"
              options={buOptionsWithEmpty}
              value={bu}
              onChange={(e) => onBuChange(e.target.value)}
              placeholder="選択してください"
              fullWidth
            />
          </div>
          <div className={styles.formField}>
            <Select
              label="顧客拠点"
              options={customerSiteOptionsWithEmpty}
              value={customerSite}
              onChange={(e) => onCustomerSiteChange(e.target.value)}
              placeholder="選択してください"
              fullWidth
            />
          </div>
          <div className={styles.formField}>
            <Select
              label="オーダ元"
              options={orderSourceOptionsWithEmpty}
              value={orderSource}
              onChange={(e) => onOrderSourceChange(e.target.value)}
              placeholder="選択してください"
              fullWidth
            />
          </div>
        </div>
        <div className={styles.filterPanelFooter}>
          <Button variant="sub" onClick={onClose} fullWidth>
            キャンセル
          </Button>
          <Button variant="default" onClick={onApply} fullWidth>
            OK
          </Button>
        </div>
      </div>
    </SidePanel>
  );
};

// パーツリクエスト登録モーダル
interface PartsRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: PartsRequestData) => void;
  isRegistering: boolean;
  setIsRegistering: (value: boolean) => void;
  onCloseModal: () => void; // モーダルを閉じる関数を追加
}

interface PartsRequestData {
  name: string;
  orderQuantity: number;
  comment: string;
  signalCode: string;
  partsDetail: string;
  partsNumber: string;
  partsReturn: string;
  price: number;
  customerPrice: number;
  factoryPreparedParts: string;
  purchasePossibleStatus: string;
  shippingUnit: string;
  quantity: number;
  product: string;
  purchaseOrder: string;
  salesPossible: string;
  salesPossibleStatus: string;
  returnReason: string;
  bu?: string;
}

const PartsRequestModal = ({ isOpen, onClose, onRegister, isRegistering, setIsRegistering, onCloseModal }: PartsRequestModalProps) => {
  const [name, setName] = useState<string>('');
  const [orderQuantity, setOrderQuantity] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [signalCode, setSignalCode] = useState<string>('');
  const [partsDetail, setPartsDetail] = useState<string>('');
  const [partsNumber, setPartsNumber] = useState<string>('');
  const [partsReturn, setPartsReturn] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [customerPrice, setCustomerPrice] = useState<string>('');
  const [factoryPreparedParts, setFactoryPreparedParts] = useState<string>('');
  const [purchasePossibleStatus, setPurchasePossibleStatus] = useState<string>('');
  const [shippingUnit, setShippingUnit] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [product, setProduct] = useState<string>('');
  const [purchaseOrder, setPurchaseOrder] = useState<string>('');
  const [salesPossible, setSalesPossible] = useState<string>('');
  const [salesPossibleStatus, setSalesPossibleStatus] = useState<string>('');
  const [returnReason, setReturnReason] = useState<string>('');

  const yesNoOptions: SelectOption[] = [
    { value: '', label: '選択してください' },
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

  const purchasePossibleStatusOptions: SelectOption[] = [
    { value: '', label: '選択してください' },
    { value: '可能', label: '可能' },
    { value: '不可', label: '不可' },
    { value: '要確認', label: '要確認' },
  ];

  const salesPossibleStatusOptions: SelectOption[] = [
    { value: '', label: '選択してください' },
    { value: '販売可能', label: '販売可能' },
    { value: '販売不可', label: '販売不可' },
    { value: '要確認', label: '要確認' },
  ];

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      // シミュレート用の遅延
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const requestData: PartsRequestData = {
        name,
        orderQuantity: parseInt(orderQuantity, 10) || 0,
        comment,
        signalCode,
        partsDetail,
        partsNumber,
        partsReturn,
        price: parseFloat(price) || 0,
        customerPrice: parseFloat(customerPrice) || 0,
        factoryPreparedParts,
        purchasePossibleStatus,
        shippingUnit,
        quantity: parseInt(quantity, 10) || 0,
        product,
        purchaseOrder,
        salesPossible,
        salesPossibleStatus,
        returnReason,
      };

      onRegister(requestData);

      // フォームをリセット
      setName('');
      setOrderQuantity('');
      setComment('');
      setSignalCode('');
      setPartsDetail('');
      setPartsNumber('');
      setPartsReturn('');
      setPrice('');
      setCustomerPrice('');
      setFactoryPreparedParts('');
      setPurchasePossibleStatus('');
      setShippingUnit('');
      setQuantity('');
      setProduct('');
      setPurchaseOrder('');
      setSalesPossible('');
      setSalesPossibleStatus('');
      setReturnReason('');

      // ローディング状態を解除
      setIsRegistering(false);

      // ローディングが終わったらモーダルを閉じる（PartsSearch.tsxと同じ方法）
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
      <Button variant="sub" onClick={handleCancel} disabled={isRegistering}>
        キャンセル
      </Button>
      <Button variant="default" onClick={handleRegister} loading={isRegistering}>
        登録
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="パーツリクエスト登録"
      footer={footer}
      size="large"
    >
      <div className={styles.requestModalContent}>
        <div className={styles.requestForm}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input
                label="名前"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="名前を入力"
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Input
                label="オーダー数量"
                type="number"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                placeholder="オーダー数量を入力"
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.textareaLabel}>コメント</label>
              <textarea
                className={styles.textarea}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="コメントを入力"
                rows={3}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input
                label="シグナルコード"
                value={signalCode}
                onChange={(e) => setSignalCode(e.target.value)}
                placeholder="シグナルコードを入力"
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Input
                label="パーツ詳細"
                value={partsDetail}
                onChange={(e) => setPartsDetail(e.target.value)}
                placeholder="パーツ詳細を入力"
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input
                label="パーツ番号"
                value={partsNumber}
                onChange={(e) => setPartsNumber(e.target.value)}
                placeholder="パーツ番号を入力"
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Select
                label="パーツ返却"
                options={yesNoOptions}
                value={partsReturn}
                onChange={(e) => setPartsReturn(e.target.value)}
                placeholder="選択してください"
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input
                label="価格"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="価格を入力"
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Input
                label="顧客価格"
                type="number"
                value={customerPrice}
                onChange={(e) => setCustomerPrice(e.target.value)}
                placeholder="顧客価格を入力"
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Select
                label="工場準備済みパーツ"
                options={yesNoOptions}
                value={factoryPreparedParts}
                onChange={(e) => setFactoryPreparedParts(e.target.value)}
                placeholder="選択してください"
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Select
                label="購入可能ステータス"
                options={purchasePossibleStatusOptions}
                value={purchasePossibleStatus}
                onChange={(e) => setPurchasePossibleStatus(e.target.value)}
                placeholder="選択してください"
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input
                label="出荷単位"
                value={shippingUnit}
                onChange={(e) => setShippingUnit(e.target.value)}
                placeholder="出荷単位を入力"
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Input
                label="数量"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="数量を入力"
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input
                label="製品"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="製品を入力"
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Input
                label="発注書"
                value={purchaseOrder}
                onChange={(e) => setPurchaseOrder(e.target.value)}
                placeholder="発注書を入力"
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Select
                label="販売可能"
                options={yesNoOptions}
                value={salesPossible}
                onChange={(e) => setSalesPossible(e.target.value)}
                placeholder="選択してください"
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Select
                label="販売可能ステータス"
                options={salesPossibleStatusOptions}
                value={salesPossibleStatus}
                onChange={(e) => setSalesPossibleStatus(e.target.value)}
                placeholder="選択してください"
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input
                label="返却理由"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="返却理由を入力"
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};


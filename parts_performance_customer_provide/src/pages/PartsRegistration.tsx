import { useState } from 'react';
import { Button, Select, Modal, Input } from '../components';
import { useTranslation } from 'react-i18next';
import type { SelectOption } from '../components';
import type { PartsSearchResult } from '../services/mockData';
import { openPartsDetail } from '../utils/navigation';
import { useToastContext } from '../contexts/ToastContext';
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
  const { t } = useTranslation();
  const { success } = useToastContext();
  const [allResults, setAllResults] = useState<RegistrationRow[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const results = allResults;

  const handleOpenRequestModal = () => {
    setIsRequestModalOpen(true);
  };

  const handleCloseRequestModal = () => {
    setIsRequestModalOpen(false);
  };

  const billingCategoryOptions: SelectOption[] = [
    { value: '', label: t('common.select') },
    { value: '有償', label: t('partsRegistration.billingCategory.paid') },
    { value: '無償', label: t('partsRegistration.billingCategory.free') },
    { value: '保証', label: t('partsRegistration.billingCategory.warranty') },
  ];

  // パーツ区分の選択肢
  const partsCategoryOptions: SelectOption[] = [
    { value: '', label: t('common.select') },
    { value: '顧客提供', label: t('partsRegistration.customerProvide.partsCategory.customerProvided') },
    { value: '預託在庫', label: t('partsRegistration.customerProvide.partsCategory.consignedStock') },
  ];

  const handleSelectAll = () => {
    const allChecked = results.every(item => item.checked || item.isDisabled);
    const newResults = allResults.map(item => {
      if (item.isDisabled) {
        return item;
      }
      return {
        ...item,
        checked: !allChecked,
        hasError: false,
      };
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
          <h2 className={styles.sectionTitle}>{t('partsRegistration.customerProvide.title')}</h2>
          <div className={styles.headerRight}>
            <Button
              variant="default"
              onClick={handleOpenRequestModal}
            >
              {t('partsRegistration.customerProvide.openRequestModal')}
            </Button>
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
                  <th>{t('partsRegistration.table.partsNumber')}</th>
                  <th>{t('partsRegistration.table.partsName')}</th>
                  <th className={styles.quantityColumn}>{t('partsRegistration.table.consumptionQuantity')}</th>
                  <th className={styles.categoryColumn}>{t('partsRegistration.table.partsCategory')}</th>
                  <th className={styles.billingColumn}>{t('partsRegistration.table.billingCategory')}</th>
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
          setAllResults([...allResults, newRow]);
          success(t('partsRegistration.customerProvide.toastRegistered'));
        }}
        isRegistering={isRegistering}
        setIsRegistering={setIsRegistering}
        onCloseModal={handleCloseRequestModal}
      />

    </div>
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
  const { t } = useTranslation();
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
    { value: '', label: t('common.select') },
    { value: 'Yes', label: t('common.yes') },
    { value: 'No', label: t('common.no') },
  ];

  const purchasePossibleStatusOptions: SelectOption[] = [
    { value: '', label: t('common.select') },
    { value: '可能', label: t('partsRegistration.customerProvide.requestModal.purchasePossibleStatus.possible') },
    { value: '不可', label: t('partsRegistration.customerProvide.requestModal.purchasePossibleStatus.notPossible') },
    { value: '要確認', label: t('partsRegistration.customerProvide.requestModal.purchasePossibleStatus.needsConfirmation') },
  ];

  const salesPossibleStatusOptions: SelectOption[] = [
    { value: '', label: t('common.select') },
    { value: '販売可能', label: t('partsRegistration.customerProvide.requestModal.salesPossibleStatus.available') },
    { value: '販売不可', label: t('partsRegistration.customerProvide.requestModal.salesPossibleStatus.notAvailable') },
    { value: '要確認', label: t('partsRegistration.customerProvide.requestModal.salesPossibleStatus.needsConfirmation') },
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
        {t('common.cancel')}
      </Button>
      <Button variant="default" onClick={handleRegister} loading={isRegistering}>
        {t('common.register')}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('partsRegistration.customerProvide.requestModal.title')}
      footer={footer}
      size="large"
    >
      <div className={styles.requestModalContent}>
        <div className={styles.requestForm}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input
                label={t('partsRegistration.customerProvide.requestModal.fields.name.label')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('partsRegistration.customerProvide.requestModal.fields.name.placeholder')}
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Input
                label={t('partsRegistration.customerProvide.requestModal.fields.orderQuantity.label')}
                type="number"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                placeholder={t('partsRegistration.customerProvide.requestModal.fields.orderQuantity.placeholder')}
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.textareaLabel}>
                {t('partsRegistration.customerProvide.requestModal.fields.comment.label')}
              </label>
              <textarea
                className={styles.textarea}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('partsRegistration.customerProvide.requestModal.fields.comment.placeholder')}
                rows={3}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input
                label={t('partsRegistration.customerProvide.requestModal.fields.signalCode.label')}
                value={signalCode}
                onChange={(e) => setSignalCode(e.target.value)}
                placeholder={t('partsRegistration.customerProvide.requestModal.fields.signalCode.placeholder')}
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Input
                label={t('partsRegistration.customerProvide.requestModal.fields.partsDetail.label')}
                value={partsDetail}
                onChange={(e) => setPartsDetail(e.target.value)}
                placeholder={t('partsRegistration.customerProvide.requestModal.fields.partsDetail.placeholder')}
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input
                label={t('partsRegistration.customerProvide.requestModal.fields.partsNumber.label')}
                value={partsNumber}
                onChange={(e) => setPartsNumber(e.target.value)}
                placeholder={t('partsRegistration.customerProvide.requestModal.fields.partsNumber.placeholder')}
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Select
                label={t('partsRegistration.customerProvide.requestModal.fields.partsReturn.label')}
                options={yesNoOptions}
                value={partsReturn}
                onChange={(e) => setPartsReturn(e.target.value)}
                placeholder={t('common.select')}
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input
                label={t('partsRegistration.customerProvide.requestModal.fields.price.label')}
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={t('partsRegistration.customerProvide.requestModal.fields.price.placeholder')}
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Input
                label={t('partsRegistration.customerProvide.requestModal.fields.customerPrice.label')}
                type="number"
                value={customerPrice}
                onChange={(e) => setCustomerPrice(e.target.value)}
                placeholder={t('partsRegistration.customerProvide.requestModal.fields.customerPrice.placeholder')}
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Select
                label={t('partsRegistration.customerProvide.requestModal.fields.factoryPreparedParts.label')}
                options={yesNoOptions}
                value={factoryPreparedParts}
                onChange={(e) => setFactoryPreparedParts(e.target.value)}
                placeholder={t('common.select')}
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Select
                label={t('partsRegistration.customerProvide.requestModal.fields.purchasePossibleStatus.label')}
                options={purchasePossibleStatusOptions}
                value={purchasePossibleStatus}
                onChange={(e) => setPurchasePossibleStatus(e.target.value)}
                placeholder={t('common.select')}
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input
                label={t('partsRegistration.customerProvide.requestModal.fields.shippingUnit.label')}
                value={shippingUnit}
                onChange={(e) => setShippingUnit(e.target.value)}
                placeholder={t('partsRegistration.customerProvide.requestModal.fields.shippingUnit.placeholder')}
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Input
                label={t('partsRegistration.customerProvide.requestModal.fields.quantity.label')}
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={t('partsRegistration.customerProvide.requestModal.fields.quantity.placeholder')}
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input
                label={t('partsRegistration.customerProvide.requestModal.fields.product.label')}
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder={t('partsRegistration.customerProvide.requestModal.fields.product.placeholder')}
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Input
                label={t('partsRegistration.customerProvide.requestModal.fields.purchaseOrder.label')}
                value={purchaseOrder}
                onChange={(e) => setPurchaseOrder(e.target.value)}
                placeholder={t('partsRegistration.customerProvide.requestModal.fields.purchaseOrder.placeholder')}
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Select
                label={t('partsRegistration.customerProvide.requestModal.fields.salesPossible.label')}
                options={yesNoOptions}
                value={salesPossible}
                onChange={(e) => setSalesPossible(e.target.value)}
                placeholder={t('common.select')}
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Select
                label={t('partsRegistration.customerProvide.requestModal.fields.salesPossibleStatus.label')}
                options={salesPossibleStatusOptions}
                value={salesPossibleStatus}
                onChange={(e) => setSalesPossibleStatus(e.target.value)}
                placeholder={t('common.select')}
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input
                label={t('partsRegistration.customerProvide.requestModal.fields.returnReason.label')}
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder={t('partsRegistration.customerProvide.requestModal.fields.returnReason.placeholder')}
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};


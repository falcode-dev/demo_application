import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select, Spinner, Modal, DatePicker } from '../components';
import type { SelectOption } from '../components';
import { buOptions, type PartsSearchResult } from '../services/mockData';
import { usePartsSearch } from '../hooks/usePartsSearch';
import { FiCheckCircle } from 'react-icons/fi';
import styles from './PartsSearch.module.css';

export const PartsSearch = () => {
  const { t } = useTranslation();
  const {
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
  } = usePartsSearch();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('partsSearch.title')}</h1>

      <div className={styles.searchForm}>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <Select
              label={t('partsSearch.bu')}
              options={buOptions as SelectOption[]}
              value={bu}
              onChange={(e) => setBu(e.target.value)}
              placeholder={t('common.select')}
            />
          </div>
          <div className={styles.formField}>
            <Input
              label={t('partsSearch.partsNumber')}
              value={partsNumber}
              onChange={(e) => setPartsNumber(e.target.value)}
              placeholder={t('partsSearch.partsNumberPlaceholder')}
            />
          </div>
          <div className={styles.formField}>
            <Input
              label={t('partsSearch.partsName')}
              value={partsName}
              onChange={(e) => setPartsName(e.target.value)}
              placeholder={t('partsSearch.partsNamePlaceholder')}
            />
          </div>
        </div>

        <div className={styles.buttonRow}>
          <Button variant="default" onClick={handleSearch} disabled={loading}>
            {t('common.search')}
          </Button>
          <Button variant="sub" onClick={handleReset} disabled={loading}>
            {t('common.reset')}
          </Button>
        </div>
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <Spinner size="large" variant="primary" label={t('common.searching')} />
        </div>
      )}

      {!loading && hasSearched && (
        <div className={styles.resultsContainer}>
          <div className={styles.resultsHeader}>
            <p className={styles.resultsCount}>
              {t('partsSearch.resultsCount', { count: results.length })}
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
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                        <span className={styles.checkmark}></span>
                      </label>
                    </th>
                    <th>{t('partsSearch.table.bu')}</th>
                    <th>{t('partsSearch.table.partsNumber')}</th>
                    <th>{t('partsSearch.table.partsName')}</th>
                    <th>{t('partsSearch.table.unit')}</th>
                    <th>{t('partsSearch.table.signalCode')}</th>
                    <th>{t('partsSearch.table.salesStatus')}</th>
                    <th>{t('partsSearch.table.intelFlag')}</th>
                    <th>{t('partsSearch.table.consumableFlag')}</th>
                    <th>{t('partsSearch.table.remarks')}</th>
                    <th>{t('partsSearch.table.category')}</th>
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
              <p>{t('partsSearch.noResults')}</p>
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
            {t('partsSearch.orderButton')}
          </Button>
        </div>
      )}

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrderModal}
        selectedPartsNumbers={Array.from(selectedParts)}
        results={results}
        onConfirm={handleOpenConfirmModal}
        isConfirmModalOpen={isConfirmModalOpen}
        onCloseConfirmModal={handleCloseConfirmModal}
        shouldReset={shouldResetOrderModal}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPartsNumbers: string[];
  results: PartsSearchResult[];
  onConfirm: () => void;
  isConfirmModalOpen?: boolean;
  onCloseConfirmModal?: () => void;
  shouldReset?: boolean;
}

const OrderModal = ({ isOpen, onClose, selectedPartsNumbers, results, onConfirm, isConfirmModalOpen, onCloseConfirmModal, shouldReset }: OrderModalProps) => {
  const { t } = useTranslation();
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [customerName, setCustomerName] = useState<string>('');
  const [deliveryType, setDeliveryType] = useState<string>('');
  const [deliveryPriority, setDeliveryPriority] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const selectedParts = results.filter(r => selectedPartsNumbers.includes(r.partsNumber));

  useEffect(() => {
    selectedParts.forEach(part => {
      if (!(part.partsNumber in quantities)) {
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPartsNumbers]);

  useEffect(() => {
    if (shouldReset) {
      setDeliveryDate(null);
      setCustomerName('');
      setDeliveryType('');
      setDeliveryPriority('');
      setMemo('');
      setQuantities({});
    }
  }, [shouldReset]);

  const handleQuantityChange = (partsNumber: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 3);
    if (numericValue === '') {
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

  const deliveryTypeOptions: SelectOption[] = [
    { value: '', label: t('common.select') },
    { value: 'type1', label: t('partsSearch.orderModal.deliveryTypeOptions.normal') },
    { value: 'type2', label: t('partsSearch.orderModal.deliveryTypeOptions.express') },
    { value: 'type3', label: t('partsSearch.orderModal.deliveryTypeOptions.sameDay') },
  ];

  const deliveryPriorityOptions: SelectOption[] = [
    { value: '', label: t('common.select') },
    { value: 'low', label: t('partsSearch.orderModal.deliveryPriorityOptions.low') },
    { value: 'medium', label: t('partsSearch.orderModal.deliveryPriorityOptions.medium') },
    { value: 'high', label: t('partsSearch.orderModal.deliveryPriorityOptions.high') },
  ];

  const handleCancel = () => {
    if (isConfirmModalOpen && onCloseConfirmModal) {
      onCloseConfirmModal();
    } else {
      onClose();
    }
  };

  const footer = (
    <div className={styles.modalFooter}>
      <Button variant="sub" onClick={handleCancel}>
        {t('common.cancel')}
      </Button>
      <Button variant="default" onClick={onConfirm}>
        {t('partsSearch.orderModal.confirmButton')}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('partsSearch.orderModal.title')}
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
              <DatePicker
                label={t('partsSearch.orderModal.deliveryDate')}
                value={deliveryDate}
                onChange={setDeliveryDate}
                placeholder={t('partsSearch.orderModal.deliveryDatePlaceholder')}
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Input
                label={t('partsSearch.orderModal.customerName')}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t('partsSearch.orderModal.customerNamePlaceholder')}
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Select
                label={t('partsSearch.orderModal.deliveryPriority')}
                options={deliveryPriorityOptions}
                value={deliveryPriority}
                onChange={(e) => setDeliveryPriority(e.target.value)}
                placeholder={t('common.select')}
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <Select
                label={t('partsSearch.orderModal.deliveryType')}
                options={deliveryTypeOptions}
                value={deliveryType}
                onChange={(e) => setDeliveryType(e.target.value)}
                placeholder={t('common.select')}
                fullWidth
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.textareaLabel}>{t('partsSearch.orderModal.memo')}</label>
              <textarea
                className={styles.textarea}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder={t('partsSearch.orderModal.memoPlaceholder')}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className={styles.selectedPartsList}>
          <h3 className={styles.selectedPartsTitle}>{t('partsSearch.orderModal.selectedParts')}</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th>{t('partsSearch.table.bu')}</th>
                  <th>{t('partsSearch.table.partsNumber')}</th>
                  <th>{t('partsSearch.table.partsName')}</th>
                  <th>{t('partsSearch.table.unit')}</th>
                  <th>{t('partsSearch.table.signalCode')}</th>
                  <th>{t('partsSearch.table.salesStatus')}</th>
                  <th>{t('partsSearch.table.intelFlag')}</th>
                  <th>{t('partsSearch.table.consumableFlag')}</th>
                  <th>{t('partsSearch.table.remarks')}</th>
                  <th>{t('partsSearch.table.category')}</th>
                  <th>{t('partsSearch.table.quantity')}</th>
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

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm }: ConfirmModalProps) => {
  const { t } = useTranslation();
  const footer = (
    <div className={styles.modalFooter}>
      <Button variant="sub" onClick={onClose}>
        {t('common.cancel')}
      </Button>
      <Button variant="default" onClick={onConfirm}>
        {t('common.ok')}
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
          <h2 className={styles.confirmTitle}>{t('partsSearch.confirmModal.title')}</h2>
        </div>
        <div className={styles.confirmMessage}>
          <p>{t('partsSearch.confirmModal.message')}</p>
          <p>{t('partsSearch.confirmModal.confirmMessage')}</p>
        </div>
      </div>
    </Modal>
  );
};


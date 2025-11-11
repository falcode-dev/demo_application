import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Select, Modal, Input, Spinner, SidePanel } from '../components';
import type { SelectOption } from '../components';
import { searchParts, buOptions, customerSiteOptions, orderSourceOptions, type PartsSearchResult } from '../services/mockData';
import { openPartsDetail } from '../utils/navigation';
import { useToastContext } from '../contexts/ToastContext';
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
  const { t } = useTranslation();
  const { success } = useToastContext();
  const [upperBu, setUpperBu] = useState<string>('');
  const [upperCustomerSite, setUpperCustomerSite] = useState<string>('');
  const [upperOrderSource, setUpperOrderSource] = useState<string>('');
  const [allResults, setAllResults] = useState<RegistrationRow[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
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

  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
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
    { value: '', label: t('common.select') },
    { value: 'paid', label: t('partsRegistration.billingCategory.paid') },
    { value: 'free', label: t('partsRegistration.billingCategory.free') },
    { value: 'warranty', label: t('partsRegistration.billingCategory.warranty') },
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
      <div className={styles.upperSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('partsRegistration.title')}</h2>
          <div className={styles.headerRight}>
            <button
              className={styles.filterButton}
              onClick={handleOpenFilterPanel}
              disabled={allResults.length === 0}
              aria-label={t('partsRegistration.editFilterButton')}
            >
              <FiFilter />
              <span className={styles.filterButtonText}>{t('partsRegistration.editFilterButton')}</span>
            </button>
            <Button
              variant="default"
              onClick={handleOpenSearchModal}
            >
              {t('partsRegistration.searchButton')}
            </Button>
          </div>
        </div>

        <div className={styles.tagsContainer}>
          {upperBu && (
            <div className={`${styles.tag} ${styles.tagActive}`}>
              <span className={styles.tagText}>{t('partsRegistration.bu')}：{upperBu}</span>
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
              <span className={styles.tagText}>{t('partsRegistration.customerSite')}：{upperCustomerSite}</span>
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
              <span className={styles.tagText}>{t('partsRegistration.orderSource')}：{upperOrderSource}</span>
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
                  <th>{t('partsRegistration.table.bu')}</th>
                  <th>{t('partsRegistration.table.partsNumber')}</th>
                  <th>{t('partsRegistration.table.partsName')}</th>
                  <th className={styles.quantityColumn}>{t('partsRegistration.table.consumptionQuantity')}</th>
                  <th className={styles.billingColumn}>{t('partsRegistration.table.billingCategory')}</th>
                  <th>{t('partsRegistration.table.unit')}</th>
                  <th>{t('partsRegistration.table.signalCode')}</th>
                  <th>{t('partsRegistration.table.salesStatus')}</th>
                  <th>{t('partsRegistration.table.intelFlag')}</th>
                  <th>{t('partsRegistration.table.consumableFlag')}</th>
                  <th>{t('partsRegistration.table.remarks')}</th>
                  <th>{t('partsRegistration.table.category')}</th>
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

      <PartsSearchModal
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        onRegister={(selectedParts) => {
          const newRows: RegistrationRow[] = selectedParts.map(part => ({
            ...part,
            checked: true,
            consumptionQuantity: 0,
            billingCategory: '',
            hasError: false,
            isDisabled: false,
            customerSite: upperCustomerSite || undefined,
            orderSource: upperOrderSource || undefined,
          }));
          setAllResults([...allResults, ...newRows]);
          success(t('partsRegistration.registerSuccess', { count: selectedParts.length }));
        }}
        onCloseModal={handleCloseSearchModal}
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
  const { t } = useTranslation();

  const buOptionsWithEmpty: SelectOption[] = [
    { value: '', label: t('common.select') },
    ...buOptions,
  ];

  const customerSiteOptionsWithEmpty: SelectOption[] = [
    { value: '', label: t('common.select') },
    ...customerSiteOptions,
  ];

  const orderSourceOptionsWithEmpty: SelectOption[] = [
    { value: '', label: t('common.select') },
    ...orderSourceOptions,
  ];

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={t('partsRegistration.filterModal.title')}
      position="right"
      width="400px"
    >
      <div className={styles.filterPanelContent}>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <Select
              label={t('partsRegistration.filterModal.bu')}
              options={buOptionsWithEmpty}
              value={bu}
              onChange={(e) => onBuChange(e.target.value)}
              placeholder={t('common.select')}
              fullWidth
            />
          </div>
          <div className={styles.formField}>
            <Select
              label={t('partsRegistration.filterModal.customerSite')}
              options={customerSiteOptionsWithEmpty}
              value={customerSite}
              onChange={(e) => onCustomerSiteChange(e.target.value)}
              placeholder={t('common.select')}
              fullWidth
            />
          </div>
          <div className={styles.formField}>
            <Select
              label={t('partsRegistration.filterModal.orderSource')}
              options={orderSourceOptionsWithEmpty}
              value={orderSource}
              onChange={(e) => onOrderSourceChange(e.target.value)}
              placeholder={t('common.select')}
              fullWidth
            />
          </div>
        </div>
        <div className={styles.filterPanelFooter}>
          <Button variant="sub" onClick={onClose} fullWidth>
            {t('common.cancel')}
          </Button>
          <Button variant="default" onClick={onApply} fullWidth>
            {t('common.ok')}
          </Button>
        </div>
      </div>
    </SidePanel>
  );
};

interface PartsSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (selectedParts: PartsSearchResult[]) => void;
  onCloseModal: () => void;
}

const PartsSearchModal = ({ isOpen, onClose, onRegister, onCloseModal }: PartsSearchModalProps) => {
  const { t } = useTranslation();
  const [bu, setBu] = useState<string>('');
  const [partsNumber, setPartsNumber] = useState<string>('');
  const [partsName, setPartsName] = useState<string>('');
  const [results, setResults] = useState<PartsSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedParts, setSelectedParts] = useState<Set<string>>(new Set());
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

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
    openPartsDetail(partsNumber);
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const selectedPartsList = results.filter(r => selectedParts.has(r.partsNumber));
      onRegister(selectedPartsList);

      setIsRegistering(false);
      handleReset();
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
        {t('common.cancel')}
      </Button>
      <Button
        variant="default"
        onClick={handleRegister}
        disabled={selectedParts.size === 0 || isRegistering}
        loading={isRegistering}
      >
        {t('common.register')}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('partsRegistration.searchModal.title')}
      footer={footer}
      size="large"
    >
      <div className={styles.searchModalContent}>
        <div className={styles.searchForm}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Select
                label={t('partsRegistration.searchModal.bu')}
                options={buOptions as SelectOption[]}
                value={bu}
                onChange={(e) => setBu(e.target.value)}
                placeholder={t('common.select')}
              />
            </div>
            <div className={styles.formField}>
              <Input
                label={t('partsRegistration.searchModal.partsNumber')}
                value={partsNumber}
                onChange={(e) => setPartsNumber(e.target.value)}
                placeholder={t('partsRegistration.searchModal.partsNumberPlaceholder')}
              />
            </div>
            <div className={styles.formField}>
              <Input
                label={t('partsRegistration.searchModal.partsName')}
                value={partsName}
                onChange={(e) => setPartsName(e.target.value)}
                placeholder={t('partsRegistration.searchModal.partsNamePlaceholder')}
              />
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
        </div>

        <div className={styles.resultsContainer}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <Spinner size="large" variant="primary" label={t('common.searching')} />
            </div>
          ) : hasSearched ? (
            <>
              <div className={styles.resultsHeader}>
                <p className={styles.resultsCount}>
                  {t('partsRegistration.searchModal.resultsCount', { count: results.length })}
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
                        <th>{t('partsRegistration.table.bu')}</th>
                        <th>{t('partsRegistration.table.partsNumber')}</th>
                        <th>{t('partsRegistration.table.partsName')}</th>
                        <th>{t('partsRegistration.table.unit')}</th>
                        <th>{t('partsRegistration.table.signalCode')}</th>
                        <th>{t('partsRegistration.table.salesStatus')}</th>
                        <th>{t('partsRegistration.table.intelFlag')}</th>
                        <th>{t('partsRegistration.table.consumableFlag')}</th>
                        <th>{t('partsRegistration.table.remarks')}</th>
                        <th>{t('partsRegistration.table.category')}</th>
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
                  <p>{t('partsRegistration.searchModal.noResults')}</p>
                </div>
              )}
            </>
          ) : (
            <div className={styles.noResults}>
              <p>{t('partsRegistration.searchModal.noSearchCondition')}</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};


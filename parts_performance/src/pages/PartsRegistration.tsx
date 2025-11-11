import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Select, Modal, Input, Spinner, DatePicker } from '../components';
import type { SelectOption } from '../components';
import {
  searchParts,
  customerNameOptions,
  partsRequestTeamOptions,
  type PartsSearchResult,
} from '../services/mockData';
import { openPartsDetail } from '../utils/navigation';
import { useToastContext } from '../contexts/ToastContext';
import styles from './PartsRegistration.module.css';
import { FiCalendar, FiSearch } from 'react-icons/fi';

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
  const { t } = useTranslation();
  const { success } = useToastContext();
  const [allResults, setAllResults] = useState<RegistrationRow[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const results = allResults;

  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
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
            <Button
              variant="default"
              onClick={handleOpenSearchModal}
            >
              {t('partsRegistration.searchButton')}
            </Button>
          </div>
        </div>

        <div className={styles.tagsContainer}>
          <div className={styles.tag}>
            <span className={styles.tagText}>{t('partsRegistration.tags.requestNumber')}</span>
          </div>
          <div className={styles.tag}>
            <span className={styles.tagText}>{t('partsRegistration.tags.bu')}</span>
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
                  <th>{t('partsRegistration.listTable.bu')}</th>
                  <th>{t('partsRegistration.listTable.partsNumber')}</th>
                  <th>{t('partsRegistration.listTable.partsName')}</th>
                  <th className={styles.quantityColumn}>{t('partsRegistration.listTable.installedQty')}</th>
                  <th className={styles.billingColumn}>{t('partsRegistration.listTable.billingType')}</th>
                  <th>{t('partsRegistration.listTable.ncdrNumber')}</th>
                  <th>{t('partsRegistration.listTable.requestNumber')}</th>
                  <th>{t('partsRegistration.listTable.soNumber')}</th>
                  <th>{t('partsRegistration.listTable.requester')}</th>
                  <th>{t('partsRegistration.listTable.station')}</th>
                  <th>{t('partsRegistration.listTable.customerName')}</th>
                  <th>{t('partsRegistration.listTable.orderDate')}</th>
                  <th>{t('partsRegistration.listTable.orderSource')}</th>
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
                    <td>{item.ncdrNumber}</td>
                    <td>{item.requestNumber}</td>
                    <td>{item.soNumber}</td>
                    <td>{item.requester}</td>
                    <td>{item.station}</td>
                    <td>{item.customerName}</td>
                    <td>{item.orderDate}</td>
                    <td>{item.orderSource}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
          }));
          setAllResults([...allResults, ...newRows]);
          success(t('partsRegistration.registerSuccess', { count: selectedParts.length }));
        }}
        onCloseModal={handleCloseSearchModal}
      />
    </div>
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
  const bu = 'BU1';
  const buOptionsForDisplay: SelectOption[] = [{ value: bu, label: bu }];
  const [requestNumber, setRequestNumber] = useState<string>('');
  const [ncdrNumber, setNcdrNumber] = useState<string>('');
  const [partsRequester, setPartsRequester] = useState<string>('');
  const [partsRequestTeam, setPartsRequestTeam] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [requestDateFrom, setRequestDateFrom] = useState<Date | null>(null);
  const [requestDateTo, setRequestDateTo] = useState<Date | null>(null);
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
      setRequestNumber('');
      setNcdrNumber('');
      setPartsRequester('');
      setPartsRequestTeam('');
      setCustomerName('');
      setRequestDateFrom(null);
      setRequestDateTo(null);
      setLoading(false);
      setIsRegistering(false);
    }
  }, [isOpen]);

  const handleRequestDateFromChange = (date: Date | null) => {
    setRequestDateFrom(date);
    if (date && requestDateTo && date > requestDateTo) {
      setRequestDateTo(null);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const searchResults = await searchParts({
        bu,
        partsNumber: requestNumber || undefined,
        partsName: ncdrNumber || undefined,
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
    setRequestNumber('');
    setNcdrNumber('');
    setPartsRequester('');
    setPartsRequestTeam('');
    setCustomerName('');
    setRequestDateFrom(null);
    setRequestDateTo(null);
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
              <Input
                label={t('partsRegistration.searchModal.requestNumber')}
                value={requestNumber}
                onChange={(e) => setRequestNumber(e.target.value)}
                placeholder={t('partsRegistration.searchModal.requestNumberPlaceholder')}
              />
            </div>
            <div className={styles.formField}>
              <Input
                label={t('partsRegistration.searchModal.ncdrNumber')}
                value={ncdrNumber}
                onChange={(e) => setNcdrNumber(e.target.value)}
                placeholder={t('partsRegistration.searchModal.ncdrNumberPlaceholder')}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Select
                label={t('partsRegistration.searchModal.bu')}
                options={buOptionsForDisplay}
                value={bu}
                disabled
              />
            </div>
            <div className={styles.formField}>
              <Input
                label={t('partsRegistration.searchModal.partsRequester')}
                value={partsRequester}
                onChange={(e) => setPartsRequester(e.target.value)}
                placeholder={t('partsRegistration.searchModal.partsRequesterPlaceholder')}
              />
            </div>
            <div className={styles.formField}>
              <Select
                label={t('partsRegistration.searchModal.partsRequestTeam')}
                options={partsRequestTeamOptions as SelectOption[]}
                value={partsRequestTeam}
                onChange={(e) => setPartsRequestTeam(e.target.value)}
                placeholder={t('common.select')}
                rightIcon={FiSearch}
                disableRightIconRotation
                fullWidth
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Select
                label={t('partsRegistration.searchModal.customerName')}
                options={customerNameOptions as SelectOption[]}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t('common.select')}
                rightIcon={FiSearch}
                disableRightIconRotation
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <DatePicker
                label={t('partsRegistration.searchModal.requestDateFrom')}
                value={requestDateFrom}
                onChange={handleRequestDateFromChange}
                startDate={requestDateFrom ?? undefined}
                endDate={requestDateTo ?? undefined}
                selectsStart
                maxDate={requestDateTo ?? undefined}
                placeholder={t('partsRegistration.searchModal.requestDatePlaceholder')}
                leftIcon={FiCalendar}
                fullWidth
              />
            </div>
            <div className={styles.formField}>
              <DatePicker
                label={t('partsRegistration.searchModal.requestDateTo')}
                value={requestDateTo}
                onChange={setRequestDateTo}
                startDate={requestDateFrom ?? undefined}
                endDate={requestDateTo ?? undefined}
                selectsEnd
                minDate={requestDateFrom ?? undefined}
                placeholder={t('partsRegistration.searchModal.requestDatePlaceholder')}
                leftIcon={FiCalendar}
                fullWidth
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


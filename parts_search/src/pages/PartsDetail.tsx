import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiChevronDown } from 'react-icons/fi';
import { Spinner, Button } from '../components';
import { usePartsDetail } from '../hooks/usePartsDetail';
import styles from './PartsDetail.module.css';

interface PartsDetailProps {
  partsNumber: string;
}

export const PartsDetail = ({ partsNumber }: PartsDetailProps) => {
  const { t } = useTranslation();
  const {
    detail,
    inventory,
    alternativeParts,
    loading,
    inventoryLoading,
    region,
    setRegion,
    loadInventory,
    handleAlternativePartsClick,
    handleClose,
  } = usePartsDetail(partsNumber);
  const [alternativeFilter, setAlternativeFilter] = useState<'alternative' | 'all'>('alternative');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const filterSelectRef = useRef<HTMLDivElement | null>(null);
  const inventoryWrapperRef = useRef<HTMLDivElement | null>(null);

  const filteredAlternativeParts = useMemo(() => {
    if (alternativeFilter === 'all') {
      return alternativeParts;
    }
    return alternativeParts.filter((item) => item.type === 'alternative');
  }, [alternativeFilter, alternativeParts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterSelectRef.current && !filterSelectRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filterOptions: Array<{ value: 'alternative' | 'all'; label: string }> = useMemo(
    () => [
      { value: 'alternative', label: t('partsDetail.alternativeParts.filters.alternative') },
      { value: 'all', label: t('partsDetail.alternativeParts.filters.all') },
    ],
    [t]
  );

  const handleFilterSelect = (value: 'alternative' | 'all') => {
    setAlternativeFilter(value);
    setIsFilterOpen(false);
  };

  const scrollInventoryToTop = () => {
    if (inventoryWrapperRef.current) {
      inventoryWrapperRef.current.scrollTop = 0;
    }
  };

  const handleInventoryRefresh = () => {
    scrollInventoryToTop();
    loadInventory();
  };

  const handleRegionChange = (value: string) => {
    scrollInventoryToTop();
    setRegion(value);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Spinner size="large" variant="primary" label={t('common.loading')} />
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>{t('partsDetail.notFound')}</p>
          <button className={styles.backButton} onClick={handleClose}>
            {t('common.close')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleClose}>
          {t('common.close')}
        </button>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.detailSection}>
          <h2 className={styles.sectionTitle}>{t('partsDetail.title')}</h2>
          <div className={styles.detailGrid}>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.bu')}</div>
              <div className={styles.detailValue}>{detail.bu}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.productCode')}</div>
              <div className={styles.detailValue}>{detail.productCode}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.partsNumber')}</div>
              <div className={styles.detailValue}>{detail.partsNumber}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.partsName')}</div>
              <div className={styles.detailValue}>{detail.partsName}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.unit')}</div>
              <div className={styles.detailValue}>{detail.unit}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.signalCode')}</div>
              <div className={styles.detailValue}>{detail.signalCode}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.purchaseItemStatus')}</div>
              <div className={styles.detailValue}>{detail.purchaseItemStatus}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.category')}</div>
              <div className={styles.detailValue}>{detail.category}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.salesStatus')}</div>
              <div className={styles.detailValue}>{detail.salesStatus}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.purchasePossibleCategory')}</div>
              <div className={styles.detailValue}>{detail.purchasePossibleCategory}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.specificCustomerSalesPossibleCategory')}</div>
              <div className={styles.detailValue}>
                {detail.specificCustomerSalesPossibleCategory}
              </div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.intelFlag')}</div>
              <div className={styles.detailValue}>{detail.intelFlag}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.consumable')}</div>
              <div className={styles.detailValue}>{detail.consumable}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.telCustomerUrl')}</div>
              <div className={styles.detailValue}>{detail.telCustomerUrl}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.ltFromWarehouseJapanToCustomer')}</div>
              <div className={styles.detailValue}>{detail.ltFromWarehouseJapanToCustomer}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.ltFromFactoryJapanToCustomer')}</div>
              <div className={styles.detailValue}>{detail.ltFromFactoryJapanToCustomer}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.ltFromGenpoWarehouseToCustomer')}</div>
              <div className={styles.detailValue}>{detail.ltFromGenpoWarehouseToCustomer}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.ltFromNaritaToCustomer')}</div>
              <div className={styles.detailValue}>{detail.ltFromNaritaToCustomer}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.optimalAlternativeParts')}</div>
              <div className={styles.detailValue}>{detail.optimalAlternativeParts}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.remarks')}</div>
              <div className={styles.detailValue}>{detail.remarks}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.repairableCategory')}</div>
              <div className={styles.detailValue}>{detail.repairableCategory}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.minOrderQuantity')}</div>
              <div className={styles.detailValue}>{detail.minOrderQuantity}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.shippingUnit')}</div>
              <div className={styles.detailValue}>{detail.shippingUnit}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.eolCategory')}</div>
              <div className={styles.detailValue}>{detail.eolCategory}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.exportRestrictionCategory')}</div>
              <div className={styles.detailValue}>{detail.exportRestrictionCategory}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.globalHazardousFlag')}</div>
              <div className={styles.detailValue}>{detail.globalHazardousFlag}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.mainComponent')}</div>
              <div className={styles.detailValue}>{detail.mainComponent}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.itemGroupPackagingSds')}</div>
              <div className={styles.detailValue}>{detail.itemGroupPackagingSds}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.heavyObjectFlag')}</div>
              <div className={styles.detailValue}>{detail.heavyObjectFlag}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.createFlag')}</div>
              <div className={styles.detailValue}>{detail.createFlag}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.autoAllocationPermissionCategory')}</div>
              <div className={styles.detailValue}>{detail.autoAllocationPermissionCategory}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>{t('partsDetail.fields.serialNumberProfile')}</div>
              <div className={styles.detailValue}>{detail.serialNumberProfile}</div>
            </div>
          </div>
        </div>

        <div className={styles.inventorySection}>
          <h2 className={styles.sectionTitle}>{t('partsDetail.inventory.title')}</h2>
          <div
            ref={inventoryWrapperRef}
            className={`${styles.inventoryTableWrapper} ${
              inventoryLoading ? styles.inventoryTableWrapperLoading : ''
            }`}
          >
            {inventoryLoading && (
              <div className={styles.inventoryLoading}>
                <Spinner size="medium" variant="primary" />
              </div>
            )}
            <table className={styles.inventoryTable}>
              <thead>
                <tr>
                  <th>{t('partsDetail.inventory.warehouse')}</th>
                  <th>{t('partsDetail.inventory.outboundAvailable')}</th>
                  <th>{t('partsDetail.inventory.allocated')}</th>
                  <th>{t('partsDetail.inventory.initialStock')}</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length > 0 ? (
                  inventory.map((item, index) => (
                    <tr key={index}>
                      <td>{item.warehouse}</td>
                      <td>{item.outboundAvailable}</td>
                      <td>{item.allocated}</td>
                      <td>{item.initialStock}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className={styles.emptyCell}>
                      &nbsp;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.inventoryControls}>
          <div className={styles.radioGroup}>
            {['JP', 'US', 'EU', 'CN', 'KR', 'SG', 'TW'].map((r) => (
              <label key={r} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="region"
                  value={r}
                  checked={region === r}
                    onChange={(e) => handleRegionChange(e.target.value)}
                  className={styles.radioInput}
                />
                <span>{r}</span>
              </label>
            ))}
          </div>
          <div className={styles.updateButtonContainer}>
            <Button
              variant="default"
                onClick={handleInventoryRefresh}
              disabled={inventoryLoading}
                className={styles.updateButton}
            >
              {t('common.update')}
            </Button>
          </div>
        </div>
        </div>

      </div>

      <div className={styles.alternativeSection}>
        <div className={styles.alternativeHeader} ref={filterSelectRef}>
          <button
            type="button"
            className={styles.alternativeFilterButton}
            onClick={() => setIsFilterOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isFilterOpen}
          >
            <span>{filterOptions.find((option) => option.value === alternativeFilter)?.label}</span>
            <FiChevronDown
              className={`${styles.alternativeFilterIcon} ${isFilterOpen ? styles.alternativeFilterIconOpen : ''}`}
            />
          </button>
          {isFilterOpen && (
            <ul className={styles.alternativeFilterOptions} role="listbox">
              {filterOptions.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`${styles.alternativeFilterOption} ${
                      alternativeFilter === option.value ? styles.alternativeFilterOptionActive : ''
                    }`}
                    onClick={() => handleFilterSelect(option.value)}
                    role="option"
                    aria-selected={alternativeFilter === option.value}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {filteredAlternativeParts.length > 0 ? (
          <div className={styles.alternativeTableWrapper}>
            <table className={styles.alternativeTable}>
              <thead>
                <tr>
                  <th>{t('partsDetail.alternativeParts.columns.sequence')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.buCode')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.partCode')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.altPartsCode')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.altOld')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.compatibility')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.description')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.model')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.latestInventory')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.signalCode')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.purchaseItemStatus')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.salesStatus')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.intelFlag')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.salesRemark1')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.salesRemark2')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.englishRemark')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.factoryRemark')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.factoryLeadTime')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.salesLeadTime')}</th>
                  <th>{t('partsDetail.alternativeParts.columns.exportRestrictionCategory')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlternativeParts.map((item, index) => (
                  <tr key={`${item.altPartsCode}-${index}`}>
                    <td>{item.sequence}</td>
                    <td>{item.buCode}</td>
                    <td>{item.partCode}</td>
                    <td>
                      <button
                        className={styles.partsNumberLink}
                        onClick={() => handleAlternativePartsClick(item.altPartsCode)}
                      >
                        {item.altPartsCode}
                      </button>
                    </td>
                    <td>{item.altOld}</td>
                    <td>{item.compatibility}</td>
                    <td>{item.description}</td>
                    <td>{item.model}</td>
                    <td>{item.latestInventory}</td>
                    <td>{item.signalCode}</td>
                    <td>{item.purchaseItemStatus}</td>
                    <td>{item.salesStatus}</td>
                    <td>{item.intelFlag}</td>
                    <td>{item.salesRemark1}</td>
                    <td>{item.salesRemark2}</td>
                    <td>{item.englishRemark}</td>
                    <td>{item.factoryRemark}</td>
                    <td>{item.factoryLeadTime}</td>
                    <td>{item.salesLeadTime}</td>
                    <td>{item.exportRestrictionCategory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.noAlternativeParts}>
            <p>{t('partsDetail.alternativeParts.noParts')}</p>
          </div>
        )}
      </div>
    </div>
  );
};


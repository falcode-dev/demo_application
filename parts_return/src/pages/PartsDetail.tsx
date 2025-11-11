import { useTranslation } from 'react-i18next';
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
          <div className={styles.inventoryTableWrapper}>
            {inventoryLoading && (
              <div className={styles.inventoryLoading}>
                <Spinner size="medium" variant="primary" />
              </div>
            )}
            <table className={styles.inventoryTable}>
              <thead>
                <tr>
                  <th>{t('partsDetail.inventory.warehouse')}</th>
                  <th>{t('partsDetail.inventory.outbound')}</th>
                  <th>{t('partsDetail.inventory.available')}</th>
                  <th>{t('partsDetail.inventory.allocated')}</th>
                  <th>{t('partsDetail.inventory.initialStock')}</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length > 0 ? (
                  inventory.map((item, index) => (
                    <tr key={index}>
                      <td>{item.warehouse}</td>
                      <td>{item.outbound}</td>
                      <td>{item.available}</td>
                      <td>{item.allocated}</td>
                      <td>{item.initialStock}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className={styles.emptyCell}>
                      &nbsp;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.radioGroup}>
            {['JP', 'US', 'EU', 'CN', 'KR', 'SG', 'TW'].map((r) => (
              <label key={r} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="region"
                  value={r}
                  checked={region === r}
                  onChange={(e) => setRegion(e.target.value)}
                  className={styles.radioInput}
                />
                <span>{r}</span>
              </label>
            ))}
          </div>
          <div className={styles.updateButtonContainer}>
            <Button
              variant="default"
              onClick={loadInventory}
              disabled={inventoryLoading}
            >
              {t('common.update')}
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.alternativeSection}>
        <h2 className={styles.sectionTitle}>{t('partsDetail.alternativeParts.title')}</h2>
        {alternativeParts.length > 0 ? (
          <div className={styles.alternativeTableWrapper}>
            <table className={styles.alternativeTable}>
              <thead>
                <tr>
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
                {alternativeParts.map((item, index) => (
                  <tr key={index}>
                    <td>{item.bu}</td>
                    <td>
                      <button
                        className={styles.partsNumberLink}
                        onClick={() => handleAlternativePartsClick(item.partsNumber)}
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
          <div className={styles.noAlternativeParts}>
            <p>{t('partsDetail.alternativeParts.noParts')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

import { useTranslation } from 'react-i18next';
import { Button, Input, Select, Spinner } from '../components';
import type { SelectOption } from '../components';
import { buOptions } from '../services/mockData';
import { usePartsSearch } from '../hooks/usePartsSearch';
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
    handleSearch,
    handleReset,
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
    </div>
  );
};


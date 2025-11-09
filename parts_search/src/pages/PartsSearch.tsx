import { useState } from 'react';
import { Button, Input, Select, Spinner } from '../components';
import type { SelectOption } from '../components';
import { searchParts, buOptions, type PartsSearchResult } from '../services/mockData';
import styles from './PartsSearch.module.css';

export const PartsSearch = () => {
  const [bu, setBu] = useState<string>('');
  const [partsNumber, setPartsNumber] = useState<string>('');
  const [partsName, setPartsName] = useState<string>('');
  const [results, setResults] = useState<PartsSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

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
    setBu('');
    setPartsNumber('');
    setPartsName('');
  };

  const handlePartsNumberClick = (partsNumber: string) => {
    // 常に別タブでパーツ詳細画面を開く（元の検索画面はそのまま）
    const detailUrl = `${window.location.origin}${window.location.pathname}?partsNumber=${encodeURIComponent(partsNumber)}`;

    // PowerApps環境でも通常のWeb環境でも、window.openでタブを開く
    // PowerAppsのWebリソース内からwindow.openを呼び出すと、ブラウザのタブで開かれる
    window.open(detailUrl, '_blank');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>パーツ検索</h1>

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

      {loading && (
        <div className={styles.loadingContainer}>
          <Spinner size="large" variant="primary" label="検索中..." />
        </div>
      )}

      {!loading && hasSearched && (
        <div className={styles.resultsContainer}>
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
        </div>
      )}
    </div>
  );
};


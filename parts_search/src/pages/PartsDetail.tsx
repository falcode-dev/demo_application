import { useState, useEffect } from 'react';
import { Spinner, Button } from '../components';
import {
  getPartsDetail,
  getInventoryInfo,
  getAlternativeParts,
  type PartsDetail as PartsDetailType,
  type InventoryInfo,
  type PartsSearchResult,
} from '../services/mockData';
import styles from './PartsDetail.module.css';

interface PartsDetailProps {
  partsNumber: string;
}

export const PartsDetail = ({ partsNumber }: PartsDetailProps) => {
  const [detail, setDetail] = useState<PartsDetailType | null>(null);
  const [inventory, setInventory] = useState<InventoryInfo[]>([]);
  const [alternativeParts, setAlternativeParts] = useState<PartsSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inventoryLoading, setInventoryLoading] = useState<boolean>(false);
  const [region, setRegion] = useState<string>('JP');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [detailData, alternativeData] = await Promise.all([
          getPartsDetail(partsNumber),
          getAlternativeParts(partsNumber),
        ]);
        setDetail(detailData);
        setAlternativeParts(alternativeData);
      } catch (error) {
        console.error('データ取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [partsNumber]);

  const loadInventory = async () => {
    setInventoryLoading(true);
    try {
      const inventoryData = await getInventoryInfo(partsNumber, region);
      setInventory(inventoryData);
    } catch (error) {
      console.error('在庫情報取得エラー:', error);
    } finally {
      setInventoryLoading(false);
    }
  };

  useEffect(() => {
    if (partsNumber) {
      loadInventory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partsNumber, region]);

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

  const handleAlternativePartsClick = (altPartsNumber: string) => {
    // 常に別タブでパーツ詳細画面を開く（元の詳細画面はそのまま）
    const detailUrl = `${window.location.origin}${window.location.pathname}?partsNumber=${encodeURIComponent(altPartsNumber)}`;

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
      // 通常のWeb環境の場合、別タブで開く（元の詳細画面はそのまま）
      window.open(detailUrl, '_blank');
    }
  };

  const handleClose = () => {
    // ブラウザのタブを閉じる
    if (isPowerAppsEnvironment()) {
      // PowerApps環境の場合、親フレームにメッセージを送信
      try {
        // ページを閉じるメッセージを送信
        window.parent.postMessage({
          type: 'closePage'
        }, '*');
      } catch (e) {
        // エラーが発生した場合はwindow.close()を試みる
        window.close();
      }
    } else {
      // 通常のWeb環境の場合、ブラウザのタブを閉じる
      window.close();
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Spinner size="large" variant="primary" label="読み込み中..." />
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>パーツ詳細情報が見つかりませんでした</p>
          <button className={styles.backButton} onClick={handleClose}>
            閉じる
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {/* <h1 className={styles.title}>パーツ詳細</h1> */}
        <button className={styles.backButton} onClick={handleClose}>
          閉じる
        </button>
      </div>

      <div className={styles.contentGrid}>
        {/* 左グリッド: パーツ詳細情報 */}
        <div className={styles.detailSection}>
          <h2 className={styles.sectionTitle}>パーツ詳細情報</h2>
          <div className={styles.detailGrid}>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>BU</div>
              <div className={styles.detailValue}>{detail.bu}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>プロダクトコード</div>
              <div className={styles.detailValue}>{detail.productCode}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>パーツ番号</div>
              <div className={styles.detailValue}>{detail.partsNumber}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>パーツ名称/型式(英)</div>
              <div className={styles.detailValue}>{detail.partsName}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>ユニット</div>
              <div className={styles.detailValue}>{detail.unit}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>シグナルコード</div>
              <div className={styles.detailValue}>{detail.signalCode}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>購買品目ステータス</div>
              <div className={styles.detailValue}>{detail.purchaseItemStatus}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>区分</div>
              <div className={styles.detailValue}>{detail.category}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>販売ステータス</div>
              <div className={styles.detailValue}>{detail.salesStatus}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>購買可能区分</div>
              <div className={styles.detailValue}>{detail.purchasePossibleCategory}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>特定顧客販売可能区分</div>
              <div className={styles.detailValue}>
                {detail.specificCustomerSalesPossibleCategory}
              </div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>インテルフラグ</div>
              <div className={styles.detailValue}>{detail.intelFlag}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>消耗品</div>
              <div className={styles.detailValue}>{detail.consumable}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>TEL Customer URL</div>
              <div className={styles.detailValue}>{detail.telCustomerUrl}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>LT from Warehouse in Japan to Customer</div>
              <div className={styles.detailValue}>{detail.ltFromWarehouseJapanToCustomer}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>LT from Factory in Japan to Customer</div>
              <div className={styles.detailValue}>{detail.ltFromFactoryJapanToCustomer}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>LT from Genpo Warehouse in Genpo to Customer</div>
              <div className={styles.detailValue}>{detail.ltFromGenpoWarehouseToCustomer}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>LT from Narita to Customer</div>
              <div className={styles.detailValue}>{detail.ltFromNaritaToCustomer}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>最適な代替パーツ</div>
              <div className={styles.detailValue}>{detail.optimalAlternativeParts}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>備考</div>
              <div className={styles.detailValue}>{detail.remarks}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>修理可能区分</div>
              <div className={styles.detailValue}>{detail.repairableCategory}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>最小受注数量</div>
              <div className={styles.detailValue}>{detail.minOrderQuantity}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>出荷単位</div>
              <div className={styles.detailValue}>{detail.shippingUnit}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>EOL区分</div>
              <div className={styles.detailValue}>{detail.eolCategory}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>輸出規制区分</div>
              <div className={styles.detailValue}>{detail.exportRestrictionCategory}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Global危険物フラグ</div>
              <div className={styles.detailValue}>{detail.globalHazardousFlag}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>主構成物質</div>
              <div className={styles.detailValue}>{detail.mainComponent}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>品目グループ梱包材(SDS)</div>
              <div className={styles.detailValue}>{detail.itemGroupPackagingSds}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Heavy Object Flag</div>
              <div className={styles.detailValue}>{detail.heavyObjectFlag}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Create Flag（木枠）</div>
              <div className={styles.detailValue}>{detail.createFlag}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>自動引当権限区分</div>
              <div className={styles.detailValue}>{detail.autoAllocationPermissionCategory}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>シリアル番号プロファイル</div>
              <div className={styles.detailValue}>{detail.serialNumberProfile}</div>
            </div>
          </div>
        </div>

        {/* 右グリッド: 在庫情報 */}
        <div className={styles.inventorySection}>
          <h2 className={styles.sectionTitle}>在庫情報</h2>
          <div className={styles.inventoryTableWrapper}>
            {inventoryLoading && (
              <div className={styles.inventoryLoading}>
                <Spinner size="medium" variant="primary" />
              </div>
            )}
            <table className={styles.inventoryTable}>
              <thead>
                <tr>
                  <th>倉庫</th>
                  <th>出庫</th>
                  <th>可能数</th>
                  <th>引当済数</th>
                  <th>最初在庫数</th>
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
              更新
            </Button>
          </div>
        </div>
      </div>

      {/* 代替パーツ */}
      <div className={styles.alternativeSection}>
        <h2 className={styles.sectionTitle}>代替パーツ</h2>
        {alternativeParts.length > 0 ? (
          <div className={styles.alternativeTableWrapper}>
            <table className={styles.alternativeTable}>
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
            <p>代替パーツがありません</p>
          </div>
        )}
      </div>
    </div>
  );
};


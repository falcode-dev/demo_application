// 型定義
export interface PartsSearchResult {
  bu: string;
  partsNumber: string;
  partsName: string;
  unit: string;
  signalCode: string;
  salesStatus: string;
  intelFlag: string;
  consumableFlag: string;
  remarks: string;
  category: string;
}

export interface PartsDetail {
  bu: string;
  productCode: string;
  partsNumber: string;
  partsName: string;
  unit: string;
  signalCode: string;
  purchaseItemStatus: string;
  category: string;
  salesStatus: string;
  purchasePossibleCategory: string;
  specificCustomerSalesPossibleCategory: string;
  intelFlag: string;
  consumable: string;
  telCustomerUrl: string;
  ltFromWarehouseJapanToCustomer: string;
  ltFromFactoryJapanToCustomer: string;
  ltFromGenpoWarehouseToCustomer: string;
  ltFromNaritaToCustomer: string;
  optimalAlternativeParts: string;
  remarks: string;
  repairableCategory: string;
  minOrderQuantity: string;
  shippingUnit: string;
  eolCategory: string;
  exportRestrictionCategory: string;
  globalHazardousFlag: string;
  mainComponent: string;
  itemGroupPackagingSds: string;
  heavyObjectFlag: string;
  createFlag: string;
  autoAllocationPermissionCategory: string;
  serialNumberProfile: string;
}

export interface InventoryInfo {
  warehouse: string;
  outbound: string;
  available: string;
  allocated: string;
  initialStock: string;
}

// BUオプション
export const buOptions = [
  { value: 'BU1', label: 'BU1' },
  { value: 'BU2', label: 'BU2' },
  { value: 'BU3', label: 'BU3' },
  { value: 'BU4', label: 'BU4' },
];

// モックデータ生成関数
const generateMockParts = (count: number): PartsSearchResult[] => {
  const buList = ['BU1', 'BU2', 'BU3', 'BU4'];
  const salesStatusList = ['販売中', '販売終了', '販売予定'];
  const intelFlagList = ['Y', 'N'];
  const consumableFlagList = ['Y', 'N'];
  const categoryList = ['カテゴリ1', 'カテゴリ2', 'カテゴリ3', 'カテゴリ4'];
  const unitList = ['個', 'セット', '箱', '本'];

  return Array.from({ length: count }, (_, i) => {
    const index = i + 1;
    const bu = buList[i % buList.length];
    return {
      bu,
      partsNumber: `P${String(index).padStart(3, '0')}`,
      partsName: `パーツ名称${index}`,
      unit: unitList[i % unitList.length],
      signalCode: `SC${String(index).padStart(3, '0')}`,
      salesStatus: salesStatusList[i % salesStatusList.length],
      intelFlag: intelFlagList[i % intelFlagList.length],
      consumableFlag: consumableFlagList[i % consumableFlagList.length],
      remarks: `備考${index}`,
      category: categoryList[i % categoryList.length],
    };
  });
};

const mockPartsData = generateMockParts(30);

// 詳細データ生成
const generateMockPartsDetail = (partsData: PartsSearchResult[]): Record<string, PartsDetail> => {
  const detailData: Record<string, PartsDetail> = {};

  partsData.forEach((part) => {
    detailData[part.partsNumber] = {
      bu: part.bu,
      productCode: `PC${part.partsNumber.slice(1)}`,
      partsNumber: part.partsNumber,
      partsName: part.partsName,
      unit: part.unit,
      signalCode: part.signalCode,
      purchaseItemStatus: part.salesStatus === '販売中' ? '購入可能' : '購入不可',
      category: part.category,
      salesStatus: part.salesStatus,
      purchasePossibleCategory: part.salesStatus === '販売中' ? '可能' : '不可',
      specificCustomerSalesPossibleCategory: part.salesStatus === '販売中' ? '可能' : '不可',
      intelFlag: part.intelFlag,
      consumable: part.consumableFlag,
      telCustomerUrl: 'https://example.com',
      ltFromWarehouseJapanToCustomer: part.salesStatus === '販売中' ? '3日' : '0日',
      ltFromFactoryJapanToCustomer: part.salesStatus === '販売中' ? '7日' : '0日',
      ltFromGenpoWarehouseToCustomer: part.salesStatus === '販売中' ? '5日' : '0日',
      ltFromNaritaToCustomer: part.salesStatus === '販売中' ? '4日' : '0日',
      optimalAlternativeParts: part.partsNumber !== 'P001' ? 'P001' : 'P002',
      remarks: part.remarks,
      repairableCategory: part.consumableFlag === 'N' ? '修理可能' : '修理不可',
      minOrderQuantity: part.consumableFlag === 'Y' ? '10' : '1',
      shippingUnit: part.unit,
      eolCategory: part.salesStatus === '販売終了' ? 'EOL' : '継続',
      exportRestrictionCategory: part.intelFlag === 'Y' ? 'あり' : 'なし',
      globalHazardousFlag: part.intelFlag === 'Y' ? 'Y' : 'N',
      mainComponent: `主要構成物質${part.partsNumber.slice(1)}`,
      itemGroupPackagingSds: `グループ${part.partsNumber.slice(1)}`,
      heavyObjectFlag: parseInt(part.partsNumber.slice(1)) % 5 === 0 ? 'Y' : 'N',
      createFlag: parseInt(part.partsNumber.slice(1)) % 7 === 0 ? 'Y' : 'N',
      autoAllocationPermissionCategory: part.salesStatus === '販売中' ? '可能' : '不可',
      serialNumberProfile: `プロファイル${part.partsNumber.slice(1)}`,
    };
  });

  return detailData;
};

const mockPartsDetailData = generateMockPartsDetail(mockPartsData);

// API関数（モック）
export const searchParts = async (params: {
  bu?: string;
  partsNumber?: string;
  partsName?: string;
}): Promise<PartsSearchResult[]> => {
  // シミュレート用の遅延
  await new Promise((resolve) => setTimeout(resolve, 500));

  let results = [...mockPartsData];

  // フィルタリング
  if (params.bu) {
    results = results.filter((item) => item.bu === params.bu);
  }
  if (params.partsNumber) {
    results = results.filter((item) =>
      item.partsNumber.toLowerCase().includes(params.partsNumber!.toLowerCase())
    );
  }
  if (params.partsName) {
    results = results.filter((item) =>
      item.partsName.toLowerCase().includes(params.partsName!.toLowerCase())
    );
  }

  return results;
};

export const getPartsDetail = async (partsNumber: string): Promise<PartsDetail> => {
  // シミュレート用の遅延
  await new Promise((resolve) => setTimeout(resolve, 300));

  const detail = mockPartsDetailData[partsNumber];
  if (!detail) {
    throw new Error(`パーツ番号 ${partsNumber} の詳細情報が見つかりません`);
  }
  return detail;
};

export const getInventoryInfo = async (
  _partsNumber: string,
  region: string
): Promise<InventoryInfo[]> => {
  // シミュレート用の遅延
  await new Promise((resolve) => setTimeout(resolve, 300));

  // モック在庫データ
  return [
    {
      warehouse: `${region}-倉庫1`,
      outbound: '10',
      available: '50',
      allocated: '5',
      initialStock: '65',
    },
    {
      warehouse: `${region}-倉庫2`,
      outbound: '5',
      available: '30',
      allocated: '2',
      initialStock: '37',
    },
  ];
};

export const getAlternativeParts = async (partsNumber: string): Promise<PartsSearchResult[]> => {
  // シミュレート用の遅延
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 代替パーツのモックデータ
  const detail = mockPartsDetailData[partsNumber];
  if (!detail || !detail.optimalAlternativeParts) {
    return [];
  }

  const alternativePartsNumber = detail.optimalAlternativeParts;
  const alternativePart = mockPartsData.find((p) => p.partsNumber === alternativePartsNumber);

  return alternativePart ? [alternativePart] : [];
};

// パーツ返却用のデータ型
export interface PartsReturnRow {
  partsNumber: string;
  partsName: string;
  arrangementQuantity: number; // 手配数
  usedQuantity: number; // 使用数
  remainingQuantity: number; // 残数量
  requestNumber: string; // リクエスト番号
  ncdrNumber: string; // NCDR番号
  orderSource: string; // オーダー元
  woNumber: string; // WO#
  orderStage: string; // オーダーステージ
  shippingNumber: string; // 配送番号
  scheduledDeliveryDate: string; // 予定納期
  bu: string;
  site: string; // 拠点
  customerName: string; // 顧客名
  scheduledWorkDate: string; // 作業予定日
  isReturned: boolean; // 返却済みかどうか
  shippingWarehouse?: string; // 出荷元倉庫
}

// パーツ返却用のモックデータ生成
const generateMockPartsReturn = (count: number): PartsReturnRow[] => {
  const buList = ['BU1', 'BU2', 'BU3', 'BU4'];
  const siteList = ['東京', '大阪', '名古屋', '福岡'];
  const customerList = ['顧客A', '顧客B', '顧客C', '顧客D'];
  const orderStageList = ['受注', '手配中', '出荷済み', '納品済み'];
  const warehouseList = ['倉庫A', '倉庫B', '倉庫C'];

  return Array.from({ length: count }, (_, i) => {
    const index = i + 1;
    const bu = buList[i % buList.length];
    const arrangementQuantity = 10 + (i % 5) * 2;
    const usedQuantity = Math.floor(arrangementQuantity * 0.3) + (i % 3);
    // 残数量を1~5の範囲に設定
    const remainingQuantity = (i % 5) + 1;

    return {
      partsNumber: `P${String(index).padStart(3, '0')}`,
      partsName: `パーツ名称${index}`,
      arrangementQuantity,
      usedQuantity,
      remainingQuantity,
      requestNumber: `REQ${String(index).padStart(4, '0')}`,
      ncdrNumber: `NCDR${String(index).padStart(4, '0')}`,
      orderSource: `オーダー元${(i % 3) + 1}`,
      woNumber: `WO${String(index).padStart(5, '0')}`,
      orderStage: orderStageList[i % orderStageList.length],
      shippingNumber: `SHIP${String(index).padStart(4, '0')}`,
      scheduledDeliveryDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      bu,
      site: siteList[i % siteList.length],
      customerName: customerList[i % customerList.length],
      scheduledWorkDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      isReturned: false,
      shippingWarehouse: warehouseList[i % warehouseList.length],
    };
  });
};

// 一覧表示は一時的に停止しモーダル表示のみとしたため、2行分のデータがあれば十分
const mockPartsReturnData = generateMockPartsReturn(2);

// パーツ返却データを取得するAPI関数（モック）
export const getPartsReturnData = async (): Promise<PartsReturnRow[]> => {
  // シミュレート用の遅延
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...mockPartsReturnData];
};

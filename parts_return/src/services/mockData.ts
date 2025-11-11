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

export const buOptions = [
  { value: 'BU1', label: 'BU1' },
  { value: 'BU2', label: 'BU2' },
  { value: 'BU3', label: 'BU3' },
  { value: 'BU4', label: 'BU4' },
];

const mockPartsData: PartsSearchResult[] = [
  {
    bu: 'BU1',
    partsNumber: 'P001',
    partsName: '基板アセンブリA',
    unit: '個',
    signalCode: 'SC001',
    salesStatus: '販売中',
    intelFlag: 'Y',
    consumableFlag: 'N',
    remarks: '標準品',
    category: '電子部品',
  },
  {
    bu: 'BU1',
    partsNumber: 'P002',
    partsName: 'ケーブルセットB',
    unit: 'セット',
    signalCode: 'SC002',
    salesStatus: '販売中',
    intelFlag: 'N',
    consumableFlag: 'Y',
    remarks: '消耗品',
    category: 'ケーブル',
  },
  {
    bu: 'BU2',
    partsNumber: 'P003',
    partsName: 'モジュールC',
    unit: '個',
    signalCode: 'SC003',
    salesStatus: '販売終了',
    intelFlag: 'Y',
    consumableFlag: 'N',
    remarks: '旧型',
    category: 'モジュール',
  },
  {
    bu: 'BU2',
    partsNumber: 'P004',
    partsName: '電源ユニットD',
    unit: '個',
    signalCode: 'SC004',
    salesStatus: '販売中',
    intelFlag: 'N',
    consumableFlag: 'N',
    remarks: '標準品',
    category: '電源',
  },
  {
    bu: 'BU3',
    partsNumber: 'P005',
    partsName: '冷却ファンE',
    unit: '個',
    signalCode: 'SC005',
    salesStatus: '販売予定',
    intelFlag: 'N',
    consumableFlag: 'Y',
    remarks: '新製品',
    category: '冷却',
  },
];

const mockPartsDetailData: Record<string, PartsDetail> = {
  P001: {
    bu: 'BU1',
    productCode: 'PC001',
    partsNumber: 'P001',
    partsName: '基板アセンブリA',
    unit: '個',
    signalCode: 'SC001',
    purchaseItemStatus: '購入可能',
    category: '電子部品',
    salesStatus: '販売中',
    purchasePossibleCategory: '可能',
    specificCustomerSalesPossibleCategory: '可能',
    intelFlag: 'Y',
    consumable: 'N',
    telCustomerUrl: 'https://example.com/p001',
    ltFromWarehouseJapanToCustomer: '3日',
    ltFromFactoryJapanToCustomer: '7日',
    ltFromGenpoWarehouseToCustomer: '5日',
    ltFromNaritaToCustomer: '4日',
    optimalAlternativeParts: 'P002',
    remarks: '標準品',
    repairableCategory: '修理可能',
    minOrderQuantity: '1',
    shippingUnit: '個',
    eolCategory: '継続',
    exportRestrictionCategory: 'あり',
    globalHazardousFlag: 'Y',
    mainComponent: 'プラスチック',
    itemGroupPackagingSds: 'グループA',
    heavyObjectFlag: 'N',
    createFlag: 'N',
    autoAllocationPermissionCategory: '可能',
    serialNumberProfile: 'プロファイル1',
  },
  P002: {
    bu: 'BU1',
    productCode: 'PC002',
    partsNumber: 'P002',
    partsName: 'ケーブルセットB',
    unit: 'セット',
    signalCode: 'SC002',
    purchaseItemStatus: '購入可能',
    category: 'ケーブル',
    salesStatus: '販売中',
    purchasePossibleCategory: '可能',
    specificCustomerSalesPossibleCategory: '可能',
    intelFlag: 'N',
    consumable: 'Y',
    telCustomerUrl: 'https://example.com/p002',
    ltFromWarehouseJapanToCustomer: '3日',
    ltFromFactoryJapanToCustomer: '7日',
    ltFromGenpoWarehouseToCustomer: '5日',
    ltFromNaritaToCustomer: '4日',
    optimalAlternativeParts: 'P001',
    remarks: '消耗品',
    repairableCategory: '修理不可',
    minOrderQuantity: '10',
    shippingUnit: 'セット',
    eolCategory: '継続',
    exportRestrictionCategory: 'なし',
    globalHazardousFlag: 'N',
    mainComponent: '銅線',
    itemGroupPackagingSds: 'グループB',
    heavyObjectFlag: 'N',
    createFlag: 'N',
    autoAllocationPermissionCategory: '可能',
    serialNumberProfile: 'プロファイル2',
  },
  P003: {
    bu: 'BU2',
    productCode: 'PC003',
    partsNumber: 'P003',
    partsName: 'モジュールC',
    unit: '個',
    signalCode: 'SC003',
    purchaseItemStatus: '購入不可',
    category: 'モジュール',
    salesStatus: '販売終了',
    purchasePossibleCategory: '不可',
    specificCustomerSalesPossibleCategory: '不可',
    intelFlag: 'Y',
    consumable: 'N',
    telCustomerUrl: 'https://example.com/p003',
    ltFromWarehouseJapanToCustomer: '0日',
    ltFromFactoryJapanToCustomer: '0日',
    ltFromGenpoWarehouseToCustomer: '0日',
    ltFromNaritaToCustomer: '0日',
    optimalAlternativeParts: 'P004',
    remarks: '旧型',
    repairableCategory: '修理可能',
    minOrderQuantity: '1',
    shippingUnit: '個',
    eolCategory: 'EOL',
    exportRestrictionCategory: 'あり',
    globalHazardousFlag: 'Y',
    mainComponent: 'シリコン',
    itemGroupPackagingSds: 'グループC',
    heavyObjectFlag: 'N',
    createFlag: 'N',
    autoAllocationPermissionCategory: '不可',
    serialNumberProfile: 'プロファイル3',
  },
  P004: {
    bu: 'BU2',
    productCode: 'PC004',
    partsNumber: 'P004',
    partsName: '電源ユニットD',
    unit: '個',
    signalCode: 'SC004',
    purchaseItemStatus: '購入可能',
    category: '電源',
    salesStatus: '販売中',
    purchasePossibleCategory: '可能',
    specificCustomerSalesPossibleCategory: '可能',
    intelFlag: 'N',
    consumable: 'N',
    telCustomerUrl: 'https://example.com/p004',
    ltFromWarehouseJapanToCustomer: '3日',
    ltFromFactoryJapanToCustomer: '7日',
    ltFromGenpoWarehouseToCustomer: '5日',
    ltFromNaritaToCustomer: '4日',
    optimalAlternativeParts: 'P001',
    remarks: '標準品',
    repairableCategory: '修理可能',
    minOrderQuantity: '1',
    shippingUnit: '個',
    eolCategory: '継続',
    exportRestrictionCategory: 'なし',
    globalHazardousFlag: 'N',
    mainComponent: '金属',
    itemGroupPackagingSds: 'グループD',
    heavyObjectFlag: 'Y',
    createFlag: 'N',
    autoAllocationPermissionCategory: '可能',
    serialNumberProfile: 'プロファイル4',
  },
  P005: {
    bu: 'BU3',
    productCode: 'PC005',
    partsNumber: 'P005',
    partsName: '冷却ファンE',
    unit: '個',
    signalCode: 'SC005',
    purchaseItemStatus: '購入不可',
    category: '冷却',
    salesStatus: '販売予定',
    purchasePossibleCategory: '不可',
    specificCustomerSalesPossibleCategory: '不可',
    intelFlag: 'N',
    consumable: 'Y',
    telCustomerUrl: 'https://example.com/p005',
    ltFromWarehouseJapanToCustomer: '0日',
    ltFromFactoryJapanToCustomer: '0日',
    ltFromGenpoWarehouseToCustomer: '0日',
    ltFromNaritaToCustomer: '0日',
    optimalAlternativeParts: 'P002',
    remarks: '新製品',
    repairableCategory: '修理不可',
    minOrderQuantity: '10',
    shippingUnit: '個',
    eolCategory: '継続',
    exportRestrictionCategory: 'なし',
    globalHazardousFlag: 'N',
    mainComponent: 'プラスチック',
    itemGroupPackagingSds: 'グループE',
    heavyObjectFlag: 'N',
    createFlag: 'Y',
    autoAllocationPermissionCategory: '不可',
    serialNumberProfile: 'プロファイル5',
  },
};

export const searchParts = async (params: {
  bu?: string;
  partsNumber?: string;
  partsName?: string;
}): Promise<PartsSearchResult[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let results = [...mockPartsData];

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
  await new Promise((resolve) => setTimeout(resolve, 300));

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
  await new Promise((resolve) => setTimeout(resolve, 300));

  const detail = mockPartsDetailData[partsNumber];
  if (!detail || !detail.optimalAlternativeParts) {
    return [];
  }

  const alternativePartsNumber = detail.optimalAlternativeParts;
  const alternativePart = mockPartsData.find((p) => p.partsNumber === alternativePartsNumber);

  return alternativePart ? [alternativePart] : [];
};

export interface PartsReturnRow {
  partsNumber: string;
  partsName: string;
  arrangementQuantity: number;
  usedQuantity: number;
  remainingQuantity: number;
  requestNumber: string;
  ncdrNumber: string;
  orderSource: string;
  woNumber: string;
  orderStage: string;
  shippingNumber: string;
  scheduledDeliveryDate: string;
  bu: string;
  site: string;
  customerName: string;
  scheduledWorkDate: string;
  isReturned: boolean;
  shippingWarehouse?: string;
}

const mockPartsReturnData: PartsReturnRow[] = [
  {
    partsNumber: 'P001',
    partsName: '基板アセンブリA',
    arrangementQuantity: 10,
    usedQuantity: 7,
    remainingQuantity: 3,
    requestNumber: 'REQ0001',
    ncdrNumber: 'NCDR0001',
    orderSource: 'オーダー元1',
    woNumber: 'WO00001',
    orderStage: '受注',
    shippingNumber: 'SHIP0001',
    scheduledDeliveryDate: '2024-01-15',
    bu: 'BU1',
    site: '東京',
    customerName: '顧客A',
    scheduledWorkDate: '2024-01-20',
    isReturned: false,
    shippingWarehouse: '倉庫A',
  },
  {
    partsNumber: 'P002',
    partsName: 'ケーブルセットB',
    arrangementQuantity: 12,
    usedQuantity: 8,
    remainingQuantity: 4,
    requestNumber: 'REQ0002',
    ncdrNumber: 'NCDR0002',
    orderSource: 'オーダー元2',
    woNumber: 'WO00002',
    orderStage: '手配中',
    shippingNumber: 'SHIP0002',
    scheduledDeliveryDate: '2024-02-10',
    bu: 'BU1',
    site: '大阪',
    customerName: '顧客B',
    scheduledWorkDate: '2024-02-15',
    isReturned: false,
    shippingWarehouse: '倉庫B',
  },
];

export const getPartsReturnData = async (): Promise<PartsReturnRow[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...mockPartsReturnData];
};

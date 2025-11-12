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
  ncdrNumber: string;
  requestNumber: string;
  soNumber: string;
  requester: string;
  station: string;
  customerName: string;
  orderDate: string;
  orderSource: string;
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
  outboundAvailable: string;
  allocated: string;
  initialStock: string;
}

export type AlternativePartFilter = 'alternative' | 'all';

export interface AlternativePart {
  sequence: string;
  buCode: string;
  partCode: string;
  altPartsCode: string;
  altOld: string;
  compatibility: string;
  description: string;
  model: string;
  latestInventory: string;
  signalCode: string;
  purchaseItemStatus: string;
  salesStatus: string;
  intelFlag: string;
  salesRemark1: string;
  salesRemark2: string;
  englishRemark: string;
  factoryRemark: string;
  factoryLeadTime: string;
  salesLeadTime: string;
  exportRestrictionCategory: string;
  type: AlternativePartFilter;
}

export const buOptions = [
  { value: 'BU1', label: 'BU1' },
  { value: 'BU2', label: 'BU2' },
  { value: 'BU3', label: 'BU3' },
  { value: 'BU4', label: 'BU4' },
];

export const customerSiteOptions = [
  { value: 'Customer Site 1', label: 'Customer Site 1' },
  { value: 'Customer Site 2', label: 'Customer Site 2' },
  { value: 'Customer Site 3', label: 'Customer Site 3' },
];

export const orderSourceOptions = [
  { value: 'Order Source 1', label: 'Order Source 1' },
  { value: 'Order Source 2', label: 'Order Source 2' },
  { value: 'Order Source 3', label: 'Order Source 3' },
];

export const partsRequestTeamOptions = [
  { value: 'teamA', label: 'Team A' },
  { value: 'teamB', label: 'Team B' },
  { value: 'teamC', label: 'Team C' },
];

export const customerNameOptions = [
  { value: 'Customer 1', label: 'Customer 1' },
  { value: 'Customer 2', label: 'Customer 2' },
  { value: 'Customer 3', label: 'Customer 3' },
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
    ncdrNumber: 'NCDR-0001',
    requestNumber: 'REQ-1001',
    soNumber: 'SO-5001',
    requester: 'Taro Yamada',
    station: 'Station A',
    customerName: 'Customer 1',
    orderDate: '2025-01-05',
    orderSource: 'Order Source 1',
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
    ncdrNumber: 'NCDR-0002',
    requestNumber: 'REQ-1002',
    soNumber: 'SO-5002',
    requester: 'Hanako Sato',
    station: 'Station B',
    customerName: 'Customer 2',
    orderDate: '2025-01-12',
    orderSource: 'Order Source 2',
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
    ncdrNumber: 'NCDR-0003',
    requestNumber: 'REQ-1003',
    soNumber: 'SO-5003',
    requester: 'Ichiro Takahashi',
    station: 'Station C',
    customerName: 'Customer 3',
    orderDate: '2025-02-01',
    orderSource: 'Order Source 3',
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
    ncdrNumber: 'NCDR-0004',
    requestNumber: 'REQ-1004',
    soNumber: 'SO-5004',
    requester: 'Jiro Suzuki',
    station: 'Station D',
    customerName: 'Customer 1',
    orderDate: '2025-02-08',
    orderSource: 'Order Source 1',
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
    ncdrNumber: 'NCDR-0005',
    requestNumber: 'REQ-1005',
    soNumber: 'SO-5005',
    requester: 'Saburo Tanaka',
    station: 'Station E',
    customerName: 'Customer 2',
    orderDate: '2025-03-15',
    orderSource: 'Order Source 2',
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
      outboundAvailable: '50',
      allocated: '5',
      initialStock: '65',
    },
    {
      warehouse: `${region}-倉庫2`,
      outboundAvailable: '30',
      allocated: '2',
      initialStock: '37',
    },
    {
      warehouse: `${region}-倉庫3`,
      outboundAvailable: '37',
      allocated: '4',
      initialStock: '49',
    },
    {
      warehouse: `${region}-倉庫4`,
      outboundAvailable: '21',
      allocated: '1',
      initialStock: '30',
    },
    {
      warehouse: `${region}-倉庫5`,
      outboundAvailable: '63',
      allocated: '6',
      initialStock: '78',
    },
    {
      warehouse: `${region}-倉庫6`,
      outboundAvailable: '18',
      allocated: '0',
      initialStock: '24',
    },
  ];
};

const mockAlternativePartsData: Record<string, AlternativePart[]> = {
  P001: [
    {
      sequence: '1',
      buCode: 'BU1',
      partCode: 'P001',
      altPartsCode: 'P002',
      altOld: 'Alt',
      compatibility: 'High',
      description: '代替パーツA / Alternative Part A',
      model: 'モデルA / Model A',
      latestInventory: '25',
      signalCode: 'SC010',
      purchaseItemStatus: 'Available',
      salesStatus: 'Active',
      intelFlag: 'Y',
      salesRemark1: 'Remark 1',
      salesRemark2: 'Remark 2',
      englishRemark: 'Sa',
      factoryRemark: 'Factory note',
      factoryLeadTime: '5d',
      salesLeadTime: '7d',
      exportRestrictionCategory: 'None',
      type: 'alternative',
    },
    {
      sequence: '2',
      buCode: 'BU1',
      partCode: 'P001',
      altPartsCode: 'P003',
      altOld: 'Old',
      compatibility: 'Medium',
      description: '代替パーツB / Alternative Part B',
      model: 'モデルB / Model B',
      latestInventory: '12',
      signalCode: 'SC011',
      purchaseItemStatus: 'Limited',
      salesStatus: 'Planned',
      intelFlag: 'N',
      salesRemark1: 'Remark 1',
      salesRemark2: 'Remark 2',
      englishRemark: 'Sa',
      factoryRemark: 'Factory memo',
      factoryLeadTime: '8d',
      salesLeadTime: '10d',
      exportRestrictionCategory: 'Category A',
      type: 'all',
    },
  ],
  P002: [
    {
      sequence: '1',
      buCode: 'BU1',
      partCode: 'P002',
      altPartsCode: 'P001',
      altOld: 'Alt',
      compatibility: 'High',
      description: '代替パーツC / Alternative Part C',
      model: 'モデルC / Model C',
      latestInventory: '18',
      signalCode: 'SC012',
      purchaseItemStatus: 'Available',
      salesStatus: 'Active',
      intelFlag: 'N',
      salesRemark1: 'Remark 1',
      salesRemark2: 'Remark 2',
      englishRemark: 'Sa',
      factoryRemark: 'Factory note',
      factoryLeadTime: '6d',
      salesLeadTime: '9d',
      exportRestrictionCategory: 'None',
      type: 'alternative',
    },
  ],
};

export const getAlternativeParts = async (partsNumber: string): Promise<AlternativePart[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockAlternativePartsData[partsNumber] ?? [];
};

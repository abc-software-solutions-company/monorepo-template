import { SelectOption } from '../interfaces/rule.interface';

export enum TRANSACTION_TYPE_ENUM {
  B2B_SALES = 'b2b_sales',
  B2B_PURCHASE = 'b2b_purchase',
  B2C = 'b2c',
  QR_SCAN = 'qr_scan',
  RECEIPT = 'receipt',
}

export const CONDITION_TYPES = [
  { value: 'and', label: 'And' },
  { value: 'or', label: 'Or' },
];

export const CONDITION_OPTIONS: SelectOption[] = [
  { id: 'equal', name: 'Equals to' },
  { id: 'notEqual', name: 'Not equals to' },
  { id: 'containsAll', name: 'Contains' },
  { id: 'doesNotContain', name: 'Not contains' },
  { id: 'greaterThan', name: 'More than' },
  { id: 'lessThan', name: 'Less than' },
  { id: 'greaterThanInclusive', name: 'Equals to or more than' },
  { id: 'lessThanInclusive', name: 'Equals to or less than' },
  { id: 'in', name: 'One of' },
  { id: 'containsAny', name: 'One of' }, // For SKU
];

export const VOLUME_METRIC_OPTIONS: SelectOption[] = [
  { id: 'kg', name: 'KG' },
  { id: 'liters', name: 'Liters' },
  { id: 'metric_ton', name: 'Metric ton' },
];

export const TRANSACTION_TYPE_OPTIONS: SelectOption[] = [
  { id: TRANSACTION_TYPE_ENUM.B2B_SALES, name: 'B2B sales' },
  { id: TRANSACTION_TYPE_ENUM.B2B_PURCHASE, name: 'B2B purchase' },
  { id: TRANSACTION_TYPE_ENUM.B2C, name: 'B2C' },
  { id: TRANSACTION_TYPE_ENUM.QR_SCAN, name: 'QR scan' },
  { id: TRANSACTION_TYPE_ENUM.RECEIPT, name: 'Receipt' },
];

export const CONDITION_OPERATORS = {
  BASIC: ['equal', 'notEqual', 'in'],
  NUMERIC: ['equal', 'notEqual', 'greaterThan', 'lessThan', 'greaterThanInclusive', 'lessThanInclusive'],
  TEXT: ['containsAll', 'doesNotContain', 'containsAny'],
};

export const PROPERTY_CONDITION_MAP: Record<string, string[]> = {
  transaction_event: CONDITION_OPERATORS.BASIC,
  transaction_type: CONDITION_OPERATORS.BASIC,
  shop_type: CONDITION_OPERATORS.BASIC,
  campaign_key: CONDITION_OPERATORS.BASIC,
  sku: CONDITION_OPERATORS.TEXT,
  lineitem_amount: CONDITION_OPERATORS.NUMERIC,
  transaction_amount: CONDITION_OPERATORS.NUMERIC,
  lineitem_volume: CONDITION_OPERATORS.NUMERIC,
  transaction_volume: CONDITION_OPERATORS.NUMERIC,
  lineitem_quantity: CONDITION_OPERATORS.NUMERIC,
  transaction_quantity: CONDITION_OPERATORS.NUMERIC,
  scan_count: CONDITION_OPERATORS.NUMERIC,
  qr_code: CONDITION_OPERATORS.BASIC,
  custom: [...CONDITION_OPERATORS.NUMERIC, 'one_of'],
};
export const PROPERTY_NAME_OVERRIDES: Partial<Record<keyof typeof PROPERTY_CONDITION_MAP, string>> = {
  lineitem_amount: 'Product Amount',
  lineitem_volume: 'Product Volume',
  lineitem_quantity: 'Product Quantity',
  transaction_quantity: 'Transaction Quantity',
};

export const PROPERTY_OPTIONS = Object.keys(PROPERTY_CONDITION_MAP).map(id => ({
  id,
  name:
    PROPERTY_NAME_OVERRIDES[id] ||
    id
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
  conditions: PROPERTY_CONDITION_MAP[id],
}));

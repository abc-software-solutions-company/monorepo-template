export type LocaleValue = {
  lang: string;
  value: string;
};

export enum CAMPAIGN_STEP {
  CAMPAIGN_DETAILS = 'campaign_details',
  ELIGIBILITY_CRITERIA = 'eligibility_criteria',
  CAMPAIGN_MECHANISM = 'campaign_mechanism',
  CONFIRMATION = 'confirmation',
}

export const CAMPAIGN_STEP_LABELS: Record<CAMPAIGN_STEP, string> = {
  [CAMPAIGN_STEP.CAMPAIGN_DETAILS]: 'Campaign Details',
  [CAMPAIGN_STEP.ELIGIBILITY_CRITERIA]: 'Eligibility Criteria',
  [CAMPAIGN_STEP.CAMPAIGN_MECHANISM]: 'Campaign Mechanism',
  [CAMPAIGN_STEP.CONFIRMATION]: 'Confirmation',
};

export enum CAMPAIGN_RULE {
  PRODUCT_SALES_OR_PURCHASE = 'product_sales_or_purchase',
  CUSTOM = 'custom',
}

export enum CAMPAIGN_TYPE {
  MILESTONE = 'milestone',
  STAMP = 'stamp',
}

export enum CAMPAIGN_TRIGGER_PROPERTY {
  TRANSACTION_TYPE = 'transaction_type',
  AMOUNT = 'amount',
  SKU = 'sku',
  QUANTITY = 'quantity',
  CUSTOM = 'custom',
}

export const CAMPAIGN_TRIGGER_PROPERTY_LABELS: Record<CAMPAIGN_TRIGGER_PROPERTY, string> = {
  [CAMPAIGN_TRIGGER_PROPERTY.TRANSACTION_TYPE]: 'Transaction type',
  [CAMPAIGN_TRIGGER_PROPERTY.AMOUNT]: 'Amount',
  [CAMPAIGN_TRIGGER_PROPERTY.SKU]: 'SKU',
  [CAMPAIGN_TRIGGER_PROPERTY.QUANTITY]: 'Quantity',
  [CAMPAIGN_TRIGGER_PROPERTY.CUSTOM]: 'Custom',
};

export enum CAMPAIGN_TRIGGER_CONDITION {
  EQUALS_TO = 'equals_to',
  NOT_EQUALS_TO = 'not_equals_to',
  MORE_THAN = 'more_than',
  LESS_THAN = 'less_than',
}

export enum CAMPAIGN_TRIGGER_FIELD {
  B2B_SALES = 'b2b_sales',
  B2B_PURCHASE = 'b2b_purchase',
  B2C = 'b2c',
  QR_SCAN = 'qr_scan',
  RECEIPT = 'receipt',
}

export type Locale = {
  languageLabel: string;
  languageName: string;
  id: string;
  isDefault: boolean;
};

export const locales = [
  { languageLabel: 'Vietnam', languageName: 'vi_VN', id: '7422e7b3-883f-539f-add1-e7418eb0330', isDefault: false },
  { languageLabel: 'Thailand', languageName: 'th_TH', id: '7422e7b3-883f-539f-add1-e5418eb0378', isDefault: false },
  { languageLabel: 'Ghana English', languageName: 'en_GH', id: '6311d6a2-772e-428e-9cc0-d6f307da0220', isDefault: true },
  { languageLabel: 'English', languageName: 'en_US', id: '6311d6a2-772e-428e-9cc0-d6f307da0223', isDefault: false },
  { languageLabel: 'India', languageName: 'in_IN', id: '6311d6a2-772e-428e-9cc0-d6f307da0433', isDefault: false },
];

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
  isDefault: boolean;
};

export const locales = [
  { languageLabel: 'Vietnam', languageName: 'vi_VN', isDefault: false },
  { languageLabel: 'Thailand', languageName: 'th_TH', isDefault: false },
  { languageLabel: 'Ghana English', languageName: 'en_GH', isDefault: true },
  { languageLabel: 'English', languageName: 'en_US', isDefault: false },
  { languageLabel: 'India', languageName: 'in_IN', isDefault: false },
];

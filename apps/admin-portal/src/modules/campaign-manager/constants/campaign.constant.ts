import { Locale } from '@/interfaces/language.interface';

export enum CAMPAIGN_STEP {
  STEP_1 = 'step_1',
  STEP_2 = 'step_2',
  STEP_3 = 'step_3',
  STEP_4 = 'step_4',
}

export const CAMPAIGN_STEP_LABELS: Record<CAMPAIGN_STEP, string> = {
  [CAMPAIGN_STEP.STEP_1]: 'Step 1',
  [CAMPAIGN_STEP.STEP_2]: 'Step 2',
  [CAMPAIGN_STEP.STEP_3]: 'Step 3',
  [CAMPAIGN_STEP.STEP_4]: 'Step 4',
};

export enum CAMPAIGN_TRACKER_TYPE {
  PRORATED = 'prorated',
  FIXED = 'fixed',
}

export const CAMPAIGN_TRACKER_TYPE_LIST = [
  { id: CAMPAIGN_TRACKER_TYPE.PRORATED, name: 'Prorated' },
  { id: CAMPAIGN_TRACKER_TYPE.FIXED, name: 'Fixed' },
];

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

export const CAMPAIGN_TYPE_LIST = [
  { label: 'Milestone', value: CAMPAIGN_TYPE.MILESTONE, description: 'Rewards can be configured for each completed level.' },
  { label: 'Stamp', value: CAMPAIGN_TYPE.STAMP, description: 'Rewards can be configured for each completed level.' },
];

export const locales: Locale[] = [
  { languageLabel: 'English', languageName: 'en-us', isDefault: true },
  { languageLabel: 'Vietnam', languageName: 'vi-vn', isDefault: false },
  { languageLabel: 'Germany', languageName: 'de-de', isDefault: false },
  { languageLabel: 'Thailand', languageName: 'th-th', isDefault: false },
  { languageLabel: 'India', languageName: 'in-hi', isDefault: false },
  { languageLabel: 'Indonesia', languageName: 'id-id', isDefault: false },
];

export const countries = [
  { id: 'vi-vn', name: 'Vietnam' },
  { id: 'th-th', name: 'Thailand' },
  { id: 'en-us', name: 'English' },
  { id: 'de-de', name: 'Germany' },
  { id: 'in-hi', name: 'India' },
];

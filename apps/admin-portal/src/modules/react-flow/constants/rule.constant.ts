import { SelectOption } from '../interfaces/rule.interface';

export const FLOW_NODE_WIDTH = 260;

export const TRACKER_ENTITY_OPTIONS: SelectOption[] = [
  {
    id: 'transaction_gross_amount',
    name: 'Transactions gross amount',
  },
  {
    id: 'lineitem_amount',
    name: 'Lineitem amount',
  },
  {
    id: 'lineitem_volume',
    name: 'Lineitem volume',
  },
  {
    id: 'lineitem_quantity',
    name: 'Lineitem quantity',
  },
];

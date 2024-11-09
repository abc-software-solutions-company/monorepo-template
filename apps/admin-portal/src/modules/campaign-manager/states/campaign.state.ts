import { atomWithStorage } from 'jotai/utils';

import { MilestoneFormValues, RuleFormValues } from '../interfaces/campaign.interface';

export const rulesAtom = atomWithStorage('@rules', [
  // {
  //   ruleName: 'Rule Name 1',
  //   campaignRule: 'custom',
  //   trackerType: CAMPAIGN_TRACKER_TYPE.PRORATED,
  //   trackerValue: '1',
  //   triggers: [
  //     {
  //       property: CAMPAIGN_TRIGGER_PROPERTY.TRANSACTION_TYPE,
  //       condition: CAMPAIGN_TRIGGER_CONDITION.EQUALS_TO,
  //     },
  //   ],
  // },
  // {
  //   ruleName: 'Rule Name 2',
  //   campaignRule: 'custom',
  //   trackerType: CAMPAIGN_TRACKER_TYPE.FIXED,
  //   trackerValue: '4',
  //   triggers: [
  //     {
  //       property: CAMPAIGN_TRIGGER_PROPERTY.TRANSACTION_TYPE,
  //       condition: CAMPAIGN_TRIGGER_CONDITION.EQUALS_TO,
  //     },
  //   ],
  // },
] as RuleFormValues[]);

export const milestonesAtom = atomWithStorage('@milestones', [
  // {
  //   goals: ['1', '1'],
  // },
] as MilestoneFormValues[]);

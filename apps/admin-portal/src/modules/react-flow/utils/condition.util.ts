import { SelectOption } from '../interfaces/rule.interface';

import { CONDITION_OPTIONS, PROPERTY_CONDITION_MAP } from '../constants/condition.constant';

export const getConditionsByProperty = (propertyType: string): SelectOption[] => {
  const allowedConditionIds = PROPERTY_CONDITION_MAP[propertyType] || [];

  return CONDITION_OPTIONS.filter(condition => allowedConditionIds.includes(condition.id));
};

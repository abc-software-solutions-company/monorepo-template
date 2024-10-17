import { ConditionFormValues } from '../interfaces/condition.interface';

export function useCheckSku(data?: ConditionFormValues): boolean {
  try {
    if (!data) return false;
    if (!data.sets?.length) return false;

    for (const set of data.sets) {
      if (!set.subsets?.length) continue;

      for (const subset of set.subsets) {
        if (!subset.facts?.length) continue;

        if (subset.facts.some(fact => fact.property === 'sku')) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}

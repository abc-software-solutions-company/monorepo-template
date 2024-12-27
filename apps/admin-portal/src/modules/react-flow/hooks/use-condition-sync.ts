import { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { ConditionFormValues, ConditionType } from '../interfaces/condition.interface';

type SyncLevel = 'set' | 'subset' | 'fact';

type UseSyncConditionTypeProps = {
  form: UseFormReturn<ConditionFormValues>;
};

export const useConditionSync = ({ form }: UseSyncConditionTypeProps) => {
  const syncConditionType = useCallback(
    (params: { level: SyncLevel; setIndex: number; subsetIndex?: number; factIndex?: number; newConditionType: ConditionType }) => {
      const { level, setIndex, subsetIndex, factIndex, newConditionType } = params;
      const currentSets = form.getValues('sets');
      const updatedSets = [...currentSets];

      switch (level) {
        case 'set':
          if (setIndex === 0) {
            updatedSets.forEach(set => (set.conditionType = newConditionType));
          }
          break;
        case 'subset':
          if (subsetIndex === 0) {
            updatedSets[setIndex].subsets.forEach(subset => (subset.conditionType = newConditionType));
          }
          break;
        case 'fact':
          if (factIndex === 0 && typeof subsetIndex === 'number') {
            updatedSets[setIndex].subsets[subsetIndex].facts.forEach(fact => {
              fact.conditionType = newConditionType;
            });
          }
          break;
      }

      form.setValue('sets', updatedSets);
    },
    [form]
  );

  return { syncConditionType };
};

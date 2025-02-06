import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { CheckIcon, InfoIcon, PenIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@repo/react-web-ui-shadcn/components/ahua/input';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Label } from '@repo/react-web-ui-shadcn/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/react-web-ui-shadcn/components/ui/tooltip';

import { MilestonesFormValues } from '../../interfaces/campaign.interface';
import { milestonesAtom, rulesAtom } from '../../states/campaign.state';
import { milestoneLevelsSchema } from '../../validators/campaign-step-3.validator';

type MilestonesProps = {
  className?: string;
};

type ValidationResult = {
  isValid: boolean;
  message: string;
};

const Milestones: React.FC<MilestonesProps> = () => {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingValues, setEditingValues] = useState<string[]>([]);
  const [rulesItems] = useAtom(rulesAtom);
  const [milestoneItems, setMilestoneItems] = useAtom(milestonesAtom);

  const form = useForm<MilestonesFormValues>({
    resolver: zodResolver(milestoneLevelsSchema),
    defaultValues: {
      milestones: milestoneItems,
    },
  });

  const { remove, append, update } = useFieldArray({
    control: form.control,
    name: 'milestones',
  });

  const milestones = form.watch('milestones') ?? [];

  const handleAdd = () => {
    const newMilestone = {
      goals: Array(rulesItems.length).fill(''),
    };

    setMilestoneItems(prev => [...prev, newMilestone]);
    append(newMilestone);
  };

  const handleEdit = (index: number) => {
    const currentGoals = [...milestones[index].goals];

    while (currentGoals.length < rulesItems.length) {
      currentGoals.push('');
    }
    setEditingValues(currentGoals);
    setEditingIndex(index);
  };

  const handleCancel = () => {
    setEditingIndex(-1);
    setEditingValues([]);
  };

  const handleRemove = (index: number) => {
    setMilestoneItems(prev => {
      const newItems = [...prev];

      newItems.splice(index, 1);

      return newItems;
    });
    remove(index);
  };

  const handleSave = (index: number) => {
    if (editingValues.length !== rulesItems.length) {
      toast.error('Invalid number of goals');

      return;
    }

    const validationResults = validateMilestone(index, editingValues);

    if (validationResults.length > 0) {
      toast.error('Validation Errors', {
        description: (
          <div className="mt-2 space-y-1">
            {validationResults.map((error, idx) => (
              <p key={idx} className="flex items-start space-x-2">
                <span className="mt-0.5">•</span>
                <span>{error.message}</span>
              </p>
            ))}
          </div>
        ),
        duration: 5000,
      });

      return;
    }

    update(index, { goals: editingValues });

    setMilestoneItems(prev => {
      const newItems = [...prev];

      newItems[index] = { ...newItems[index], goals: editingValues };

      return newItems;
    });

    handleCancel();

    // Trigger validation for all goals
    editingValues.forEach((_, goalIndex) => {
      form.trigger(`milestones.${index}.goals.${goalIndex}`);
    });
  };

  const validateGoalValue = (value: string, milestoneIndex: number, goalIndex: number): ValidationResult => {
    if (!value?.trim()) {
      return { isValid: false, message: 'This field is required' };
    }

    const currentValue = parseFloat(value);

    if (isNaN(currentValue) || currentValue <= 0) {
      return { isValid: false, message: currentValue <= 0 ? 'Value must be greater than 0' : 'Please enter a valid number' };
    }

    if (milestoneIndex === 0) {
      return { isValid: true, message: '' };
    }

    const previousValue = parseFloat(milestones[milestoneIndex - 1]?.goals[goalIndex]);

    return currentValue <= previousValue
      ? { isValid: false, message: `This goal must be greater than the previous level's goal (${previousValue})` }
      : { isValid: true, message: '' };
  };

  const validateMilestone = (milestoneIndex: number, values: string[]) => {
    const validationResults: ValidationResult[] = [];

    // Ensure we validate all rules
    values.forEach((goal, goalIndex) => {
      const validation = validateGoalValue(goal, milestoneIndex, goalIndex);

      if (!validation.isValid) {
        validationResults.push({
          isValid: false,
          message: `${rulesItems[goalIndex].ruleName}: ${validation.message}`,
        });
      }
    });

    return validationResults;
  };

  const handleGoalChange = (goalIndex: number, value: string) => {
    const sanitizedValue = value
      .replace(/[^0-9.]/g, '')
      .split('.')
      .reduce((acc, part, idx) => (idx === 0 ? part : `${acc}.${part}`));

    setEditingValues(prev => {
      const newValues = [...prev];

      newValues[goalIndex] = sanitizedValue;

      return newValues;
    });
  };

  useEffect(() => {
    milestones.forEach((field, index) => {
      const currentGoals = field.goals || [];

      if (currentGoals.length !== rulesItems.length) {
        const updatedGoals = Array(rulesItems.length)
          .fill('')
          .map((_, i) => currentGoals[i] || '');

        update(index, {
          ...field,
          goals: updatedGoals,
        });

        setMilestoneItems(prev => {
          const newItems = [...prev];

          newItems[index] = { ...field, goals: updatedGoals };

          return newItems;
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rulesItems, milestones]);

  useEffect(() => {
    form.reset({ milestones: milestoneItems });
  }, [form, milestoneItems]);

  return (
    <Form {...form}>
      <form>
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Milestone levels and rewards</Label>
              {milestones.length === 0 && (
                <p className="mb-4">Define goals for each level and configure rewards such as physical rewards, discount coupons, and Yara Points</p>
              )}
            </div>
            <Button type="button" disabled={rulesItems.length === 0 || milestones.length >= 5} onClick={handleAdd}>
              <PlusIcon className="mr-2" /> Add level
            </Button>
          </div>
          <div className="mt-4 space-y-8">
            {milestones.map((field, milestoneIndex) => (
              <div key={milestoneIndex}>
                <div className="grid gap-2">
                  <h1 className="text-md font-semibold">{`Milestone Level ${(milestoneIndex + 1).toString().padStart(2, '0')}`}</h1>
                  <p className="font-medium">Total campaign trackers required to complete this milestone</p>
                  <p className="mb-4 max-w-lg text-xs text-muted-foreground">
                    You should enter a goal for each rule created. When the user has reached the goal for every configured rule, then the milestone
                    level is completed.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex grow items-center space-x-4">
                    {rulesItems.map((rule, ruleIndex) => {
                      const currentValues = editingIndex === milestoneIndex ? editingValues : field.goals;
                      const validation = validateGoalValue(currentValues[ruleIndex], milestoneIndex, ruleIndex);

                      return (
                        <div key={ruleIndex} className="relative w-1/3">
                          <Input
                            required
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*\.?[0-9]*"
                            label={`Enter tracker goal for ${rule.ruleName}`}
                            value={currentValues[ruleIndex] || ''}
                            error={!validation.isValid}
                            disabled={editingIndex !== milestoneIndex}
                            onChange={e => handleGoalChange(ruleIndex, e.target.value)}
                          />
                          {!validation.isValid && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <InfoIcon className="h-5 w-5 text-red-500" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="w-52">
                                  <p>{validation.message}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex w-20 items-end">
                    {editingIndex === milestoneIndex ? (
                      <div className="ml-auto flex space-x-2">
                        <Button size="icon-sm" variant="secondary" onClick={handleCancel}>
                          <XIcon size={20} className="text-destructive" />
                        </Button>
                        <Button size="icon-sm" variant="secondary" onClick={() => handleSave(milestoneIndex)}>
                          <CheckIcon size={20} className="text-green-500" />
                        </Button>
                      </div>
                    ) : (
                      <div className="ml-auto flex space-x-2">
                        <Button size="icon-sm" variant="secondary" disabled={editingIndex !== -1} onClick={() => handleEdit(milestoneIndex)}>
                          <PenIcon size={20} className="text-primary" />
                        </Button>
                        <Button size="icon-sm" variant="secondary" onClick={() => handleRemove(milestoneIndex)}>
                          <Trash2Icon size={20} className="text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <pre className="overflow-hidden rounded-md border-slate-200 p-2 text-xs">{JSON.stringify(form.watch(), null, 2)}</pre>
        </div>
      </form>
    </Form>
  );
};

export default Milestones;

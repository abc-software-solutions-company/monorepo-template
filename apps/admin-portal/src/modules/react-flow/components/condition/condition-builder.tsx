import { Fragment, useEffect, useState } from 'react';
import { ChevronDownIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Path, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldRadioButtonGroup from '@repo/react-web-ui-shadcn/components/form-fields/form-field-radio-button-group';
import FormFieldSelect from '@repo/react-web-ui-shadcn/components/form-fields/form-field-select';
import { Block } from '@repo/react-web-ui-shadcn/components/ui/block';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Card, CardContent } from '@repo/react-web-ui-shadcn/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@repo/react-web-ui-shadcn/components/ui/collapsible';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';
import { cn } from '@repo/react-web-ui-shadcn/lib/utils';

import ConditionSubSet from './condition-display-subset';
import PropertyValueField from './condition-dynamic-field';

import { CONDITION_TYPES, PROPERTY_OPTIONS } from '../../constants/condition.constant';
import { useConditionSync } from '../../hooks/use-condition-sync';
import { useRuleMode } from '../../hooks/use-rule-mode';
import { ConditionFormValues, ConditionType } from '../../interfaces/condition.interface';
import { getConditionsByProperty } from '../../utils/condition.util';
import { conditionSchema } from '../../validators/condition.validator';

const DeleteButton = ({ className, disabled = false, onDelete }: { className?: string; disabled?: boolean; onDelete: () => void }) => {
  return (
    <Button className={cn('h-6 w-6 rounded-full bg-red-100 px-1 py-1', className)} disabled={disabled} variant="transparent" onClick={onDelete}>
      <Trash2Icon className="h-4 w-4 text-destructive" />
    </Button>
  );
};
const DeleteFactButton = ({ className, disabled = false, onDelete }: { className?: string; disabled?: boolean; onDelete: () => void }) => {
  return (
    <Button
      className={cn('group relative rounded-full border hover:bg-red-50', className)}
      variant="ghost"
      size="icon"
      disabled={disabled}
      onClick={onDelete}
    >
      <Trash2Icon className="h-4 w-4 text-destructive" />
    </Button>
  );
};

type ConditionBuilderProps = {
  initialValue?: ConditionFormValues;
  onSave: (value: ConditionFormValues) => void;
  onClose: () => void;
};

const ConditionBuilder = ({ initialValue, onSave, onClose }: ConditionBuilderProps) => {
  const { isView } = useRuleMode();
  const [closedSubsets, setClosedSubsets] = useState<Set<string>>(new Set());

  const ensureUUIDs = (data: ConditionFormValues) => {
    return {
      sets: data.sets.map(set => ({
        ...set,
        id: set.id || crypto.randomUUID(),
        subsets: set.subsets.map(subset => ({
          ...subset,
          id: subset.id || crypto.randomUUID(),
          facts: subset.facts.map(fact => ({
            ...fact,
            id: fact.id || crypto.randomUUID(),
          })),
        })),
      })),
    };
  };

  const form = useForm<ConditionFormValues>({
    resolver: zodResolver(conditionSchema),
    defaultValues: initialValue
      ? ensureUUIDs(initialValue)
      : {
          sets: [
            {
              id: crypto.randomUUID(),
              subsets: [
                {
                  id: crypto.randomUUID(),
                  facts: [
                    {
                      id: crypto.randomUUID(),
                      property: '',
                      condition: '',
                      conditionType: 'and',
                      value: '',
                    },
                  ],
                  conditionType: 'and',
                },
              ],
              conditionType: 'and',
            },
          ],
        },
  });

  const { fields: setItems, append: appendSet, remove: removeSet } = useFieldArray({ control: form.control, name: 'sets' });
  const { syncConditionType } = useConditionSync({ form });

  const addSet = () => {
    const currentSets = form.getValues('sets');
    const firstSetConditionType = currentSets[0]?.conditionType || 'and';

    appendSet({
      id: crypto.randomUUID(),
      subsets: [
        {
          id: crypto.randomUUID(),
          facts: [
            {
              id: crypto.randomUUID(),
              property: '',
              condition: '',
              conditionType: 'and',
              value: '',
            },
          ],
          conditionType: 'and',
        },
      ],
      conditionType: firstSetConditionType,
    });
  };

  const toggleSubset = (subsetId: string) => {
    setClosedSubsets(prev => {
      const newSet = new Set(prev);

      if (newSet.has(subsetId)) {
        newSet.delete(subsetId);
      } else {
        newSet.add(subsetId);
      }

      return newSet;
    });
  };

  const addSubset = (setIndex: number) => {
    const currentSets = form.getValues('sets');
    const updatedSets = [...currentSets];

    const firstSubsetConditionType = updatedSets[setIndex].subsets[0].conditionType || 'and';

    updatedSets[setIndex].subsets.push({
      id: crypto.randomUUID(),
      facts: [
        {
          id: crypto.randomUUID(),
          property: '',
          condition: '',
          conditionType: firstSubsetConditionType,
          value: '',
        },
      ],
      conditionType: firstSubsetConditionType,
    });

    form.setValue('sets', updatedSets);
  };

  const removeSubset = (setIndex: number, subsetIndex: number) => {
    const currentSets = form.getValues('sets');
    const updatedSets = [...currentSets];

    if (updatedSets[setIndex].subsets.length > 1) {
      updatedSets[setIndex].subsets.splice(subsetIndex, 1);

      form.setValue('sets', updatedSets);
    }
  };

  const addFact = (setIndex: number, subsetIndex: number) => {
    const currentSets = form.getValues('sets');
    const updatedSets = [...currentSets];

    const firstFactConditionType = updatedSets[setIndex].subsets[subsetIndex].facts[0]?.conditionType || 'and';

    updatedSets[setIndex].subsets[subsetIndex].facts.push({
      id: crypto.randomUUID(),
      property: '',
      condition: '',
      conditionType: firstFactConditionType,
      value: '',
    });
    form.setValue('sets', updatedSets);
  };

  const removeFact = (setIndex: number, subsetIndex: number, factIndex: number) => {
    const currentSets = form.getValues('sets');
    const updatedSets = [...currentSets];

    const currentFacts = updatedSets[setIndex].subsets[subsetIndex].facts;

    if (currentFacts.length > 1) {
      updatedSets[setIndex].subsets[subsetIndex].facts.splice(factIndex, 1);
      form.setValue('sets', updatedSets);
    }
  };

  const onSubmit = (data: ConditionFormValues) => {
    onSave(data);
  };

  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (name?.includes('.property')) {
        const valuePath = name.replace('.property', '.value') as Path<ConditionFormValues>;

        form.setValue(valuePath, '', {
          shouldValidate: form.formState.isSubmitted,
        });

        const conditionPath = name.replace('.property', '.condition') as Path<ConditionFormValues>;

        form.setValue(conditionPath, '', {
          shouldValidate: form.formState.isSubmitted,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    form.reset(initialValue);
  }, [form, initialValue]);

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold">Setup Condition</h2>
            <div className="flex justify-end gap-2">
              <Button variant="outline-destructive" onClick={onClose}>
                Close
              </Button>
              {!isView && <Button type="submit">Save</Button>}
            </div>
          </div>
          <div className="space-y-6">
            {setItems.map((set, setIndex) => (
              <Fragment key={set.id}>
                <Card className="relative bg-gray-100">
                  <Block visibled={!isView}>
                    <DeleteButton className="absolute -right-2 -top-2" disabled={setItems.length <= 1} onDelete={() => removeSet(setIndex)} />
                  </Block>
                  <CardContent className="space-y-4 p-7">
                    {form.watch(`sets.${setIndex}.subsets`).map((subset, subsetIndex) => {
                      const subsets = form.watch(`sets.${setIndex}.subsets`);
                      const isOpen = !closedSubsets.has(subset.id as string);
                      const hasFacts = subset.facts.findIndex(x => x.property !== '') > -1;

                      return (
                        <Fragment key={subsetIndex}>
                          <Collapsible open={isOpen} onOpenChange={() => toggleSubset(subset.id as string)}>
                            <Card className="relative">
                              {!isView && (
                                <DeleteButton
                                  className="absolute -right-3 -top-3 z-10 flex size-6 items-center justify-center rounded-full border bg-white"
                                  disabled={subsets.length <= 1}
                                  onDelete={() => removeSubset(setIndex, subsetIndex)}
                                />
                              )}
                              <CollapsibleTrigger>
                                <Block visibled={!isOpen}>
                                  <div className="p-4">
                                    <ConditionSubSet subset={subset} />
                                  </div>
                                </Block>
                                <Button
                                  variant="transparent"
                                  className={cn(
                                    'absolute -left-3 -top-3 z-10 flex size-6 items-center justify-center rounded-full border bg-white p-0',
                                    isOpen && 'rotate-180'
                                  )}
                                  disabled={!hasFacts}
                                >
                                  <ChevronDownIcon className="size-4 text-primary" />
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <CardContent className="space-y-4 p-4">
                                  {subset.facts.map((fact, factIndex) => (
                                    <div key={factIndex} className="flex items-start gap-2">
                                      <FormFieldRadioButtonGroup
                                        form={form}
                                        fieldName={`sets.${setIndex}.subsets.${subsetIndex}.facts.0.conditionType`}
                                        options={CONDITION_TYPES}
                                        disabled={isView || factIndex > 0}
                                        onChange={value =>
                                          syncConditionType({
                                            level: 'fact',
                                            setIndex,
                                            subsetIndex,
                                            factIndex: 0,
                                            newConditionType: value as ConditionType,
                                          })
                                        }
                                      />
                                      <div className="rule-controls flex grow gap-2">
                                        <FormFieldSelect
                                          required
                                          showErrorMessage
                                          formLabel="Property"
                                          form={form}
                                          fieldName={`sets.${setIndex}.subsets.${subsetIndex}.facts.${factIndex}.property`}
                                          options={PROPERTY_OPTIONS.map(option => ({ id: option.id, name: option.name }))}
                                          placeholder="Select property"
                                          size="sm"
                                          className="w-full"
                                          showSearch={false}
                                          disabled={isView}
                                        />
                                        <FormFieldSelect
                                          required
                                          showErrorMessage
                                          formLabel="Select condition"
                                          form={form}
                                          fieldName={`sets.${setIndex}.subsets.${subsetIndex}.facts.${factIndex}.condition`}
                                          options={getConditionsByProperty(fact.property)}
                                          placeholder="Select"
                                          size="sm"
                                          className="w-full"
                                          showSearch={false}
                                          disabled={isView}
                                        />
                                        <PropertyValueField
                                          property={form.watch(`sets.${setIndex}.subsets.${subsetIndex}.facts.${factIndex}.property`)}
                                          path={`sets.${setIndex}.subsets.${subsetIndex}.facts.${factIndex}.value`}
                                          form={form}
                                          isView={isView}
                                        />
                                      </div>
                                      {!isView && (
                                        <div className="flex gap-2">
                                          <DeleteFactButton
                                            disabled={isView || subset.facts.length <= 1}
                                            onDelete={() => removeFact(setIndex, subsetIndex, factIndex)}
                                          />
                                          <Button
                                            className="rounded-full border"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => addFact(setIndex, subsetIndex)}
                                          >
                                            <PlusIcon size={16} />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </CardContent>
                              </CollapsibleContent>
                            </Card>
                          </Collapsible>
                          {subsetIndex < subsets.length - 1 && (
                            <div className="mb-4 text-center">
                              <FormFieldRadioButtonGroup
                                form={form}
                                fieldName={`sets.${setIndex}.subsets.0.conditionType`}
                                options={CONDITION_TYPES}
                                disabled={isView || subsetIndex > 0}
                                onChange={value =>
                                  syncConditionType({
                                    level: 'subset',
                                    setIndex,
                                    subsetIndex: 0,
                                    newConditionType: value as ConditionType,
                                  })
                                }
                              />
                            </div>
                          )}
                        </Fragment>
                      );
                    })}
                    <Block visibled={!isView}>
                      <div className="flex justify-center">
                        <Button variant="transparent" onClick={() => addSubset(setIndex)}>
                          <PlusIcon size={16} className="mr-2" />
                          Add subset
                        </Button>
                      </div>
                    </Block>
                  </CardContent>
                </Card>
                <Block visibled={setIndex < setItems.length - 1} className="mb-4 flex justify-center">
                  <FormFieldRadioButtonGroup
                    form={form}
                    fieldName={`sets.0.conditionType`}
                    options={CONDITION_TYPES}
                    disabled={isView || setIndex > 0}
                    onChange={value =>
                      syncConditionType({
                        level: 'set',
                        setIndex: 0,
                        newConditionType: value as ConditionType,
                      })
                    }
                  />
                </Block>
              </Fragment>
            ))}
          </div>
          <Block visibled={!isView} className="mt-4 text-center">
            <Button variant="transparent" onClick={addSet}>
              <PlusIcon size={16} className="mr-2" />
              Add set
            </Button>
          </Block>
        </div>
        {/* <pre className="text-xs">{JSON.stringify(form.watch(), null, 2)}</pre> */}
      </form>
    </Form>
  );
};

export default ConditionBuilder;

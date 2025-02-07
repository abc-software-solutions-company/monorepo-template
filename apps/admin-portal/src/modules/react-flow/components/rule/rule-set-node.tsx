import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldInputDateRangePicker from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input-date-range-picker';
import FormFieldInputNumber from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input-number';
import FormFieldRadio from '@repo/react-web-ui-shadcn/components/form-fields/form-field-radio';
import FormFieldSelect from '@repo/react-web-ui-shadcn/components/form-fields/form-field-select';
import FormFieldSelectTag from '@repo/react-web-ui-shadcn/components/form-fields/form-field-select-tag';
import { Block } from '@repo/react-web-ui-shadcn/components/ui/block';
import { Collapsible, CollapsibleContent } from '@repo/react-web-ui-shadcn/components/ui/collapsible';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Label } from '@repo/react-web-ui-shadcn/components/ui/label';
import { Separator } from '@repo/react-web-ui-shadcn/components/ui/separator';
import { cn } from '@repo/react-web-ui-shadcn/lib/utils';
import { getDateWithoutTimeZone } from '@repo/shared-universal/utils/date.util';
import { type Edge, Handle, type NodeProps, Position, useReactFlow } from '@xyflow/react';

import RuleButtonAdd from './rule-button-add';
import RuleToolbar from './rule-button-toolbar';
import RuleHeader from './rule-header';
import { RuleRenameModal } from './rule-rename-modal';

import { FLOW_NODE_WIDTH, TRACKER_ENTITY_OPTIONS } from '../../constants/rule.constant';
import { useNodeForm } from '../../contexts/node-form.context';
import { useFlowNode } from '../../hooks/use-flow-node';
import useRemoveNode from '../../hooks/use-remove-node';
import { useRuleMode } from '../../hooks/use-rule-mode';
import { FlowNode, RuleNode, RuleSetFormValues, RuleSetNode } from '../../interfaces/rule.interface';
import { useTrackerState } from '../../states/tracker.state';
import { ruleSetSchema } from '../../validators/rule.validator';

export function RuleSet({ id, data }: NodeProps<RuleSetNode>) {
  const removeNode = useRemoveNode(id);
  const { isView } = useRuleMode();
  const { getNodes, setNodes, setEdges } = useReactFlow<FlowNode>();
  const { updateNodeData } = useFlowNode();
  const [isContentCollapsed, setIsContentCollapsed] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const trackerState = useTrackerState();

  const defaultValues: RuleSetFormValues = {
    width: FLOW_NODE_WIDTH,
    label: data.label ?? 'Untitled set 01',
    date_type: data.date_type ?? 'no_limit',
    date_range:
      data.date_range && data.date_range?.from && data.date_range?.to
        ? {
            from: getDateWithoutTimeZone(data.date_range.from),
            to: getDateWithoutTimeZone(data.date_range.to),
          }
        : undefined,
    max_points_overall: data.max_points_overall ?? undefined,
    max_points_per_user: data.max_points_per_user ?? undefined,
    tracker_type: data.tracker_type ?? '',
    tracker_entity: data.tracker_entity ?? undefined,
    action_ids: data.action_ids ?? [],
  };

  const form = useForm<RuleSetFormValues>({ resolver: zodResolver(ruleSetSchema), defaultValues, mode: 'onChange' });

  const displayName = data.label || 'Rule Set';
  const trackerType = form.watch('tracker_type');
  const dateType = form.watch('date_type');

  const dateRangeValue = form.getValues('date_range');
  const trackerEntityValue = form.getValues('tracker_entity');
  const maxPointsOverallValue = form.getValues('max_points_overall');
  const maxPointsPerUserValue = form.getValues('max_points_per_user');
  const trackerTypeValue = form.getValues('tracker_type');

  const isLastSetNode = useCallback(() => {
    const nodes = getNodes();
    const sets = nodes.filter(node => node.type === 'set');

    return sets.length <= 1;
  }, [getNodes]);

  const handleRename = (newName: string) => {
    updateNodeData<RuleSetFormValues>(id, { label: newName });

    setIsRenameModalOpen(false);
  };

  const addSet = useCallback(() => {
    setNodes(currentNodes => {
      const nodeHeight = 510;
      const xOffset = 100;
      const sets = currentNodes.filter(node => node.type === 'set');
      const rules = currentNodes.filter(node => node.type === 'rule');
      const yOffset = nodeHeight * sets.length + 100;
      const setLabel = `Untitled set ${(sets.length + 1).toString().padStart(2, '0')}`;
      const ruleLabel = `Untitled rule ${(rules.length + 1).toString().padStart(2, '0')}`;

      const ruleSetId = crypto.randomUUID();
      const newSet: RuleSetNode = {
        id: ruleSetId,
        type: 'set',
        dragHandle: '.node-header',
        position: { x: xOffset, y: yOffset },
        data: {
          width: FLOW_NODE_WIDTH,
          label: setLabel,
          date_type: 'no_limit',
          tracker_type: '',
          action_ids: [],
        },
      };

      const ruleNode: RuleNode = {
        id: crypto.randomUUID(),
        type: 'rule',
        dragHandle: '.node-header',
        position: { x: xOffset + 350, y: yOffset },
        data: {
          width: FLOW_NODE_WIDTH,
          label: ruleLabel,
          metadata: {
            ruleset_id: ruleSetId,
            parent_node_id: newSet.id,
            level: 1,
          },
          conditions: undefined,
        },
      };

      const newEdge: Edge = { id: `edge-${newSet.id}-${ruleNode.id}`, source: newSet.id, target: ruleNode.id, type: 'customEdge' };

      setEdges(currentEdges => [...currentEdges, newEdge]);

      return [...currentNodes, newSet, ruleNode];
    });
  }, [setNodes, setEdges]);

  useNodeForm(id, form);

  const onSubmit: SubmitHandler<RuleSetFormValues> = async _ => {};

  // Reset form values after data changes
  useEffect(() => {
    form.reset(data, {
      keepErrors: true,
      keepIsSubmitted: true,
    });
  }, [form, data]);

  useEffect(() => {
    if (dateType === 'no_limit') {
      form.setValue('date_range', undefined);
      updateNodeData<RuleSetFormValues>(id, { date_range: undefined });
    }
  }, [form, dateType, id, updateNodeData]);

  useEffect(() => {
    const subscription = form.watch((_, { type }) => {
      if (type !== 'change' || !form.formState.isSubmitted) return;

      form.trigger();
    });

    return () => subscription.unsubscribe();
  }, [form, form.formState]);

  useEffect(() => {
    trackerState.setTrackerType(id, trackerType);
  }, [id, trackerState, trackerType]);

  return (
    <div className={cn('campaign-node relative rounded-lg border bg-card text-foreground')} style={{ width: data.width }}>
      <RuleHeader
        className="bg-blue-700"
        name={displayName}
        isCollapsed={isContentCollapsed}
        onCollapse={() => setIsContentCollapsed(!isContentCollapsed)}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Collapsible open={!isContentCollapsed}>
            <CollapsibleContent>
              <Block visibled={!isView}>
                <div className="grid gap-3 p-3">
                  <FormFieldRadio
                    form={form}
                    fieldName="date_type"
                    formLabel="Date range"
                    options={[
                      { value: 'no_limit', label: 'No limit' },
                      { value: 'specific_date', label: 'Specific date' },
                    ]}
                  />
                  <FormFieldInputDateRangePicker
                    required
                    showErrorMessage
                    form={form}
                    fieldName="date_range"
                    formLabel="Duration"
                    size="sm"
                    disabled={dateType === 'no_limit'}
                    disableBefore={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                  />
                  <Label>Maximum points</Label>
                  <FormFieldInputNumber
                    showErrorMessage
                    form={form}
                    fieldName="max_points_overall"
                    formLabel="Maximum points per RuleSet"
                    size="sm"
                    min={1}
                    max={99999}
                  />
                  <FormFieldInputNumber
                    showErrorMessage
                    form={form}
                    fieldName="max_points_per_user"
                    formLabel="Maximum points per User"
                    size="sm"
                    min={1}
                    max={99999}
                  />
                  <Separator />
                  <FormFieldSelect
                    required
                    showErrorMessage
                    form={form}
                    fieldName="tracker_type"
                    formLabel="Set type"
                    placeholder="Select type"
                    size="sm"
                    showSearch={false}
                    options={[
                      { id: 'FIXED', name: 'Fixed' },
                      { id: 'PRORATED', name: 'Prorated' },
                    ]}
                  />
                  {trackerType === 'PRORATED' && (
                    <FormFieldSelect
                      required
                      showErrorMessage
                      form={form}
                      fieldName="tracker_entity"
                      formLabel="Tracker"
                      placeholder="Select tracker"
                      size="sm"
                      showSearch={false}
                      options={TRACKER_ENTITY_OPTIONS}
                    />
                  )}
                  <FormFieldSelectTag
                    showErrorMessage
                    className="w-full"
                    required={true}
                    form={form}
                    fieldName="action_ids"
                    formLabel="Transaction actions"
                    placeholder="Select transaction action"
                    size="sm"
                    showSearch={false}
                    maxVisible={1}
                    options={TRACKER_ENTITY_OPTIONS}
                  />
                </div>
                <RuleButtonAdd orientation="vertical" onClick={addSet} />
              </Block>
              <Block className="grid gap-3 p-3" visibled={isView}>
                <div className="grid gap-1">
                  <Label className="mb-1">Date range</Label>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  {!dateRangeValue && <p className="font-bold">No limit</p>}
                  {dateRangeValue && (
                    <p className="font-bold">
                      <span>{dateRangeValue?.from?.toString()}</span>
                      <span> - </span>
                      <span>{dateRangeValue?.to?.toString()}</span>
                    </p>
                  )}
                </div>
                <Block className="grid gap-1" visibled={!!maxPointsOverallValue}>
                  <Label className="mb-1">Maximum points</Label>
                  <p className="text-xs text-muted-foreground">Maximum points per RuleSet</p>
                  <p className="font-bold">{maxPointsOverallValue}</p>
                </Block>
                <Block className="grid gap-1" visibled={!!maxPointsPerUserValue}>
                  <p className="text-xs text-muted-foreground">Maximum points per User</p>
                  <p className="font-bold">{maxPointsPerUserValue}</p>
                </Block>
                <Separator />
                <div className="grid gap-1">
                  <p className="text-xs text-muted-foreground">
                    Set type<span className="text-destructive">*</span>
                  </p>
                  <p className="font-bold">{trackerTypeValue}</p>
                </div>
                <Block className="grid gap-1" visibled={!!trackerEntityValue}>
                  <p className="text-xs text-muted-foreground">Tracker</p>
                  <p className="font-bold">{TRACKER_ENTITY_OPTIONS.find(x => x.id === trackerEntityValue)?.name}</p>
                </Block>
                <div className="grid gap-1">
                  <p className="text-xs text-muted-foreground">
                    Transaction actions
                    <span className="text-destructive">*</span>
                  </p>
                  <p className="flex flex-wrap gap-1">
                    <span key={id} className="rounded-full border border-stone-500 px-1 text-xs text-stone-500">
                      abc
                    </span>
                  </p>
                </div>
              </Block>
            </CollapsibleContent>
          </Collapsible>
          <RuleToolbar visible={!isView} removeDisabled={isLastSetNode()} onRemove={removeNode} onEdit={() => setIsRenameModalOpen(true)} />
          <RuleRenameModal
            isOpen={isRenameModalOpen}
            title="Set Name"
            defaultValues={{ name: data.label }}
            onClose={() => setIsRenameModalOpen(false)}
            onSubmit={handleRename}
          />
          {/* <pre className="text-xs">
            <code>{JSON.stringify(form.formState.isValid, null, 2)}</code>
            <br />
            <code>{JSON.stringify(form.watch(), null, 2)}</code>
          </pre> */}
        </form>
      </Form>
      <Handle className="invisible" type="source" position={Position.Right} />
    </div>
  );
}

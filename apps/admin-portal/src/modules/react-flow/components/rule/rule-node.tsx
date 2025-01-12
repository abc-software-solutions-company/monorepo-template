import { useCallback, useEffect, useState } from 'react';
import { Trash2Icon } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalConfirm from '@repo/react-web-ui-shadcn/components/modals/modal-confirm';
import { Block } from '@repo/react-web-ui-shadcn/components/ui/block';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Collapsible, CollapsibleContent } from '@repo/react-web-ui-shadcn/components/ui/collapsible';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Label } from '@repo/react-web-ui-shadcn/components/ui/label';
import { Separator } from '@repo/react-web-ui-shadcn/components/ui/separator';
import { cn } from '@repo/react-web-ui-shadcn/lib/utils';
import { usePrevious } from '@repo/shared-universal/hooks/use-previous';
import { type Edge, Handle, type Node, type NodeProps, Position, useReactFlow } from '@xyflow/react';

import RuleButtonAdd from './rule-button-add';
import RuleToolbar from './rule-button-toolbar';
import RuleHeader from './rule-header';
import RuleOutcomeAddButton from './rule-outcome-add-button';
import RuleOutcomeDisplay from './rule-outcome-display';
import RuleOutcomeEmpty from './rule-outcome-empty';
import { RuleRenameModal } from './rule-rename-modal';

import { FLOW_NODE_WIDTH } from '../../constants/rule.constant';
import { useNodeForm } from '../../contexts/node-form.context';
import { useCheckSku } from '../../hooks/use-check-sku';
import { useFlowNode } from '../../hooks/use-flow-node';
import useRemoveNode from '../../hooks/use-remove-node';
import { useRuleMode } from '../../hooks/use-rule-mode';
import { ConditionFormValues } from '../../interfaces/condition.interface';
import { RuleFormValues, RuleNode } from '../../interfaces/rule.interface';
import { useTrackerState } from '../../states/tracker.state';
import { ruleSchema } from '../../validators/rule.validator';
import ConditionContent from '../condition/condition-content';
import ConditionModal from '../condition/condition-modal';

export function Rule({ id, data }: NodeProps<RuleNode>) {
  const removeNode = useRemoveNode(id);
  const { isView } = useRuleMode();
  const { setNodes, setEdges, getNodes } = useReactFlow<RuleNode>();
  const { updateNodeData } = useFlowNode();
  const [isContentCollapsed, setIsContentCollapsed] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const trackerState = useTrackerState();

  const isRuleLevel1 = data.metadata?.level === 1;
  const hasSku = useCheckSku(data.conditions);
  const ruleSetId = data.metadata?.ruleset_id;
  const trackerType = trackerState.trackerTypes[ruleSetId as string];
  const previousTrackerType = usePrevious(trackerType);

  const defaultValues: RuleFormValues = {
    width: FLOW_NODE_WIDTH,
    label: data.label ?? 'Untitled rule 01',
    conditions: data.conditions ?? undefined,
    rule_outcomes: data.rule_outcomes,
    metadata: data.metadata,
  };

  const form = useForm<RuleFormValues>({ resolver: zodResolver(ruleSchema), defaultValues, mode: 'onChange' });

  const handleRename = (newName: string) => {
    updateNodeData<RuleFormValues>(id, { label: newName });

    setIsRenameModalOpen(false);
  };

  const getSubRulePosition = useCallback((currentRule: Node, existingSubRules: Node[]) => {
    if (existingSubRules.length === 0) {
      return { x: currentRule.position.x + 350, y: currentRule.position.y };
    }

    const lastSubRule = existingSubRules[existingSubRules.length - 1];

    return { x: lastSubRule.position.x, y: lastSubRule.position.y + 250 };
  }, []);

  const addRule = useCallback(() => {
    const nodes = getNodes();
    const currentRule = nodes.find(node => node.id === id);
    const existingSubRules = nodes.filter(node => node.type === 'rule' && node.data.metadata?.parent_node_id === id);
    const rules = nodes.filter(node => node.type === 'rule');
    const ruleLabel = `Untitled rule ${(rules.length + 1).toString().padStart(2, '0')}`;

    if (!currentRule) return;

    const position = getSubRulePosition(currentRule, existingSubRules);

    const newRule: RuleNode = {
      id: crypto.randomUUID(),
      type: 'rule',
      dragHandle: '.node-header',
      position,
      data: {
        width: FLOW_NODE_WIDTH,
        label: ruleLabel,
        metadata: {
          ruleset_id: data.metadata?.ruleset_id,
          parent_node_id: id,
          level: data.metadata?.level ? data.metadata.level + 1 : 1,
        },
        conditions: undefined,
      },
    };

    const newEdge: Edge = { id: `edge-${id}-${newRule.id}`, source: id, target: newRule.id, type: 'customEdge' };

    setNodes(nds => [...nds, newRule]);
    setEdges(eds => [...eds, newEdge]);
  }, [id, getNodes, getSubRulePosition, setNodes, setEdges, data]);

  const addOutcome = () => {
    const initialOutcomes = {
      id: crypto.randomUUID(),
      points_strategy_id: '',
      expiry_strategy_id: '',
    };

    updateNodeData<RuleFormValues>(id, { rule_outcomes: initialOutcomes });
  };

  const removeOutcome = () => {
    updateNodeData<RuleFormValues>(id, { rule_outcomes: undefined });
  };

  const onSubmitCondition = (values: ConditionFormValues) => {
    updateNodeData<RuleFormValues>(id, { conditions: values });
  };

  useNodeForm(id, form);

  const onSubmit: SubmitHandler<RuleFormValues> = async _ => {};

  // Reset form values after data changes
  useEffect(() => {
    form.reset(data, {
      keepErrors: true,
      keepIsSubmitted: true,
    });
  }, [form, data]);

  useEffect(() => {
    if (previousTrackerType && trackerType && previousTrackerType !== trackerType && !!data.rule_outcomes?.points_strategy_id) {
      updateNodeData<RuleFormValues>(id, {
        rule_outcomes: { ...data.rule_outcomes, points_strategy_id: '' },
      });
    }
  }, [form, id, data, trackerType, previousTrackerType, updateNodeData]);

  useEffect(() => {
    const subscription = form.watch((_, { type }) => {
      if (type !== 'change' || !form.formState.isSubmitted) return;

      form.trigger();
    });

    return () => subscription.unsubscribe();
  }, [form, form.formState]);

  return (
    <div className={cn('rule-node relative rounded-lg border bg-card text-foreground')} style={{ width: data.width }}>
      <RuleHeader
        className="bg-green-700"
        name={data.label}
        isCollapsed={isContentCollapsed}
        onCollapse={() => setIsContentCollapsed(!isContentCollapsed)}
      />
      <Collapsible open={!isContentCollapsed}>
        <CollapsibleContent className="relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="p-3">
                <ConditionContent isViewMode={isView} conditions={data.conditions} onClick={() => setIsConditionModalOpen(true)} />
              </div>
              <Separator />
              <Block visibled={!isView}>
                <div className="p-3">
                  {!data.rule_outcomes && <RuleOutcomeAddButton disabled={!data.conditions} onClick={addOutcome} />}
                  {data.rule_outcomes && (
                    <>
                      <div className="mb-2 flex items-center justify-between">
                        <Label>Outcome</Label>
                        <Button className="size-7 rounded-full border p-0" variant="transparent" onClick={removeOutcome}>
                          <Trash2Icon size={16} className="text-red-500" />
                        </Button>
                      </div>
                      <div className="grid gap-3">
                        {/* <RuleSelectPointStrategy form={form} defaultItem={pointStrategyDetail?.data} trackerType={trackerType} /> */}
                        {/* <RuleSelectExpiryStrategy form={form} defaultItem={expiryStrategyDetail?.data} /> */}
                      </div>
                    </>
                  )}
                </div>
              </Block>
              <Block className="p-3" visibled={isView}>
                {data.rule_outcomes && <RuleOutcomeDisplay pointStrategyName="abc" expiryStrategyName="cde" />}
                {!data.rule_outcomes && <RuleOutcomeEmpty />}
              </Block>
              <RuleRenameModal
                isOpen={isRenameModalOpen}
                title={'Rule Name'}
                defaultValues={{ name: data.label }}
                onClose={() => setIsRenameModalOpen(false)}
                onSubmit={handleRename}
              />
              <ModalConfirm
                visible={isDeleteModalOpen}
                title="Are you sure you want to delete this rule?"
                btnNo="Cancel"
                btnYes="Delete"
                onYes={removeNode}
                onNo={() => setIsDeleteModalOpen(false)}
              />
              <ConditionModal isOpen={isConditionModalOpen} ruleId={id} onClose={() => setIsConditionModalOpen(false)} onSubmit={onSubmitCondition} />
              <RuleButtonAdd visibled={!isView && !hasSku} onClick={addRule} />
              {/* <pre className="text-xs">
                <code>{JSON.stringify(form.formState.isValid, null, 2)}</code>
                <br />
                <code>{JSON.stringify(form.watch(), null, 2)}</code>
              </pre> */}
            </form>
          </Form>
        </CollapsibleContent>
      </Collapsible>
      <RuleToolbar
        visible={!isView}
        removeDisabled={isRuleLevel1}
        onRemove={() => setIsDeleteModalOpen(true)}
        onEdit={() => setIsRenameModalOpen(true)}
      />
      <Handle className="invisible" type="target" position={Position.Left} />
      <Handle className="invisible" type="source" position={Position.Right} />
    </div>
  );
}

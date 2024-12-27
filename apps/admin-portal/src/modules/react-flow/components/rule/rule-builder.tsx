/* eslint-disable no-console */
import { forwardRef, RefObject, useCallback, useImperativeHandle } from 'react';
import {
  addEdge,
  type Connection,
  Controls,
  type DefaultEdgeOptions,
  type Edge,
  type FitViewOptions,
  MarkerType,
  type Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';

import { CustomEdge } from './custom-edge';
import { Rule } from './rule-node';
import { RuleSet } from './rule-set-node';

import { FLOW_NODE_WIDTH } from '../../constants/rule.constant';
import { useRuleValidation } from '../../contexts/node-form.context';

import '@xyflow/react/dist/style.css';

const fitViewOptions: FitViewOptions = { padding: 0.2 };
const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
  markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
  data: {
    dashed: true,
    color: '#999',
  },
};
const defaultViewport = { x: 0, y: 0, zoom: 1 };
const nodeTypes = { set: RuleSet, rule: Rule };
const edgeTypes = { customEdge: CustomEdge };

export type RuleBuilderRef = {
  validateAllForms: () => Promise<{ isValid: boolean }>;
  getNodes: () => Node[];
  getEdges: () => Edge[];
  getRuleName: () => string;
  isEmpty: () => boolean;
  addSet: () => void;
};

type RuleBuilderProps = {
  mode: 'create' | 'edit' | 'view';
  name?: string;
  initNodes?: Node[];
  initEdges?: Edge[];
  onSave?: () => Promise<void>;
  onClose?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  ref: RefObject<RuleBuilderRef>;
};
const RuleBuilder = forwardRef<RuleBuilderRef, Omit<RuleBuilderProps, 'ref'>>(({ name = '', initNodes = [], initEdges = [] }, ref) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initEdges);
  const { validateAllForms } = useRuleValidation();

  const onConnect = useCallback((params: Connection) => setEdges(eds => addEdge(params, eds)), [setEdges]);

  const addSet = useCallback(() => {
    setNodes(currentNodes => {
      const sets = currentNodes.filter(node => node.type === 'set');
      const xOffset = 100 + currentNodes.length * (FLOW_NODE_WIDTH + 50);
      const yOffset = 100;
      const setLabel = `Untitled set ${(sets.length + 1).toString().padStart(2, '0')}`;
      const rules = nodes.filter(node => node.type === 'rule');
      const ruleLabel = `Untitled rule ${(rules.length + 1).toString().padStart(2, '0')}`;

      const ruleSetId = crypto.randomUUID();
      const newSet: Node = {
        id: ruleSetId,
        type: 'set',
        dragHandle: '.node-header',
        position: { x: xOffset, y: yOffset },
        data: {
          width: FLOW_NODE_WIDTH,
          label: setLabel,
          date_type: 'no_limit',
          action_ids: [],
        },
      };

      const ruleNode: Node = {
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
        },
      };

      const newEdge: Edge = {
        id: `edge-${newSet.id}-${ruleNode.id}`,
        source: newSet.id,
        target: ruleNode.id,
        type: 'customEdge',
      };

      setEdges(currentEdges => [...currentEdges, newEdge]);

      return [...currentNodes, newSet, ruleNode];
    });
  }, [setNodes, nodes, setEdges]);

  useImperativeHandle(
    ref,
    () => ({
      validateAllForms,
      getNodes: () => nodes,
      getEdges: () => edges,
      getRuleName: () => name,
      isEmpty: () => nodes.length === 0,
      addSet,
    }),
    [validateAllForms, nodes, edges, name, addSet]
  );

  return (
    <div className="flex h-full grow rounded bg-gray-100">
      <ReactFlow
        fitView={false}
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={defaultViewport}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
      </ReactFlow>
      {/* <div>
        <pre className="text-xs">{JSON.stringify(nodes, null, 2)}</pre>
      </div> */}
    </div>
  );
});

RuleBuilder.displayName = 'RuleBuilder';

export default RuleBuilder;

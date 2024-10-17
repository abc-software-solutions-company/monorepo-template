import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

import { FlowNode } from '../interfaces/rule.interface';

export const useFlowNode = () => {
  const { setNodes } = useReactFlow<FlowNode>();

  const updateNodeData = useCallback(
    <T extends object>(id: string, values: Partial<T>) => {
      setNodes(nodes =>
        nodes.map(node => {
          if (node.id === id) {
            return { ...node, data: { ...node.data, ...values } };
          }

          return node;
        })
      );
    },
    [setNodes]
  );

  return { updateNodeData };
};

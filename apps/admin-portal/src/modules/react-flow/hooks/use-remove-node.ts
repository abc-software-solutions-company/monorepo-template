import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

import { FlowNode } from '../interfaces/rule.interface';

export default function useRemoveNode(id: string) {
  const { getEdges, getNodes, setNodes, setEdges } = useReactFlow<FlowNode>();

  return useCallback(() => {
    const allNodes = getNodes();
    const allEdges = getEdges();
    const targetNode = allNodes.find(n => n.id === id);

    if (!targetNode) return;
    const hasChildren = allEdges.some(edge => edge.source === id);

    if (targetNode.type === 'set' || hasChildren) {
      const nodesToRemove = new Set([id]);
      const newNodesToCheck = allEdges.filter(edge => edge.source === id).map(edge => edge.target);

      while (newNodesToCheck.length > 0) {
        const currentId = newNodesToCheck.pop();

        if (currentId && !nodesToRemove.has(currentId)) {
          nodesToRemove.add(currentId);
          const childIds = allEdges.filter(edge => edge.source === currentId).map(edge => edge.target);

          newNodesToCheck.push(...childIds);
        }
      }

      setNodes(nodes => nodes.filter(n => !nodesToRemove.has(n.id)));
      setEdges(edges => edges.filter(e => !nodesToRemove.has(e.source) && !nodesToRemove.has(e.target)));

      return;
    }

    setNodes(nodes => nodes.filter(n => n.id !== id));
    setEdges(edges => edges.filter(e => e.source !== id && e.target !== id));
  }, [id, getNodes, getEdges, setNodes, setEdges]);
}

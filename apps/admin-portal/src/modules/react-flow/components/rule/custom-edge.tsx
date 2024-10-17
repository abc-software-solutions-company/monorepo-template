import { type Edge, type EdgeProps, getEdgeCenter, getSmoothStepPath } from '@xyflow/react';

export type CustomEdgeType = Edge<{
  edgeType?: 'step' | 'smoothstep';
  dashed?: boolean;
  color?: string;
}>;

export function CustomEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data }: EdgeProps<CustomEdgeType>) {
  const edgeType = data?.edgeType || 'smoothstep';

  let edgePath: string;

  if (edgeType === 'smoothstep') {
    [edgePath] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  } else {
    const [centerX] = getEdgeCenter({ sourceX, sourceY, targetX, targetY });

    edgePath = `M${sourceX},${sourceY} L${centerX},${sourceY} L${centerX},${targetY} L${targetX},${targetY}`;
  }

  const color = data?.color || '#ef4444';

  const pathStyle = {
    ...style,
    stroke: color || '#ef4444',
    strokeWidth: 2,
    markerEnd: `url(#arrow-${id})`,
    ...(data?.dashed && { strokeDasharray: '5, 5' }),
  };

  return (
    <>
      <defs>
        <marker id={`arrow-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <path id={id} style={pathStyle} className="react-flow__edge-path" d={edgePath} />
    </>
  );
}

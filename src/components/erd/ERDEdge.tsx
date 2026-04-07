import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';
import { X } from 'lucide-react';

export default function ERDEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
  });

  const onEdgeClick = () => {
    // This is handled by the parent currently via onEdgeClick for cycling
    // But we want a literal delete button
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 10,
            pointerEvents: 'all',
          }}
          className="nodrag nopan flex flex-col items-center gap-1"
        >
          <div className="bg-card border border-border px-2 py-1 rounded-md shadow-sm font-mono font-bold text-[10px] text-foreground flex items-center gap-1.5 group hover:border-primary transition-all cursor-pointer select-none">
            {label}
            <button
              className="w-4 h-4 rounded-full bg-muted hover:bg-destructive hover:text-white flex items-center justify-center transition-colors shadow-inner"
              onClick={(event) => {
                event.stopPropagation();
                if (typeof data?.onDelete === 'function') {
                  data.onDelete(id);
                }
              }}
            >
              <X size={10} />
            </button>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

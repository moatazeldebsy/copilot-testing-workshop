import React from 'react';
import './ArchDiagram.css';

export interface DiagramNode {
  label: string;
  icon?: string;
}

export interface DiagramConnection {
  from: number;
  to: number;
  label?: string;
}

interface ArchDiagramProps {
  title?: string;
  nodes: DiagramNode[];
  connections: DiagramConnection[];
}

const ArchDiagram: React.FC<ArchDiagramProps> = ({ title, nodes, connections }) => {
  // Group outgoing connections by source node
  const outgoingMap: Record<number, DiagramConnection[]> = {};
  connections.forEach((c) => {
    if (!outgoingMap[c.from]) outgoingMap[c.from] = [];
    outgoingMap[c.from].push(c);
  });

  // Identify branch targets (nodes targeted by a source with multiple outgoing)
  const branchTargets = new Set<number>();
  Object.values(outgoingMap).forEach((group) => {
    if (group.length > 1) {
      group.forEach((c) => branchTargets.add(c.to));
    }
  });

  return (
    <div className="arch-diagram">
      {title && <div className="arch-diagram-title">{title}</div>}
      <div className="arch-diagram-flow">
        {nodes.map((node, i) => {
          // Skip nodes rendered inside a branch group
          if (branchTargets.has(i)) return null;

          const outgoing = outgoingMap[i] || [];

          return (
            <React.Fragment key={i}>
              <div className="arch-node">
                {node.icon && <span className="arch-node-icon">{node.icon}</span>}
                <span className="arch-node-label">{node.label}</span>
              </div>
              {outgoing.length > 0 && (
                <>
                  <div className="arch-arrow">
                    <span className="arch-arrow-line" />
                    {outgoing[0].label && (
                      <span className="arch-arrow-label">{outgoing[0].label}</span>
                    )}
                    <span className="arch-arrow-head">▸</span>
                  </div>
                  {outgoing.length > 1 && (
                    <div className="arch-node-group">
                      {outgoing.map((c) => (
                        <div key={c.to} className="arch-node">
                          {nodes[c.to].icon && (
                            <span className="arch-node-icon">{nodes[c.to].icon}</span>
                          )}
                          <span className="arch-node-label">{nodes[c.to].label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ArchDiagram;

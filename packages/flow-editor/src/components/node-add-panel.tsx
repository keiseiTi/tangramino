import React from 'react';

import { WorkflowDragService, useService } from '@flowgram.ai/free-layout-editor';

const cardkeys = ['Node1', 'Node2', 'Condition', 'Chain', 'Tool'];

export const NodeAddPanel: React.FC = (props) => {
  const startDragSerivce = useService<WorkflowDragService>(WorkflowDragService);

  return (
    <div style={{ overflow: 'auto', background: '#e2e2e2', padding: 10 }}>
      {cardkeys.map((nodeType) => (
        <div
          key={nodeType}
          className='demo-free-card'
          onMouseDown={(e) =>
            startDragSerivce.startDragCard(nodeType.toLowerCase(), e, {
              data: {
                title: `New ${nodeType}`,
                content: 'xxxx',
              },
            })
          }
        >
          {nodeType}
        </div>
      ))}
    </div>
  );
};

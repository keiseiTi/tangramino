import React from 'react';
import { type LineRenderProps } from '@flowgram.ai/free-lines-plugin';

export const CustomLineLabel = (props: LineRenderProps) => {
  const { line, color } = props;

  if (line.from?.flowNodeType === 'condition') {
    return (
      <div
        style={{
          transform: `translate(-50%, -50%) translate(${line.center.labelX}px, ${line.center.labelY}px)`,
          color,
        }}
        data-line-id={line.id}
      >
        true
      </div>
    );
  }

  return <></>;
};

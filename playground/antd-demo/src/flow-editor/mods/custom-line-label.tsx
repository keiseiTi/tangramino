import React from 'react';
import { type LineRenderProps } from '@flowgram.ai/free-lines-plugin';

export const CustomLineLabel = (props: LineRenderProps) => {
  const { line, color } = props;
  const fromNode = line.from;

  if (fromNode?.flowNodeType === 'condition') {
    if (fromNode.lines.outputLines.length === 1) {
      if (typeof line.lineData?.value !== 'boolean') {
        setTimeout(() => {
          line.lineData = {
            value: true,
          };
        });
      }
    }

    if (fromNode.lines.outputLines.length === 2) {
      const firstOutputLine = fromNode.lines.outputLines[0];
      const secondOutputLine = fromNode.lines.outputLines[1];
      if (typeof firstOutputLine.lineData?.value !== 'boolean') {
        setTimeout(() => {
          firstOutputLine.lineData = {
            value: true,
          };
        });
      }

      if (typeof secondOutputLine.lineData?.value !== 'boolean') {
        setTimeout(() => {
          secondOutputLine.lineData = {
            value: firstOutputLine.lineData?.value === true ? false : true,
          };
        });
      }
    }

    return (
      <div
        style={{
          transform: `translate(-50%, -50%) translate(${line.center.labelX}px, ${line.center.labelY}px)`,
          color,
        }}
        className='absolute cursor-pointer pointer-events-auto'
        data-line-id={line.id}
      >
        {String(line.lineData?.value)}
      </div>
    );
  }

  return <></>;
};

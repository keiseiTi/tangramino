import React from 'react';
import { useEditorContext } from '@/hooks/use-editor-context';
import { cn } from '@/utils';

export const Operation = () => {
  const { activeElementEvent } = useEditorContext();

  return (
    <div className={cn('p-2 text-sm text-slate-800 border-b border-slate-300 bg-gray-50', {
      'hidden': !activeElementEvent,
    })}>
      {`${activeElementEvent?.material?.title} - ${activeElementEvent?.method?.description}`}
    </div>
  );
};

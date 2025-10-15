import React, { useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { cn } from '@/utils/cn';

interface IProps {
  value?: string;
  onChange?: (value: string) => void;
  classNames?: string;
}

export const CodeEditor = (props: IProps) => {
  const { value, onChange, classNames } = props;
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);

  useEffect(() => {
    if (monacoEl) {
      setEditor((editor) => {
        if (editor) return editor;

        return monaco.editor.create(monacoEl.current!, {
          value: value || ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
          language: 'typescript',
        });
      });
    }

    return () => editor?.dispose();
  }, [monacoEl.current]);

  useEffect(() => {
    if (editor) {
      editor.onDidChangeModelContent(() => {
        const value = editor.getValue();
        onChange?.(value);
      });
    }
  }, [editor]);

  return <div className={cn('w-full h-[300px]', classNames)} ref={monacoEl}></div>;
};

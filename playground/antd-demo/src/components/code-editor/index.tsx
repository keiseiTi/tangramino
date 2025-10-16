import React, { useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { cn } from '@/utils/cn';

export interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  classNames?: string;
  placeholder?: string;
}

export const CodeEditor = (props: CodeEditorProps) => {
  const { value, onChange, classNames, placeholder } = props;
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);

  useEffect(() => {
    if (monacoEl) {
      setEditor((editor) => {
        if (editor) return editor;

        return monaco.editor.create(monacoEl.current!, {
          value: value,
          language: 'typescript',
          placeholder: placeholder
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

  return <div className={cn('w-full h-100', classNames)} ref={monacoEl}></div>;
};

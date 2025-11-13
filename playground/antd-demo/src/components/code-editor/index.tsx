import React, { useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { cn } from '@/utils/cn';

export interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  classNames?: string;
  placeholder?: string;
  language?: string;
}

export const CodeEditor = (props: CodeEditorProps) => {
  const { value, onChange, classNames, placeholder, language } = props;
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);

  useEffect(() => {
    if (monacoEl) {
      setEditor((editor) => {
        if (editor) return editor;

        return monaco.editor.create(monacoEl.current!, {
          value: value,
          language: language || 'typescript',
          placeholder: placeholder,
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

  useEffect(() => {
    if (editor && typeof value === 'string' && value !== editor.getValue()) {
      editor.setValue(value);
    }
  }, [editor, value]);

  return <div className={cn('w-full', classNames ?? 'h-100')} ref={monacoEl}></div>;
};

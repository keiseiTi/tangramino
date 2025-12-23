import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useEditorCore } from '../hooks/use-editor-core';
import { createPortal } from 'react-dom';

interface CanvasOverlayProps {
  style?: React.CSSProperties | undefined;
  className?: string | undefined;
  renderContent?: (() => React.ReactNode) | undefined;
}

export const CanvasOverlay = (props: CanvasOverlayProps) => {
  const { style, className, renderContent: Content } = props;
  const activeElement = useEditorCore((state) => state.activeElement);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastRectRef = useRef<DOMRect | null>(null);

  // 比较两个 DOMRect 是否相同
  const isRectChanged = (rect1: DOMRect | null, rect2: DOMRect | null): boolean => {
    if (rect1 === null && rect2 === null) return false;
    if (rect1 === null || rect2 === null) return true;
    return (
      rect1.left !== rect2.left ||
      rect1.top !== rect2.top ||
      rect1.width !== rect2.width ||
      rect1.height !== rect2.height
    );
  };

  const updateRect = useCallback(() => {
    if (!activeElement) {
      if (isRectChanged(lastRectRef.current, null)) {
        setRect(null);
        lastRectRef.current = null;
      }
      return;
    }

    const element = document.querySelector(`[data-element-id="${activeElement.id}"]`);
    if (element) {
      const newRect = element.getBoundingClientRect();
      if (isRectChanged(lastRectRef.current, newRect)) {
        setRect(newRect);
        lastRectRef.current = newRect;
      }
    } else {
      if (isRectChanged(lastRectRef.current, null)) {
        setRect(null);
        lastRectRef.current = null;
      }
    }
  }, [activeElement]);

  // 初始化和选中元素改变时更新
  useEffect(() => {
    updateRect();
  }, [activeElement, updateRect]);

  // 使用 requestAnimationFrame 持续监听尺寸变化
  useEffect(() => {
    const animate = () => {
      updateRect();
      rafIdRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [updateRect]);

  if (!rect || !activeElement) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 999,
      }}
    >
      <div
        style={{
          position: 'absolute',
          transform: `translate(${rect.left}px, ${rect.top}px)`,
          width: rect.width,
          height: rect.height,
          border: '2px solid #1677ff',
          boxSizing: 'border-box',
          transition: 'all 0.1s ease-out',
          ...style,
        }}
        className={className}
      >
        {Content ? (
          <Content />
        ) : (
          <div
            style={{
              position: 'absolute',
              top: -24,
              left: 0,
              background: '#1677ff',
              color: 'white',
              padding: '2px 8px',
              fontSize: 12,
              borderRadius: '2px 2px 0 0',
            }}
          >
            {activeElement.material.title}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

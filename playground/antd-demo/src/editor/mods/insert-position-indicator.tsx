import React, { useEffect, useState } from 'react';
import { useEditorCore } from '@tangramino/base-editor';
import { createPortal } from 'react-dom';

export const InsertPositionIndicator = () => {
  const insertPosition = useEditorCore((state) => state.insertPosition);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const updateRect = () => {
    if (!insertPosition) {
      setRect(null);
      return;
    }

    const element = document.querySelector(`[data-element-id="${insertPosition.id}"]`);
    if (element) {
      setRect(element.getBoundingClientRect());
    } else {
      setRect(null);
    }
  };

  useEffect(() => {
    updateRect();
    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);

    // 使用 requestAnimationFrame 来持续更新位置
    let rafId: number;
    const rafUpdate = () => {
      updateRect();
      rafId = requestAnimationFrame(rafUpdate);
    };
    rafId = requestAnimationFrame(rafUpdate);

    return () => {
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
      cancelAnimationFrame(rafId);
    };
  }, [insertPosition]);

  if (!rect || !insertPosition) return null;

  const position = insertPosition.position;

  // 根据插入位置计算线条的样式
  const getLineStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      background: '#faad14', // 黄色指示线
      boxShadow: '0 0 4px rgba(250, 173, 20, 0.8)',
      borderRadius: 2,
    };

    switch (position) {
      case 'before':
        // 左侧竖线
        return {
          ...baseStyle,
          left: rect.left - 2,
          top: rect.top,
          width: 4,
          height: rect.height,
        };
      case 'after':
        // 右侧竖线
        return {
          ...baseStyle,
          left: rect.right - 2,
          top: rect.top,
          width: 4,
          height: rect.height,
        };
      case 'up':
        // 顶部横线
        return {
          ...baseStyle,
          left: rect.left,
          top: rect.top - 2,
          width: rect.width,
          height: 4,
        };
      case 'down':
        // 底部横线
        return {
          ...baseStyle,
          left: rect.left,
          top: rect.bottom - 2,
          width: rect.width,
          height: 4,
        };
      default:
        return baseStyle;
    }
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9998,
      }}
    >
      <div style={getLineStyle()} />
    </div>,
    document.body,
  );
};

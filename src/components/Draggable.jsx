import React, { useEffect, useRef, useState } from 'react';

// Compact pointer/touch drag helper for both mouse & touch.
// Renders `children` at absolute position (x,y) inside a positioned parent.
// Calls onDrop with the final rect ({ x, y, cx, cy, w, h }) when the pointer is released.
// Calls onMove during drag.
export const Draggable = ({
  initialX = 0,
  initialY = 0,
  width = 80,
  height = 80,
  onDrop,
  onMove,
  disabled = false,
  children,
  testid,
  z = 1,
}) => {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const elRef = useRef(null);

  useEffect(() => { setPos({ x: initialX, y: initialY }); }, [initialX, initialY]);

  const start = (clientX, clientY) => {
    if (disabled) return;
    const parent = elRef.current?.offsetParent;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    offset.current = { x: clientX - rect.left - pos.x, y: clientY - rect.top - pos.y };
    setDragging(true);
  };

  const move = (clientX, clientY) => {
    const parent = elRef.current?.offsetParent;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const nx = clientX - rect.left - offset.current.x;
    const ny = clientY - rect.top - offset.current.y;
    setPos({ x: nx, y: ny });
    if (onMove) onMove({ x: nx, y: ny, cx: nx + width / 2, cy: ny + height / 2, w: width, h: height });
  };

  useEffect(() => {
    if (!dragging) return;
    const onPointerMove = (e) => { e.preventDefault(); move(e.clientX, e.clientY); };
    const onTouchMove = (e) => { const t = e.touches[0]; if (t) { e.preventDefault(); move(t.clientX, t.clientY); } };
    const finish = () => {
      setDragging(false);
      if (onDrop) onDrop({ x: pos.x, y: pos.y, cx: pos.x + width / 2, cy: pos.y + height / 2, w: width, h: height });
    };
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', finish);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', finish);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', finish);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, pos.x, pos.y]);

  return (
    <div
      ref={elRef}
      onPointerDown={(e) => { e.preventDefault(); start(e.clientX, e.clientY); }}
      onTouchStart={(e) => { const t = e.touches[0]; if (t) start(t.clientX, t.clientY); }}
      data-testid={testid}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width,
        height,
        cursor: disabled ? 'default' : (dragging ? 'grabbing' : 'grab'),
        touchAction: 'none',
        transition: dragging ? 'none' : 'left 300ms ease, top 300ms ease',
        zIndex: dragging ? 30 : z,
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
};

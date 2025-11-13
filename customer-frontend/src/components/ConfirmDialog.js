import React, { useEffect, useRef } from 'react';

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message = '',
  confirmText = 'Yes',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  defaultAction = 'confirm', // 'confirm' | 'cancel'
}) {
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    // Focus default action button when opened
    const toFocus = defaultAction === 'cancel' ? cancelRef.current : confirmRef.current;
    toFocus && toFocus.focus();
  }, [open, defaultAction]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel && onCancel();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm && onConfirm();
      } else if (e.key === 'Tab') {
        // Simple focus trap between the two buttons
        const focusable = [cancelRef.current, confirmRef.current].filter(Boolean);
        if (focusable.length === 0) return;
        const idx = focusable.indexOf(document.activeElement);
        if (e.shiftKey) {
          // backwards
          const next = idx <= 0 ? focusable[focusable.length - 1] : focusable[idx - 1];
          e.preventDefault();
          next && next.focus();
        } else {
          // forwards
          const next = idx === focusable.length - 1 ? focusable[0] : focusable[idx + 1];
          e.preventDefault();
          next && next.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;
  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000,
      }}
      onClick={(e) => {
        // Close on backdrop click (but not when clicking inside the card)
        if (e.target === containerRef.current) onCancel && onCancel();
      }}
    >
      <div style={{
        width: 'min(92vw, 420px)', background: 'var(--card-bg,#fff)', color: 'var(--text,#111)', borderRadius: 16,
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)', overflow: 'hidden'
      }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-color,#e2e8f0)' }}>
          <h3 id="confirm-title" style={{ margin: 0, fontSize: 18 }}>{title}</h3>
        </div>
        <div style={{ padding: '18px 20px', fontSize: 15, lineHeight: 1.6 }}>
          {message}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '14px 20px', background: 'var(--tabs-bg,#f8fafc)', borderTop: '1px solid var(--border-color,#e2e8f0)' }}>
          <button
            ref={cancelRef}
            onClick={onCancel}
            style={{ padding: '10px 14px', borderRadius: 10, background: '#fff', border: '1px solid #cbd5e1', cursor: 'pointer' }}
          >{cancelText}</button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            style={{ padding: '10px 14px', borderRadius: 10, background: 'linear-gradient(90deg,#1976d2,#21cbf3)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { FiX } from 'react-icons/fi';
import styles from './SidePanel.module.css';

export interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  position?: 'left' | 'right';
  width?: string | number;
  className?: string;
  style?: CSSProperties;
}

export const SidePanel = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = '400px',
  className,
  style,
}: SidePanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (!isOpen && shouldRender) {
      setIsClosing(true);
      timeoutRef.current = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300);
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [isOpen, shouldRender]);

  const handleClose = useCallback(() => {
    if (isClosing || !isOpen) return;
    onClose();
  }, [onClose, isClosing, isOpen]);

  useEffect(() => {
    if (!isOpen || isClosing) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isClosing, handleClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current && !isClosing) {
      handleClose();
    }
  };

  if (!shouldRender) return null;

  const panelWidth = typeof width === 'number' ? `${width}px` : width;

  const panelClasses = [
    styles.panel,
    styles[position],
    isClosing && styles.closing,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const overlayClasses = [
    styles.overlay,
    isClosing && styles.closing,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={overlayRef}
      className={overlayClasses}
      onClick={handleOverlayClick}
      aria-modal="true"
      aria-labelledby={title ? 'side-panel-title' : undefined}
      role="dialog"
    >
      <div
        ref={panelRef}
        className={panelClasses}
        style={{ width: panelWidth, ...style }}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || true) && (
          <div className={styles.header}>
            {title && (
              <h2 id="side-panel-title" className={styles.title}>
                {title}
              </h2>
            )}
            <button
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="閉じる"
              type="button"
            >
              <FiX aria-hidden="true" />
            </button>
          </div>
        )}

        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>
  );
};

SidePanel.displayName = 'SidePanel';


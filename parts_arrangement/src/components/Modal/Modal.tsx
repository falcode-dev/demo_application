import { useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { FiX } from 'react-icons/fi';
import styles from './Modal.module.css';

export interface ModalProps {
  /** モーダルを開くかどうか */
  isOpen: boolean;
  /** モーダルを閉じる関数 */
  onClose: () => void;
  /** モーダルのタイトル */
  title?: string;
  /** モーダルのコンテンツ */
  children: ReactNode;
  /** フッターのコンテンツ（ボタンなど） */
  footer?: ReactNode;
  /** モーダルのサイズ（small/medium/large またはカスタムCSSProperties） */
  size?: 'small' | 'medium' | 'large' | CSSProperties;
  /** 閉じるボタンを表示するか */
  showCloseButton?: boolean;
  /** オーバーレイをクリックして閉じるか */
  closeOnOverlayClick?: boolean;
  /** ESCキーで閉じるか */
  closeOnEscape?: boolean;
  /** オーバーレイを非表示にするか（2つ目のモーダルの下に表示される場合など） */
  hideOverlay?: boolean;
  /** z-indexを高くするか（2つ目のモーダルなど） */
  higherZIndex?: boolean;
  /** カスタムクラス名 */
  className?: string;
  /** カスタムスタイル */
  style?: CSSProperties;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  hideOverlay = false,
  higherZIndex = false,
  className,
  style,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // モーダルが開いた時にレンダリングを開始
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      // アニメーションのために少し遅延
      const timer = setTimeout(() => {
        setIsClosing(false);
      }, 10);
      return () => clearTimeout(timer);
    } else if (!isOpen && shouldRender) {
      // モーダルが閉じられた時は閉じるアニメーションを開始
      setIsClosing(true);
      timeoutRef.current = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300); // アニメーション時間に合わせる
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [isOpen, shouldRender]);

  // 閉じる処理
  const handleClose = useCallback(() => {
    if (isClosing || !isOpen) return;
    onClose();
  }, [onClose, isClosing, isOpen]);

  // ESCキーで閉じる
  useEffect(() => {
    if (!isOpen || !closeOnEscape || isClosing) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, isClosing, handleClose]);

  // モーダルが開いている時、bodyのスクロールを無効化
  useEffect(() => {
    if (isOpen && shouldRender) {
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
  }, [isOpen, shouldRender]);

  // オーバーレイクリックで閉じる
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === overlayRef.current && !isClosing && isOpen) {
      handleClose();
    }
  };

  if (!shouldRender) return null;

  const sizeClassName = typeof size === 'string' ? styles[`size-${size}`] : '';
  const sizeStyle = typeof size === 'object' && size !== null ? size : {};

  const modalClasses = [
    styles.modal,
    sizeClassName,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const overlayClasses = [
    styles.overlay,
    isClosing && styles.closing,
    hideOverlay && styles.hideOverlay,
    higherZIndex && styles.higherZIndex,
  ]
    .filter(Boolean)
    .join(' ');

  const modalClassesWithClosing = [
    modalClasses,
    isClosing && styles.modalClosing,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={overlayRef}
      className={overlayClasses}
      onClick={handleOverlayClick}
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      role="dialog"
    >
      <div
        ref={modalRef}
        className={modalClassesWithClosing}
        style={{ ...sizeStyle, ...style }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        {(title || showCloseButton) && (
          <div className={styles.header}>
            {title && (
              <h2 id="modal-title" className={styles.title}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                className={styles.closeButton}
                onClick={handleClose}
                aria-label="閉じる"
                type="button"
              >
                <FiX aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* ボディ */}
        <div className={styles.body}>
          {children}
        </div>

        {/* フッター */}
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';

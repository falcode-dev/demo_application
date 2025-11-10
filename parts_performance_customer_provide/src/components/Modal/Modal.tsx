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

  // 閉じるアニメーション
  const handleClose = useCallback(() => {
    if (isClosing) return; // 既に閉じる処理中の場合は何もしない
    setIsClosing(true);
    timeoutRef.current = setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      onClose();
    }, 300); // アニメーション時間に合わせる
  }, [onClose, isClosing]);

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
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
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

  // オーバーレイクリックで閉じる
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === overlayRef.current && !isClosing) {
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


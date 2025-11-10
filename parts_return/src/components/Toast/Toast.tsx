import { useEffect } from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';
import styles from './Toast.module.css';

export interface ToastProps {
  /** トーストのメッセージ */
  message: string;
  /** トーストのタイプ */
  type?: 'error' | 'success' | 'info' | 'warning';
  /** 表示時間（ミリ秒）。0の場合は自動で閉じない */
  duration?: number;
  /** トーストを閉じる関数 */
  onClose: () => void;
  /** トーストの位置 */
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export const Toast = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  position = 'top-right',
}: ToastProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]} ${styles[position]}`} role="alert">
      <div className={styles.content}>
        <FiAlertCircle className={styles.icon} aria-hidden="true" />
        <div className={styles.message}>
          {message.split('\n').map((line, index) => (
            <div key={index} className={line.trim() === '' ? styles.emptyLine : ''}>
              {line || '\u00A0'}
            </div>
          ))}
        </div>
      </div>
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="閉じる"
      >
        <FiX aria-hidden="true" />
      </button>
    </div>
  );
};


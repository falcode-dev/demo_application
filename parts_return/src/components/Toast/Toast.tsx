import { useEffect, useState, useCallback } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertCircle, FiX } from 'react-icons/fi';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ANIMATION_DURATION = 300;

export const ToastItem = ({ toast, onClose }: ToastProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(toast.id);
    }, ANIMATION_DURATION);
  }, [toast.id, onClose]);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FiCheckCircle className={styles.icon} />;
      case 'error':
        return <FiXCircle className={styles.icon} />;
      case 'warning':
        return <FiAlertCircle className={styles.icon} />;
      case 'info':
      default:
        return <FiInfo className={styles.icon} />;
    }
  };

  return (
    <div
      className={`${styles.toast} ${styles[toast.type]} ${isClosing ? styles.closing : ''}`}
    >
      {getIcon()}
      <span className={styles.message}>{toast.message}</span>
      <button
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Close"
      >
        <FiX />
      </button>
    </div>
  );
};

import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** ラベルテキスト */
  label?: string;
  /** サイズ */
  size?: 'small' | 'medium' | 'large';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, size = 'medium', className, ...props }, ref) => {
    const checkboxId = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <label className={`${styles.checkboxWrapper} ${styles[`size-${size}`]} ${className || ''}`}>
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={styles.checkboxInput}
          {...props}
        />
        <span className={styles.checkboxCustom} aria-hidden="true">
          <svg
            className={styles.checkboxIcon}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5 4L6 11.5L2.5 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {label && <span className={styles.checkboxLabel}>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';


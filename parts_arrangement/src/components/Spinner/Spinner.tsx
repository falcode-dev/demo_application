import type { CSSProperties } from 'react';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  /** サイズ（small/medium/large またはカスタムCSSProperties） */
  size?: 'small' | 'medium' | 'large' | CSSProperties;
  /** カラー（primary/sub/accent） */
  variant?: 'primary' | 'sub' | 'accent';
  /** テキストラベル */
  label?: string;
  /** オーバーレイを表示するか */
  overlay?: boolean;
  /** フルスクリーン表示 */
  fullScreen?: boolean;
  /** カスタムクラス名 */
  className?: string;
  /** カスタムスタイル */
  style?: CSSProperties;
}

export const Spinner = ({
  size = 'medium',
  variant = 'primary',
  label,
  overlay = false,
  fullScreen = false,
  className,
  style,
}: SpinnerProps) => {
  // サイズの判定
  const sizeClassName = typeof size === 'string' ? styles[`size-${size}`] : '';
  const sizeStyle = typeof size === 'object' && size !== null ? size : {};

  const spinnerClasses = [
    styles.spinner,
    sizeClassName,
    styles[`variant-${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const containerClasses = [
    styles.container,
    overlay && styles.overlay,
    fullScreen && styles.fullScreen,
  ]
    .filter(Boolean)
    .join(' ');

  const spinnerElement = (
    <div className={containerClasses}>
      <div className={spinnerClasses} style={{ ...sizeStyle, ...style }}>
        <div className={styles.circle} />
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );

  return spinnerElement;
};

Spinner.displayName = 'Spinner';


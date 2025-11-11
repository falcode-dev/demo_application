import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import type { IconType } from 'react-icons';
import styles from './Button.module.css';

export type ButtonVariant = 'default' | 'sub' | 'accent';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  /** ボタンのテキスト */
  children: React.ReactNode;
  /** バリアント */
  variant?: ButtonVariant;
  /** サイズ（CSSPropertiesまたは文字列で個別に指定可能） */
  size?: CSSProperties | string;
  /** 左側のアイコン */
  leftIcon?: IconType;
  /** 右側のアイコン */
  rightIcon?: IconType;
  /** アイコンを表示するかどうか（leftIcon/rightIconが指定されている場合） */
  showIcons?: boolean;
  /** ローディング状態 */
  loading?: boolean;
  /** フル幅 */
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'default',
      size,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      showIcons = true,
      loading = false,
      fullWidth = false,
      disabled,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const defaultSizeStyle: CSSProperties = {
      padding: '0.5rem 1rem',
      fontSize: '1rem',
      minHeight: '2.5rem',
    };

    const sizeStyle = typeof size === 'object' && size !== null
      ? { ...defaultSizeStyle, ...size }
      : defaultSizeStyle;

    const sizeClassName = typeof size === 'string' ? styles[`size-${size}`] : '';

    const buttonClasses = [
      styles.button,
      styles[`variant-${variant}`],
      sizeClassName,
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
      loading && styles.loading,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const mergedStyle: CSSProperties = {
      ...sizeStyle,
      ...style,
    };

    return (
      <button
        ref={ref}
        className={buttonClasses}
        style={mergedStyle}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className={styles.spinner} />}
        {LeftIcon && showIcons && !loading && (
          <LeftIcon className={styles.leftIcon} aria-hidden="true" />
        )}
        <span className={styles.content}>{children}</span>
        {RightIcon && showIcons && !loading && (
          <RightIcon className={styles.rightIcon} aria-hidden="true" />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';


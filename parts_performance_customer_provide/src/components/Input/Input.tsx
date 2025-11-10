import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes, CSSProperties } from 'react';
import type { IconType } from 'react-icons';
import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** サイズ（CSSPropertiesまたは文字列で個別に指定可能） */
  size?: CSSProperties | string;
  /** 左側のアイコン */
  leftIcon?: IconType;
  /** 右側のアイコン */
  rightIcon?: IconType;
  /** アイコンを表示するかどうか */
  showIcons?: boolean;
  /** エラーメッセージ */
  error?: string;
  /** ラベル */
  label?: string;
  /** ヘルプテキスト */
  helpText?: string;
  /** フル幅 */
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      showIcons = true,
      error,
      label,
      helpText,
      fullWidth = false,
      className,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // デフォルトサイズ（sizeが指定されていない場合）
    const defaultSizeStyle: CSSProperties = {
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
      fontSize: '1rem',
      minHeight: '2.5rem',
    };

    // sizeがCSSPropertiesの場合はマージ、文字列の場合はクラス名として扱う
    let sizeStyle = typeof size === 'object' && size !== null
      ? { ...defaultSizeStyle, ...size }
      : defaultSizeStyle;

    // paddingが一括指定されている場合、個別のパディングに分解
    if ('padding' in sizeStyle && typeof sizeStyle.padding === 'string') {
      const paddingValue = sizeStyle.padding;
      const parts = paddingValue.split(' ').filter(Boolean);
      
      const { padding, ...restStyle } = sizeStyle;
      
      if (parts.length === 1) {
        // padding: value → すべて同じ
        sizeStyle = {
          ...restStyle,
          paddingTop: parts[0],
          paddingBottom: parts[0],
        };
      } else if (parts.length === 2) {
        // padding: vertical horizontal
        sizeStyle = {
          ...restStyle,
          paddingTop: parts[0],
          paddingBottom: parts[0],
        };
      } else if (parts.length === 4) {
        // padding: top right bottom left
        sizeStyle = {
          ...restStyle,
          paddingTop: parts[0],
          paddingBottom: parts[2],
        };
      }
    }

    // アイコンがある場合、インラインスタイルからpaddingLeft/paddingRightを削除
    // CSSクラスで処理するため
    if (LeftIcon && showIcons) {
      // paddingLeftが明示的に指定されていない場合のみ削除
      if (!('paddingLeft' in sizeStyle) || sizeStyle.paddingLeft === '0.75rem') {
        const { paddingLeft, ...restStyle } = sizeStyle;
        sizeStyle = restStyle;
      }
    } else {
      // アイコンがない場合、デフォルトのpaddingLeftを設定
      if (!('paddingLeft' in sizeStyle)) {
        sizeStyle = {
          ...sizeStyle,
          paddingLeft: '0.75rem',
        };
      }
    }

    if (RightIcon && showIcons) {
      // paddingRightが明示的に指定されていない場合のみ削除
      if (!('paddingRight' in sizeStyle) || sizeStyle.paddingRight === '0.75rem') {
        const { paddingRight, ...restStyle } = sizeStyle;
        sizeStyle = restStyle;
      }
    } else {
      // アイコンがない場合、デフォルトのpaddingRightを設定
      if (!('paddingRight' in sizeStyle)) {
        sizeStyle = {
          ...sizeStyle,
          paddingRight: '0.75rem',
        };
      }
    }

    const sizeClassName = typeof size === 'string' ? styles[`size-${size}`] : '';

    const inputClasses = [
      styles.input,
      sizeClassName,
      LeftIcon && showIcons && styles.hasLeftIcon,
      RightIcon && showIcons && styles.hasRightIcon,
      error && styles.error,
      disabled && styles.disabled,
      isFocused && styles.focused,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const wrapperClasses = [
      styles.wrapper,
      fullWidth && styles.fullWidth,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className={styles.label} htmlFor={props.id}>
            {label}
          </label>
        )}
        <div className={styles.inputContainer}>
          {LeftIcon && showIcons && (
            <LeftIcon className={styles.leftIcon} aria-hidden="true" />
          )}
          <input
            ref={ref}
            className={inputClasses}
            style={{ ...sizeStyle, ...style }}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {RightIcon && showIcons && (
            <RightIcon className={styles.rightIcon} aria-hidden="true" />
          )}
        </div>
        {(error || helpText) && (
          <div className={styles.helperText}>
            {error ? (
              <span className={styles.errorText}>{error}</span>
            ) : (
              <span className={styles.helpText}>{helpText}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';


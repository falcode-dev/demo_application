import { forwardRef, useState } from 'react';
import type { CSSProperties, InputHTMLAttributes } from 'react';
import type { IconType } from 'react-icons';
import DatePickerLib, { registerLocale } from 'react-datepicker';
import { ja } from 'date-fns/locale';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './DatePicker.module.css';

// 日本語ロケールを登録
registerLocale('ja', ja);

// カスタム入力コンポーネント
const CustomInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={className}
        style={style}
        readOnly
        {...props}
      />
    );
  }
);

CustomInput.displayName = 'CustomInput';

export interface DatePickerProps {
  /** 選択された日付 */
  value?: Date | null;
  /** 日付変更時のコールバック */
  onChange?: (date: Date | null) => void;
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
  /** 無効化 */
  disabled?: boolean;
  /** カスタムクラス名 */
  className?: string;
  /** カスタムスタイル */
  style?: CSSProperties;
  /** プレースホルダー */
  placeholder?: string;
  /** 日付フォーマット */
  dateFormat?: string;
  /** 最小日付 */
  minDate?: Date;
  /** 最大日付 */
  maxDate?: Date;
  /** 開始日 */
  startDate?: Date;
  /** 終了日（範囲選択時） */
  endDate?: Date;
  /** 日付を選択可能にするか */
  selectsStart?: boolean;
  /** 日付を選択可能にするか（範囲選択時） */
  selectsEnd?: boolean;
  /** 今日の日付をハイライト */
  highlightDates?: Date[];
  /** 除外する日付 */
  excludeDates?: Date[];
  /** 日付フィルター関数 */
  filterDate?: (date: Date) => boolean;
  /** インライン表示 */
  inline?: boolean;
  /** 月表示モード */
  showMonthYearPicker?: boolean;
  /** 年表示モード */
  showYearPicker?: boolean;
  /** カレンダーを開いた状態で表示 */
  open?: boolean;
  /** カレンダーの開閉を制御 */
  onCalendarOpen?: () => void;
  /** カレンダーの開閉を制御 */
  onCalendarClose?: () => void;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      size,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      showIcons = true,
      error,
      label,
      helpText,
      fullWidth = false,
      disabled = false,
      className,
      style,
      placeholder = '日付を選択',
      dateFormat = 'yyyy年MM月dd日',
      minDate,
      maxDate,
      startDate,
      endDate,
      selectsStart,
      selectsEnd,
      highlightDates,
      excludeDates,
      filterDate,
      inline = false,
      showMonthYearPicker = false,
      showYearPicker = false,
      open,
      onCalendarOpen,
      onCalendarClose,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isOpen, setIsOpen] = useState(open ?? false);

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
        sizeStyle = {
          ...restStyle,
          paddingTop: parts[0],
          paddingBottom: parts[0],
        };
      } else if (parts.length === 2) {
        sizeStyle = {
          ...restStyle,
          paddingTop: parts[0],
          paddingBottom: parts[0],
        };
      } else if (parts.length === 4) {
        sizeStyle = {
          ...restStyle,
          paddingTop: parts[0],
          paddingBottom: parts[2],
        };
      }
    }

    // アイコンがある場合、インラインスタイルからpaddingLeft/paddingRightを削除
    if (LeftIcon && showIcons) {
      if (!('paddingLeft' in sizeStyle) || sizeStyle.paddingLeft === '0.75rem') {
        const { paddingLeft, ...restStyle } = sizeStyle;
        sizeStyle = restStyle;
      }
    } else {
      if (!('paddingLeft' in sizeStyle)) {
        sizeStyle = {
          ...sizeStyle,
          paddingLeft: '0.75rem',
        };
      }
    }

    if (RightIcon && showIcons) {
      if (!('paddingRight' in sizeStyle) || sizeStyle.paddingRight === '0.75rem') {
        const { paddingRight, ...restStyle } = sizeStyle;
        sizeStyle = restStyle;
      }
    } else {
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

    const handleChange = (date: Date | null) => {
      onChange?.(date);
    };

    const handleCalendarOpen = () => {
      setIsOpen(true);
      setIsFocused(true);
      onCalendarOpen?.();
    };

    const handleCalendarClose = () => {
      setIsOpen(false);
      setIsFocused(false);
      onCalendarClose?.();
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className={styles.label} htmlFor={`datepicker-${label}`}>
            {label}
          </label>
        )}
        <div className={styles.inputContainer}>
          {LeftIcon && showIcons && (
            <LeftIcon className={styles.leftIcon} aria-hidden="true" />
          )}
          <DatePickerLib
            selected={value}
            onChange={handleChange}
            locale="ja"
            dateFormat={dateFormat}
            placeholderText={placeholder}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            startDate={startDate}
            endDate={endDate}
            selectsStart={selectsStart}
            selectsEnd={selectsEnd}
            highlightDates={highlightDates}
            excludeDates={excludeDates}
            filterDate={filterDate}
            inline={inline}
            showMonthYearPicker={showMonthYearPicker}
            showYearPicker={showYearPicker}
            open={open ?? isOpen}
            onCalendarOpen={handleCalendarOpen}
            onCalendarClose={handleCalendarClose}
            onFocus={handleFocus}
            onBlur={handleBlur}
            wrapperClassName={styles.datePickerWrapper}
            calendarClassName={styles.calendar}
            dayClassName={(date) => {
              const baseClass = styles.day;
              if (value && format(date, 'yyyy-MM-dd') === format(value, 'yyyy-MM-dd')) {
                return `${baseClass} ${styles.selected}`;
              }
              return baseClass;
            }}
            customInput={
              <CustomInput
                ref={ref}
                className={inputClasses}
                style={{ ...sizeStyle, ...style }}
              />
            }
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

DatePicker.displayName = 'DatePicker';


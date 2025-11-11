import { forwardRef, useState, useRef, useEffect } from 'react';
import type { SelectHTMLAttributes, CSSProperties } from 'react';
import type { IconType } from 'react-icons';
import { FaChevronDown } from 'react-icons/fa';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** オプション */
  options: SelectOption[];
  /** サイズ（CSSPropertiesまたは文字列で個別に指定可能） */
  size?: CSSProperties | string;
  /** 左側のアイコン */
  leftIcon?: IconType;
  /** 右側のアイコン（デフォルトは下向き矢印） */
  rightIcon?: IconType;
  /** アイコンを表示するかどうか */
  showIcons?: boolean;
  /** プレースホルダー */
  placeholder?: string;
  /** エラーメッセージ */
  error?: string;
  /** ラベル */
  label?: string;
  /** ヘルプテキスト */
  helpText?: string;
  /** フル幅 */
  fullWidth?: boolean;
  /** 検索可能かどうか */
  searchable?: boolean;
  /** 右側アイコンの回転を無効化 */
  disableRightIconRotation?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      size,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      showIcons = true,
      placeholder,
      error,
      label,
      helpText,
      fullWidth = false,
      searchable = false,
      disableRightIconRotation = false,
      className,
      disabled,
      value,
      onChange,
      style,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const defaultSizeStyle: CSSProperties = {
      padding: '0.5rem 0.75rem',
      fontSize: '1rem',
      minHeight: '2.5rem',
    };

    const sizeStyle = typeof size === 'object' && size !== null
      ? { ...defaultSizeStyle, ...size }
      : defaultSizeStyle;

    const sizeClassName = typeof size === 'string' ? styles[`size-${size}`] : '';

    const filteredOptions = searchable && searchTerm
      ? options.filter(option =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    const updateDropdownPosition = () => {
      if (isOpen && wrapperRef.current) {
        const selectButton = wrapperRef.current.querySelector('button');
        if (selectButton) {
          const buttonRect = selectButton.getBoundingClientRect();
          setDropdownPosition({
            top: buttonRect.bottom,
            left: buttonRect.left,
            width: buttonRect.width,
          });
        }
      } else {
        setDropdownPosition(null);
      }
    };

    useEffect(() => {
      updateDropdownPosition();
    }, [isOpen]);

    useEffect(() => {
      if (isOpen) {
        const handleScroll = () => {
          setIsOpen(false);
          setSearchTerm('');
        };
        
        const handleResize = () => {
          updateDropdownPosition();
        };
        
        let parent = wrapperRef.current?.parentElement;
        const scrollElements: Element[] = [];
        while (parent && parent !== document.body) {
          const style = window.getComputedStyle(parent);
          const overflow = style.overflow || style.overflowY || style.overflowX;
          if (overflow === 'auto' || overflow === 'scroll' || overflow === 'hidden') {
            scrollElements.push(parent);
            parent.addEventListener('scroll', handleScroll, true);
          }
          parent = parent.parentElement;
        }
        
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleResize);
        
        return () => {
          scrollElements.forEach(el => {
            el.removeEventListener('scroll', handleScroll, true);
          });
          window.removeEventListener('scroll', handleScroll, true);
          window.removeEventListener('resize', handleResize);
        };
      }
    }, [isOpen]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchTerm('');
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        if (searchable && searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, searchable]);

    const selectedOption = options.find(opt => opt.value === value);

    const selectClasses = [
      styles.selectButton,
      sizeClassName,
      LeftIcon && showIcons && styles.hasLeftIcon,
      RightIcon && showIcons && styles.hasRightIcon,
      !RightIcon && showIcons && styles.hasDefaultIcon,
      error && styles.error,
      disabled && styles.disabled,
      isFocused && styles.focused,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const mergedStyle: CSSProperties = {
      ...sizeStyle,
      ...style,
    };

    const wrapperClasses = [
      styles.wrapper,
      fullWidth && styles.fullWidth,
    ]
      .filter(Boolean)
      .join(' ');

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e);
      setIsOpen(false);
      setSearchTerm('');
    };

    const handleOptionClick = (optionValue: string) => {
      const syntheticEvent = {
        target: { value: optionValue },
        currentTarget: { value: optionValue },
      } as React.ChangeEvent<HTMLSelectElement>;
      handleSelectChange(syntheticEvent);
    };

    return (
      <div className={wrapperClasses} ref={wrapperRef}>
        {label && (
          <label className={styles.label} htmlFor={props.id}>
            {label}
          </label>
        )}
          <div className={styles.selectContainer}>
          {LeftIcon && showIcons && (
            <LeftIcon className={styles.leftIcon} aria-hidden="true" />
          )}
          <div className={styles.customSelect}>
            <button
              type="button"
              className={selectClasses}
              style={mergedStyle}
              onClick={() => !disabled && setIsOpen(!isOpen)}
              disabled={disabled}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            >
              {LeftIcon && showIcons && (
                <LeftIcon className={styles.leftIconInButton} aria-hidden="true" />
              )}
              <span className={styles.selectValue}>
                {selectedOption ? selectedOption.label : placeholder || '選択してください'}
              </span>
              {RightIcon && showIcons ? (
                <RightIcon
                  className={[
                    styles.rightIcon,
                    !disableRightIconRotation && isOpen ? styles.rotated : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden="true"
                />
              ) : (
                showIcons && (
                  <FaChevronDown
                    className={`${styles.rightIcon} ${isOpen ? styles.rotated : ''}`}
                    aria-hidden="true"
                  />
                )
              )}
            </button>
            {isOpen && dropdownPosition && (
              <div
                ref={dropdownRef}
                className={styles.dropdown}
                style={{
                  position: 'fixed',
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  width: `${dropdownPosition.width}px`,
                }}
              >
                {searchable && (
                  <div className={styles.searchContainer}>
                    <input
                      ref={searchInputRef}
                      type="text"
                      className={styles.searchInput}
                      placeholder="検索..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
                <div className={styles.optionsList}>
                  {filteredOptions.length === 0 ? (
                    <div className={styles.noOptions}>該当する項目がありません</div>
                  ) : (
                    filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={[
                          styles.option,
                          value === option.value && styles.selected,
                          option.disabled && styles.optionDisabled,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => {
                          if (!option.disabled) {
                            handleOptionClick(option.value);
                          }
                        }}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <select
            ref={ref}
            className={styles.hiddenSelect}
            value={value}
            onChange={handleSelectChange}
            disabled={disabled}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
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

Select.displayName = 'Select';


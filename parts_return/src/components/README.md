# components フォルダ

このフォルダは、アプリケーション全体で再利用可能な汎用的なUIコンポーネントを管理します。

## フォルダ構成

各コンポーネントは独立したフォルダとして管理します：

```
components/
├── Button/
│   ├── Button.tsx          // コンポーネント本体
│   ├── Button.module.css    // スタイル（または styled-components など）
│   └── index.ts             // エクスポート用
└── ...
```

## 使い方

### コンポーネントの作成例

**Button/Button.tsx**
```typescript
import styles from './Button.module.css';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button = ({ label, onClick }: ButtonProps) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {label}
    </button>
  );
};
```

**Button/index.ts**
```typescript
export { Button } from './Button';
```

### コンポーネントの使用例
```typescript
import { Button } from '@/components/Button';

<Button label="クリック" onClick={handleClick} />
```

## 注意事項

- 機能固有のコンポーネントは `features/` フォルダ内に配置してください
- 汎用的で複数の場所で使用されるコンポーネントのみここに配置します


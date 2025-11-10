# pages フォルダ

このフォルダは、ルーティング対象となるページコンポーネントを管理します。

## 使い方

### ページコンポーネントの作成例

**pages/Home.tsx**
```typescript
export const Home = () => {
  return (
    <div>
      <h1>ホームページ</h1>
      {/* ページの内容 */}
    </div>
  );
};
```

**pages/About.tsx**
```typescript
export const About = () => {
  return (
    <div>
      <h1>About ページ</h1>
      {/* ページの内容 */}
    </div>
  );
};
```

**pages/NotFound.tsx**
```typescript
export const NotFound = () => {
  return (
    <div>
      <h1>404 - ページが見つかりません</h1>
    </div>
  );
};
```

### ルーティングでの使用例

**router.tsx** または **App.tsx**
```typescript
import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { NotFound } from '@/pages/NotFound';

// React Router などで使用
<Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
<Route path="*" element={<NotFound />} />
```

## 注意事項

- ページコンポーネントは主にルーティングの設定で使用されます
- 実際のビジネスロジックは `features/` フォルダに配置し、ページコンポーネントから呼び出すことを推奨します
- ページコンポーネントは薄く保ち、主にレイアウトとルーティングの統合に集中します


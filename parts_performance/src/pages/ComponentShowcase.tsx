import { useState } from 'react'
import { Button, Input, Select, DatePicker, Spinner, Modal } from '../components'
import { FiSearch, FiUser, FiMail, FiChevronDown, FiCalendar } from 'react-icons/fi'
import type { SelectOption } from '../components'

export const ComponentShowcase = () => {
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [fullScreenLoading, setFullScreenLoading] = useState(false)
  const [dateValue, setDateValue] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const selectOptions: SelectOption[] = [
    { value: 'option1', label: 'オプション 1' },
    { value: 'option2', label: 'オプション 2' },
    { value: 'option3', label: 'オプション 3' },
    { value: 'option4', label: 'オプション 4' },
  ]

  const handleButtonClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  const handleSearch = () => {
    setSearchLoading(true)
    setTimeout(() => setSearchLoading(false), 2000)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>PartsPortal Search</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Button コンポーネントの例 */}
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Button</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Button variant="default" leftIcon={FiSearch}>
              検索
            </Button>
            <Button variant="sub" rightIcon={FiUser}>
              ユーザー
            </Button>
            <Button variant="default" size={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem', minHeight: '2rem' }}>
              小さいボタン
            </Button>
            <Button variant="sub" size={{ padding: '0.75rem 1.5rem', fontSize: '1.125rem', minHeight: '3rem' }} leftIcon={FiMail}>
              大きいボタン
            </Button>
            <Button variant="default" style={{ backgroundColor: '#ef4444' }} loading={loading} onClick={handleButtonClick}>
              ローディング
            </Button>
            <Button variant="default" showIcons={false}>
              アイコンなし
            </Button>
          </div>
        </section>

        {/* Input コンポーネントの例 */}
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Input</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input
              label="検索"
              placeholder="検索キーワードを入力"
              leftIcon={FiSearch}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              fullWidth
            />
            <Input
              label="メールアドレス"
              type="email"
              placeholder="example@email.com"
              leftIcon={FiMail}
              helpText="有効なメールアドレスを入力してください"
              fullWidth
            />
            <Input
              label="エラー状態の例"
              error="この項目は必須です"
              leftIcon={FiUser}
              fullWidth
            />
            <Input
              size="small"
              placeholder="小さいサイズ"
              leftIcon={FiSearch}
              fullWidth
            />
            <Input
              size="large"
              placeholder="大きいサイズ"
              leftIcon={FiSearch}
              fullWidth
            />
          </div>
        </section>

        {/* Select コンポーネントの例 */}
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Select</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Select
              label="通常のセレクト"
              placeholder="選択してください"
              options={selectOptions}
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              leftIcon={FiUser}
              fullWidth
            />
            <Select
              label="検索可能なセレクト"
              placeholder="検索して選択"
              options={selectOptions}
              searchable
              rightIcon={FiChevronDown}
              fullWidth
            />
            <Select
              label="エラー状態の例"
              options={selectOptions}
              error="選択が必要です"
              fullWidth
            />
            <Select
              size="small"
              placeholder="小さいサイズ"
              options={selectOptions}
              fullWidth
            />
          </div>
        </section>

        {/* DatePicker コンポーネントの例 */}
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>DatePicker</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <DatePicker
              label="日付を選択"
              placeholder="日付を選択してください"
              leftIcon={FiCalendar}
              value={dateValue}
              onChange={setDateValue}
              dateFormat="yyyy年MM月dd日"
              fullWidth
            />
            <DatePicker
              label="生年月日"
              placeholder="生年月日を選択"
              leftIcon={FiCalendar}
              helpText="生年月日を選択してください"
              value={dateValue}
              onChange={setDateValue}
              maxDate={new Date()}
              dateFormat="yyyy年MM月dd日"
              fullWidth
            />
            <DatePicker
              label="エラー状態の例"
              error="日付の選択が必要です"
              leftIcon={FiCalendar}
              dateFormat="yyyy年MM月dd日"
              fullWidth
            />
            <DatePicker
              size="small"
              placeholder="小さいサイズ"
              leftIcon={FiCalendar}
              value={dateValue}
              onChange={setDateValue}
              dateFormat="yyyy年MM月dd日"
              fullWidth
            />
            <DatePicker
              size="large"
              placeholder="大きいサイズ"
              leftIcon={FiCalendar}
              value={dateValue}
              onChange={setDateValue}
              dateFormat="yyyy年MM月dd日"
              fullWidth
            />
            <DatePicker
              label="範囲選択（開始日）"
              placeholder="開始日を選択"
              leftIcon={FiCalendar}
              selectsStart
              startDate={startDate || undefined}
              endDate={endDate || undefined}
              value={startDate}
              onChange={setStartDate}
              dateFormat="yyyy年MM月dd日"
              fullWidth
            />
            <DatePicker
              label="範囲選択（終了日）"
              placeholder="終了日を選択"
              leftIcon={FiCalendar}
              selectsEnd
              startDate={startDate || undefined}
              endDate={endDate || undefined}
              minDate={startDate || undefined}
              value={endDate}
              onChange={setEndDate}
              dateFormat="yyyy年MM月dd日"
              fullWidth
            />
          </div>
        </section>

        {/* Spinner コンポーネントの例 */}
        <section style={{ position: 'relative', minHeight: '200px' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Spinner</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
              <Spinner size="small" />
              <Spinner size="medium" />
              <Spinner size="large" />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
              <Spinner size="small" variant="sub" />
              <Spinner size="medium" variant="sub" />
              <Spinner size="large" variant="accent" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Spinner size="medium" label="読み込み中..." />
              <Spinner size="large" variant="primary" label="検索中..." />
            </div>
            <div style={{ position: 'relative', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ marginBottom: '1rem' }}>オーバーレイ付きスピナー（検索時に使用）</p>
              <Button variant="default" leftIcon={FiSearch} onClick={handleSearch}>
                検索を実行
              </Button>
              {searchLoading && (
                <Spinner
                  size="large"
                  variant="primary"
                  label="検索中..."
                  overlay
                />
              )}
            </div>
            <div style={{ position: 'relative', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ marginBottom: '1rem' }}>フルスクリーンスピナー</p>
              <Button variant="default" onClick={() => {
                setFullScreenLoading(true)
                setTimeout(() => setFullScreenLoading(false), 3000)
              }}>
                フルスクリーン表示
              </Button>
              {fullScreenLoading && (
                <Spinner
                  size="large"
                  variant="primary"
                  label="処理中..."
                  fullScreen
                />
              )}
            </div>
          </div>
        </section>

        {/* Modal コンポーネントの例 */}
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Modal</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Button variant="default" onClick={() => setIsModalOpen(true)}>
              モーダルを開く
            </Button>
            <Button variant="sub" onClick={() => setIsConfirmModalOpen(true)}>
              確認モーダル
            </Button>
          </div>

          {/* 基本的なモーダル */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="モーダルタイトル"
            size="medium"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p>これはモーダルのコンテンツです。</p>
              <p>様々なコンテンツを表示できます。</p>
              <Input
                label="入力欄の例"
                placeholder="テキストを入力"
                fullWidth
              />
              <Select
                label="セレクトの例"
                placeholder="選択してください"
                options={selectOptions}
                fullWidth
              />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <p>スクロール可能なコンテンツも表示できます。</p>
              {Array.from({ length: 10 }).map((_, i) => (
                <p key={i}>項目 {i + 1}</p>
              ))}
            </div>
          </Modal>

          {/* 確認モーダル */}
          <Modal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            title="確認"
            size="small"
            footer={
              <>
                <Button variant="sub" onClick={() => setIsConfirmModalOpen(false)}>
                  キャンセル
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    alert('実行しました');
                    setIsConfirmModalOpen(false);
                  }}
                >
                  実行
                </Button>
              </>
            }
          >
            <p>この操作を実行してもよろしいですか？</p>
          </Modal>
        </section>
      </div>
    </div>
  )
}


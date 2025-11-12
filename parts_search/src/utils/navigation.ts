import i18n from '../i18n/config';

export const openPartsDetail = (partsNumber: string) => {
  // 現在の言語を取得（URLパラメータ > i18n > デフォルト）
  const params = new URLSearchParams(window.location.search);
  let currentLang = params.get('lang');
  
  // URLパラメータに言語がない場合は、i18nから取得
  if (!currentLang && i18n.language) {
    currentLang = i18n.language;
  }
  
  // 最終的なフォールバック
  if (currentLang !== 'ja' && currentLang !== 'en') {
    currentLang = 'en';
  }
  
  const detailUrl = `${window.location.origin}${window.location.pathname}?partsNumber=${encodeURIComponent(partsNumber)}&lang=${currentLang}`;
  window.open(detailUrl, '_blank');
};

export const getPartsNumberFromUrl = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get('partsNumber');
};


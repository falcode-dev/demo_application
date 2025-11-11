export const openPartsDetail = (partsNumber: string) => {
  const detailUrl = `${window.location.origin}${window.location.pathname}?partsNumber=${encodeURIComponent(partsNumber)}`;
  window.open(detailUrl, '_blank');
};

export const getPartsNumberFromUrl = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get('partsNumber');
};


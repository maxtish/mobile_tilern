export const normalizeWord = (str: string) =>
  str
    .replace(/[.,!?;:°]/g, '')
    .replace(/^(der|die|das|ein|eine)\s+/i, '')
    .trim()
    .toLowerCase();

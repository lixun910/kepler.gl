export const LOCALES = {
  en: 'English',
};

export const LOCALE_CODES = Object.keys(LOCALES).reduce((acc, key) => ({...acc, [key]: key}), {});

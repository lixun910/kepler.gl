import en from './en';
import {flattenMessages} from 'utils/locale-utils';
import {LOCALE_CODES} from './locales';

const enFlat = flattenMessages(en);

export const messages = Object.keys(LOCALE_CODES).reduce(
  (acc, key) => ({
    ...acc,
    [key]: key === 'en' ? enFlat : {...enFlat, ...flattenMessages(require(`./${key}`).default)}
  }),
  {}
);

export {LOCALE_CODES, LOCALES} from './locales';

export {default as FormattedMessage} from './formatted-message';

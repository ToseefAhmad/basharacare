import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { enUS, arSA } from 'date-fns/locale';

const dateFnsLocaleMap = new Map([['en', enUS], ['en-US', enUS], ['ar', arSA], ['ar-SA', arSA]]);

export const localeToDateFns = locale => {
    if (dateFnsLocaleMap.has(locale)) {
        return dateFnsLocaleMap.get(locale);
    }

    const [languageCode] = locale.split('-');

    if (dateFnsLocaleMap.has(languageCode)) {
        return dateFnsLocaleMap.get(languageCode);
    }

    return enUS;
};

export const isDateValid = date => {
    return !Number.isNaN(new Date(date).getTime());
};

export const dateToDistance = (date, locale = 'en-US') =>
    isDateValid(date)
        ? formatDistanceStrict(new Date(date), new Date(), { addSuffix: true, locale: localeToDateFns(locale) })
        : '';

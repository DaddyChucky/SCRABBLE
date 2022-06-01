import { Dictionary } from '@app/../../../common/model/dictionary';

export const DICTIONARY_TABLE_COLUMN_NAMES = ['title', 'description', 'actions', 'download'];
export const WAIT_TIME = 1000;
export const DICTIONARIES: Dictionary[] = [
    { title: 'Dictionnaire 1', description: 'Description 1', words: ['magie', 'test'] } as Dictionary,
    { title: 'Dictionnaire 2', description: 'Description 2', words: ['soupe', 'chocolat'] } as Dictionary,
];
export const DEFAULT_DICTIONARY = 'francais';
export const ATTRIBUTE_DOWNLOAD = 'download';
export const ATTRIBUTE_HREF = 'href';
export const DICTIONARY_URL = 'data:application/json,';
export const JSON_EXTENSION = '.json';

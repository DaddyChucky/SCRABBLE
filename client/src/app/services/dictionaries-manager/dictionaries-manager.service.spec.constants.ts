import { Dictionary } from '@app/../../../common/model/dictionary';

export const URL_STRING = 'http://localhost:3000/dicts/';
export const RESUME_TEST = { title: 'francais', description: 'description de base' } as Dictionary;
export const DICT_TEST = { title: 'franglais', description: 'description de base', words: [] } as Dictionary;
export const STRING_DICT_TEST = JSON.stringify(DICT_TEST);
export const STRING_EMPTY_DICT_TEST = JSON.stringify({});
export const INVALID_DICT_TEST = { title: 'franglais' };
export const STRING_INVALID_DICT_TEST: string = JSON.stringify(INVALID_DICT_TEST);
export const VALID_NEW_TITLE = 'newDictTitle';
export const INVALID_NEW_TITLE = 'english';
export const ENGLISH_DICTIONARY: Dictionary = { title: 'english', description: 'Description', words: ['cat', 'food'] } as Dictionary;
export const URL_GET_FRANCAIS_DICT = 'http://localhost:3000/dicts/francais';
export const INVALID_DICTIONARY: Dictionary = { title: 'invalid', description: '', words: ['chocolate', 'food'] } as Dictionary;

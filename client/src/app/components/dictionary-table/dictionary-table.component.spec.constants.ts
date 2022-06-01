import { Dictionary } from '@app/../../../common/model/dictionary';

export const VALID_NEW_DICTIONARY: Dictionary = { title: 'validDict', description: 'Description de base', words: [] } as Dictionary;
export const INVALID_DICTIONARY: Dictionary = { title: 'noDescriptionDict', description: '', words: ['magie'] } as Dictionary;
export const DICTIONARY_TO_CANCEL: Dictionary = { title: 'dictionaryToCancel', description: 'description', words: [] } as Dictionary;
export const DICTIONARIES: Dictionary[] = [
    { title: 'Dictionnaire 1', description: 'Description 1', words: ['magie', 'test'] } as Dictionary,
    { title: 'Dictionnaire 2', description: 'Description 2', words: ['soupe', 'chocolat'] } as Dictionary,
];
export const INDEX_VALID_DICTIONARY = 2;
export const INDEX_INVALID_DICTIONARY = 3;
export const DICTIONARIES_INPUT: Dictionary[] = [DICTIONARIES[0], DICTIONARIES[1], VALID_NEW_DICTIONARY, INVALID_DICTIONARY, DICTIONARY_TO_CANCEL];
export const INDEX_DICTIONARY_TO_CANCEL = 4;
export const HREF_VALUE = 'test';
export const DOWNLOAD_VALUE = 'test';

import { DictionaryProvider } from '@app/services/dict-provider/dict-provider.service';
import { Service } from 'typedi';
import * as serviceConstants from './word-validator.service.constants';

@Service()
export class WordValidatorService {
    dictionary: string[];
    private provider: DictionaryProvider;

    constructor(dictName: string) {
        this.provider = new DictionaryProvider(dictName);
        this.initializeDictionary();
    }

    isValid(word: string): boolean {
        word = word.toLowerCase();
        return this.isInDict(word) && this.isExemptOfSpecialCharacters(word) && this.isLongerThanOneLetter(word);
    }

    private isLongerThanOneLetter(word: string): boolean {
        return word.length >= serviceConstants.MINIMUM_WORD_LENGTH;
    }

    private isExemptOfSpecialCharacters(word: string): boolean {
        return !(word.includes(serviceConstants.FORBIDDEN_CHAR_DRAW) || word.includes(serviceConstants.FORBIDDEN_CHAR_QUOTE));
    }

    private isInDict(word: string): boolean {
        // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
        word = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return this.dictionary.includes(word);
    }

    private initializeDictionary(): void {
        this.dictionary = this.provider.dictionary;
    }
}

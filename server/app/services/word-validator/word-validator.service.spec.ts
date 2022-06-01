/* eslint-disable dot-notation */
import { expect } from 'chai';
import { WordValidatorService } from './word-validator.service';
import * as specConstants from './word-validator.service.spec.constants';

describe('WordValidatorService', () => {
    const wordValidatorService: WordValidatorService = new WordValidatorService(specConstants.DICT_NAME);

    before(() => {
        wordValidatorService['dictionary'] = specConstants.VALID_DICTIONARY_STUB;
    });

    it('initializeDictionary should modify dictionary length and content', () => {
        const dictionaryAfterInitialization: string[] = wordValidatorService['dictionary'];
        expect(dictionaryAfterInitialization).not.equal([]);
        expect(dictionaryAfterInitialization.length).greaterThanOrEqual(1);
    });

    it('isInDict should return true for valid words in dictionary', () => {
        for (const word of specConstants.VALID_DICTIONARY_STUB) {
            expect(wordValidatorService['isInDict'](word)).to.equal(true);
        }
    });

    it('isInDict should return false for invalid words in dictionary', () => {
        for (const word of specConstants.INVALID_DICTIONARY_STUB) {
            expect(wordValidatorService['isInDict'](word)).to.equal(false);
        }
    });

    it('isExemptOfSpecialCharacters should return false if there are any hyphen or apostrophe', () => {
        for (const word of specConstants.INVALID_CHARS) {
            expect(wordValidatorService['isExemptOfSpecialCharacters'](word)).to.equal(false);
        }
    });

    it('isExemptOfSpecialCharacters should return true if there are no any hyphen or apostrophe', () => {
        for (const word of specConstants.VALID_DICTIONARY_STUB) {
            expect(wordValidatorService['isExemptOfSpecialCharacters'](word)).to.equal(true);
        }
    });

    it('isLongerThanOneLetter should return false if the given word length is smaller than 2', () => {
        for (const word of specConstants.CHARS_TOO_SHORT) {
            expect(wordValidatorService['isLongerThanOneLetter'](word)).to.equal(false);
        }
    });

    it('isLongerThanOneLetter should return true if the given length is longer than 1', () => {
        for (const word of specConstants.VALID_DICTIONARY_STUB) {
            expect(wordValidatorService['isLongerThanOneLetter'](word)).to.equal(true);
        }
    });

    it('isValid should return false word is not in dict', () => {
        for (const word of specConstants.INVALID_DICTIONARY_STUB) {
            expect(wordValidatorService['isValid'](word)).to.equal(false);
        }
    });

    it('isValid should return false word has special chars', () => {
        for (const word of specConstants.INVALID_CHARS) {
            expect(wordValidatorService['isValid'](word)).to.equal(false);
        }
    });

    it('isValid should return false word is not longer than 1 letter', () => {
        for (const word of specConstants.CHARS_TOO_SHORT) {
            expect(wordValidatorService['isValid'](word)).to.equal(false);
        }
    });

    it('isValid should return true word is longer than 1 letter, does not have any special chars and exists in dict', () => {
        for (const word of specConstants.VALID_DICTIONARY_STUB) {
            expect(wordValidatorService['isValid'](word)).to.equal(true);
        }
    });
});

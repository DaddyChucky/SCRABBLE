/* eslint-disable @typescript-eslint/no-require-imports */
import { expect } from 'chai';
import * as fs from 'fs';
import { DictionaryProvider } from './dict-provider.service';
import * as specConstants from './dict-provider.service.spec.constants';
import Sinon = require('sinon');

describe('Dictionary Provider service', () => {
    let dictService: DictionaryProvider;

    beforeEach(async () => {
        dictService = new DictionaryProvider();
    });

    afterEach(() => {
        Sinon.restore();
    });

    it('dictionary should not be empty', async () => {
        const newDictionary = dictService.dictionary;
        expect(newDictionary.length).greaterThan(0);
    });

    it('dictionary should trow error for invalid dict', async () => {
        dictService = new DictionaryProvider('');
    });

    it('format() should have removed slashes and backslashes from words', () => {
        const newDictionary = dictService.dictionary;
        const numberSlashes = newDictionary.filter(
            (word) => word.includes(specConstants.SLASH_CHARACTER) || word.includes(specConstants.BACKSLASH_CHARACTER),
        );
        expect(numberSlashes.length).equal(0);
    });

    it('getter should return dictionary', () => {
        // eslint-disable-next-line dot-notation
        const newDictionary = dictService['dictionary'];
        expect(dictService.dictionary).to.equals(newDictionary);
    });

    it('getter should return dictionary', () => {
        Sinon.stub(fs, 'readFileSync').onCall(0).returns('').onCall(1).returns(JSON.stringify(specConstants.RESUME_FRENCH));
        const dictTestService: DictionaryProvider = new DictionaryProvider();
        expect(dictTestService.dictionary).to.equals(undefined);
    });
});

import { Dictionary } from '@common/model/dictionary';
import * as fs from 'fs';
import { Service } from 'typedi';
import * as serviceConstants from './dict-provider.service.constants';

@Service()
export class DictionaryProvider {
    dictionary: string[];
    private readonly data: Dictionary;

    constructor(dictName: string = serviceConstants.DEFAULT) {
        try {
            this.data = JSON.parse(
                fs.readFileSync(serviceConstants.PATH[0] + dictName + serviceConstants.PATH[1], { encoding: serviceConstants.UTF_8 }),
            );
            if (!this.data) throw new Error();
        } catch (error) {
            this.data = JSON.parse(
                fs.readFileSync(serviceConstants.PATH[0] + serviceConstants.DEFAULT + serviceConstants.PATH[1], { encoding: serviceConstants.UTF_8 }),
            );
        }
        if (this.data.words) this.dictionary = this.data.words;
    }
}

import { Quests } from '@app/classes/quest-describe';
import { Quest } from '@common/model/quest';
import { expect } from 'chai';
import { SideQuestProviderService } from './side-quest-provider.service';
import * as specConstants from './side-quest-provider.service.constants';

describe('SideQuestProviderService', () => {
    let service: SideQuestProviderService;

    beforeEach(async () => {
        service = new SideQuestProviderService();
    });

    it('constructor should set attribute sideQuests to Quests.constQuests', () => {
        service = new SideQuestProviderService();
        expect(service.sideQuests).to.deep.equal(Quests.constQuests);
    });

    it('getPublicQuests should return a list of lenght 2 of two objects', () => {
        let quests: Quests[] = [];
        quests = service.assignPublicQuests();
        expect(quests.length).to.be.equal(specConstants.CORRECT_LENGHT_PUBLIC_QUESTS);
    });

    it('getPublicQuests should never return a list of two identical quests', () => {
        let quests: Quests[] = [];
        for (let i = 0; i < specConstants.LARGE_NUMBER_OF_TRIES; i++) {
            quests = service.assignPublicQuests();
            expect(quests[0]).to.be.not.equal(quests[1]);
            service = new SideQuestProviderService();
        }
    });

    it('removeQuest should remove a quest fron attribute sideQuests', () => {
        const questToRemove: Quest = specConstants.QUEST;
        /* eslint-disable dot-notation */
        service['removeQuest'](questToRemove);
        expect(service.sideQuests.includes(questToRemove)).to.be.equal(false);
    });
});

import { Quest } from '@app/../../../common/model/quest';
import { Quests } from '@app/classes/quest-describe';
import { Service } from 'typedi';

@Service()
export class SideQuestProviderService {
    sideQuests: Quest[];

    constructor() {
        this.sideQuests = Quests.constQuests;
    }

    assignPublicQuests(): [Quest, Quest] {
        const firstQuest: Quest = this.assignRandomQuest();
        this.removeQuest(firstQuest);
        const secondQuest: Quest = this.assignRandomQuest();
        this.removeQuest(secondQuest);
        return [firstQuest, secondQuest];
    }

    assignPrivateQuest(): Quest {
        const privateQuest: Quest = this.assignRandomQuest();
        this.removeQuest(privateQuest);
        return privateQuest;
    }

    resetQuests(): void {
        this.sideQuests = Quests.constQuests;
    }

    private assignRandomQuest(): Quest {
        return this.sideQuests[Math.floor(Math.random() * this.sideQuests.length)];
    }

    private removeQuest(quest: Quest): void {
        const index: number = this.sideQuests.indexOf(quest);
        this.sideQuests.splice(index, 1);
    }
}

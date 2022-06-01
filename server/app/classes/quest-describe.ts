import { Quest } from '@common/model/quest';
import * as quests from '@common/model/quest-name';

export class Quests {
    static get constQuests(): Quest[] {
        return [
            { name: quests.QuestName.PALINDROME, isAccomplished: false, isPrivate: false, points: 30 } as Quest,
            { name: quests.QuestName.DIAGONAL, isAccomplished: false, isPrivate: false, points: 25 } as Quest,
            { name: quests.QuestName.SQUARE, isAccomplished: false, isPrivate: false, points: 50 } as Quest,
            { name: quests.QuestName.WORD_THREE_E, isAccomplished: false, isPrivate: false, points: 20 } as Quest,
            { name: quests.QuestName.SAME_WORD_2X, isAccomplished: false, isPrivate: false, points: 15 } as Quest,
            { name: quests.QuestName.LONG_WORD, isAccomplished: false, isPrivate: false, points: 25 } as Quest,
            { name: quests.QuestName.FIVE_SECONDS_MOVE, isAccomplished: false, isPrivate: false, points: 20 } as Quest,
            { name: quests.QuestName.CORNERS_2X, isAccomplished: false, isPrivate: false, points: 50 } as Quest,
        ];
    }
}

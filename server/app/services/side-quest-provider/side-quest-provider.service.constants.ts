import { Quest } from '@common/model/quest';
import * as quests from '@common/model/quest-name';

export const CORRECT_LENGHT_PUBLIC_QUESTS = 2;
export const LARGE_NUMBER_OF_TRIES = 30;
export const QUEST = { name: quests.QuestName.PALINDROME, isAccomplished: false, isPrivate: false, points: 15 } as Quest;

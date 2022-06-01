import { QuestName } from './quest-name';

export interface Quest {
    name: QuestName;
    isAccomplished: boolean;
    isPrivate: boolean;
    points: number;
}

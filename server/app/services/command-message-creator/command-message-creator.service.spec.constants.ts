import { ChatMessage } from '@common/model/chat-message';
import { DirectionType } from '@common/model/direction-type';
import { LetterBag } from '@common/model/letter-bag/letter-bag';
import { Player } from '@common/model/player';
import { Quest } from '@common/model/quest';
import { TypeOfUser } from '@common/model/type-of-user';
import * as serviceConstants from './command-message-creator.service.constants';

export const LETTERS_TO_EXCHANGE = 'abc';
export const ONE_LETTER_TO_EXCHANGE = 'a';
export const ACTIVE_PLAYER: Player = {
    name: 'Bobby Louba',
    score: 12,
    playerId: 'PLAYER1_ID',
    isTurn: true,
    tiles: [],
    host: true,
    sideQuest: {} as Quest,
} as Player;
export const INACTIVE_PLAYER: Player = {
    name: 'Malin le lapin',
    score: 16,
    playerId: 'PLAYER2_ID',
    isTurn: false,
    tiles: [],
    host: false,
    sideQuest: {} as Quest,
} as Player;
export const EXCHANGE_MESSAGE_IS_TURN_TRUE = serviceConstants.EXCHANGE_COMMAND + LETTERS_TO_EXCHANGE;
export const EXCHANGE_MESSAGE_IS_TURN_FALSE_SINGULAR = 'Bobby Louba : !échanger 1 lettre';
export const EXCHANGE_MESSAGE_IS_TURN_FALSE_PLURAL = 'Bobby Louba : !échanger 3 lettres';

export const CHAT_MESSAGE_EXCHANGE: ChatMessage = {
    author: TypeOfUser.SYSTEM,
    text: '',
    lobbyId: serviceConstants.LOBBY_ID,
    date: new Date(),
    socketId: ACTIVE_PLAYER.playerId,
};
export const EASEL_MESSAGE_STRUC = ['Les lettres de ', ' sont:'];
export const EASEL_MESSAGE = EASEL_MESSAGE_STRUC[0] + ACTIVE_PLAYER.name + EASEL_MESSAGE_STRUC[1];
export const EASEL_MESSAGE_TEST = EASEL_MESSAGE_STRUC[0] + ACTIVE_PLAYER.name + EASEL_MESSAGE_STRUC[1] + ' a';
export const LETTER_BAG_STUB: LetterBag = new LetterBag();
export const NUMBER_OF_LINE_TO_PRINT_LETTER_BAG = 7;
export const LETTERBAG_CONTENT = [
    ['A : 9, B : 2, C : 2, D : 2, '],
    ['E : 14, F : 1, G : 0, H : 2, '],
    ['I : 8, J : 1, K : 0, L : 5, '],
    ['M : 2, N : 5, O : 6, P : 2, '],
    ['Q : 1, R : 6, S : 5, T : 5, '],
    ['U : 6, V : 1, W : 0, X : 0, '],
    ['Y : 0, Z : 1, * : 2, '],
];

export const SET_POSSIBILITIES: Set<serviceConstants.WordPossibility> = new Set();
export const EMPTY_LIST: serviceConstants.WordPossibility[] = [];
export const RANDOM_WORD1 = 'chien';
export const RANDOM_WORD2 = 'chat';
export const RANDOM_WORD3 = 'singe';
export const WORD_POSSIBILITY1: serviceConstants.WordPossibility = {
    word: RANDOM_WORD1,
    anchor: { x: 0, y: 0 },
    playerLetters: 'faf',
    wordDirection: DirectionType.HORIZONTAL,
} as serviceConstants.WordPossibility;
export const WORD_POSSIBILITY2: serviceConstants.WordPossibility = {
    word: RANDOM_WORD2,
    anchor: { x: 0, y: 0 },
    playerLetters: 'fafaw',
    wordDirection: DirectionType.HORIZONTAL,
} as serviceConstants.WordPossibility;
export const WORD_POSSIBILITY3: serviceConstants.WordPossibility = {
    word: RANDOM_WORD2,
    anchor: { x: 0, y: 0 },
    playerLetters: 'faff',
    wordDirection: DirectionType.HORIZONTAL,
} as serviceConstants.WordPossibility;
export const WORD_POSSIBILITY4: serviceConstants.WordPossibility = {
    word: RANDOM_WORD2,
    anchor: { x: 0, y: 0 },
    playerLetters: 'fafa',
    wordDirection: DirectionType.HORIZONTAL,
} as serviceConstants.WordPossibility;

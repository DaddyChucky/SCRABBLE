import { ChatMessage } from '@common/model/chat-message';
import { TypeOfUser } from '@common/model/type-of-user';

export const RESPONSE_DELAY = 300;
export const VIRTUAL_PLAYER_ID = 'virtual-player';
export const SECOND_BEFORE_GIVEUP = 5000;
export const SECOND_VIRTUAL_PLAYER_PLAY = 3000;
export const TIME_LEFT_VIRTUAL_PLAYER = 17000;
export const RESIGNATION_MESSAGE: ChatMessage = {
    author: TypeOfUser.SYSTEM,
    text: 'Votre adversaire a abandonné la partie et a été remplacer par un joueur virtuel débutant',
    lobbyId: '',
    date: new Date(),
    socketId: '',
};
export const INDEX_DATA_0 = 0;
export const INDEX_DATA_1 = 1;
export const INDEX_DATA_2 = 2;
export const DEFAULT_DICT = 'francais';

import { TypeOfUser } from './type-of-user';

export interface ChatMessage {
    author: TypeOfUser;
    text: string;
    date: Date;
    lobbyId: string;
    socketId: string;
}

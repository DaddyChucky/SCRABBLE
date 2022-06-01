import { ChatMessage } from '@common/model/chat-message';
import { ASCII_LETTER_START_MAJ } from '@common/model/constants';
import { LetterBag } from '@common/model/letter-bag/letter-bag';
import { Player } from '@common/model/player';
import { TypeOfUser } from '@common/model/type-of-user';
import { Service } from 'typedi';
import * as serviceConstants from './command-message-creator.service.constants';

@Service()
export class CommandMessageCreatorService {
    createExchangeMessage(letters: string, currentPlayer: Player, lobbyId: string, isPlayerTurn: boolean): ChatMessage {
        return {
            author: isPlayerTurn ? TypeOfUser.CURRENT_PLAYER : TypeOfUser.OPPONENT_PLAYER,
            text: this.createExchangeText(letters, currentPlayer.name, isPlayerTurn),
            date: new Date(),
            lobbyId,
            socketId: currentPlayer.playerId,
        } as ChatMessage;
    }

    createGetLetterBagMessage(playerId: string, letterBag: LetterBag, lobbyId: string): ChatMessage[] {
        const letterBagContent: string[] = this.createLetterBagContentText(letterBag);
        const chatMessages: ChatMessage[] = [];
        for (const line of letterBagContent) {
            chatMessages.push({
                author: TypeOfUser.SYSTEM,
                text: line,
                date: new Date(),
                lobbyId,
                socketId: playerId,
            } as ChatMessage);
        }
        return chatMessages;
    }

    createGetIndiceBeginMessage(playerId: string, lobbyId: string): ChatMessage {
        return {
            author: TypeOfUser.SYSTEM,
            text: serviceConstants.HINT_MSG,
            date: new Date(),
            lobbyId,
            socketId: playerId,
        } as ChatMessage;
    }

    createGetIndiceFullMessage(playerId: string, lobbyId: string, wordPossibility: serviceConstants.WordPossibility): ChatMessage {
        return {
            author: TypeOfUser.SYSTEM,
            text:
                serviceConstants.PLACE_COMMAND +
                String.fromCharCode(ASCII_LETTER_START_MAJ + wordPossibility.anchor.y).toLowerCase() +
                (wordPossibility.anchor.x + 1).toString() +
                wordPossibility.wordDirection.toLowerCase() +
                ` ${wordPossibility.playerLetters} `,
            date: new Date(),
            lobbyId,
            socketId: playerId,
        } as ChatMessage;
    }

    createEndGameEaselMessage(player: Player, lobbyId: string): ChatMessage {
        return {
            author: TypeOfUser.SYSTEM,
            text: this.easelStateMessage(player),
            date: {} as Date,
            lobbyId,
            socketId: player.playerId,
        } as ChatMessage;
    }

    private createLetterBagContentText(letterBag: LetterBag): string[] {
        const letterBagContent: string[] = [];
        let line = '';
        let counter = 0;
        for (const letter of letterBag.letters) {
            if (counter >= serviceConstants.NUBMER_LETTER_ON_ONE_LINE) {
                letterBagContent.push(line);
                counter = 0;
                line = '';
            }
            line += `${letter.tile.name} : ${letter.quantity}, `;
            counter++;
        }
        if (line.length) letterBagContent.push(line);
        return letterBagContent;
    }

    private easelStateMessage(player: Player): string {
        let playerTiles = '';
        player.tiles.forEach((tile) => (playerTiles += ` ${tile.name}`));
        return serviceConstants.EASEL_MESSAGE_STRUC[0] + player.name + serviceConstants.EASEL_MESSAGE_STRUC[1] + playerTiles;
    }

    private createExchangeText(letters: string, currentPlayerName: string, isPlayerTurn: boolean): string {
        const wordLetterConjugate: string =
            letters.length > serviceConstants.MIN_LETTERS_SIZE ? serviceConstants.WORD_LETTERS_PLURAL : serviceConstants.WORD_LETTER_SINGULAR;
        return isPlayerTurn
            ? serviceConstants.EXCHANGE_COMMAND + letters
            : currentPlayerName + serviceConstants.COLON + serviceConstants.EXCHANGE_COMMAND + letters.length + wordLetterConjugate;
    }
}

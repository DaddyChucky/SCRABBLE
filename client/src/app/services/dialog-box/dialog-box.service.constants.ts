/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ChatMessage } from '@app/../../../common/model/chat-message';
import { TypeOfUser } from '@app/../../../common/model/type-of-user';

export const PLACE_COMMAND = '!placer ';
export const SPACE = ' ';
export const INDEX_WORD = 1;
export const INDEX_POSITION = 0;
export const INDEX_DIRECTION = 1;
export const INDEX_COMMAND = 0;
export const INDEX_LETTER = 1;
export const BEGINNING_COMMAND_NAME_INDEX = 1;
export const NUMBER_OF_CALLS_TO_SEND = 2;
export const FIRST_DOUBLE_DIGIT = 10;
export const ZERO_TO_MAKE_DOUBLE_DIGIT = '0';
export const MESSAGE_SYNTAX_ERROR = 'Erreur de syntaxe';
export const MESSAGE_COMMAND_ERROR = 'Commande impossible à réaliser';
export const MESSAGE_ENTRY_ERROR = 'Entrée invalide';
export const MESSAGE_NOT_IN_DIC_ERROR = "Le mot choisi n'est pas dans le dictionnaire.";
export const WELCOME_MSG =
    'Bienvenue au jeu de Scrabble! ' + 'Utilisez cette boîte de communication pour clavarder avec votre adversaire ou pour inscrire des commandes.';
export const FIRST_CHAT_MESSAGE: ChatMessage = {
    author: TypeOfUser.SYSTEM,
    text: WELCOME_MSG,
    date: new Date(),
    lobbyId: '',
    socketId: '',
} as ChatMessage;
const HELP_PLACER = "!placer [a-o][1-15][h/v] 'lettre' : Pour placer les lettres voulues";
const HELP_EXCHANGE = "!échanger 'lettre' : Pour échanger les lettres de votre chevalet";
const HELP_HINT = '!indice : Pour avoir 3 suggestions de placement';
const HELP_PASS = '!passer : Pour passer votre tour';
const HELP_RESERVE = "!réserve : Pour voir l'état de la réserve de lettres";
export const HELP_HELP = '!aide : Pour afficher la liste des commande et leur utilité';
export const HELP_MSG: string[] = [HELP_HELP, HELP_PLACER, HELP_EXCHANGE, HELP_HINT, HELP_PASS, HELP_RESERVE];

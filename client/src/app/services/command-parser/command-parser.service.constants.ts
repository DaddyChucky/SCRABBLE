/* eslint-disable @typescript-eslint/no-magic-numbers */ // constants file
import { LetterBag } from '@app/../../../common/model/letter-bag/letter-bag';
import { MultiplayerLobby } from '@app/../../../common/model/lobby';
import { LobbyStatus } from '@app/../../../common/model/lobby-status';
import { LobbyType } from '@app/../../../common/model/lobby-type';

export const EXCHANGE_COMMAND_REGEX = /!échanger [a-z*]{1,7}/;
export const PLACE_COMMAND_REGEX = /!placer [a-o]{1,1}[1-9]{1,1}[0-5]{0,1}[hv]{0,1} [a-zA-Zàâäéèêëïîôöùûüÿç]{1,7}/;
export const VALID_SKIP_COMMAND = '!passer';
export const VALID_RESERVE_COMMAND = '!réserve';
export const VALID_HINT_COMMAND = '!indice';
export const VALID_HELP_COMMAND = '!aide';
export const MAX_WHITE_LETTERS = 2;
export const MAX_N_SEPARATORS = 3;
export const WHITE_LETTER = '*';
export const COMMAND_CHARACTER = '!';
export const SPACE_REGEX = /[ ]/g;
export const SQUARE_NAME_AND_WORD_DIRECTION_REGEX = /[a-o]{1,1}[1-9]{1,1}[0-5]{0,1}[hv]{0,1}/;
export const SQUARE_NAME_REGEX = /[a-o]{1,1}[1-9]{1,1}[0-5]{0,1}/;
export const MAJ_REGEX = /[A-Z]/g;
export const MIN_REGEX = /[a-z]/g;
export const MAX_POSITION_LENGTH = 4;
export const HORIZONTAL_POSITION = 'h';
export const VERTICAL_POSITION = 'v';
export const MAX_LONE_LETTER_LENGTH = 1;
export const MIN_N_SEPARATORS = 2;
export const LETTER_BAG_STUB_LENGTH = 100;
export const BOARD_POSITION_INDEX = 1;
export const EXCHANGE_LETTERS_INDEX = 1;
export const PLACING_LETTERS_INDEX = 2;
export const BOARD_POSITION_STRING_INDEX = 0;
export const POSSIBLE_VERTICAL_PLACINGS: string[] = ['B8', 'C8', 'D8', 'E8', 'F8', 'G8'];
export const POSSIBLE_HORIZONTAL_PLACINGS: string[] = ['H2', 'H3', 'H4', 'H5', 'H6', 'H7'];
export const POSSIBLE_PLACINGS_MAX_LENGTH = 2;
export const LOBBY_MOCK: MultiplayerLobby = {
    playerList: [],
    lobbyType: LobbyType.CLASSIC,
    dictionary: 'ENGLISH',
    baseTimerValue: 60,
    timeLeft: 0,
    lobbyId: 'lobby2',
    lobbyStatus: LobbyStatus.CREATED,
    letterBag: new LetterBag(),
};
export const LETTERS_INDEX = 1;
export const PARSE_NUM = 10;
export const EMPTY_STRING = '';
export const INDEX_DIRECTION = 2;

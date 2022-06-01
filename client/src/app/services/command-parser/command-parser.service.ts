import { Injectable } from '@angular/core';
import { MAX_TILES_PER_PLAYER } from '@app/../../../common/model/constants';
import { DirectionType } from '@app/../../../common/model/direction-type';
import { Player } from '@app/../../../common/model/player';
import { Tile } from '@app/../../../common/model/tile';
import { Vec2 } from '@app/../../../common/model/vec2';
import { CommandType } from '@app/classes/command-type';
import { GRID_CENTER, MIN_TILES_PER_PLAYER } from '@app/classes/constants';
import { ParserErrorType } from '@app/classes/parser-error-types';
import { GridService } from '@app/services/grid/grid.service';
import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';
import * as serviceConstants from './command-parser.service.constants';

@Injectable({
    providedIn: 'root',
})
export class CommandParserService {
    constructor(private readonly gridService: GridService, private readonly letterBagService: LetterBagService) {}

    isCommand(chatMsg: string): boolean {
        return chatMsg[0] === serviceConstants.COMMAND_CHARACTER;
    }

    validateCommand(player: Player, command: string): ParserErrorType {
        const commandType: CommandType = this.parseCommandType(command);
        if (commandType === CommandType.NOT_IMPLEMENTED) return ParserErrorType.ENTRY;
        if (this.isInfoCommand(commandType)) return ParserErrorType.NONE;
        if (!this.isTurn(player)) return ParserErrorType.COMMAND;
        if (this.isValidSkipCommand(command)) return ParserErrorType.NONE;
        if (!this.isValidCommandSyntax(command)) return ParserErrorType.SYNTAX;
        const boardPositionAndPlacingLetters: [string, string] | undefined = this.splitPositionAndPlacingLetters(command);
        if (!boardPositionAndPlacingLetters || !boardPositionAndPlacingLetters[serviceConstants.LETTERS_INDEX]) return ParserErrorType.SYNTAX;
        if (!this.isInPossessionOfLetters(player, boardPositionAndPlacingLetters[serviceConstants.LETTERS_INDEX], commandType))
            return ParserErrorType.SYNTAX;
        if (this.gridService.isGridEmpty() && command.substring(1, CommandType.PLACE.length + 1) === CommandType.PLACE)
            if (!this.isFirstTurnValidation(command)) return ParserErrorType.SYNTAX;
        return ParserErrorType.NONE;
    }

    splitPositionAndPlacingLetters(regexedCommand: string): [string, string] | undefined {
        const boardPositionAndPlacingLetters: string[] = regexedCommand.split(serviceConstants.SPACE_REGEX);
        if (!this.isValidBoardPositionAndPlacingLetters(boardPositionAndPlacingLetters.length)) return undefined;
        return boardPositionAndPlacingLetters.length === serviceConstants.MIN_N_SEPARATORS
            ? [serviceConstants.EMPTY_STRING, boardPositionAndPlacingLetters[serviceConstants.EXCHANGE_LETTERS_INDEX]]
            : [
                  boardPositionAndPlacingLetters[serviceConstants.BOARD_POSITION_INDEX],
                  boardPositionAndPlacingLetters[serviceConstants.PLACING_LETTERS_INDEX],
              ];
    }

    convertCommandToPositionAndDirectionType(command: string): [Vec2, DirectionType] | undefined {
        const squareNameAndDirectionType: string | undefined = this.convertCommandToSquareNameAndDirectionType(command);
        if (!squareNameAndDirectionType) return undefined;
        const squareName: string | undefined = this.convertSquareNameAndDirectionTypeToSquareName(squareNameAndDirectionType);
        if (!squareName) return undefined;
        let vectorPosition: Vec2 | undefined = this.gridService.convertSquareNameToPosition(squareName);
        if (!vectorPosition) return undefined;
        if (!this.isDirectionType(vectorPosition, squareNameAndDirectionType.length, squareName.length)) return [vectorPosition, DirectionType.NONE];
        vectorPosition = this.gridService.convertSquareNameToPosition(squareNameAndDirectionType.substring(0, squareName.length));
        const directionType: DirectionType | undefined = this.chooseDirectionType(squareNameAndDirectionType[squareName.length]);
        if (directionType === undefined || vectorPosition === undefined) return undefined;
        return [vectorPosition, directionType];
    }

    removePlayerLetters(player: Player, letters: string): void {
        player.tiles = player.tiles.filter((tile) => !letters.includes(tile.name));
        for (const letter of letters) {
            const tileToRemove: Tile | undefined = this.findPlayerTileToRemoveWithTileName(player, letter);
            if (tileToRemove) {
                player.tiles = player.tiles.filter((tile: Tile) => tile !== tileToRemove);
            }
        }
    }

    private isFirstTurnValidation(regexedCommand: string): boolean {
        const boardPositionAndPlacingLetters: [string, string] | undefined = this.splitPositionAndPlacingLetters(regexedCommand);
        if (!boardPositionAndPlacingLetters) return false;
        const boardPosition: string = boardPositionAndPlacingLetters[serviceConstants.BOARD_POSITION_STRING_INDEX];

        const wordToPlace: string = boardPositionAndPlacingLetters[1];
        const letterPosition: string = boardPosition.substring(0, serviceConstants.PLACING_LETTERS_INDEX);
        if (!boardPosition[serviceConstants.INDEX_DIRECTION]) return false;
        const direction: string = boardPosition[serviceConstants.INDEX_DIRECTION];
        let newLetterPosition: string;

        for (let i = 0; i < wordToPlace.length; ++i) {
            newLetterPosition =
                direction.toLowerCase() === DirectionType.HORIZONTAL
                    ? letterPosition[0] + (parseInt(letterPosition[serviceConstants.LETTERS_INDEX], serviceConstants.PARSE_NUM) + i).toString()
                    : String.fromCharCode(letterPosition.charCodeAt(0) + i) + letterPosition[serviceConstants.LETTERS_INDEX];
            if (newLetterPosition.toUpperCase() === GRID_CENTER) return true;
        }

        return false;
    }

    private isInfoCommand(commandType: CommandType): boolean {
        return commandType === CommandType.RESERVE || commandType === CommandType.HINT || commandType === CommandType.HELP;
    }

    private chooseDirectionType(wordPlacingPosition: string): DirectionType | undefined {
        switch (wordPlacingPosition) {
            case serviceConstants.HORIZONTAL_POSITION:
                return DirectionType.HORIZONTAL;
            case serviceConstants.VERTICAL_POSITION:
                return DirectionType.VERTICAL;
        }
        return undefined;
    }

    private isDirectionType(vectorPosition: Vec2 | undefined, squareNameAndDirectionTypeLength: number, squareNameLength: number): boolean {
        return vectorPosition === undefined || squareNameAndDirectionTypeLength - squareNameLength !== 0;
    }

    private convertCommandToSquareNameAndDirectionType(command: string): string | undefined {
        const squareNameAndDirectionTypeMatchArray: RegExpMatchArray | null = command.match(serviceConstants.SQUARE_NAME_AND_WORD_DIRECTION_REGEX);
        if (!this.isValidRegExpMatchArray(squareNameAndDirectionTypeMatchArray)) return undefined;
        // @ts-ignore: Object is possibly 'null'. -- Condition verified above, cannot be null
        return squareNameAndDirectionTypeMatchArray[0];
    }

    private convertSquareNameAndDirectionTypeToSquareName(squareNameAndDirectionType: string): string | undefined {
        const squareNameMatchArray: RegExpMatchArray | null = squareNameAndDirectionType.match(serviceConstants.SQUARE_NAME_REGEX);
        if (!squareNameMatchArray) return undefined;
        return squareNameMatchArray[0];
    }

    private isValidRegExpMatchArray(matchArray: RegExpMatchArray | null): boolean {
        return (
            matchArray !== null && matchArray.length === 1 && matchArray[0].length > 0 && matchArray[0].length <= serviceConstants.MAX_POSITION_LENGTH
        );
    }

    private isTurn(player: Player): boolean {
        return player.isTurn;
    }

    private isValidPlayerAndLettersToReplace(player: Player, letters: string): boolean {
        return player && this.isValidPlayerTiles(player) && this.isValidLettersLength(letters);
    }

    private isValidLettersLength(letters: string): boolean {
        return letters.length > MIN_TILES_PER_PLAYER && letters.length <= MAX_TILES_PER_PLAYER;
    }

    private isValidPlayerTiles(player: Player): boolean {
        return player.tiles.length > MIN_TILES_PER_PLAYER && player.tiles.length <= MAX_TILES_PER_PLAYER;
    }

    private isInPossessionOfLetters(player: Player, letters: string, commandType: CommandType): boolean {
        if (!this.isValidPlayerAndLettersToReplace(player, letters)) return false;
        if (!this.hasEnoughLetters(player, letters)) return false;
        if (!this.isPlayerHaveEachLetters(player.tiles, letters)) return false;
        if (commandType === CommandType.EXCHANGE && !this.isExchangeValid()) return false;
        return true;
    }

    private isPlayerHaveEachLetters(tiles: Tile[], word: string): boolean {
        const lettersOfPlayer: string[] = this.letterBagService.convertTileInWord(tiles);
        let index: number;
        for (let letter of word) {
            if (letter === letter.toUpperCase()) letter = serviceConstants.WHITE_LETTER;
            index = lettersOfPlayer.indexOf(letter);
            if (index < 0) return false;
            lettersOfPlayer.splice(index, 1);
        }
        return true;
    }

    private isExchangeValid(): boolean {
        return this.letterBagService.getLetterBagSize() >= MAX_TILES_PER_PLAYER;
    }

    private findPlayerTileToRemoveWithTileName(player: Player, tileName: string): Tile | undefined {
        return this.isUpperCase(tileName)
            ? player.tiles.find((tile: Tile) => tile.name === serviceConstants.WHITE_LETTER)
            : player.tiles.find((tile: Tile) => tile.name === tileName);
    }

    private isUpperCase(letters: string): boolean {
        return letters === letters.toUpperCase();
    }

    private hasEnoughLetters(player: Player, letters: string): boolean {
        return this.hasEnoughUpperLetters(player, letters) || this.hasEnoughLowerLetters(player, letters);
    }

    private hasEnoughUpperLetters(player: Player, letters: string): boolean {
        const upperLetters: RegExpMatchArray | null = letters.match(serviceConstants.MAJ_REGEX);
        return upperLetters ? player.tiles.filter((tile: Tile) => tile.name === serviceConstants.WHITE_LETTER).length === upperLetters.length : false;
    }

    private hasEnoughLowerLetters(player: Player, letters: string): boolean {
        const lowerLetters: RegExpMatchArray | null = letters.match(serviceConstants.MIN_REGEX);
        if (!lowerLetters) return false;
        for (const lowerLetter of lowerLetters) {
            if (
                player.tiles.filter((tile: Tile) => tile.name === lowerLetter).length >=
                letters.split('').filter((letter: string) => letter === lowerLetter).length
            )
                return false;
        }
        return true;
    }

    private isValidCommandSyntax(chatMsg: string): boolean {
        switch (this.parseCommandType(chatMsg)) {
            case CommandType.PLACE:
                return (
                    this.isRegexDefined(chatMsg, serviceConstants.PLACE_COMMAND_REGEX) &&
                    this.isValidMaxWhiteLetters(chatMsg) &&
                    this.isValidLoneLetterPlacing(chatMsg)
                );
            case CommandType.EXCHANGE:
                return this.isRegexDefined(chatMsg, serviceConstants.EXCHANGE_COMMAND_REGEX);
            default:
                return false;
        }
    }

    private isValidSkipCommand(chatMsg: string): boolean {
        return chatMsg === serviceConstants.COMMAND_CHARACTER + CommandType.SKIP;
    }

    private isRegexDefined(chatMsg: string, regex: RegExp): boolean {
        const regexedCommand: RegExpMatchArray | null = chatMsg.match(regex);
        if (!regexedCommand) return false;
        return regexedCommand[0].length === chatMsg.length;
    }

    private isValidMaxWhiteLetters(regexedCommand: string): boolean {
        const upperLetters: RegExpMatchArray | null = regexedCommand.match(serviceConstants.MAJ_REGEX);
        return upperLetters ? upperLetters.length <= serviceConstants.MAX_WHITE_LETTERS : true;
    }

    private isValidLoneLetterPlacing(regexedCommand: string): boolean {
        const boardPositionAndPlacingLetters: [string, string] | undefined = this.splitPositionAndPlacingLetters(regexedCommand);
        if (!boardPositionAndPlacingLetters) return false;
        const boardPosition: string = boardPositionAndPlacingLetters[0];
        const placingLetters: string = boardPositionAndPlacingLetters[1];
        return this.isBoardPositionOriented(boardPosition, placingLetters);
    }

    private isBoardPositionOriented(boardPosition: string, placingLetters: string): boolean {
        if (boardPosition.includes(serviceConstants.VERTICAL_POSITION) || boardPosition.includes(serviceConstants.HORIZONTAL_POSITION)) return true;
        return placingLetters.length === serviceConstants.MAX_LONE_LETTER_LENGTH;
    }

    private isValidBoardPositionAndPlacingLetters(boardPositionAndPlacingLettersLength: number): boolean {
        return (
            boardPositionAndPlacingLettersLength >= serviceConstants.MIN_N_SEPARATORS &&
            boardPositionAndPlacingLettersLength <= serviceConstants.MAX_N_SEPARATORS
        );
    }

    private parseCommandType(chatMsg: string): CommandType {
        if (!this.isCommand(chatMsg)) return CommandType.NOT_IMPLEMENTED;
        if (this.splitMessageCommand(chatMsg, CommandType.PLACE)) return CommandType.PLACE;
        else if (this.splitMessageCommand(chatMsg, CommandType.EXCHANGE)) return CommandType.EXCHANGE;
        else if (this.splitMessageCommand(chatMsg, CommandType.SKIP)) return CommandType.SKIP;
        else
            switch (chatMsg) {
                case serviceConstants.VALID_RESERVE_COMMAND:
                    return CommandType.RESERVE;
                case serviceConstants.VALID_HINT_COMMAND:
                    return CommandType.HINT;
                case serviceConstants.VALID_HELP_COMMAND:
                    return CommandType.HELP;
            }
        return CommandType.NOT_IMPLEMENTED;
    }

    private splitMessageCommand(chatMsg: string, commandType: CommandType): boolean {
        const substringCommandTypeOffset: number = commandType.length + 1;
        if (chatMsg.length < substringCommandTypeOffset) return false;
        return chatMsg.substring(serviceConstants.COMMAND_CHARACTER.length, substringCommandTypeOffset) === commandType;
    }
}

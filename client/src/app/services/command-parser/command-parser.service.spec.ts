/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { DirectionType } from '@app/../../../common/model/direction-type';
import { Player } from '@app/../../../common/model/player';
import { Tile } from '@app/../../../common/model/tile';
import { Vec2 } from '@app/../../../common/model/vec2';
import { CommandType } from '@app/classes/command-type';
import { ParserErrorType } from '@app/classes/parser-error-types';
import { GridService } from '@app/services/grid/grid.service';
import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';
import { CommandParserService } from './command-parser.service';
import * as serviceConstants from './command-parser.service.constants';
import * as specConstants from './command-parser.service.spec.constants';
import { PLAYER_STUB } from './command-parser.service.spec.constants';

describe('CommandParserService', () => {
    let service: CommandParserService;
    let gridServiceStub: jasmine.SpyObj<GridService>;
    let letterServiceStub: jasmine.SpyObj<LetterBagService>;

    beforeEach(() => {
        letterServiceStub = jasmine.createSpyObj<any>('LetterBagService', ['refillLetters', 'getLetterBagSize', 'convertTileInWord'], {});
        gridServiceStub = jasmine.createSpyObj<any>(GridService, ['convertSquareNameToPosition', 'isGridEmpty']);

        TestBed.configureTestingModule({
            providers: [
                CommandParserService,
                { provide: GridService, useValue: gridServiceStub },
                { provide: LetterBagService, useValue: letterServiceStub },
            ],
        });
        service = TestBed.inject(CommandParserService);
        gridServiceStub.convertSquareNameToPosition.and.returnValue(specConstants.VALID_POSITION);
        specConstants.PLAYER_STUB.tiles = specConstants.PLAYER_STUB_TILES;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('parseCommand should call isCommand for any command', () => {
        const isCommandSpy: jasmine.Spy<jasmine.Func> = spyOn<any>(service, 'isCommand').and.stub();
        for (const command of specConstants.INVALID_PLACER_COMMANDS.concat(specConstants.VALID_PLACER_COMMANDS)
            .concat(specConstants.INVALID_PLACER_COMMANDS_NOT_REGEX_DEFINED)
            .concat(specConstants.INVALID_EXCHANGE_COMMANDS)
            .concat(specConstants.VALID_EXCHANGE_COMMANDS)) {
            service['parseCommandType'](command);
            expect(isCommandSpy).toHaveBeenCalled();
        }
    });

    it('parseCommand should return "CommandType.PLACE" for valid placer commands', () => {
        for (const command of specConstants.VALID_PLACER_COMMANDS) {
            expect(service['parseCommandType'](command)).toEqual(CommandType.PLACE);
        }
    });

    it('parseCommand should return "CommandType.EXCHANGE" for valid exchange commands', () => {
        for (const command of specConstants.VALID_EXCHANGE_COMMANDS) {
            expect(service['parseCommandType'](command)).toEqual(CommandType.EXCHANGE);
        }
    });

    it('parseCommand should return "CommandType.SKIP" for valid skip command', () => {
        expect(service['parseCommandType'](serviceConstants.VALID_SKIP_COMMAND)).toEqual(CommandType.SKIP);
    });

    it('parseCommand should return "CommandType.NOTIMPLEMENTED" for invalid commands', () => {
        for (const command of specConstants.INVALID_STARTING_COMMANDS)
            expect(service['parseCommandType'](command)).toEqual(CommandType.NOT_IMPLEMENTED);
    });

    it('parseCommand should return "CommandType.RESERVE" for command !réserve', () => {
        expect(service['parseCommandType'](serviceConstants.VALID_RESERVE_COMMAND)).toEqual(CommandType.RESERVE);
    });

    it('parseCommand should return "CommandType.HINT" for command !indice', () => {
        expect(service['parseCommandType'](serviceConstants.VALID_HINT_COMMAND)).toEqual(CommandType.HINT);
    });

    it('parseCommand should return "CommandType.Help" for valid help command', () => {
        expect(service['parseCommandType'](serviceConstants.VALID_HELP_COMMAND)).toEqual(CommandType.HELP);
    });

    it('parseCommand should return "CommandType.NOTIMPLEMENTED" for command invalid !réser command', () => {
        expect(service['parseCommandType'](specConstants.INVALID_RESERVE_COMMAND)).toEqual(CommandType.NOT_IMPLEMENTED);
    });

    it('isValidPlayerAndLettersToReplace should return false if player tiles length is invalid', () => {
        specConstants.PLAYER_STUB.tiles.push(new Tile());
        const playerLetters = 'abcdefgh';
        const lettersToPlace = 'abcdeff';
        for (let i = 0; i < playerLetters.length; ++i) specConstants.PLAYER_STUB.tiles[i].name = playerLetters[i];

        expect(service['isValidPlayerAndLettersToReplace'](specConstants.PLAYER_STUB, lettersToPlace)).toBeFalsy();
        specConstants.PLAYER_STUB.tiles.pop();
    });

    it('isValidLettersLength should return true if the length of the letters to place is valid', () => {
        expect(service['isValidLettersLength'](specConstants.PLAYER_STUB_LETTERS)).toBeTruthy();
    });

    it('isValidLettersLength should return false if the length of the letters to place is invalid', () => {
        expect(service['isValidLettersLength'](specConstants.PLAYER_STUB_LETTERS + 'a')).toBeFalsy();
    });

    it('isValidPlayerTiles should return true if player has between 0 and 7 tiles', () => {
        expect(service['isValidPlayerTiles'](specConstants.PLAYER_STUB)).toBeTruthy();
    });

    it('isValidPlayerTiles should return false if player has no tiles', () => {
        specConstants.PLAYER_STUB.tiles = [];
        expect(service['isValidPlayerTiles'](specConstants.PLAYER_STUB)).toBeFalsy();
    });

    it('isValidPlayerTiles should return false if player has more than 7 tiles', () => {
        const playerTiles: Tile[] = [new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()];
        const player: Player = { tiles: playerTiles } as Player;
        expect(service['isValidPlayerTiles'](player)).toBeFalsy();
    });

    it('isInPossessionOfLetters should call isExchangeValid for CommandType.EXCHANGE', () => {
        spyOn<any>(service, 'isValidPlayerAndLettersToReplace').and.returnValue(true);
        spyOn<any>(service, 'hasEnoughLetters').and.returnValue(true);
        spyOn<any>(service, 'isPlayerHaveEachLetters').and.returnValue(true);
        const isExchangeValidSpy = spyOn<any>(service, 'isExchangeValid').and.returnValue(true);
        expect(service['isInPossessionOfLetters'](specConstants.PLAYER_STUB, specConstants.PLAYER_STUB_LETTERS, CommandType.EXCHANGE)).toBeTruthy();
        expect(isExchangeValidSpy).toHaveBeenCalled();
    });

    it('isInPossessionOfLetters should return false if player letters to replace are invalid', () => {
        expect(service['isInPossessionOfLetters'](specConstants.PLAYER_STUB, '', CommandType.EXCHANGE)).toBeFalsy();
        expect(service['isInPossessionOfLetters'](specConstants.PLAYER_STUB, '', CommandType.PLACE)).toBeFalsy();
    });

    it('isInPossessionOfLetters should return false if command type is exchange and current game is not permitting exchange', () => {
        spyOn<any>(service, 'isValidPlayerAndLettersToReplace').and.returnValue(true);
        spyOn<any>(service, 'hasEnoughLetters').and.returnValue(true);
        spyOn<any>(service, 'isExchangeValid').and.returnValue(false);
        expect(service['isInPossessionOfLetters'](specConstants.PLAYER_STUB, '', CommandType.EXCHANGE)).toBeFalsy();
    });

    it('isInPossessionOfLetters should return false if letters ', () => {
        spyOn<any>(service, 'isValidPlayerAndLettersToReplace').and.returnValue(true);
        spyOn<any>(service, 'hasEnoughLetters').and.returnValue(true);
        spyOn<any>(service, 'isPlayerHaveEachLetters').and.returnValue(false);
        expect(service['isInPossessionOfLetters'](specConstants.PLAYER_STUB, '', CommandType.EXCHANGE)).toBeFalsy();
    });

    it('isPlayerHaveEachLetters should return true only if each letter is in easel and call convertTileInWord', () => {
        letterServiceStub.convertTileInWord.and.returnValue(specConstants.LETTERS_OF_PLAYER_ARRAY);
        expect(service['isPlayerHaveEachLetters'](specConstants.LETTERS_OF_PLAYER, specConstants.ENOUGH_PLAYER_LETTERS)).toBeTruthy();
        expect(letterServiceStub.convertTileInWord).toHaveBeenCalled();
    });

    it('isPlayerHaveEachLetters should return false if one letter not found', () => {
        letterServiceStub.convertTileInWord.and.returnValue([]);
        expect(service['isPlayerHaveEachLetters'](specConstants.LETTERS_OF_PLAYER, specConstants.ENOUGH_PLAYER_LETTERS)).toBeFalsy();
        expect(letterServiceStub.convertTileInWord).toHaveBeenCalled();
    });

    it('convertSquareNameAndDirectionTypeToSquareName should return undefined for an invalid squareNameAndDirectionType', () => {
        expect(service['convertSquareNameAndDirectionTypeToSquareName']('')).toEqual(undefined);
    });

    it('chooseDirectionType should return undefined for an invalid wordPlacingPosition', () => {
        expect(service['chooseDirectionType']('')).toEqual(undefined);
    });

    it('isExchangeValid should return if letterBagSize has enough letters to be exchange valid', () => {
        expect(service['isExchangeValid']()).toBeFalsy();
    });

    it('isTurn should return true if it is the turn of the player', () => {
        const player: Player = { isTurn: true } as Player;
        expect(service['isTurn'](player)).toBeTruthy();
    });

    it('isTurn should return false if it is not the turn of the player', () => {
        const player: Player = { isTurn: false } as Player;
        expect(service['isTurn'](player)).toBeFalsy();
    });

    it('validateCommand should return "ParserErrorType.ENTRY" for invalid starting commands', () => {
        const player: Player = {} as Player;
        for (const command of specConstants.INVALID_STARTING_COMMANDS) {
            expect(service.validateCommand(player, command)).toEqual(ParserErrorType.ENTRY);
        }
    });

    it('validateCommand should return "ParserErrorType.COMMAND" if it not the turn of the player to play', () => {
        const player: Player = {} as Player;
        const command = '!placer a15h bongo';
        expect(service.validateCommand(player, command)).toEqual(ParserErrorType.COMMAND);
    });

    it('validateCommand should return "ParserErrorType.SYNTAX" for commands with invalid syntax', () => {
        const player: Player = { isTurn: true } as Player;
        for (const command of specConstants.INVALID_PLACER_COMMANDS) {
            expect(service.validateCommand(player, command)).toEqual(ParserErrorType.SYNTAX);
        }
    });

    it('validateCommand should return "ParserErrorType.NONE" for valid skip command if isTurn is true', () => {
        const player: Player = { isTurn: true } as Player;
        expect(service.validateCommand(player, serviceConstants.VALID_SKIP_COMMAND)).toEqual(ParserErrorType.NONE);
    });

    it('validateCommand should return "ParserErrorType.NONE" for valid indice command', () => {
        const player: Player = { isTurn: true } as Player;
        expect(service.validateCommand(player, serviceConstants.VALID_HINT_COMMAND)).toEqual(ParserErrorType.NONE);
    });

    it('validateCommand should return "ParserErrorType.NONE" for valid réserve command', () => {
        const player: Player = {} as Player;
        expect(service.validateCommand(player, serviceConstants.VALID_RESERVE_COMMAND)).toEqual(ParserErrorType.NONE);
    });

    it('validateCommand should return "ParserErrorType.NONE" for valid help command', () => {
        const player: Player = {} as Player;
        expect(service.validateCommand(player, serviceConstants.VALID_HELP_COMMAND)).toEqual(ParserErrorType.NONE);
    });

    it('validateCommand should not return "ParserErrorType.NONE" for valid skip command if isTurn is false', () => {
        const player: Player = { isTurn: false } as Player;
        expect(service.validateCommand(player, serviceConstants.VALID_SKIP_COMMAND)).not.toEqual(ParserErrorType.NONE);
    });

    it('validateCommand should return "ParserErrorType.SYNTAX" for invalid boardPositionAndPlacingLetters', () => {
        spyOn<any>(service, 'parseCommandType').and.returnValue(CommandType.PLACE);
        spyOn<any>(service, 'isTurn').and.returnValue(true);
        spyOn<any>(service, 'isValidCommandSyntax').and.returnValue(true);
        spyOn<any>(service, 'splitPositionAndPlacingLetters').and.returnValue(undefined);
        expect(service.validateCommand(PLAYER_STUB, '')).toEqual(ParserErrorType.SYNTAX);
    });

    it('validateCommand should return "ParserErrorType.SYNTAX" for invalid boardPositionAndPlacingLetters content', () => {
        spyOn<any>(service, 'parseCommandType').and.returnValue(CommandType.PLACE);
        spyOn<any>(service, 'isTurn').and.returnValue(true);
        spyOn<any>(service, 'isValidCommandSyntax').and.returnValue(true);
        spyOn<any>(service, 'splitPositionAndPlacingLetters').and.returnValue([specConstants.INVALID_SQUARE_NAME, '']);
        expect(service.validateCommand(PLAYER_STUB, '')).toEqual(ParserErrorType.SYNTAX);
    });

    it('validateCommand should return "ParserErrorType.NONE" if player is in possession of letters', () => {
        spyOn<any>(service, 'parseCommandType').and.returnValue(CommandType.PLACE);
        spyOn<any>(service, 'isTurn').and.returnValue(true);
        spyOn<any>(service, 'isValidCommandSyntax').and.returnValue(true);
        spyOn<any>(service, 'splitPositionAndPlacingLetters').and.returnValue([specConstants.INVALID_SQUARE_NAME, specConstants.INVALID_SQUARE_NAME]);
        spyOn<any>(service, 'isInPossessionOfLetters').and.returnValue(true);
        expect(service.validateCommand(PLAYER_STUB, '')).toEqual(ParserErrorType.NONE);
    });

    it('validateCommand should return "ParserErrorType.SYNTAX" if player does not have correct letters to place', () => {
        const playerTiles: Tile[] = [new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()];
        const playerLetters = 'bonjour';
        const command = '!placer a15h bongo';
        for (let i = 0; i < playerTiles.length; ++i) {
            playerTiles[i].name = playerLetters[i];
        }
        const player: Player = { tiles: playerTiles, isTurn: true } as Player;
        expect(service.validateCommand(player, command)).toEqual(ParserErrorType.SYNTAX);
    });

    it('validateCommand should return "ParserErrorType.SYNTAX" if it is first turn and command place, but invalid position for first turn', () => {
        spyOn<any>(service, 'isPlayerHaveEachLetters').and.returnValue(true);
        gridServiceStub.isGridEmpty.and.returnValue(true);
        const playerTiles: Tile[] = [
            new Tile({ x: 0, y: 0 } as Vec2, 'B', 1),
            new Tile({ x: 0, y: 0 } as Vec2, 'O', 1),
            new Tile({ x: 0, y: 0 } as Vec2, 'N', 1),
            new Tile({ x: 0, y: 0 } as Vec2, 'J', 1),
            new Tile({ x: 0, y: 0 } as Vec2, 'O', 1),
            new Tile({ x: 0, y: 0 } as Vec2, 'U', 1),
            new Tile({ x: 0, y: 0 } as Vec2, 'R', 1),
        ];
        const command = '!placer a1h bon';
        const player: Player = { tiles: playerTiles, isTurn: true } as Player;
        expect(service.validateCommand(player, command)).toEqual(ParserErrorType.SYNTAX);
    });

    it('convertCommandToPositionAndDirectionType should return undefined for commands with invalid regex', () => {
        const commandsWithInvalidRegex: string[] = [
            '!placer 15d bonjour',
            '!placer 15dv bonjour',
            '!placer 15dh bonjour',
            '!placer p15h bonjour',
            '!placer a0h bonjour',
        ];
        for (const invalidCommand of commandsWithInvalidRegex) {
            expect(service.convertCommandToPositionAndDirectionType(invalidCommand)).toEqual(undefined);
        }
    });

    it('convertCommandToPositionAndDirectionType should return correct DirectionType for horizontal words', () => {
        for (const command of specConstants.VALID_HORIZONTAL_PLACER_COMMANDS) {
            const wordPositionAndDirection: [Vec2, DirectionType] | undefined = service.convertCommandToPositionAndDirectionType(command);
            expect(wordPositionAndDirection).not.toEqual(undefined);
            if (wordPositionAndDirection) {
                expect(wordPositionAndDirection[specConstants.DIRECTION_OFFSET]).toEqual(DirectionType.HORIZONTAL);
            }
        }
    });

    it('convertCommandToPositionAndDirectionType should return correct DirectionType for vertical words', () => {
        for (const command of specConstants.VALID_VERTICAL_PLACER_COMMANDS) {
            const wordPositionAndDirection: [Vec2, DirectionType] | undefined = service.convertCommandToPositionAndDirectionType(command);
            expect(wordPositionAndDirection).not.toEqual(undefined);
            if (wordPositionAndDirection) {
                expect(wordPositionAndDirection[specConstants.DIRECTION_OFFSET]).toEqual(DirectionType.VERTICAL);
            }
        }
    });

    it('convertCommandToPositionAndDirectionType should return undefined for an invalid squareName', () => {
        spyOn<any>(service, 'convertCommandToSquareNameAndDirectionType').and.returnValue(specConstants.INVALID_SQUARE_NAME);
        expect(service.convertCommandToPositionAndDirectionType(specConstants.INVALID_SQUARE_NAME)).toEqual(undefined);
    });

    it('convertCommandToPositionAndDirectionType should return undefined for an invalid vector position', () => {
        spyOn<any>(service, 'convertCommandToSquareNameAndDirectionType').and.returnValue(specConstants.INVALID_SQUARE_NAME);
        spyOn<any>(service, 'convertSquareNameAndDirectionTypeToSquareName').and.returnValue(specConstants.INVALID_SQUARE_NAME);
        gridServiceStub.convertSquareNameToPosition.and.returnValue(undefined);
        expect(service.convertCommandToPositionAndDirectionType(specConstants.INVALID_SQUARE_NAME)).toEqual(undefined);
    });

    it('convertCommandToPositionAndDirectionType should return vectorPosition and NONE as direction type for an invalid direction type', () => {
        spyOn<any>(service, 'convertCommandToSquareNameAndDirectionType').and.returnValue(specConstants.INVALID_SQUARE_NAME);
        spyOn<any>(service, 'convertSquareNameAndDirectionTypeToSquareName').and.returnValue(specConstants.INVALID_SQUARE_NAME);
        gridServiceStub.convertSquareNameToPosition.and.returnValue(specConstants.VALID_POSITION);
        expect(service.convertCommandToPositionAndDirectionType(specConstants.INVALID_SQUARE_NAME)).toEqual([
            specConstants.VALID_POSITION,
            DirectionType.NONE,
        ]);
    });

    it('convertCommandToPositionAndDirectionType should return undefined for an invalid direction type but valid vector position', () => {
        spyOn<any>(service, 'convertCommandToSquareNameAndDirectionType').and.returnValue(specConstants.INVALID_SQUARE_NAME);
        spyOn<any>(service, 'convertSquareNameAndDirectionTypeToSquareName').and.returnValue(specConstants.INVALID_SQUARE_NAME);
        gridServiceStub.convertSquareNameToPosition.and.returnValue(specConstants.VALID_POSITION);
        spyOn<any>(service, 'isDirectionType').and.returnValue(true);
        gridServiceStub.convertSquareNameToPosition.and.returnValue(specConstants.VALID_POSITION);
        spyOn<any>(service, 'chooseDirectionType').and.returnValue(undefined);
        expect(service.convertCommandToPositionAndDirectionType(specConstants.INVALID_SQUARE_NAME)).toEqual(undefined);
    });

    it('convertCommandToPositionAndDirectionType should return undefined for an invalid vector position but valid direction type', () => {
        spyOn<any>(service, 'convertCommandToSquareNameAndDirectionType').and.returnValue(specConstants.INVALID_SQUARE_NAME);
        spyOn<any>(service, 'convertSquareNameAndDirectionTypeToSquareName').and.returnValue(specConstants.INVALID_SQUARE_NAME);
        gridServiceStub.convertSquareNameToPosition.and.returnValue(specConstants.VALID_POSITION);
        spyOn<any>(service, 'isDirectionType').and.returnValue(true);
        gridServiceStub.convertSquareNameToPosition.and.returnValue(undefined);
        spyOn<any>(service, 'chooseDirectionType').and.returnValue(DirectionType.HORIZONTAL);
        expect(service.convertCommandToPositionAndDirectionType(specConstants.INVALID_SQUARE_NAME)).toEqual(undefined);
    });

    it('isFirstTurnValidation should always return false if it is the first move and no commands place first letters touching H8', () => {
        gridServiceStub.isGridEmpty.and.returnValue(true);
        for (const command of specConstants.VALID_PLACER_COMMANDS.concat(specConstants.INVALID_PLACER_COMMANDS_STARTING_POSITIONS)) {
            expect(service['isFirstTurnValidation'](command)).toEqual(false);
        }
    });

    it('isFirstTurnValidation should always return true if it is the first move and for commands placing first letters touching H8', () => {
        gridServiceStub.isGridEmpty.and.stub().and.returnValue(true);
        for (const command of specConstants.VALID_PLACER_COMMANDS_STARTING_POSITIONS) {
            expect(service['isFirstTurnValidation'](command)).toEqual(true);
        }
    });

    it('isFirstTurnValidation should always be called if it is first move and command is place', () => {
        spyOn<any>(service, 'isPlayerHaveEachLetters').and.returnValue(true);
        const playerTiles: Tile[] = [new Tile({ x: 0, y: 0 } as Vec2, 'A', 1)];
        const player: Player = { tiles: playerTiles } as Player;
        player.isTurn = true;
        gridServiceStub.isGridEmpty.and.stub().and.returnValue(true);
        const isFirstTurnValidationSpy = spyOn<any>(service, 'isFirstTurnValidation').and.callThrough();
        for (const command of specConstants.VALID_PLACER_COMMANDS_STARTING_POSITIONS) {
            service.validateCommand(player, command);
            expect(isFirstTurnValidationSpy).toHaveBeenCalledWith(command);
        }
    });

    it('isFirstTurnValidation should return false if boardPositionAndPlacingLetters is undefined', () => {
        gridServiceStub.isGridEmpty.and.stub().and.returnValue(false);
        spyOn(service, 'splitPositionAndPlacingLetters').and.returnValue(undefined);
        expect(service['isFirstTurnValidation']('')).toBeFalsy();
    });

    it('isValidRegExpMatchArray should return false if matchArray given is null', () => {
        expect(service['isValidRegExpMatchArray'](null)).toBeFalsy();
    });

    it('isValidRegExpMatchArray should return false if matchArray given has not a length of 1', () => {
        expect(service['isValidRegExpMatchArray'](specConstants.MATCH_ARRAY_WITH_CONTENT_STUB)).toBeFalsy();
        expect(service['isValidRegExpMatchArray'](specConstants.MATCH_ARRAY_WITHOUT_CONTENT_STUB)).toBeFalsy();
    });

    it('isValidRegExpMatchArray should return false if matchArray content is superior than 4 varchars', () => {
        expect(service['isValidRegExpMatchArray'](specConstants.MATCH_ARRAY_WITH_SUPERIOR_CONTENT_LENGTH_STUB)).toBeFalsy();
    });

    it('isValidRegExpMatchArray should return true for valid matchArrays', () => {
        for (const matchArray of specConstants.VALID_MATCH_ARRAYS) {
            expect(service['isValidRegExpMatchArray'](matchArray)).toBeTruthy();
        }
    });

    it('removePlayerLetters should call findPlayerTileToRemoveWithTileName', () => {
        const findPlayerTileToRemoveWithTileNameSpy = spyOn<any>(service, 'findPlayerTileToRemoveWithTileName').and.stub();
        const tileName = 'a';
        const playerTiles: Tile[] = [new Tile({ x: 0, y: 0 } as Vec2, tileName, 1)];
        const player: Player = { tiles: playerTiles } as Player;
        service['removePlayerLetters'](player, tileName);
        expect(findPlayerTileToRemoveWithTileNameSpy).toHaveBeenCalledTimes(1);
    });

    it('removePlayerLetters should remove non-white tiles of the player', () => {
        const lettersToRemove = 'bcdefg';
        const letterLeft = 'a';
        for (let i = 0; i < specConstants.PLAYER_STUB_LETTERS.length; ++i) {
            specConstants.PLAYER_STUB.tiles[i].name = specConstants.PLAYER_STUB_LETTERS[i];
        }
        service['removePlayerLetters'](specConstants.PLAYER_STUB, lettersToRemove);
        expect(specConstants.PLAYER_STUB.tiles.length).toEqual(1);
        expect(specConstants.PLAYER_STUB.tiles[0].name).toEqual(letterLeft);
    });

    it('removePlayerLetters should remove white tiles of the player', () => {
        const playerRemovalStubTiles: Tile[] = [new Tile(), new Tile(), new Tile(), new Tile(), new Tile()];
        const playerLetters = '**jus';
        for (let i = 0; i < playerLetters.length; ++i) {
            playerRemovalStubTiles[i].name = playerLetters[i];
        }
        const playerStubToRemove: Player = { tiles: playerRemovalStubTiles } as Player;
        const lettersToRemove = 'jOuE';
        const letterLeft = 's';
        service['removePlayerLetters'](playerStubToRemove, lettersToRemove);
        expect(playerStubToRemove.tiles.length).toEqual(letterLeft.length);
        expect(playerStubToRemove.tiles[0].name).toEqual(letterLeft);
    });

    it('findPlayerTileToRemoveWithTileName should return the tile if player has a tile with the name in question', () => {
        const playerRemovalStubTiles: Tile[] = [new Tile(), new Tile(), new Tile(), new Tile(), new Tile()];
        const playerLetters = '**jus';
        for (let i = 0; i < playerLetters.length; ++i) {
            playerRemovalStubTiles[i].name = playerLetters[i];
        }
        const playerStubToRemove: Player = { tiles: playerRemovalStubTiles } as Player;
        const playerTileToRemove: Tile | undefined = service['findPlayerTileToRemoveWithTileName'](
            playerStubToRemove,
            playerStubToRemove.tiles[0].name,
        );
        expect(playerTileToRemove).not.toBeUndefined();
        expect(playerTileToRemove).toEqual(playerStubToRemove.tiles[0]);
    });

    it('findPlayerTileToRemoveWithTileName should return white tile if player an upper letter is passed', () => {
        specConstants.PLAYER_STUB.tiles[0].name = serviceConstants.WHITE_LETTER;
        const randomUpperLetter = 'A';
        const playerTileToRemove: Tile | undefined = service['findPlayerTileToRemoveWithTileName'](specConstants.PLAYER_STUB, randomUpperLetter);
        expect(playerTileToRemove).not.toBeUndefined();
        expect(playerTileToRemove).toEqual(specConstants.PLAYER_STUB.tiles[0]);
    });

    it('isUpperCase return true for uppercase input', () => {
        const upperInput = 'TEST';
        expect(service['isUpperCase'](upperInput)).toBeTruthy();
    });

    it('isUpperCase return false for non-uppercase input', () => {
        const nonUppercaseInput = 'teST';
        expect(service['isUpperCase'](nonUppercaseInput)).toBeFalsy();
    });

    it('hasEnoughLetters should call hasEnoughUpperLetters and hasEnoughLowerLetters notwithstanding valid or invalid placing commands', () => {
        const hasEnoughUpperLettersSpy = spyOn<any>(service, 'hasEnoughUpperLetters').and.returnValue(false);
        const hasEnoughLowerLettersSpy = spyOn<any>(service, 'hasEnoughLowerLetters').and.returnValue(true);
        const playerLetters = '**nnnne';
        const validLettersToPlace = 'BOnnnne';
        const invalidLettersToPlace = 'BOeeeen';
        const expectedSpyCalls = 2;
        for (let i = 0; i < playerLetters.length; ++i) {
            specConstants.PLAYER_STUB.tiles[i].name = playerLetters[i];
        }
        service['hasEnoughLetters'](specConstants.PLAYER_STUB, validLettersToPlace);
        expect(hasEnoughLowerLettersSpy).toHaveBeenCalledWith(specConstants.PLAYER_STUB, validLettersToPlace);
        expect(hasEnoughUpperLettersSpy).toHaveBeenCalledWith(specConstants.PLAYER_STUB, validLettersToPlace);
        service['hasEnoughLetters'](specConstants.PLAYER_STUB, invalidLettersToPlace);
        expect(hasEnoughUpperLettersSpy).toHaveBeenCalledWith(specConstants.PLAYER_STUB, invalidLettersToPlace);
        expect(hasEnoughLowerLettersSpy).toHaveBeenCalledWith(specConstants.PLAYER_STUB, invalidLettersToPlace);
        expect(hasEnoughLowerLettersSpy).toHaveBeenCalledTimes(expectedSpyCalls);
        expect(hasEnoughUpperLettersSpy).toHaveBeenCalledTimes(expectedSpyCalls);
    });

    it('hasEnoughLetters should return false if player is in possession of letters', () => {
        for (let i = 0; i < specConstants.ENOUGH_PLAYER_LETTERS.length; ++i) {
            specConstants.PLAYER_STUB.tiles[i].name = specConstants.ENOUGH_PLAYER_LETTERS[i];
        }
        expect(service['hasEnoughLetters'](specConstants.PLAYER_STUB, specConstants.BONJOUR_WORD)).toBeFalse();
    });

    it('hasEnoughUpperLetters should return true if player has enough upper letters', () => {
        for (let i = 0; i < specConstants.ENOUGH_PLAYER_LETTERS.length; ++i) {
            specConstants.PLAYER_STUB.tiles[i].name = specConstants.ENOUGH_PLAYER_LETTERS[i];
        }
        expect(service['hasEnoughUpperLetters'](specConstants.PLAYER_STUB, specConstants.ENOUGH_LETTERS_TO_PLACE)).toBeTruthy();
    });

    it('hasEnoughUpperLetters should return false if player has not enough upper letters', () => {
        for (let i = 0; i < specConstants.ENOUGH_PLAYER_LETTERS.length; ++i) {
            specConstants.PLAYER_STUB.tiles[i].name = specConstants.ENOUGH_PLAYER_LETTERS[i];
        }
        expect(service['hasEnoughUpperLetters'](specConstants.PLAYER_STUB, specConstants.BONJOUR_WORD)).toBeFalsy();
    });

    it('hasEnoughLowerLetters should return false if player has not enough lower letters', () => {
        for (let i = 0; i < specConstants.ENOUGH_PLAYER_LETTERS.length; ++i) {
            specConstants.PLAYER_STUB.tiles[i].name = specConstants.ENOUGH_PLAYER_LETTERS[i];
        }
        expect(service['hasEnoughLowerLetters'](specConstants.PLAYER_STUB, specConstants.ENOUGH_LETTERS_TO_PLACE)).toBeFalse();
    });

    it('hasEnoughLowerLetters should return false if player has only upper letters', () => {
        const lettersToPlace = 'OR';
        for (let i = 0; i < specConstants.ENOUGH_PLAYER_LETTERS.length; ++i) {
            specConstants.PLAYER_STUB.tiles[i].name = specConstants.ENOUGH_PLAYER_LETTERS[i];
        }
        expect(service['hasEnoughLowerLetters'](specConstants.PLAYER_STUB, lettersToPlace)).toBeFalsy();
    });

    it('hasEnoughLowerLetters should return false if player has not enough lower letters', () => {
        const lettersToPlace = 'bonjjur';
        for (let i = 0; i < specConstants.ENOUGH_PLAYER_LETTERS.length; ++i) {
            specConstants.PLAYER_STUB.tiles[i].name = specConstants.ENOUGH_PLAYER_LETTERS[i];
        }
        expect(service['hasEnoughLowerLetters'](specConstants.PLAYER_STUB, lettersToPlace)).toBeFalsy();
    });

    it('isValidCommandSyntax calls parseCommandType, isRegexDefined, isValidMaxWhiteLetters, and isValidLoneLetterPlacing /w good placer cmd', () => {
        const parseCommandTypeSpy = spyOn<any>(service, 'parseCommandType').and.returnValue(CommandType.PLACE);
        const isRegexDefinedSpy = spyOn<any>(service, 'isRegexDefined').and.returnValue(true);
        const isValidMaxWhiteLettersSpy = spyOn<any>(service, 'isValidMaxWhiteLetters').and.returnValue(true);
        const isValidLoneLetterPlacingSpy = spyOn<any>(service, 'isValidLoneLetterPlacing').and.returnValue(true);
        service['isValidCommandSyntax'](specConstants.VALID_PLACER_COMMANDS[0]);
        expect(parseCommandTypeSpy).toHaveBeenCalled();
        expect(isRegexDefinedSpy).toHaveBeenCalled();
        expect(isValidMaxWhiteLettersSpy).toHaveBeenCalled();
        expect(isValidLoneLetterPlacingSpy).toHaveBeenCalled();
    });

    it('isValidCommandSyntax calls parseCommandType, and isRegexDefined /w good exchange cmd', () => {
        const parseCommandTypeSpy = spyOn<any>(service, 'parseCommandType').and.returnValue(CommandType.EXCHANGE);
        const isRegexDefinedSpy = spyOn<any>(service, 'isRegexDefined').and.returnValue(true);
        service['isValidCommandSyntax'](specConstants.VALID_EXCHANGE_COMMANDS[0]);
        expect(parseCommandTypeSpy).toHaveBeenCalled();
        expect(isRegexDefinedSpy).toHaveBeenCalled();
    });

    it('isValidCommandSyntax should accept valid placer commands and return true', () => {
        for (const command of specConstants.VALID_PLACER_COMMANDS) {
            expect(service['isValidCommandSyntax'](command)).toBeTruthy();
        }
    });

    it('isValidCommandSyntax should not accept invalid placer commands and return false', () => {
        for (const command of specConstants.INVALID_PLACER_COMMANDS.concat(specConstants.INVALID_PLACER_COMMANDS_NOT_REGEX_DEFINED)) {
            expect(service['isValidCommandSyntax'](command)).toBeFalsy();
        }
    });

    it('isValidCommandSyntax should accept valid exchange commands and return true', () => {
        for (const command of specConstants.VALID_EXCHANGE_COMMANDS) {
            expect(service['isValidCommandSyntax'](command)).toBeTruthy();
        }
    });

    it('isValidCommandSyntax should not accept invalid exchange commands and return false', () => {
        for (const command of specConstants.INVALID_EXCHANGE_COMMANDS) {
            expect(service['isValidCommandSyntax'](command)).toBeFalsy();
        }
    });

    it('isRegexDefined should return true for valid chat placer commands', () => {
        for (const command of specConstants.VALID_PLACER_COMMANDS) {
            expect(service['isRegexDefined'](command, specConstants.PLACER_COMMAND_REGEX)).toBeTruthy();
        }
    });

    it('isRegexDefined should return false for invalid chat placer commands', () => {
        for (const command of specConstants.INVALID_PLACER_COMMANDS_NOT_REGEX_DEFINED) {
            expect(service['isRegexDefined'](command, specConstants.PLACER_COMMAND_REGEX)).toBeFalsy();
        }
    });

    it('isRegexDefined should return true for valid chat exchange commands', () => {
        for (const command of specConstants.VALID_EXCHANGE_COMMANDS) {
            expect(service['isRegexDefined'](command, serviceConstants.EXCHANGE_COMMAND_REGEX)).toBeTruthy();
        }
    });

    it('isRegexDefined should return false for invalid chat exchange commands', () => {
        for (const command of specConstants.INVALID_EXCHANGE_COMMANDS) {
            expect(service['isRegexDefined'](command, serviceConstants.EXCHANGE_COMMAND_REGEX)).toBeFalsy();
        }
    });

    it('isValidMaxWhiteLetters should return true for valid chat placer commands containing less than 2 white letters', () => {
        for (const command of specConstants.VALID_PLACER_COMMANDS) {
            expect(service['isValidMaxWhiteLetters'](command)).toBeTruthy();
        }
    });

    it('isValidMaxWhiteLetters should return false for invalid chat placer commands containing more than 2 white letters', () => {
        for (const command of specConstants.INVALID_PLACER_COMMANDS_NOT_MAX_WHITE_LETTERS_VALID) {
            expect(service['isValidMaxWhiteLetters'](command)).toBeFalsy();
        }
    });

    it('isValidLoneLetterPlacing should call isBoardPositionOriented notwithstanding valid or invalid chat placer commands', () => {
        const validAndInvalidCommands: string[] = specConstants.VALID_PLACER_COMMANDS.concat(
            specConstants.INVALID_PLACER_COMMANDS_NOT_LONE_LETTERS_PLACING_VALID,
        );
        const isValidLoneLetterPlacingSpy = spyOn<any>(service, 'isValidLoneLetterPlacing').and.stub();
        for (const command of validAndInvalidCommands) {
            service['isValidLoneLetterPlacing'](command);
        }
        expect(isValidLoneLetterPlacingSpy).toHaveBeenCalledTimes(validAndInvalidCommands.length);
    });

    it('isValidLoneLetterPlacing should return true for valid chat placer commands', () => {
        for (const command of specConstants.VALID_PLACER_COMMANDS) {
            expect(service['isValidLoneLetterPlacing'](command)).toBeTruthy();
        }
    });

    it('isValidLoneLetterPlacing should return false for invalid chat placer commands', () => {
        for (const command of specConstants.INVALID_PLACER_COMMANDS_NOT_LONE_LETTERS_PLACING_VALID) {
            expect(service['isValidLoneLetterPlacing'](command)).toBeFalsy();
        }
    });

    it('isValidLoneLetterPlacing should return false for commands not containing spaces', () => {
        expect(service['isValidLoneLetterPlacing'](specConstants.INVALID_COMMAND_WITH_NO_SPACES)).toBeFalsy();
    });

    it('splitPositionAndPlacingLetters should return undefined for command not containing spacing separators', () => {
        expect(service['splitPositionAndPlacingLetters'](specConstants.INVALID_COMMAND_WITH_NO_SPACES)).toEqual(undefined);
    });

    it('splitPositionAndPlacingLetters should return correct position and placing letters for a valid command', () => {
        const command = '!placer d11h BOnjour';
        const expectedPosition = 'd11h';
        const expectedPositionIndex = 0;
        const expectedPlacingLetters = 'BOnjour';
        const expectedPlacingLettersIndex = 1;
        const positionAndPlacingLetters = service['splitPositionAndPlacingLetters'](command);
        expect(positionAndPlacingLetters).not.toEqual(undefined);
        if (positionAndPlacingLetters) {
            expect(positionAndPlacingLetters[expectedPositionIndex]).toEqual(expectedPosition);
            expect(positionAndPlacingLetters[expectedPlacingLettersIndex]).toEqual(expectedPlacingLetters);
        }
    });

    it('splitPositionAndPlacingLetters should return no position but placing letters in case of exchange', () => {
        const exchangeCommand = '!échanger **';
        const exchangeCommandLetters = '**';
        expect(service.splitPositionAndPlacingLetters(exchangeCommand)).toEqual(['', exchangeCommandLetters]);
    });

    it('isValidBoardPositionAndPlacingLetters should call isValidBoardPositionAndPlacingLetters', () => {
        const command = '!placer d11h BOnjour';
        const isValidBoardPositionAndPlacingLettersSpy = spyOn<any>(service, 'isValidBoardPositionAndPlacingLetters').and.stub();
        service['splitPositionAndPlacingLetters'](command);
        expect(isValidBoardPositionAndPlacingLettersSpy).toHaveBeenCalled();
    });

    it('isValidBoardPositionAndPlacingLetters should return true if boardPositionAndPlacingLettersLength has the right amount of spaces', () => {
        expect(service['isValidBoardPositionAndPlacingLetters'](serviceConstants.MAX_N_SEPARATORS)).toBeTruthy();
    });

    it('isValidBoardPositionAndPlacingLetters should return false if boardPositionAndPlacingLettersLength has not the right amount of spaces', () => {
        expect(service['isValidBoardPositionAndPlacingLetters'](0)).toBeFalsy();
    });

    it('parseCommandType should call isCommand, splitMessageCommand for valid placer and exchange commands', () => {
        const isCommandSpy = spyOn<any>(service, 'isCommand').and.returnValue(true);
        const splitMessageCommandSpy = spyOn<any>(service, 'splitMessageCommand').and.stub();
        const validAndInvalidCommands: string[] = specConstants.VALID_PLACER_COMMANDS.concat(specConstants.VALID_EXCHANGE_COMMANDS);
        for (const command of validAndInvalidCommands) {
            service['parseCommandType'](command);
        }
        const expectedIsCommandSpyCalls = validAndInvalidCommands.length;
        const expectedSplitMessageCommandSpy = expectedIsCommandSpyCalls * specConstants.NUMBER_OF_SPLIT_MESSAGE_CALLS;
        expect(isCommandSpy).toHaveBeenCalledTimes(expectedIsCommandSpyCalls);
        expect(splitMessageCommandSpy).toHaveBeenCalledTimes(expectedSplitMessageCommandSpy);
    });

    it('parseCommandType should return "CommandType.NOTIMPLEMENTED" for invalid starting commands', () => {
        for (const command of specConstants.INVALID_STARTING_COMMANDS) {
            expect(service['parseCommandType'](command)).toEqual(CommandType.NOT_IMPLEMENTED);
        }
    });

    it('splitMessageCommand should return false for invalid command length', () => {
        const invalidExchangeCommand = '!échange';
        const invalidPlacingCommand = '!place';
        expect(service['splitMessageCommand'](invalidExchangeCommand, CommandType.EXCHANGE)).toBeFalsy();
        expect(service['splitMessageCommand'](invalidPlacingCommand, CommandType.EXCHANGE)).toBeFalsy();
    });

    it('isCommand should return true for valid commands starting with "!"', () => {
        for (const command of specConstants.VALID_PLACER_COMMANDS.concat(specConstants.VALID_EXCHANGE_COMMANDS)) {
            expect(service['isCommand'](command)).toBeTruthy();
        }
    });

    it('isCommand should return false for commands not starting with "!"', () => {
        for (const command of specConstants.INVALID_STARTING_COMMANDS) {
            expect(service['isCommand'](command)).toBeFalsy();
        }
    });

    it("isValidSkipCommand should return true with valid command '!passer'", () => {
        expect(service['isValidSkipCommand'](serviceConstants.VALID_SKIP_COMMAND)).toBeTruthy();
    });

    it('isValidSkipCommand should return false with invalid command skip', () => {
        for (const command of specConstants.INVALID_SKIP_COMMANDS) {
            expect(service['isValidSkipCommand'](command)).toBeFalsy();
        }
    });
});

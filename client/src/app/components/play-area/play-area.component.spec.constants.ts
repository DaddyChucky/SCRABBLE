import { DirectionType } from '@app/../../../common/model/direction-type';
import { Player } from '@app/../../../common/model/player';
import { Quest } from '@app/../../../common/model/quest';
import { Tile } from '@app/../../../common/model/tile';
import { Vec2 } from '@app/../../../common/model/vec2';
import { CommandType } from '@app/classes/command-type';
import { PlaceCommand } from '@app/classes/place-command';

export const POSITION: Vec2 = { x: 0, y: 0 } as Vec2;
export const TILES: Tile[] = [
    new Tile(POSITION, 'A', 1),
    new Tile(POSITION, 'B', 1),
    new Tile(POSITION, 'C', 1),
    new Tile(POSITION, 'D', 1),
    new Tile(POSITION, 'E', 1),
    new Tile(POSITION, 'F', 1),
    new Tile(POSITION, 'G', 1),
];

export const PLAYER: Player = {
    name: 'Johhny Le Terrible',
    playerId: '',
    score: 1110,
    tiles: TILES,
    host: true,
    isTurn: true,
    sideQuest: {} as Quest,
};
export const ESCAPE_BUTTON = 'Escape';
export const ENTER_BUTTON = 'Enter';
export const BACKSPACE_BUTTON = 'Backspace';
export const PLACE_COMMAND: PlaceCommand = {
    name: CommandType.PLACE,
    startPosition: { x: 0, y: 0 } as Vec2,
    direction: DirectionType.HORIZONTAL,
    letters: 'coucou',
} as PlaceCommand;
export const GRID_POSITION: Vec2 = { x: 0, y: 0 } as Vec2;
export const SQUARE_NAME = 'a1';
export const DEFAULT_INDEX = 0;
export const FONT_SIZE = 30;
export const SELECTED_TILE = new Tile(undefined, 'a');
export const TILE_TO_SWAP = new Tile(undefined, 'b');
export const INDEX_OF_SELECTED_TILE = 5;
export const INDEX_OF_SWAP = 0;
export const LETTER_PRESSED = 'a';
export const BLANK_TILE = '*';
export const ARROW_BUTTON = 'ArrowLeft';
export const KEY_A = 'a';
export const CLICK_POSITION: Vec2 = { x: 70, y: 70 } as Vec2;

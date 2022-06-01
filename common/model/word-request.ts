import { DirectionType } from './direction-type';
import { Tile } from './tile';
import { Vec2 } from './vec2';

export interface WordRequest {
    lobbyId: string;
    socketId: string;
    word: string;
    startPosition: Vec2;
    direction: DirectionType;
    tiles: Tile[];
}

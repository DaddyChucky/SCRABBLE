import { DirectionType } from './direction-type';
import { ScrabbleGrid } from './scrabble-grid';
import { Vec2 } from './vec2';

export interface ParsedInfo {
    lobbyId: string;
    scrabbleGrid: ScrabbleGrid;
    lettersCommand: string;
    completeWord?: string;
    position: Vec2;
    direction: DirectionType;
}

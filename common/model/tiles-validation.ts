import { Tile } from './tile';

export interface TilesValidation {
    tilesOnGrid: Tile[];
    newTilesToAdd: Tile[];
    tilesCompleteWord: Tile[];
    adjacentWords: string[];
    adjacentTiles: Tile[][];
}

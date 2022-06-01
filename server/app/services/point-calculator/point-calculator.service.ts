import { ScrabbleGridService } from '@app/services/scrabble-grid/scrabble-grid.service';
import { WordValidatorService } from '@app/services/word-validator/word-validator.service';
import { MAX_TILES_PER_PLAYER } from '@common/model/constants';
import { DirectionType } from '@common/model/direction-type';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Tile } from '@common/model/tile';
import { TilesValidation } from '@common/model/tiles-validation';
import { Service } from 'typedi';
import * as serviceConstants from './point-calculator.service.constants';

@Service()
export class PointCalculatorService {
    private points: number;
    private readonly wordValidator: WordValidatorService;
    private formedWord: string;
    private formedWordPoints: number;
    private grid: ScrabbleGrid;
    private completeTiles: Tile[];
    private incompleteTiles: Tile[];
    private wordMultiplier: number;
    private direction: DirectionType;
    private tilesValidation: TilesValidation;
    private scrabbleGridService: ScrabbleGridService;

    get newPoints(): number {
        return this.points;
    }

    constructor(inputGrid: ScrabbleGrid, tiles: Tile[], wordValidatorService: WordValidatorService, scrabbleGridService: ScrabbleGridService) {
        this.grid = { elements: [] } as ScrabbleGrid;
        this.resetGrid();
        this.grid = inputGrid;
        this.completeTiles = tiles;
        this.wordValidator = wordValidatorService;
        this.scrabbleGridService = scrabbleGridService;
    }

    update(newGrid: ScrabbleGrid, tiles: TilesValidation, direction?: DirectionType): void {
        if (!direction) this.setDirection();
        else this.direction = direction;
        this.resetGrid();
        this.grid = newGrid;
        this.completeTiles = tiles.tilesCompleteWord;
        this.incompleteTiles = tiles.newTilesToAdd;
        this.tilesValidation = tiles;
    }

    checkAllWordsFormed(): void {
        if (this.direction === DirectionType.NONE) return;
        this.checkBoniPoints();
        this.newFormedWord();

        if (!this.wordValidator.isValid(this.formedWord)) {
            this.resetPoints();
            return;
        }
        this.points += this.formedWordPoints * this.wordMultiplier;
        this.calculateNewPoints(this.tilesValidation.adjacentWords, this.calculateAdjacentWordWeights());
    }

    private calculateAdjacentWordWeights(): number[] {
        const adjacentWordWeights: number[] = [];
        let adjacentWordMultiplier = serviceConstants.NO_MULTIPLIER;
        for (let index = 0; index < this.tilesValidation.adjacentTiles.length; ++index) {
            adjacentWordWeights[index] = 0;
            for (const tile of this.tilesValidation.adjacentTiles[index]) {
                adjacentWordWeights[index] += tile.weight;
                if (!this.isAdjacentTileANewTile(tile)) continue;
                adjacentWordWeights[index] += (this.grid.elements[tile.position.y][tile.position.x].letterMultiplier - 1) * tile.weight;
                adjacentWordMultiplier = this.grid.elements[tile.position.y][tile.position.x].wordMultiplier;
            }
        }
        if (adjacentWordMultiplier !== serviceConstants.NO_MULTIPLIER) adjacentWordWeights.forEach((weight) => weight * adjacentWordMultiplier);
        return adjacentWordWeights;
    }

    private isAdjacentTileANewTile(tile: Tile): boolean {
        return this.tilesValidation.newTilesToAdd.find(
            (tileAdded) => tileAdded.name === tile.name && tileAdded.position.x === tile.position.x && tileAdded.position.y === tile.position.y,
        )
            ? true
            : false;
    }

    private resetGrid(): void {
        this.resetPoints();
        this.formedWordPoints = serviceConstants.INITIAL_POINTS;
        this.formedWord = '';
        this.wordMultiplier = serviceConstants.DEFAULT_MULTIPLIER;
    }

    private resetPoints(): void {
        this.points = serviceConstants.INITIAL_POINTS;
    }

    private newFormedWord(): void {
        for (const tile of this.completeTiles) {
            this.formedWord += tile.name;
            const newTilePoints: Tile | undefined = this.incompleteTiles.find(
                (position) => position.position.x === tile.position.x && position.position.y === tile.position.y,
            );
            this.formedWordPoints += newTilePoints ? newTilePoints.weight : tile.weight;
        }
        this.resetTilesWeight();
    }

    private resetTilesWeight(): void {
        for (const tile of this.completeTiles)
            if (this.scrabbleGridService.isValidGridPosition(tile.position) && this.grid.elements[tile.position.y][tile.position.x])
                tile.weight /= this.grid.elements[tile.position.y][tile.position.x].letterMultiplier;
    }

    private calculateNewPoints(otherWords: string[], otherPoints: number[]): void {
        for (let index = 0; index < otherWords.length; index++) {
            if (otherWords[index].length <= serviceConstants.DEFAULT_LENGTH) continue;
            if (this.wordValidator.isValid(otherWords[index])) this.points += otherPoints[index];
            else {
                this.resetPoints();
                break;
            }
        }
    }

    private isSevenLetters(): boolean {
        return this.incompleteTiles.length === MAX_TILES_PER_PLAYER;
    }

    private calculateBonusTiles(): void {
        for (const tile of this.incompleteTiles) {
            if (!this.scrabbleGridService.isValidGridPosition(tile.position)) continue;
            tile.weight *= this.grid.elements[tile.position.y][tile.position.x].letterMultiplier;
            this.wordMultiplier *= this.grid.elements[tile.position.y][tile.position.x].wordMultiplier;
        }
    }

    private checkBoniPoints(): void {
        if (this.isSevenLetters()) this.points += serviceConstants.BONI_POINTS;
        this.calculateBonusTiles();
    }

    private isHorizontalPosition(): boolean {
        return this.completeTiles.every((position) => position.position.x === this.completeTiles[0].position.x);
    }

    private isVerticalPosition(): boolean {
        return this.completeTiles.every((position) => position.position.y === this.completeTiles[0].position.y);
    }

    private setDirection(): void {
        if (this.isHorizontalPosition()) this.direction = DirectionType.HORIZONTAL;
        else if (this.isVerticalPosition()) this.direction = DirectionType.VERTICAL;
    }
}

import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';
import { GRID_SQUARES_PER_LINE } from '@common/model/constants';
import { DirectionType } from '@common/model/direction-type';
import { GridDirection } from '@common/model/grid-direction';
import { ParsedInfo } from '@common/model/parsed-info';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Square } from '@common/model/square';
import { Tile } from '@common/model/tile';
import { TilesValidation } from '@common/model/tiles-validation';
import { Vec2 } from '@common/model/vec2';
import { WordValidation } from '@common/model/word-validation';
import { Service } from 'typedi';
import * as serviceConstants from './scrabble-grid.service.constants';

@Service()
export class ScrabbleGridService {
    scrabbleGrid: ScrabbleGrid = { elements: [] } as ScrabbleGrid;

    createWordValidation(parsedInfo: ParsedInfo): WordValidation {
        this.scrabbleGrid = parsedInfo.scrabbleGrid;
        this.addCompleteWord(parsedInfo);
        return {
            tiles: this.convertTilesAndFindPosition(parsedInfo),
            parsedInfo,
        } as WordValidation;
    }

    convertTilesToWord(tiles: Tile[]): string {
        let word = '';
        tiles.forEach((tile) => (word += tile.name));
        return word;
    }

    isValidGridPosition(position: Vec2): boolean {
        return this.isValidAxisPosition(position.x) && this.isValidAxisPosition(position.y);
    }

    private convertTilesAndFindPosition(parsedInfo: ParsedInfo): TilesValidation {
        const tilesValidation: TilesValidation = {
            tilesCompleteWord: [],
            tilesOnGrid: [],
            newTilesToAdd: [],
            adjacentWords: [],
            adjacentTiles: [],
        } as TilesValidation;
        tilesValidation.tilesOnGrid = this.findTilePositionBeforeWord(parsedInfo);

        if (this.hasNoDirection(parsedInfo.direction)) this.findTilesAfterNoDirection(parsedInfo, tilesValidation);
        else this.checkSideAfterPosition(parsedInfo.position, parsedInfo.direction, parsedInfo.lettersCommand, tilesValidation);

        this.findAdjacentWords(tilesValidation, parsedInfo.direction);
        if (tilesValidation.adjacentWords !== [])
            for (let index = 0; index < tilesValidation.adjacentWords.length; ++index)
                for (const word of tilesValidation.adjacentWords) tilesValidation.adjacentTiles[index] = this.convertStringWordToTiles(word);

        return tilesValidation;
    }

    private addCompleteWord(parsedInfo: ParsedInfo): void {
        const position: Vec2 = parsedInfo.position;
        let completeWord: string;

        if (this.hasNoDirection(parsedInfo.direction)) {
            completeWord = this.checkBothSideNoDirection(parsedInfo);
        } else {
            const lettersToAddBefore: string = this.checkSideBeforePosition(position, parsedInfo.direction);
            const letterTiles: string = this.checkSideAfterPosition(position, parsedInfo.direction, parsedInfo.lettersCommand);
            completeWord = lettersToAddBefore + letterTiles;
        }

        if (completeWord) parsedInfo.completeWord = completeWord;
    }

    private convertStringWordToTiles(word: string): Tile[] {
        const letterBagService = new LetterBagService();
        const tiles: Tile[] = [];
        for (const letter of word) {
            const tile: Tile | undefined = letterBagService.getTile(letter.toUpperCase());
            if (tile) tiles.push(tile);
        }
        return tiles;
    }

    private findAdjacentWords(tilesValidation: TilesValidation, wordDirection: DirectionType): void {
        const oppositeDirection: DirectionType = wordDirection === DirectionType.HORIZONTAL ? DirectionType.VERTICAL : DirectionType.HORIZONTAL;
        for (const tile of tilesValidation.newTilesToAdd) {
            const parsedInfo: ParsedInfo = {
                lettersCommand: tile.name,
                position: tile.position,
                direction: oppositeDirection,
            } as ParsedInfo;
            this.addCompleteWord(parsedInfo);
            if (parsedInfo.completeWord && parsedInfo.completeWord.length > 1) tilesValidation.adjacentWords.push(parsedInfo.completeWord);
        }
    }

    private findWordBeforeNoDirection(parsedInfo: ParsedInfo): string {
        let lettersBefore: string;
        const letterBeforeVertical: string = this.checkSideBeforePosition(parsedInfo.position, DirectionType.VERTICAL);
        const letterBeforeHorizontal: string = this.checkSideBeforePosition(parsedInfo.position, DirectionType.HORIZONTAL);

        if (!letterBeforeVertical && !letterBeforeHorizontal) return '';
        if (letterBeforeVertical.length >= letterBeforeHorizontal.length) {
            lettersBefore = letterBeforeVertical;
            parsedInfo.direction = DirectionType.VERTICAL;
        } else {
            lettersBefore = letterBeforeHorizontal;
            parsedInfo.direction = DirectionType.HORIZONTAL;
        }

        return lettersBefore;
    }

    private findTilePositionBeforeWord(parsedInfo: ParsedInfo): Tile[] {
        const lettersBefore: string = this.hasNoDirection(parsedInfo.direction)
            ? this.findWordBeforeNoDirection(parsedInfo)
            : this.checkSideBeforePosition(parsedInfo.position, parsedInfo.direction);

        const tilesBefore: Tile[] = [];
        if (lettersBefore === '') return tilesBefore;

        let position: Vec2 = parsedInfo.position;
        for (const letter of this.reverseOrderOfLetters(lettersBefore)) {
            position = this.nextPosition(position, parsedInfo.direction, GridDirection.BEFORE);
            if (!this.isValidGridPosition(position)) continue;
            const square: Square | undefined = this.getSquare(position);
            if (!(square && square.tile)) continue;
            if (square.tile.name === letter.toUpperCase()) tilesBefore.push(square.tile);
        }
        tilesBefore.reverse();
        return tilesBefore;
    }

    private hasNoDirection(direction: DirectionType): boolean {
        return direction === DirectionType.NONE;
    }

    private checkBothSideNoDirection(parsedInfo: ParsedInfo): string {
        const beforeWord: string[] = [];
        const afterWord: string[] = [];

        for (let i = 0; i < serviceConstants.DIRECTIONS.length; ++i) {
            beforeWord[i] = this.checkSideBeforePosition(parsedInfo.position, serviceConstants.DIRECTIONS[i]);
            afterWord[i] = this.checkSideAfterPosition(parsedInfo.position, serviceConstants.DIRECTIONS[i], parsedInfo.lettersCommand);
        }

        const verticalWord: string = beforeWord[serviceConstants.VERTICAL_INDEX] + afterWord[serviceConstants.VERTICAL_INDEX];
        const horizontalWord: string = beforeWord[serviceConstants.HORIZONTAL_INDEX] + afterWord[serviceConstants.HORIZONTAL_INDEX];
        const completeWord: string = verticalWord.length >= horizontalWord.length ? verticalWord : horizontalWord;

        return completeWord;
    }

    private findTilesAfterNoDirection(parsedInfo: ParsedInfo, tilesValidation: TilesValidation): void {
        const horizontalTiles: TilesValidation = {
            tilesCompleteWord: [],
            tilesOnGrid: [],
            newTilesToAdd: [],
            adjacentWords: [],
            adjacentTiles: [],
        } as TilesValidation;

        this.checkSideAfterPosition(parsedInfo.position, DirectionType.HORIZONTAL, parsedInfo.lettersCommand, horizontalTiles);
        this.checkSideAfterPosition(parsedInfo.position, DirectionType.VERTICAL, parsedInfo.lettersCommand, tilesValidation);

        if (tilesValidation.tilesCompleteWord.length < horizontalTiles.tilesCompleteWord.length) {
            this.swapTilesValidationValues(tilesValidation, horizontalTiles);
        }
    }

    private swapTilesValidationValues(currentTilesValidation: TilesValidation, newTilesValidation: TilesValidation): void {
        currentTilesValidation.newTilesToAdd = newTilesValidation.newTilesToAdd;
        currentTilesValidation.tilesCompleteWord = newTilesValidation.tilesCompleteWord;
        currentTilesValidation.tilesOnGrid = newTilesValidation.tilesOnGrid;
    }

    private reverseOrderOfLetters(letters: string): string {
        return letters.split(serviceConstants.SEPARATOR).reverse().join(serviceConstants.SEPARATOR);
    }

    private checkSideAfterPosition(position: Vec2, direction: DirectionType, word: string, tilesValidation?: TilesValidation): string {
        const tiles: Tile[] | undefined = this.convertStringWordToTiles(word);
        let newWord = '';
        let tilesIndex = 0;
        let wordIndex = 0;

        while (this.isValidGridPosition(position)) {
            const square: Square | undefined = this.getSquare(position);
            if (square && square.tile) {
                newWord += square.tile.name.toLowerCase();
                tiles.splice(tilesIndex, 0, square.tile);
                ++tilesIndex;
            } else if (this.isValidGridPosition(position) && wordIndex < word.length) {
                newWord += word[wordIndex];
                tiles[tilesIndex].position = position;
                if (tilesValidation) tilesValidation.newTilesToAdd.push(tiles[tilesIndex]);
                ++wordIndex;
                ++tilesIndex;
            } else {
                break;
            }
            position = this.nextPosition(position, direction, GridDirection.AFTER);
        }

        if (tilesValidation) this.addTilesToTilesValidation(tilesValidation, tiles);

        return newWord;
    }

    private addTilesToTilesValidation(tilesValidation: TilesValidation, tilesAfterAndNew: Tile[]): void {
        if (tilesValidation.tilesOnGrid) tilesValidation.tilesCompleteWord.push(...tilesValidation.tilesOnGrid);
        tilesValidation.tilesCompleteWord.push(...tilesAfterAndNew);

        for (const tile of tilesAfterAndNew) {
            if (!tilesValidation.newTilesToAdd.includes(tile)) tilesValidation.tilesOnGrid.push(tile);
        }
    }

    private checkSideBeforePosition(position: Vec2, direction: DirectionType): string {
        let lettersToAdd = '';
        while (this.isValidGridPosition(position)) {
            position = this.nextPosition(position, direction, GridDirection.BEFORE);
            const square: Square | undefined = this.getSquare(position);
            if (square && square.tile) lettersToAdd += square.tile.name.toLowerCase();
            else break;
        }

        return this.reverseOrderOfLetters(lettersToAdd);
    }

    private isValidAxisPosition(position: number): boolean {
        return 0 <= position && position < GRID_SQUARES_PER_LINE;
    }

    private getSquare(position: Vec2): Square | undefined {
        if (this.isValidGridPosition(position)) return this.scrabbleGrid.elements[position.y][position.x];
        return undefined;
    }

    private nextPosition(position: Vec2, direction: DirectionType, gridDirection: GridDirection): Vec2 {
        const nextPosition: Vec2 = { x: position.x, y: position.y } as Vec2;
        switch (direction) {
            case DirectionType.HORIZONTAL:
                nextPosition.x = this.orientationNextPosition(gridDirection, position.x);
                break;
            case DirectionType.VERTICAL:
                nextPosition.y = this.orientationNextPosition(gridDirection, position.y);
                break;
        }
        return nextPosition;
    }

    private orientationNextPosition(gridDirection: GridDirection, position: number): number {
        switch (gridDirection) {
            case GridDirection.BEFORE:
                return position - 1;
            case GridDirection.AFTER:
                return position + 1;
        }
    }
}

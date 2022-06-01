/* eslint-disable max-lines */
import { Injectable } from '@angular/core';
import { ColorName } from '@app/../../../common/model/color-name';
import {
    ASCII_LETTER_START_MAJ,
    GRID_DEFAULT_HEIGHT,
    GRID_DEFAULT_WIDTH,
    GRID_LETTERX2_MULTIPLIER,
    GRID_LETTERX3_MULTIPLIER,
    GRID_SQUARES_PER_LINE,
    GRID_WORDX2_MULTIPLIER,
    GRID_WORDX3_MULTIPLIER,
    LETTERX2_POSITIONS,
    LETTERX3_POSITIONS,
    TILE_DEFAULT_HEIGHT,
    TILE_DEFAULT_WIDTH,
    WORDX3_POSITIONS,
} from '@app/../../../common/model/constants';
import { DirectionType } from '@app/../../../common/model/direction-type';
import { GridDirection } from '@app/../../../common/model/grid-direction';
import { ScrabbleGrid } from '@app/../../../common/model/scrabble-grid';
import { Square } from '@app/../../../common/model/square';
import { Tile } from '@app/../../../common/model/tile';
import { Vec2 } from '@app/../../../common/model/vec2';
import { WordRequest } from '@app/../../../common/model/word-request';
import {
    GRID_DEFAULT_FONT,
    GRID_LETTER_PREMIUM_NAME,
    GRID_LINE_WIDTH,
    GRID_ROW_LABELS,
    GRID_WORD_PREMIUM_NAME,
    GRID_X2_PREMIUM_NAME,
    GRID_X3_PREMIUM_NAME,
    MIDDLE_SQUARE_POSITION,
    PREMIUM_SQUARE_FONT,
    SQUARE_WITHOUT_MULTIPLIER,
    TILE_BORDER_WIDTH,
} from '@app/classes/constants';
import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';
import { TileService } from '@app/services/tile/tile.service';
import { Observable, Subject } from 'rxjs';
import * as serviceConstants from './grid.service.constants';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    tileService: TileService;
    gridContext: CanvasRenderingContext2D;
    scrabbleGrid: ScrabbleGrid;
    subjectScrabbleGrid: Subject<WordRequest>;
    scrabbleGridObservable$: Observable<WordRequest>;
    private starImage: HTMLImageElement;
    private arrow: HTMLImageElement;
    private canvasSize: Vec2;
    private brushPosition: Vec2;

    constructor() {
        this.tileService = new TileService();
        this.scrabbleGrid = { elements: [] } as ScrabbleGrid;
        this.subjectScrabbleGrid = new Subject<WordRequest>();
        this.scrabbleGridObservable$ = this.subjectScrabbleGrid.asObservable();
        this.starImage = new Image();
        this.arrow = new Image();
        this.canvasSize = { x: GRID_DEFAULT_WIDTH, y: GRID_DEFAULT_HEIGHT } as Vec2;
        this.brushPosition = { x: 0, y: 0 } as Vec2;
    }

    addTilesObservable(wordRequest: WordRequest): void {
        this.addTilesToGrid(wordRequest.tiles);
        this.subjectScrabbleGrid.next(wordRequest);
    }

    removeTilesObservable(wordRequest: WordRequest, tiles: Tile[]): void {
        this.removeTileFromGrid(tiles);
        this.subjectScrabbleGrid.next(wordRequest);
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    get gridLabelOffset(): number {
        return this.width * serviceConstants.GRID_LABEL_OFFSET_FACTOR;
    }

    get squareLength(): number {
        return (this.width - this.gridLabelOffset) / GRID_SQUARES_PER_LINE;
    }

    addWordToGrid(tiles: Tile[], startPosition: Vec2, direction: DirectionType): void {
        if (!this.isValidGridPosition(startPosition)) return;
        let position: Vec2 = startPosition;
        let square: Square | undefined;
        for (const tile of tiles) {
            square = this.getSquare(position);
            this.setPosition(tile, position);
            if (square && !square.tile) square.tile = tile;
            else {
                position = this.nextPosition(position, direction, GridDirection.AFTER);
                square = this.getSquare(position);
                this.setPosition(tile, position);
                if (square && !square.tile) square.tile = tile;
            }
            position = this.nextPosition(position, direction, GridDirection.AFTER);
        }
    }

    convertStringWordToTiles(word: string): Tile[] {
        const letterBagService = new LetterBagService();
        const tiles: Tile[] = [];
        for (const letter of word) {
            const tile: Tile | undefined = letterBagService.getTile(letter.toUpperCase());
            if (tile) tiles.push(tile);
        }
        return tiles;
    }

    drawTilesAndScrabbleGrid(fontSize: number): void {
        this.drawGrid();
        for (let y = 0; y < GRID_SQUARES_PER_LINE; ++y) {
            for (let x = 0; x < GRID_SQUARES_PER_LINE; ++x) {
                const tile: Tile | null = this.scrabbleGrid.elements[y][x].tile;
                if (tile) this.drawTileOnGrid(tile, fontSize);
            }
        }
    }

    convertSquareNameToPosition(squareName: string): Vec2 | undefined {
        const regexedSquareName: RegExpMatchArray | null = squareName.match(serviceConstants.VALID_SQUARE_NAME_REGEX);
        if (
            regexedSquareName &&
            regexedSquareName.length === 1 &&
            regexedSquareName[0].length === squareName.length &&
            regexedSquareName !== null &&
            squareName.length >= serviceConstants.MIN_SQUARE_NAME_LENGTH &&
            squareName.length <= serviceConstants.MAX_SQUARE_NAME_LENGTH
        ) {
            const xNameStartOffset = 1;
            let xEndOffset = serviceConstants.MIN_SQUARE_NAME_LENGTH;
            if (squareName.length === serviceConstants.MAX_SQUARE_NAME_LENGTH) {
                xEndOffset = serviceConstants.MAX_SQUARE_NAME_LENGTH;
            }
            return {
                x: Number(squareName.substring(xNameStartOffset, xEndOffset)) - 1,
                y: squareName[0].toUpperCase().charCodeAt(0) - ASCII_LETTER_START_MAJ,
            } as Vec2;
        }
        return undefined;
    }

    initializeGrid(): void {
        for (let y = 0; y < GRID_SQUARES_PER_LINE; ++y) {
            this.scrabbleGrid.elements[y] = [];
            for (let x = 0; x < GRID_SQUARES_PER_LINE; ++x) {
                const pos: Vec2 = {
                    x,
                    y,
                } as Vec2;
                this.scrabbleGrid.elements[y][x] = {
                    position: pos,
                    color: ColorName.BEIGE,
                    wordMultiplier: SQUARE_WITHOUT_MULTIPLIER,
                    letterMultiplier: SQUARE_WITHOUT_MULTIPLIER,
                    name: this.convertPositionToSquareName(pos),
                    tile: null,
                } as Square;
                this.doConvertBaseSquareToPremium(this.scrabbleGrid.elements[y][x]);
            }
        }
    }

    isGridEmpty(): boolean {
        for (let y = 0; y < GRID_SQUARES_PER_LINE; ++y) {
            for (let x = 0; x < GRID_SQUARES_PER_LINE; ++x) if (this.scrabbleGrid.elements[y][x].tile) return false;
        }
        return true;
    }

    convertPositionToSquareName(pos: Vec2): string | undefined {
        const inputIsValid: boolean = pos && pos.x >= 0 && pos.x < GRID_SQUARES_PER_LINE && pos.y >= 0 && pos.y < GRID_SQUARES_PER_LINE;
        return inputIsValid ? String.fromCharCode(ASCII_LETTER_START_MAJ + pos.y) + (pos.x + 1).toString() : undefined;
    }

    isValidGridPosition(position: Vec2): boolean {
        return this.isValidAxisPosition(position.x) && this.isValidAxisPosition(position.y);
    }

    nextPosition(position: Vec2, direction: DirectionType, gridDirection: GridDirection): Vec2 {
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

    drawArrow(position: Vec2, direction: DirectionType): void {
        this.arrow.src = direction === DirectionType.HORIZONTAL ? serviceConstants.RIGHT_ARROW_SRC : serviceConstants.BOTTOM_ARROW_SRC;
        this.arrow.onload = () => {
            const positionToDrawArrow: Vec2 = this.convertGridPositionToDrawPosition(position);
            positionToDrawArrow.x =
                direction === DirectionType.HORIZONTAL ? positionToDrawArrow.x : positionToDrawArrow.x + serviceConstants.OFFSET_ARROW;
            positionToDrawArrow.y =
                direction === DirectionType.HORIZONTAL ? positionToDrawArrow.y + serviceConstants.OFFSET_ARROW : positionToDrawArrow.y;
            this.gridContext.drawImage(
                this.arrow,
                positionToDrawArrow.x,
                positionToDrawArrow.y,
                serviceConstants.ARROW_SIZE,
                serviceConstants.ARROW_SIZE,
            );
        };
    }

    addBorderToTiles(tiles: Tile[], borderColor: ColorName): void {
        for (const tile of tiles) {
            const drawPositionOfTile: Vec2 = this.convertGridPositionToDrawPosition(tile.position);
            this.gridContext.strokeStyle = borderColor;
            this.gridContext.lineWidth = TILE_BORDER_WIDTH;
            this.gridContext.beginPath();
            this.drawHorizontalLine(drawPositionOfTile.y, drawPositionOfTile.x, drawPositionOfTile.x + this.squareLength);
            this.drawHorizontalLine(drawPositionOfTile.y + this.squareLength, drawPositionOfTile.x, drawPositionOfTile.x + this.squareLength);
            this.drawVerticalLine(drawPositionOfTile.x, drawPositionOfTile.y, drawPositionOfTile.y + this.squareLength);
            this.drawVerticalLine(drawPositionOfTile.x + this.squareLength, drawPositionOfTile.y, drawPositionOfTile.y + this.squareLength);
            this.gridContext.stroke();
        }
    }

    isEmptyGridSquare(position: Vec2): boolean {
        const square: Square | undefined = this.scrabbleGrid.elements[position.y][position.x];
        return square && !square.tile;
    }

    private isValidAxisPosition(position: number): boolean {
        return 0 <= position && position < GRID_SQUARES_PER_LINE;
    }

    private drawGrid(): void {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = ColorName.WHITE;
        this.gridContext.lineWidth = GRID_LINE_WIDTH;
        this.gridContext.font = GRID_DEFAULT_FONT;
        for (let y = 0; y < GRID_SQUARES_PER_LINE; ++y) {
            this.drawLegend(y);
            for (let x = 0; x < GRID_SQUARES_PER_LINE; ++x) this.drawSquare({ x, y } as Vec2);
        }
        this.drawLastLinesOfGrid();
        this.gridContext.stroke();
    }

    private convertGridPositionToDrawPosition(position: Vec2): Vec2 {
        return { x: position.x * this.squareLength + this.gridLabelOffset, y: position.y * this.squareLength + this.gridLabelOffset } as Vec2;
    }

    private addTilesToGrid(tiles: Tile[]): void {
        const letterBagService = new LetterBagService();
        for (const tile of tiles) {
            const newTile: Tile | undefined = letterBagService.getTile(tile.name.toUpperCase());
            if (!newTile) return;
            newTile.position = tile.position;
            const square: Square | undefined = this.getSquare(newTile.position);
            if (square && !square.tile) {
                square.tile = newTile;
            }
        }
    }

    private removeTileFromGrid(tiles: Tile[]): void {
        for (const tile of tiles) {
            const square: Square | undefined = this.getSquare(tile.position);
            if (square) {
                square.tile = null;
            }
        }
    }

    private orientationNextPosition(gridDirection: GridDirection, position: number): number {
        switch (gridDirection) {
            case GridDirection.BEFORE:
                return position - 1;
            case GridDirection.AFTER:
                return position + 1;
        }
    }

    private getSquare(position: Vec2): Square | undefined {
        if (this.isValidGridPosition(position)) return this.scrabbleGrid.elements[position.y][position.x];
        return undefined;
    }

    private setPosition(tile: Tile, newPosition: Vec2): void {
        tile.position = { ...tile.position, x: newPosition.x, y: newPosition.y };
    }

    private drawTileOnGrid(tile: Tile, fontSize: number): void {
        const tilePosition: Vec2 = this.convertGridPositionToDrawPosition(tile.position);
        const tileCanvas: HTMLCanvasElement = document.createElement('canvas');
        tileCanvas.width = TILE_DEFAULT_WIDTH;
        tileCanvas.height = TILE_DEFAULT_HEIGHT;
        this.tileService.tileContext = tileCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.tileService.drawTile(tile, fontSize);
        this.gridContext.drawImage(
            tileCanvas,
            tilePosition.x + serviceConstants.VISUAL_OFFSET_TILE,
            tilePosition.y + serviceConstants.VISUAL_OFFSET_TILE,
            TILE_DEFAULT_WIDTH - serviceConstants.FACTOR_TO_FIT_TILE,
            TILE_DEFAULT_HEIGHT - serviceConstants.FACTOR_TO_FIT_TILE,
        );
    }

    private drawStar(middleSquare: Square): void {
        const isMiddleSquare: boolean = middleSquare.position.x === MIDDLE_SQUARE_POSITION.x && middleSquare.position.y === MIDDLE_SQUARE_POSITION.y;
        middleSquare.wordMultiplier = GRID_WORDX2_MULTIPLIER;
        if (!middleSquare.tile && isMiddleSquare) {
            this.starImage.src = serviceConstants.STAR_SRC;
            this.starImage.onload = () => {
                const positionToDrawStar: Vec2 = this.convertGridPositionToDrawPosition(MIDDLE_SQUARE_POSITION);
                this.gridContext.drawImage(
                    this.starImage,
                    positionToDrawStar.x + serviceConstants.OFFSET_STAR,
                    positionToDrawStar.y + serviceConstants.OFFSET_STAR,
                    serviceConstants.STAR_SIZE,
                    serviceConstants.STAR_SIZE,
                );
            };
        }
    }

    private drawVerticalLine(fixedPosition: number, startPosition: number, endPosition: number): void {
        this.gridContext.moveTo(fixedPosition, startPosition);
        this.gridContext.lineTo(fixedPosition, endPosition);
    }

    private drawHorizontalLine(fixedPosition: number, startPosition: number, endPosition: number): void {
        this.gridContext.moveTo(startPosition, fixedPosition);
        this.gridContext.lineTo(endPosition, fixedPosition);
    }

    private drawLastLinesOfGrid(): void {
        const position: Vec2 = this.convertGridPositionToDrawPosition(serviceConstants.LAST_GRID_POSITION);
        this.drawVerticalLine(position.x, this.gridLabelOffset, this.height);
        this.drawHorizontalLine(position.y, this.gridLabelOffset, this.width);
    }

    private setColorAndMultiplierSquare(square: Square, color: ColorName, wordMultiplier: number, letterMultiplier: number): void {
        square.color = color;
        square.wordMultiplier = wordMultiplier;
        square.letterMultiplier = letterMultiplier;
    }

    private doConvertBaseSquareToPremium(square: Square): void {
        const pos: Vec2 = square.position;
        const squareName: string = square.name;
        if (WORDX3_POSITIONS.includes(squareName)) {
            this.setColorAndMultiplierSquare(square, ColorName.RED, GRID_WORDX3_MULTIPLIER, SQUARE_WITHOUT_MULTIPLIER);
        } else if (LETTERX3_POSITIONS.includes(squareName)) {
            this.setColorAndMultiplierSquare(square, ColorName.BLUE, SQUARE_WITHOUT_MULTIPLIER, GRID_LETTERX3_MULTIPLIER);
        } else if (LETTERX2_POSITIONS.includes(squareName)) {
            this.setColorAndMultiplierSquare(square, ColorName.PALE_BLUE, SQUARE_WITHOUT_MULTIPLIER, GRID_LETTERX2_MULTIPLIER);
        } else if (pos.x === pos.y || pos.x + pos.y + 1 === GRID_SQUARES_PER_LINE) {
            this.setColorAndMultiplierSquare(square, ColorName.PALE_RED, GRID_WORDX2_MULTIPLIER, SQUARE_WITHOUT_MULTIPLIER);
        }
    }

    private isPositionInCanvas(position: Vec2): boolean {
        return 0 <= position.x && position.x < GRID_DEFAULT_WIDTH && 0 <= position.y && position.y < GRID_DEFAULT_HEIGHT;
    }

    private drawSquare(squarePos: Vec2): void {
        const element: Square = this.scrabbleGrid.elements[squarePos.y][squarePos.x];
        this.brushPosition.x = squarePos.x * this.squareLength + this.gridLabelOffset;
        this.drawVerticalLine(this.brushPosition.x, this.gridLabelOffset, this.height);
        this.gridContext.fillStyle = element.color;
        this.gridContext.fillRect(this.brushPosition.x, this.brushPosition.y, this.squareLength, this.squareLength);
        switch (element.color) {
            case ColorName.RED:
                this.fillSquareName(GRID_WORD_PREMIUM_NAME, GRID_X3_PREMIUM_NAME, this.brushPosition);
                break;
            case ColorName.PALE_RED:
                if (squarePos.x === MIDDLE_SQUARE_POSITION.x && squarePos.y === MIDDLE_SQUARE_POSITION.y) this.drawStar(element);
                else this.fillSquareName(GRID_WORD_PREMIUM_NAME, GRID_X2_PREMIUM_NAME, this.brushPosition);
                break;
            case ColorName.BLUE:
                this.fillSquareName(GRID_LETTER_PREMIUM_NAME, GRID_X3_PREMIUM_NAME, this.brushPosition);
                break;
            case ColorName.PALE_BLUE:
                this.fillSquareName(GRID_LETTER_PREMIUM_NAME, GRID_X2_PREMIUM_NAME, this.brushPosition);
                break;
        }
    }

    private drawLegend(rowIndex: number): void {
        const inputIsValid: boolean = rowIndex >= 0 && rowIndex < GRID_SQUARES_PER_LINE;
        if (inputIsValid) {
            this.brushPosition.y = rowIndex * this.squareLength + this.gridLabelOffset;
            this.drawHorizontalLine(this.brushPosition.y, this.gridLabelOffset, this.width);
            this.gridContext.fillStyle = ColorName.BLACK;
            this.gridContext.fillText(
                (rowIndex + 1).toString(),
                rowIndex * this.squareLength + this.gridLabelOffset + this.squareLength / serviceConstants.QUARTER_SQUARE_DIV_OFFSET,
                this.gridLabelOffset / serviceConstants.HALF_GRID_LABEL_DIV_OFFSET,
            );
            this.gridContext.fillText(
                GRID_ROW_LABELS.charAt(rowIndex),
                this.gridLabelOffset / serviceConstants.TENTH_GRID_LABEL_DIV_OFFSET,
                this.brushPosition.y + this.gridLabelOffset,
            );
        }
    }

    private fillSquareName(name: string, multiplier: string, brushPosition: Vec2): void {
        if (this.isPositionInCanvas(brushPosition)) {
            const currentFillStyle = this.gridContext.fillStyle;
            const currentFont = this.gridContext.font;
            this.gridContext.fillStyle = ColorName.BLACK;
            this.gridContext.font = PREMIUM_SQUARE_FONT;
            const textPosition: Vec2 = {} as Vec2;
            if (name === GRID_WORD_PREMIUM_NAME) {
                textPosition.x = brushPosition.x + this.squareLength / serviceConstants.PREMIUM_NAME_X_DIV_OFFSET;
                textPosition.y = brushPosition.y + this.squareLength / serviceConstants.PREMIUM_NAME_Y_DIV_OFFSET;
            } else {
                this.gridContext.font = '9px sans-serif';
                textPosition.x = brushPosition.x + this.squareLength / serviceConstants.NON_PREMIUM_NAME_X_DIV_OFFSET;
                textPosition.y = brushPosition.y + this.squareLength / serviceConstants.NON_PREMIUM_NAME_Y_DIV_OFFSET;
            }
            this.gridContext.fillText(name, textPosition.x, textPosition.y);
            this.gridContext.font = PREMIUM_SQUARE_FONT;
            this.gridContext.fillText(
                multiplier,
                brushPosition.x + this.squareLength / serviceConstants.PREMIUM_MULTIPLIER_X_DIV_OFFSET,
                brushPosition.y + this.squareLength / serviceConstants.PREMIUM_MULTIPLIER_Y_DIV_OFFSET,
            );
            this.gridContext.fillStyle = currentFillStyle;
            this.gridContext.font = currentFont;
        }
    }
}

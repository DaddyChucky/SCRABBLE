import { Injectable } from '@angular/core';
import { ColorName } from '@app/../../../common/model/color-name';
import { ASCII_LETTER_START_MAJ, GRID_DEFAULT_HEIGHT, GRID_DEFAULT_WIDTH } from '@app/../../../common/model/constants';
import { DirectionType } from '@app/../../../common/model/direction-type';
import { Tile } from '@app/../../../common/model/tile';
import {
    ASCII_LETTER_END_MAJ,
    ASCII_LETTER_END_MIN,
    ASCII_LETTER_START_MIN,
    BIGGER_LETTER,
    DEFAULT_TILE_SIZE_ON_GRID,
    MAX_SIZE_FOR_BIGGER_LETTER,
    TILE_BORDER_WIDTH,
    TILE_MAX_WEIGHT,
    TILE_SIZE_IN_EASEL,
    TILE_STAR_CHAR_ASCII,
} from '@app/classes/constants';
import * as serviceConstants from './tile.service.constants';

@Injectable({
    providedIn: 'root',
})
export class TileService {
    tileContext: CanvasRenderingContext2D;

    clearTile(tile: Tile): void {
        if (!this.isValidTile(tile)) return;
        this.tileContext.clearRect(tile.position.x, tile.position.y, tile.width, tile.height);
    }

    drawTile(tile: Tile, fontSize: number): void {
        this.tileContext.fillStyle = ColorName.TILE_DEFAULT;
        this.tileContext.fillRect(
            serviceConstants.START_POSITION.x,
            serviceConstants.START_POSITION.y,
            DEFAULT_TILE_SIZE_ON_GRID,
            DEFAULT_TILE_SIZE_ON_GRID,
        );
        this.drawTileInfo(tile, fontSize, ColorName.BLACK);
        this.tileContext.strokeRect(
            serviceConstants.START_POSITION.x,
            serviceConstants.START_POSITION.y,
            DEFAULT_TILE_SIZE_ON_GRID,
            DEFAULT_TILE_SIZE_ON_GRID,
        );
    }

    drawTileBackground(tile: Tile, tileColor: ColorName): void {
        if (!this.isValidTile(tile)) return;
        this.tileContext.fillStyle = tileColor;
        this.tileContext.fillRect(tile.position.x, tile.position.y, tile.width, tile.height);
    }

    drawTileInfo(tile: Tile, fontSize: number, color: ColorName): void {
        if (!this.isValidTile(tile)) return;
        this.tileContext.fillStyle = color;
        let tileSize = tile.width / serviceConstants.HALF_TILE_SIZE;
        if (this.isBiggerLetter(tile.name)) {
            if (fontSize === serviceConstants.TILE_FONT_SIZE_EASEL) fontSize = fontSize - serviceConstants.EASEL_TILE_SIZE_REDUCTION;
            fontSize = this.changeFontSizeOfBiggerLetterTile(fontSize);
            tileSize -= serviceConstants.GRID_TILE_SIZE_REDUCTION;
        }
        this.drawLetterOnTile(tile, fontSize, tileSize);
        this.drawWeightOnTile(tile, fontSize, tileSize);
    }

    onClick(tile: Tile): void {
        tile.leftClicked = true;
        this.drawTileBorder(tile, ColorName.TILE_ACTIVE);
    }

    onOutsideClick(tile: Tile): void {
        tile.leftClicked = false;
        this.drawTileBorder(tile, ColorName.TILE_DEFAULT);
    }

    private drawTileBorder(tile: Tile, borderColor: ColorName): void {
        if (!this.isValidTile(tile)) return;
        this.tileContext.strokeStyle = borderColor;
        this.tileContext.lineWidth = TILE_BORDER_WIDTH;
        this.tileContext.beginPath();
        this.tileContext.moveTo(tile.position.x, tile.position.y);
        this.tileContext.lineTo(tile.position.x + tile.width, tile.position.y);
        this.tileContext.lineTo(tile.position.x + tile.width, tile.position.y + tile.height);
        this.tileContext.lineTo(tile.position.x, tile.position.y + tile.height);
        this.tileContext.lineTo(tile.position.x, tile.position.y);
        this.tileContext.stroke();
    }

    private changeFontSizeOfBiggerLetterTile(fontSize: number): number {
        let newFontSize = fontSize - serviceConstants.FONT_SIZE_REDUCER;
        if (newFontSize > MAX_SIZE_FOR_BIGGER_LETTER)
            newFontSize = fontSize - serviceConstants.FONT_SIZE_REDUCER * serviceConstants.FONT_SIZE_REDUCER;
        return newFontSize;
    }

    private isBiggerLetter(letter: string): boolean {
        return BIGGER_LETTER.find((biggerLetter) => biggerLetter === letter.toUpperCase()) !== undefined;
    }

    private drawLetterOnTile(tile: Tile, fontSize: number, tileHalfSize: number): void {
        const tileTextOffset: number = tileHalfSize / serviceConstants.TILE_TEXT_DIV_OFFSET;
        this.tileContext.textAlign = 'center';
        this.tileContext.textBaseline = 'middle';
        this.tileContext.font = fontSize + 'px sans-serif';
        this.tileContext.fillText(
            tile.name.toUpperCase(),
            tileHalfSize - tileHalfSize / serviceConstants.TILE_TEXT_DIV_OFFSET,
            tileHalfSize - tileTextOffset,
        );
    }

    private drawWeightOnTile(tile: Tile, fontSize: number, tileHalfSize: number): void {
        const tileWeightOffset: number = tileHalfSize / serviceConstants.TILE_WEIGHT_OFFSET_DIV;
        const weightFont: string = fontSize / 2 + 'px sans-serif';
        this.tileContext.textAlign = 'left';
        this.tileContext.textBaseline = 'middle';
        this.tileContext.font = weightFont;
        this.tileContext.fillText(tile.weight.toString(), tileHalfSize + tileWeightOffset, tileHalfSize + tileWeightOffset);
    }

    private isValidTile(tile: Tile): boolean {
        return !this.isValidTilePosition(tile) ||
            !this.isValidTileName(tile) ||
            !this.isValidTileDirection(tile, DirectionType.HORIZONTAL) ||
            !this.isValidTileDirection(tile, DirectionType.VERTICAL)
            ? false
            : this.isValidTileWeight(tile);
    }

    private isValidTilePosition(tile: Tile): boolean {
        return tile.position.x >= 0 && tile.position.y >= 0 && tile.position.x <= GRID_DEFAULT_WIDTH && tile.position.y <= GRID_DEFAULT_HEIGHT;
    }

    private isValidTileName(tile: Tile): boolean {
        if (tile.name.length !== serviceConstants.LETTER_LENGTH) return false;
        return this.isValidUpperTileName(tile) || this.isValidLowerTileName(tile) || this.isValidSpecialCharTileName(tile);
    }

    private isValidUpperTileName(tile: Tile): boolean {
        return tile.name.charCodeAt(0) >= ASCII_LETTER_START_MAJ && tile.name.charCodeAt(0) <= ASCII_LETTER_END_MAJ;
    }

    private isValidLowerTileName(tile: Tile): boolean {
        return tile.name.charCodeAt(0) >= ASCII_LETTER_START_MIN && tile.name.charCodeAt(0) <= ASCII_LETTER_END_MIN;
    }

    private isValidSpecialCharTileName(tile: Tile): boolean {
        return tile.name.charCodeAt(0) === TILE_STAR_CHAR_ASCII;
    }

    private isValidTileDirection(tile: Tile, direction: DirectionType): boolean {
        return direction === DirectionType.HORIZONTAL
            ? tile.width >= 0 && tile.width <= TILE_SIZE_IN_EASEL
            : tile.height >= 0 && tile.height <= TILE_SIZE_IN_EASEL;
    }

    private isValidTileWeight(tile: Tile): boolean {
        return tile.weight >= 0 && tile.weight <= TILE_MAX_WEIGHT;
    }
}

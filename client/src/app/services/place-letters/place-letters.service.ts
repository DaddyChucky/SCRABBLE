import { Injectable } from '@angular/core';
import { ChatMessage } from '@app/../../../common/model/chat-message';
import { ColorName } from '@app/../../../common/model/color-name';
import { DirectionType } from '@app/../../../common/model/direction-type';
import { GridDirection } from '@app/../../../common/model/grid-direction';
import { Tile } from '@app/../../../common/model/tile';
import { TypeOfUser } from '@app/../../../common/model/type-of-user';
import { Vec2 } from '@app/../../../common/model/vec2';
import { WordRequest } from '@app/../../../common/model/word-request';
import { CommandType } from '@app/classes/command-type';
import { TILE_FONT_SIZE_GRID } from '@app/classes/constants';
import { PlaceCommand } from '@app/classes/place-command';
import { DialogBoxService } from '@app/services/dialog-box/dialog-box.service';
import { GridService } from '@app/services/grid/grid.service';
import { PlayerInformationService } from '@app/services/player-information/player-information.service';
import * as serviceConstants from './place-letters.service.constants';

@Injectable({
    providedIn: 'root',
})
export class PlaceLettersService {
    isValidStartPosition: boolean;
    placeCommand: PlaceCommand;
    tilesAddedToGrid: Tile[];
    gridPosition: Vec2;
    fontSize: number;

    constructor(
        private readonly playerInfoService: PlayerInformationService,
        private readonly gridService: GridService,
        private readonly dialogBoxService: DialogBoxService,
    ) {
        this.tilesAddedToGrid = [];
        this.placeCommand = {} as PlaceCommand;
        this.isValidStartPosition = false;
        this.fontSize = TILE_FONT_SIZE_GRID;
    }

    hasAddedTilesToGrid(): boolean {
        return this.tilesAddedToGrid.length !== 0;
    }

    isValidKeyPressed(key: string): boolean {
        if (!key.match(serviceConstants.REGEX_LETTERS_LOWER_CASE) && !key.match(serviceConstants.REGEX_LETTERS_UPPER_CASE)) return false;
        if (this.playerInfoService.isBlankTile(key))
            return this.playerInfoService.currentPlayer.tiles.find((tile) => tile.name === serviceConstants.BLANK_TILE) !== undefined;
        return this.isValidPlayerTile(this.removeAccent(key));
    }

    addLetterToPlaceCommand(letter: string, position: Vec2): void {
        letter = this.removeAccent(letter);
        this.placeCommand.letters += letter;
        this.saveTileAdded(letter, position);
        this.gridService.addTilesObservable(this.getWordRequest(letter, position));
        this.playerInfoService.removeTileFromCurrentPlayer(letter);
        this.gridService.addBorderToTiles(this.tilesAddedToGrid, ColorName.PURPLE);
        this.setNextValidGridPosition();
        this.gridService.drawArrow(this.gridPosition, this.placeCommand.direction);
    }

    setGridPositionOfClick(clickPosition: Vec2): void {
        this.gridPosition = { x: this.findGridAxis(clickPosition.x), y: this.findGridAxis(clickPosition.y) } as Vec2;
    }

    cancelPlaceCommand(): void {
        this.gridService.drawTilesAndScrabbleGrid(this.fontSize);
        if (this.hasAddedTilesToGrid())
            this.gridService.removeTilesObservable(
                this.getWordRequest(this.placeCommand.letters, this.placeCommand.startPosition),
                this.tilesAddedToGrid,
            );
        this.resetPlaceCommand();
    }

    cancelLastLetterPlacement(): void {
        if (this.placeCommand.letters.length === 0 || this.tilesAddedToGrid.length === 0) return;
        const lastTileToRemove: Tile = this.tilesAddedToGrid[this.tilesAddedToGrid.length - 1];
        this.gridService.removeTilesObservable(this.getWordRequest(lastTileToRemove.name, lastTileToRemove.position), [lastTileToRemove]);
        this.gridService.drawArrow(lastTileToRemove.position, this.placeCommand.direction);
        if (!this.isStartPosition(this.gridPosition)) this.gridPosition = lastTileToRemove.position;
        this.giveBackLastTileAdded(lastTileToRemove);
        this.gridService.addBorderToTiles(this.tilesAddedToGrid, ColorName.PURPLE);
    }

    confirmPlaceCommand(): void {
        this.checkIfOneLetterPlacement();
        const placeCommandMessage: ChatMessage = {
            author: TypeOfUser.CURRENT_PLAYER,
            text: this.createPlaceCommandTextMessage(),
            date: new Date(),
            lobbyId: this.playerInfoService.lobbyId,
            socketId: this.playerInfoService.currentPlayer.playerId,
        };
        this.cancelPlaceCommand();
        this.dialogBoxService.verificationTypeMessage(placeCommandMessage);
        this.isValidStartPosition = false;
    }

    manageClickOnEmptyGridSquare(): void {
        if (!this.isValidPosition(this.gridPosition)) return;
        if (this.isStartPosition(this.gridPosition)) this.toggleDirection();
        else this.createPlaceCommand(this.gridPosition);
    }

    private checkIfOneLetterPlacement(): void {
        if (this.tilesAddedToGrid.length !== 1) return;
        const positionOfTile: Vec2 = this.tilesAddedToGrid[0].position;
        if (
            this.doesSquareContainTile({ x: positionOfTile.x, y: positionOfTile.y - 1 } as Vec2) ||
            this.doesSquareContainTile({ x: positionOfTile.x, y: positionOfTile.y + 1 } as Vec2)
        ) {
            this.placeCommand.direction = DirectionType.VERTICAL;
        } else {
            this.placeCommand.direction = DirectionType.HORIZONTAL;
        }
    }

    private doesSquareContainTile(position: Vec2): boolean {
        return this.gridService.isValidGridPosition(position) && this.gridService.scrabbleGrid.elements[position.y][position.x].tile !== null;
    }

    private isStartPosition(position: Vec2): boolean {
        if (!this.placeCommand.startPosition) return false;
        return position.x === this.placeCommand.startPosition.x && position.y === this.placeCommand.startPosition.y;
    }

    private isValidPosition(position: Vec2): boolean {
        this.isValidStartPosition =
            this.gridService.isValidGridPosition(position) &&
            this.gridService.isEmptyGridSquare(position) &&
            this.playerInfoService.currentPlayer.isTurn;
        return this.isValidStartPosition;
    }

    private createPlaceCommand(startPosition: Vec2): void {
        if (!this.isValidPosition(startPosition)) return;
        this.placeCommand.direction = DirectionType.HORIZONTAL;
        this.placeCommand.startPosition = startPosition;
        this.placeCommand.name = CommandType.PLACE;
        this.placeCommand.letters = '';
        this.gridService.drawTilesAndScrabbleGrid(this.fontSize);
        this.gridService.drawArrow(startPosition, this.placeCommand.direction);
    }

    private toggleDirection(): void {
        this.placeCommand.direction = this.placeCommand.direction === DirectionType.HORIZONTAL ? DirectionType.VERTICAL : DirectionType.HORIZONTAL;
        this.gridService.drawTilesAndScrabbleGrid(this.fontSize);
        this.gridService.drawArrow(this.placeCommand.startPosition, this.placeCommand.direction);
    }

    private resetPlaceCommand(): void {
        this.tilesAddedToGrid.forEach((tile) => {
            tile.position = serviceConstants.DEFAULT_POSITION;
        });
        this.playerInfoService.currentPlayer.tiles.push(...this.tilesAddedToGrid);
        this.placeCommand = {} as PlaceCommand;
        this.tilesAddedToGrid = [];
        this.isValidStartPosition = false;
    }

    private giveBackLastTileAdded(tile: Tile): void {
        tile.position = serviceConstants.DEFAULT_POSITION;
        this.tilesAddedToGrid.pop();
        this.playerInfoService.addTileToCurrentPlayer(tile);
        this.placeCommand.letters = this.placeCommand.letters.slice(0, this.placeCommand.letters.length - 1);
    }

    private setNextValidGridPosition(): void {
        this.gridPosition = this.gridService.nextPosition(this.gridPosition, this.placeCommand.direction, GridDirection.AFTER);
        while (!this.isValidPosition(this.gridPosition)) {
            if (!this.gridService.isValidGridPosition(this.gridPosition)) break;
            this.gridPosition = this.gridService.nextPosition(this.gridPosition, this.placeCommand.direction, GridDirection.AFTER);
        }
    }

    private createPlaceCommandTextMessage(): string {
        return (
            serviceConstants.COMMAND_CHARACTER +
            this.placeCommand.name +
            serviceConstants.SPACE +
            this.gridService.convertPositionToSquareName(this.placeCommand.startPosition)?.toLowerCase() +
            this.placeCommand.direction +
            serviceConstants.SPACE +
            this.placeCommand.letters
        );
    }

    private saveTileAdded(letter: string, position: Vec2): void {
        const tileNameToFind: string = this.playerInfoService.isBlankTile(letter) ? serviceConstants.BLANK_TILE : letter.toUpperCase();
        const tileAdded: Tile | undefined = this.playerInfoService.currentPlayer.tiles.find((tile) => tile.name === tileNameToFind);
        if (!tileAdded) return;
        tileAdded.position = position;
        this.tilesAddedToGrid.push(tileAdded);
    }

    private findGridAxis(clickPosition: number): number {
        return Math.floor((clickPosition - serviceConstants.GRID_FIRST_CLICK_POSITION) / this.gridService.squareLength);
    }

    private isValidPlayerTile(key: string): boolean {
        return this.playerInfoService.currentPlayer.tiles.find((tile) => tile.name === key.toUpperCase()) !== undefined;
    }

    private removeAccent(key: string): string {
        return key.normalize(serviceConstants.NORMALIZE_TYPE_NFD).replace(serviceConstants.REGEX_REMOVE_ACCENT, '');
    }

    private newTilesToSend(): Tile[] {
        if (!this.placeCommand) return [];
        const tiles: Tile[] = this.gridService.convertStringWordToTiles(this.placeCommand.letters);
        for (let i = 0; i < tiles.length; ++i) {
            tiles[i].position = this.tilesAddedToGrid[i].position;
        }
        return tiles;
    }

    private getWordRequest(lettersToRemove: string, startPositionToRemove: Vec2): WordRequest {
        return {
            lobbyId: this.playerInfoService.lobbyId,
            socketId: this.playerInfoService.currentPlayer.playerId,
            word: lettersToRemove,
            startPosition: startPositionToRemove,
            direction: this.placeCommand.direction,
            tiles: this.newTilesToSend(),
        } as WordRequest;
    }
}

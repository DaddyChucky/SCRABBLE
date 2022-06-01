import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { GRID_DEFAULT_HEIGHT, GRID_DEFAULT_WIDTH } from '@app/../../../common/model/constants';
import { Tile } from '@app/../../../common/model/tile';
import { Vec2 } from '@app/../../../common/model/vec2';
import { PlaceCommand } from '@app/classes/place-command';
import { EaselService } from '@app/services/easel/easel.service';
import { GridService } from '@app/services/grid/grid.service';
import { MouseService } from '@app/services/mouse/mouse.service';
import { PlaceLettersService } from '@app/services/place-letters/place-letters.service';
import { Subscription } from 'rxjs';
import { BACKSPACE_BUTTON, BLANK_TILE, DEFAULT_INDEX, ENTER_BUTTON, ESCAPE_BUTTON } from './play-area.component.spec.constants';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    selectedTile: Tile | undefined;
    indexOfSelected: number = DEFAULT_INDEX;
    easelTileSelected: boolean = false;
    subscription: Subscription;
    private canvasSize: Vec2 = { x: GRID_DEFAULT_WIDTH, y: GRID_DEFAULT_HEIGHT };

    constructor(
        private readonly gridService: GridService,
        private readonly mouseService: MouseService,
        private readonly placeLettersService: PlaceLettersService,
        private readonly easelService: EaselService,
    ) {
        this.subscribeToScrabbleGrid();
    }

    @HostListener('window:click', ['$event'])
    onClick(event: MouseEvent): void {
        if (this.gridCanvas.nativeElement !== event.target) this.placeLettersService.cancelPlaceCommand();
    }

    @HostListener('keypress', ['$event'])
    buttonDetect(event: KeyboardEvent): void {
        if (!this.isValidStartPosition) {
            if (this.placeLettersService.hasAddedTilesToGrid()) return;
            if (this.placeLettersService.isValidKeyPressed(event.key) || event.key === BLANK_TILE) this.easelService.selectEaselLetter(event.key);
            else this.easelService.clearEaselSelection();
        } else if (
            this.placeLettersService.isValidKeyPressed(event.key) &&
            this.gridService.isValidGridPosition(this.placeLettersService.gridPosition)
        ) {
            this.placeLettersService.addLetterToPlaceCommand(event.key, this.placeLettersService.gridPosition);
        }
    }

    @HostListener('wheel', ['$event'])
    @HostListener('keydown', ['$event'])
    buttonDetectAction(event: KeyboardEvent): void {
        switch (event.key) {
            case ENTER_BUTTON:
                if (!this.placeLettersService.hasAddedTilesToGrid()) return;
                this.placeLettersService.confirmPlaceCommand();
                break;
            case ESCAPE_BUTTON:
                if (!this.placeLettersService.hasAddedTilesToGrid()) return;
                this.placeLettersService.cancelPlaceCommand();
                break;
            case BACKSPACE_BUTTON:
                if (!this.placeLettersService.hasAddedTilesToGrid()) return;
                this.placeLettersService.cancelLastLetterPlacement();
                break;
            default:
                if (this.placeLettersService.hasAddedTilesToGrid()) return;
                this.easelService.selectEaselLetter();
                this.easelService.manipulate(event);
        }
    }

    updatePositionOnClick(event: MouseEvent): void {
        if (this.placeLettersService.hasAddedTilesToGrid()) return;
        this.mouseService.updatePositionOnClick(event);
        this.placeLettersService.setGridPositionOfClick(this.mousePosition);
        this.placeLettersService.manageClickOnEmptyGridSquare();
    }

    get mousePosition(): Vec2 {
        return this.mouseService.mousePosition;
    }

    get placeCommand(): PlaceCommand {
        return this.placeLettersService.placeCommand;
    }

    get isValidStartPosition(): boolean {
        return this.placeLettersService.isValidStartPosition;
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    get squareClickName(): string | undefined {
        return this.gridService.convertPositionToSquareName(this.placeCommand.startPosition)?.toLowerCase();
    }

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.initializeGrid();
        this.gridService.drawTilesAndScrabbleGrid(this.placeLettersService.fontSize);
    }

    redrawTilesWithNewFontSize(fontSize: number): void {
        this.placeLettersService.fontSize = fontSize;
        this.gridService.drawTilesAndScrabbleGrid(this.placeLettersService.fontSize);
    }

    private subscribeToScrabbleGrid(): void {
        this.subscription = this.gridService.scrabbleGridObservable$.subscribe(() => {
            this.gridService.drawTilesAndScrabbleGrid(this.placeLettersService.fontSize);
        });
    }
}

import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ColorName } from '@app/../../../common/model/color-name';
import { Tile } from '@app/../../../common/model/tile';
import { TILE_FONT_SIZE_EASEL } from '@app/classes/constants';
import { TileService } from '@app/services/tile/tile.service';

@Component({
    selector: 'app-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss'],
})
export class TileComponent implements AfterViewInit {
    @ViewChild('tileCanvas', { static: false }) private readonly tileCanvas!: ElementRef<HTMLCanvasElement>;
    private tile: Tile = new Tile();

    constructor(private readonly tileService: TileService) {}

    @Input()
    get playerTile(): Tile {
        return this.tile;
    }

    set playerTile(tile: Tile) {
        this.tile = tile;
    }

    ngAfterViewInit(): void {
        this.tileService.tileContext = this.tileCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.tileService.drawTileBackground(this.tile, ColorName.TILE_DEFAULT);
        this.tileService.drawTileInfo(this.tile, TILE_FONT_SIZE_EASEL, ColorName.BLACK);
    }

    get width(): number {
        return this.tile.width;
    }

    get height(): number {
        return this.tile.height;
    }
}

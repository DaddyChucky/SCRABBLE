import { TILE_DEFAULT_HEIGHT, TILE_DEFAULT_WIDTH } from './constants';
import { Vec2 } from './vec2';

export class Tile {
    position: Vec2;
    name: string;
    weight: number;
    width: number;
    height: number;
    rightClicked: boolean;
    leftClicked: boolean;

    constructor(position?: Vec2 | undefined, name?: string | undefined, weight?: number | undefined) {
        this.position = position ? position : ({ x: 0, y: 0 } as Vec2);
        this.name = name ? name : '';
        this.weight = weight ? weight : 0;
        this.width = TILE_DEFAULT_WIDTH;
        this.height = TILE_DEFAULT_HEIGHT;
        this.rightClicked = false;
        this.leftClicked = false;
    }
}

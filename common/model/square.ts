import { ColorName } from './color-name';
import { Tile } from './tile';
import { Vec2 } from './vec2';

export class Square {
    position: Vec2;
    color: ColorName;
    wordMultiplier: number;
    letterMultiplier: number;
    name: string;
    tile: Tile | null;
}

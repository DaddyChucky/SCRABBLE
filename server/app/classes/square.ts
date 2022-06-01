import { ColorName } from '@common/model/color-name';
import { Tile } from '@common/model/tile';
import { Vec2 } from '@common/model/vec2';

export interface Square {
    position: Vec2;
    color: ColorName;
    wordMultiplier: number;
    letterMultiplier: number;
    name: string;
    tile: Tile | null;
}

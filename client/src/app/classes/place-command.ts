import { DirectionType } from '@app/../../../common/model/direction-type';
import { Vec2 } from '@app/../../../common/model/vec2';
import { CommandType } from './command-type';

export interface PlaceCommand {
    name: CommandType;
    startPosition: Vec2;
    direction: DirectionType;
    letters: string;
}

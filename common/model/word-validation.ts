import { ParsedInfo } from './parsed-info';
import { TilesValidation } from './tiles-validation';

export interface WordValidation {
    parsedInfo: ParsedInfo;
    tiles: TilesValidation;
}

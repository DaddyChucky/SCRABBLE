export enum VirtualPlayerPossibleActions {
    PASS,
    EXCHANGE,
    PLACE,
}
export enum PointsRange {
    UPPER = 18,
    MID = 12,
    LOWER = 6,
}
export const POINTS_RANGE_UPPER_BOUND = 0.7;
export const POINTS_RANGE_LOWER_BOUND = 0.4;
export const PASS_PROBABILITY_LOWER_BOUND = 0.9;
export const EXCHANGE_PROBABILITY_LOWER_BOUND = 0.8;
export const MIN_TILES_IN_LETTERBAG = 7;
export const PASS_COMMAND = '!passer';
export const EXCHANGE_COMMAND = '!échanger';
export const PLACE_COMMAND = '!placer';
export const SPACE_STR = ' ';
export const TILE_SIZE = 51.666666666666664;

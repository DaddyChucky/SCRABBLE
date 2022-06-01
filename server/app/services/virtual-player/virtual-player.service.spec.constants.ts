import { WordPossibility } from '@app/services/board-analyzer/board-analyzer.service.constants';
import { DirectionType } from '@common/model/direction-type';
import { Vec2 } from '@common/model/vec2';
export const FAKE_PLAYER_LETTERS = 'abcdefg';
export const AMOUNT_OF_RETRIES = 500;
export const UNCERTAINTY_FACTOR = 0.1;
export const FAKE_WORD_POSSIBILITY: WordPossibility = {
    word: 'a',
    playerLetters: 'b',
    weight: 1,
    anchor: { x: 0, y: 0 } as Vec2,
    wordDirection: DirectionType.HORIZONTAL,
} as WordPossibility;
export const EXPECTED_WORD_POSSIBILITY_CONVERSION = '!placer a1h b';
export const DICT_NAME = 'francais';
export const TILE_SIZE = 51.666666666666664;
export const IMPOSSIBLE_POINTS_FORMED = -1;

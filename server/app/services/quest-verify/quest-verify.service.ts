import { WordValidatorService } from '@app/services/word-validator/word-validator.service';
import { Quest } from '@common/model/quest';
import { QuestName } from '@common/model/quest-name';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Tile } from '@common/model/tile';
import { WordValidation } from '@common/model/word-validation';
import { Service } from 'typedi';
import * as serviceConstants from './quest-verify.service.constants';

@Service()
export class QuestVerifyService {
    private word: string;
    private quest: Quest;
    private wordsOnGrid: string[] = [];
    private placedTiles: WordValidation;
    private grid: ScrabbleGrid;
    private timer: number;
    private wordValidator: WordValidatorService;

    constructor(dictName: string) {
        this.wordValidator = new WordValidatorService(dictName);
    }

    updateQuest(quest: Quest, placedTiles: WordValidation): void {
        this.quest = quest;
        this.placedTiles = placedTiles;
        this.word = '';
        this.grid = placedTiles.parsedInfo.scrabbleGrid;
        this.convertTilesToWord();
    }

    checkQuestsAndReturnPoints(): number {
        switch (this.quest.name) {
            case QuestName.PALINDROME:
                return this.isPalindrome();

            case QuestName.DIAGONAL:
                return this.hasWordOnDiagonal();

            case QuestName.LONG_WORD:
                return this.isLongWord();

            case QuestName.WORD_THREE_E:
                return this.wordHasThreeE();

            case QuestName.CORNERS_2X:
                return this.gridHasTwoFilledCorners();

            case QuestName.SQUARE:
                return this.gridHasSquare();

            case QuestName.FIVE_SECONDS_MOVE:
                return this.fiveSecondsPlacement();

            case QuestName.SAME_WORD_2X:
                this.wordsOnGrid.push(this.word);
                return this.gridHasTwoIdenticalWords();

            default:
                return 0;
        }
    }

    setTimer(timer: number): void {
        this.timer = timer;
    }

    private isPalindrome(): number {
        return this.word && this.word === this.word.split('').reverse().join('') ? this.completedQuestPoints() : 0;
    }

    private hasWordOnDiagonal(): number {
        for (const word of this.wordsOnDiagonal()) if (word && this.wordValidator.isValid(word)) return this.completedQuestPoints();
        return 0;
    }

    private wordsOnDiagonal(): string[] {
        const substrings: string[] = [];
        let listIndex = 0;
        for (let i = 0; i < this.grid.elements.length; i++) {
            if (this.grid.elements[i][i].tile?.name.length)
                substrings[listIndex] = substrings[listIndex]
                    ? substrings[listIndex] + this.grid.elements[i][i].tile?.name
                    : // eslint-disable-next-line
                      this.grid.elements[i][i].tile?.name!;
            else listIndex++;
        }
        return substrings;
    }

    private gridHasSquare(): number {
        for (let i = 1; i < serviceConstants.GRID_SIZE - 1; i++)
            for (let j = 1; j < serviceConstants.GRID_SIZE - 1; j++) {
                if (this.grid.elements[i][j].tile && this.isSurrounded(i, j)) return this.completedQuestPoints();
            }

        return 0;
    }

    private isSurrounded(i: number, j: number): boolean {
        return this.isCornerSurrounded(i, j) && this.isAdjacentSurrounded(i, j);
    }

    private isCornerSurrounded(i: number, j: number): boolean {
        if (
            this.grid.elements[i + 1][j + 1].tile &&
            this.grid.elements[i + 1][j - 1].tile &&
            this.grid.elements[i - 1][j - 1].tile &&
            this.grid.elements[i - 1][j + 1].tile
        )
            return true;
        return false;
    }

    private isAdjacentSurrounded(i: number, j: number): boolean {
        if (
            this.grid.elements[i][j + 1].tile &&
            this.grid.elements[i][j - 1].tile &&
            this.grid.elements[i - 1][j].tile &&
            this.grid.elements[i + 1][j].tile
        )
            return true;
        return false;
    }

    private wordHasThreeE(): number {
        let numberOfE = 0;
        for (const char of this.word) if (char === serviceConstants.MIN_E_CHAR || char === serviceConstants.MAJ_E_CHAR) numberOfE++;
        return numberOfE >= serviceConstants.THREE_TIMES ? this.completedQuestPoints() : 0;
    }

    private gridHasTwoIdenticalWords(): number {
        let count: number;
        for (const word of this.wordsOnGrid) {
            count = 0;
            for (const otherWords of this.wordsOnGrid) if (word === otherWords) count++;
            if (count >= serviceConstants.TWO_TIMES) return this.completedQuestPoints();
        }
        return 0;
    }

    private isLongWord(): number {
        return this.placedTiles.tiles.tilesCompleteWord.length >= serviceConstants.LENGHT_LONG_WORD ? this.completedQuestPoints() : 0;
    }

    private gridHasTwoFilledCorners(): number {
        const corners: (Tile | null)[] = [
            this.grid.elements[0][0].tile,
            this.grid.elements[serviceConstants.GRID_SIZE - 1][0].tile,
            this.grid.elements[0][serviceConstants.GRID_SIZE - 1].tile,
            this.grid.elements[serviceConstants.GRID_SIZE - 1][serviceConstants.GRID_SIZE - 1].tile,
        ];
        return corners.filter((tile) => tile).length >= serviceConstants.MIN_CORNERS ? this.completedQuestPoints() : 0;
    }

    private fiveSecondsPlacement(): number {
        return this.timer <= serviceConstants.FIVE_SECONDS && this.isPlacementLongerThanFive() ? this.completedQuestPoints() : 0;
    }

    private isPlacementLongerThanFive(): boolean {
        return this.placedTiles.tiles.newTilesToAdd.length >= serviceConstants.MINIMUM_LENGTH;
    }

    private completedQuestPoints(): number {
        this.quest.isAccomplished = true;
        return this.quest.points;
    }

    private convertTilesToWord(): void {
        if (this.placedTiles) for (const tile of this.placedTiles.tiles.tilesCompleteWord) this.word += tile.name;
    }
}

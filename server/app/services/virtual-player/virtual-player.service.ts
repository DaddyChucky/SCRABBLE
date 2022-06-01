import { BoardAnalyzerService } from '@app/services/board-analyzer/board-analyzer.service';
import { WordPossibility } from '@app/services/board-analyzer/board-analyzer.service.constants';
import { PointCalculatorService } from '@app/services/point-calculator/point-calculator.service';
import { ScrabbleGridService } from '@app/services/scrabble-grid/scrabble-grid.service';
import { TurnManagerService } from '@app/services/turn-manager/turn-manager.service';
import { ASCII_LETTER_START_MAJ } from '@common/model/constants';
import { DirectionType } from '@common/model/direction-type';
import { Letter } from '@common/model/letter';
import { LetterBag } from '@common/model/letter-bag/letter-bag';
import { ParsedInfo } from '@common/model/parsed-info';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Tile } from '@common/model/tile';
import { Vec2 } from '@common/model/vec2';
import { VirtualPlayerDifficulty } from '@common/model/virtual-player-difficulty';
import { WordValidation } from '@common/model/word-validation';
import { Service } from 'typedi';
import * as serviceConstants from './virtual-player.service.constants';

@Service()
export class VirtualPlayerService {
    constructor(
        private readonly scrabbleGrid: ScrabbleGrid,
        private readonly boardAnalyzerService: BoardAnalyzerService,
        private readonly letterBag: LetterBag,
        private readonly playerLetters: string,
        private readonly pointsCalculatorService: PointCalculatorService,
        private readonly turnManagerService: TurnManagerService,
        private readonly scrabbleGridService: ScrabbleGridService,
        private readonly difficulty: VirtualPlayerDifficulty,
    ) {}

    async play(): Promise<string> {
        let wordPossibilities: Set<WordPossibility>;
        switch (this.chooseAction()) {
            case serviceConstants.VirtualPlayerPossibleActions.PASS:
                return serviceConstants.PASS_COMMAND;
            case serviceConstants.VirtualPlayerPossibleActions.EXCHANGE:
                if (!this.lettersLeftInLetterBag()) return serviceConstants.PASS_COMMAND;
                return serviceConstants.EXCHANGE_COMMAND + serviceConstants.SPACE_STR + this.randomizeExchangeLetters();
            case serviceConstants.VirtualPlayerPossibleActions.PLACE:
                wordPossibilities = await this.boardAnalyzerService.calculateWordPossibilities(this.playerLetters);
                return this.convertWordPossibilityToCommand(wordPossibilities);
        }
    }

    private getRandomIndex(ceil: number): number {
        return Math.ceil(Math.random() * (ceil - 1));
    }

    private selectPointsRange(): serviceConstants.PointsRange {
        const randomPointsRange: number = Math.random();
        if (randomPointsRange >= serviceConstants.POINTS_RANGE_UPPER_BOUND) return serviceConstants.PointsRange.UPPER;
        if (randomPointsRange >= serviceConstants.POINTS_RANGE_LOWER_BOUND) return serviceConstants.PointsRange.MID;
        return serviceConstants.PointsRange.LOWER;
    }

    private getTilesOnGrid(): Tile[] {
        const tilesOnGrid: Tile[] = [];
        for (const ySquare of this.scrabbleGrid.elements) {
            for (const xSquare of ySquare) {
                if (ySquare && xSquare && xSquare.tile) {
                    tilesOnGrid.push(xSquare.tile);
                }
            }
        }
        return tilesOnGrid;
    }

    private getOffSetX(chosenPossibility: WordPossibility): number {
        let offSetX = 0;
        while (
            this.scrabbleGrid.elements[chosenPossibility.anchor.y] &&
            chosenPossibility.anchor.x - offSetX >= 0 &&
            this.scrabbleGrid.elements[chosenPossibility.anchor.y][chosenPossibility.anchor.x - offSetX].tile
        ) {
            offSetX += 1;
        }
        return offSetX;
    }

    private getOffSetY(chosenPossibility: WordPossibility): number {
        let offSetY = 0;
        while (
            this.scrabbleGrid.elements[chosenPossibility.anchor.y - offSetY] &&
            this.scrabbleGrid.elements[chosenPossibility.anchor.y - offSetY][chosenPossibility.anchor.x].tile
        ) {
            offSetY += 1;
        }
        return offSetY;
    }

    private convertWordPossibilityToCommand(wordPossibilities: Set<WordPossibility>): string {
        if (!wordPossibilities.size) return this.chooseNoPossibilityCommand();
        const finalChosenPossibility: WordPossibility | undefined = this.percolateWordPossibilities(
            Array.from(wordPossibilities),
            this.getTilesOnGrid(),
            this.selectPointsRange(),
        );
        if (!finalChosenPossibility || !finalChosenPossibility.word) return this.chooseNoPossibilityCommand();
        return this.concatenatePlaceCommand(finalChosenPossibility);
    }

    private chooseNoPossibilityCommand(): string {
        switch (this.difficulty) {
            case VirtualPlayerDifficulty.BEGINNER:
                return serviceConstants.PASS_COMMAND;
            case VirtualPlayerDifficulty.EXPERT:
                return serviceConstants.EXCHANGE_COMMAND + serviceConstants.SPACE_STR + this.randomizeExchangeLetters();
        }
    }

    private percolateWordPossibilities(
        wordPossibilities: WordPossibility[],
        tilesOnGrid: Tile[],
        pointsRange: serviceConstants.PointsRange,
    ): WordPossibility | undefined {
        if (!wordPossibilities.length) return undefined;
        let savedWordPossibility: WordPossibility = {} as WordPossibility;
        let finalChosenPossibilityPointsFormed = 0;
        let stop = false;
        for (const chosenPossibility of wordPossibilities) {
            const offSetX: number = this.getOffSetX(chosenPossibility);
            const offSetY: number = this.getOffSetY(chosenPossibility);
            const parsedInfo: ParsedInfo = {
                lobbyId: '',
                scrabbleGrid: this.scrabbleGrid,
                lettersCommand: chosenPossibility.playerLetters,
                position: { x: chosenPossibility.anchor.x, y: chosenPossibility.anchor.y } as Vec2,
                direction: chosenPossibility.wordDirection,
            } as ParsedInfo;
            const wordValidation: WordValidation = this.scrabbleGridService.createWordValidation(parsedInfo);
            if (!this.boardAnalyzerService.dawg.has(parsedInfo.completeWord)) continue;
            wordValidation.tiles.tilesOnGrid = tilesOnGrid;
            wordValidation.tiles.newTilesToAdd = this.getNewTilesToAdd(chosenPossibility, offSetX, offSetY);
            wordValidation.tiles.tilesCompleteWord = this.getTilesCompleteWord(chosenPossibility);
            if (!this.turnManagerService.checkWordValidationAndPoints(wordValidation)) continue;
            switch (this.difficulty) {
                case VirtualPlayerDifficulty.BEGINNER:
                    if (this.isValidPointsRange(pointsRange)) {
                        stop = true;
                    }
                    break;
                case VirtualPlayerDifficulty.EXPERT:
                    if (finalChosenPossibilityPointsFormed <= this.pointsCalculatorService.newPoints) {
                        savedWordPossibility = chosenPossibility;
                        finalChosenPossibilityPointsFormed = this.pointsCalculatorService.newPoints;
                    }
                    break;
            }
            if (stop && this.difficulty === VirtualPlayerDifficulty.BEGINNER) {
                savedWordPossibility = chosenPossibility;
            }
        }
        return savedWordPossibility;
    }

    private isValidPointsRange(pointsRange: serviceConstants.PointsRange): boolean {
        switch (pointsRange) {
            case serviceConstants.PointsRange.UPPER:
                return (
                    this.pointsCalculatorService.newPoints > serviceConstants.PointsRange.MID &&
                    this.pointsCalculatorService.newPoints <= serviceConstants.PointsRange.UPPER
                );
            case serviceConstants.PointsRange.MID:
                return (
                    this.pointsCalculatorService.newPoints > serviceConstants.PointsRange.LOWER &&
                    this.pointsCalculatorService.newPoints <= serviceConstants.PointsRange.MID
                );
            case serviceConstants.PointsRange.LOWER:
                return this.pointsCalculatorService.newPoints <= serviceConstants.PointsRange.LOWER;
        }
    }

    private concatenatePlaceCommand(finalChosenPossibility: WordPossibility): string {
        return (
            serviceConstants.PLACE_COMMAND +
            serviceConstants.SPACE_STR +
            String.fromCharCode(ASCII_LETTER_START_MAJ + finalChosenPossibility.anchor.y).toLowerCase() +
            (finalChosenPossibility.anchor.x + 1).toString() +
            finalChosenPossibility.wordDirection.toLowerCase() +
            serviceConstants.SPACE_STR +
            finalChosenPossibility.playerLetters.toLowerCase()
        );
    }

    private getTilesCompleteWord(chosenPossibility: WordPossibility): Tile[] {
        const tilesCompleteWord: Tile[] = [];
        chosenPossibility.word.split('').forEach((letter: string, i: number) => {
            switch (chosenPossibility.wordDirection) {
                case DirectionType.VERTICAL:
                    tilesCompleteWord.push(
                        new Tile(
                            { x: chosenPossibility.anchor.x, y: chosenPossibility.anchor.y - i } as Vec2,
                            letter,
                            this.boardAnalyzerService.addLetterTilesWeightToPoints(letter),
                        ),
                    );
                    break;
                case DirectionType.HORIZONTAL:
                    tilesCompleteWord.push(
                        new Tile(
                            { x: chosenPossibility.anchor.x - i, y: chosenPossibility.anchor.y } as Vec2,
                            letter,
                            this.boardAnalyzerService.addLetterTilesWeightToPoints(letter),
                        ),
                    );
                    break;
            }
        });
        return tilesCompleteWord;
    }

    private getNewTilesToAdd(chosenPossibility: WordPossibility, offSetX: number, offSetY: number): Tile[] {
        const newTilesToAdd: Tile[] = [];
        chosenPossibility.playerLetters.split('').forEach((letter: string, i: number) => {
            switch (chosenPossibility.wordDirection) {
                case DirectionType.VERTICAL:
                    newTilesToAdd.push(
                        new Tile(
                            { x: chosenPossibility.anchor.x, y: chosenPossibility.anchor.y - i - offSetY } as Vec2,
                            letter,
                            this.boardAnalyzerService.addLetterTilesWeightToPoints(letter),
                        ),
                    );
                    break;
                case DirectionType.HORIZONTAL:
                    newTilesToAdd.push(
                        new Tile(
                            { x: chosenPossibility.anchor.x - i - offSetX, y: chosenPossibility.anchor.y } as Vec2,
                            letter,
                            this.boardAnalyzerService.addLetterTilesWeightToPoints(letter),
                        ),
                    );
                    break;
            }
        });
        return newTilesToAdd;
    }

    private randomizeExchangeLetters(): string {
        switch (this.difficulty) {
            case VirtualPlayerDifficulty.BEGINNER:
                return this.beginnerExchangeLettersRandomizer();
            case VirtualPlayerDifficulty.EXPERT:
                return this.expertExchangeLettersRandomizer();
        }
    }

    private expertExchangeLettersRandomizer(): string {
        if (this.lettersLeftInLetterBag() >= serviceConstants.MIN_TILES_IN_LETTERBAG) {
            return this.playerLetters.toLowerCase();
        }
        return this.beginnerExchangeLettersRandomizer();
    }

    private lettersLeftInLetterBag(): number {
        return this.letterBag.letters
            .map((letter: Letter) => letter.quantity)
            .reduce((amountTileInBag: number, amount: number) => amountTileInBag + amount);
    }

    private beginnerExchangeLettersRandomizer(): string {
        let indexesOfExchange = '';
        let nLettersToExchange = this.getRandomIndex(this.playerLetters.length);
        while (nLettersToExchange === 0) {
            nLettersToExchange = this.getRandomIndex(this.playerLetters.length);
        }
        while (indexesOfExchange.length < nLettersToExchange) {
            const letterIndexToExchange: string = this.getRandomIndex(this.playerLetters.length).toString();
            if (!indexesOfExchange.includes(letterIndexToExchange)) {
                indexesOfExchange += letterIndexToExchange;
            }
        }
        let lettersToBeExchanged = '';
        for (const index of indexesOfExchange) {
            lettersToBeExchanged += this.playerLetters[Number(index)];
        }
        return lettersToBeExchanged.toLowerCase();
    }

    private chooseAction(): serviceConstants.VirtualPlayerPossibleActions {
        const probability: number = Math.random();
        switch (this.difficulty) {
            case VirtualPlayerDifficulty.BEGINNER:
                if (probability >= serviceConstants.PASS_PROBABILITY_LOWER_BOUND) {
                    return serviceConstants.VirtualPlayerPossibleActions.PASS;
                } else if (probability >= serviceConstants.EXCHANGE_PROBABILITY_LOWER_BOUND) {
                    return serviceConstants.VirtualPlayerPossibleActions.EXCHANGE;
                } else {
                    return serviceConstants.VirtualPlayerPossibleActions.PLACE;
                }
            case VirtualPlayerDifficulty.EXPERT:
                return serviceConstants.VirtualPlayerPossibleActions.PLACE;
        }
    }
}

/* eslint-disable max-lines */
import { WordPossibility } from '@app/services/command-message-creator/command-message-creator.service.constants';
import { GRID_SQUARES_PER_LINE, MAX_TILES_PER_PLAYER } from '@common/model/constants';
import { DirectionType } from '@common/model/direction-type';
import { Letter } from '@common/model/letter';
import { LetterBag } from '@common/model/letter-bag/letter-bag';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Square } from '@common/model/square';
import { Vec2 } from '@common/model/vec2';
// @ts-ignore -- module from before 2015
import Dawg from 'dawg-set';
import { transpose } from 'matrix-transpose';
import { Service } from 'typedi';
import * as serviceConstants from './board-analyzer.service.constants';

@Service()
export class BoardAnalyzerService {
    private static letterBag: LetterBag;
    readonly dawg: typeof Dawg;
    private readonly liveBoard: serviceConstants.LetPos[];
    private readonly liveBoardT: serviceConstants.LetPos[];
    private upCurrentPaths: Set<string>;
    private downCurrentPaths: Set<string>;
    private wordPossibilities: Set<serviceConstants.WordPossibility>;

    constructor(private readonly scrabbleGrid: ScrabbleGrid, private dictionary: string[]) {
        BoardAnalyzerService.letterBag = new LetterBag();
        this.liveBoard = [];
        this.liveBoardT = [];
        this.upCurrentPaths = new Set<string>();
        this.downCurrentPaths = new Set<string>();
        this.wordPossibilities = new Set<serviceConstants.WordPossibility>();
        this.dawg = new Dawg(this.dictionary.sort());
        this.convertScrabbleGridTileNamesToLowercase();
        this.convert2DBoardTo1D();
    }

    async calculateWordPossibilities(playerLettersV: string): Promise<Set<serviceConstants.WordPossibility>> {
        const playerLetters: string = playerLettersV.toLowerCase();
        this.wordPossibilities.clear();
        await this.travelPossibilitiesAndWords(this.getPossibilities(), playerLetters, false);
        await this.travelPossibilitiesAndWords(this.getPossibilitiesT(), playerLetters, true);
        await this.filterWordPossibilities();
        await this.updatePlayerLettersOfPossibilities();
        return this.wordPossibilities;
    }

    addLetterTilesWeightToPoints(letters: string): number {
        let fictionPoints = 0;
        for (const letter of BoardAnalyzerService.letterBag.letters.filter((letterBagLetter: Letter) =>
            letters.includes(letterBagLetter.tile.name.toLowerCase()),
        )) {
            fictionPoints += letter.tile.weight;
        }
        return fictionPoints;
    }

    private convertScrabbleGridTileNamesToLowercase(): void {
        this.scrabbleGrid.elements.forEach((elem: Square[]) => {
            elem.forEach((square: Square) => {
                if (square.tile && square.tile.name) {
                    square.tile.name = square.tile.name.toLowerCase();
                }
            });
        });
    }

    private convert2DBoardTo1D(): void {
        const scrabbleGridT: ScrabbleGrid = this.transposeGridElements(this.scrabbleGrid);
        for (let y = 0; y < GRID_SQUARES_PER_LINE; ++y) {
            for (let x = 0; x < GRID_SQUARES_PER_LINE; ++x) {
                this.pushLiveBoard(this.getScrabbleGridSquare(x, y, this.scrabbleGrid), { x, y } as Vec2);
                this.pushLiveBoardT(this.getScrabbleGridSquare(x, y, scrabbleGridT), { x, y } as Vec2);
            }
        }
    }

    private async travelPossibilitiesAndWords(
        possibilities: serviceConstants.LetPos[][],
        playerLetters: string,
        isTransposed: boolean,
    ): Promise<void> {
        possibilities.forEach((possibility: serviceConstants.LetPos[], indexOfPossibility: number) => {
            this.getAnchorsIndexesOfPossibility(possibility).forEach((anchorAndPosition: serviceConstants.AnchorAndPosition) => {
                this.formPossibleWords(anchorAndPosition.anchor, indexOfPossibility, possibilities, playerLetters).forEach(
                    (setOfWords: Set<string>) => {
                        for (const possibleWord of setOfWords) {
                            if (this.hasWildCard(possibleWord)) {
                                this.addWildCardWordsToPossibilities(possibleWord, isTransposed, playerLetters, anchorAndPosition);
                            } else {
                                this.addWordToPossibilities(possibleWord, isTransposed, playerLetters, anchorAndPosition);
                            }
                        }
                    },
                );
            });
        });
    }

    private addWildCardWordsToPossibilities(
        possibleWord: string,
        isTransposed: boolean,
        playerLetters: string,
        anchorAndPosition: serviceConstants.AnchorAndPosition,
    ): void {
        const possibleWordArr: string[] = possibleWord.split('');
        const wildCardIndexes: number[] = this.getWildCardIndexesOfPossibleWord(possibleWordArr);
        wildCardIndexes.forEach((wildCardIndex: number) => {
            serviceConstants.ALPHABET.split('').forEach((firstWildCardLetter: string) => {
                possibleWordArr[wildCardIndex] = firstWildCardLetter;
                if (wildCardIndexes.length > serviceConstants.MIN_COUNT_OF_WILDCARDS) {
                    serviceConstants.ALPHABET.split('').forEach((secondWildCardLetter: string) => {
                        if (wildCardIndex === serviceConstants.MIN_COUNT_OF_WILDCARDS) {
                            possibleWordArr[wildCardIndexes[0]] = secondWildCardLetter;
                        } else {
                            possibleWordArr[wildCardIndexes[serviceConstants.MIN_COUNT_OF_WILDCARDS]] = secondWildCardLetter;
                        }
                        this.addWordToPossibilities(possibleWordArr.join(''), isTransposed, playerLetters, anchorAndPosition);
                    });
                } else {
                    this.addWordToPossibilities(possibleWordArr.join(''), isTransposed, playerLetters, anchorAndPosition);
                }
            });
        });
    }

    private getWildCardIndexesOfPossibleWord(possibleWordArr: string[]): number[] {
        const wildCardIndexes: number[] = [];
        possibleWordArr.forEach((letter: string, i: number) => {
            if (letter === serviceConstants.WILDCARD_CHAR) {
                wildCardIndexes.push(i);
            }
        });
        return wildCardIndexes;
    }

    private addWordToPossibilities(
        possibleWord: string,
        isTransposed: boolean,
        playerLetters: string,
        anchorAndPosition: serviceConstants.AnchorAndPosition,
    ): void {
        if (!this.dawg.has(possibleWord)) return;
        const wordDirection: DirectionType = isTransposed ? DirectionType.HORIZONTAL : DirectionType.VERTICAL;
        const anchor: Vec2 = isTransposed ? this.reverseAnchorPosition(anchorAndPosition.position) : anchorAndPosition.position;
        this.wordPossibilities.add({
            word: possibleWord,
            playerLetters,
            anchor,
            wordDirection,
        } as serviceConstants.WordPossibility);
    }

    private hasWildCard(possibleWord: string): boolean {
        return possibleWord.split('').filter((letter: string) => letter === serviceConstants.WILDCARD_CHAR).length > 0;
    }

    private async filterWordPossibilities(): Promise<void> {
        const realPossibilities: Set<serviceConstants.WordPossibility> = new Set<serviceConstants.WordPossibility>();
        for (const word of this.wordPossibilities) {
            for (const possibleWord of this.wordPossibilities) {
                if (word !== possibleWord && this.isVectorEqual(word.anchor, possibleWord.anchor)) {
                    realPossibilities.add(word);
                    break;
                }
            }
        }
        this.wordPossibilities = realPossibilities;
    }

    private isElementAnchorIndexable(yAnchor: number, xPos: number) {
        return this.scrabbleGrid.elements[yAnchor] && this.scrabbleGrid.elements[yAnchor][xPos] && this.scrabbleGrid.elements[yAnchor][xPos].tile;
    }

    private doHorizontalUpdate(possibility: WordPossibility): string {
        let boardLetters = '';
        let posX = possibility.anchor.x - 1;
        while (posX >= 0 && this.isElementAnchorIndexable(possibility.anchor.y, posX)) {
            boardLetters += this.scrabbleGrid.elements[possibility.anchor.y][posX].tile?.name;
            posX -= 1;
        }
        posX = possibility.anchor.x + 1;
        possibility.word.split('').every(() => {
            if (this.isElementAnchorIndexable(possibility.anchor.y, posX)) {
                boardLetters += this.scrabbleGrid.elements[possibility.anchor.y][posX].tile?.name;
            }
            if (
                this.isElementAnchorIndexable(possibility.anchor.y, posX) &&
                this.scrabbleGrid.elements[possibility.anchor.y][posX].tile?.name === possibility.word[possibility.word.length - 1]
            ) {
                return;
            }
            posX += 1;
        });
        return boardLetters;
    }

    private doVerticalUpdate(possibility: WordPossibility): string {
        let boardLetters = '';
        let posY = possibility.anchor.y - 1;
        while (posY >= 0 && this.isElementAnchorIndexable(posY, possibility.anchor.x)) {
            boardLetters += this.scrabbleGrid.elements[posY][possibility.anchor.x].tile?.name;
            posY -= 1;
        }
        posY = possibility.anchor.y + 1;
        possibility.word.split('').every(() => {
            if (this.isElementAnchorIndexable(posY, possibility.anchor.x)) {
                boardLetters += this.scrabbleGrid.elements[posY][possibility.anchor.x].tile?.name;
            }
            if (
                this.isElementAnchorIndexable(posY, possibility.anchor.x) &&
                this.scrabbleGrid.elements[posY][possibility.anchor.x].tile?.name === possibility.word[possibility.word.length - 1]
            ) {
                return;
            }
            posY += 1;
        });
        return boardLetters;
    }

    private async updatePlayerLettersOfPossibilities(): Promise<void> {
        this.wordPossibilities.forEach((possibility: serviceConstants.WordPossibility) => {
            let finalBoardLetters = '';
            switch (possibility.wordDirection) {
                case DirectionType.HORIZONTAL:
                    finalBoardLetters = this.doHorizontalUpdate(possibility);
                    break;
                case DirectionType.VERTICAL:
                    finalBoardLetters = this.doVerticalUpdate(possibility);
                    break;
            }
            let wordArr: string[] = possibility.word.split('');
            wordArr = this.flushCommonLetters(wordArr, finalBoardLetters.split(''));
            wordArr = this.replacePlayerLettersWildCards(possibility, wordArr, finalBoardLetters);
            possibility.playerLetters = Array.from(wordArr).join('');
        });
    }

    private flushCommonLetters(wordArr: string[], boardLettersArr: string[]): string[] {
        for (let i = 0; i < wordArr.length; ++i) {
            for (let j = 0; j < boardLettersArr.length; ++j) {
                if (wordArr[i] === boardLettersArr[j]) {
                    wordArr[i] = '';
                    boardLettersArr[j] = '';
                }
            }
        }
        return wordArr;
    }

    private replacePlayerLettersWildCards(possibility: WordPossibility, wordArr: string[], finalBoardLetters: string): string[] {
        if (possibility.playerLetters.includes(serviceConstants.WILDCARD_CHAR)) {
            for (let i = 0; i < wordArr.length; ++i) {
                if (!possibility.playerLetters.includes(wordArr[i]) && !finalBoardLetters.includes(wordArr[i])) {
                    wordArr[i] = wordArr[i].toUpperCase();
                }
            }
        }
        return wordArr;
    }

    private reverseAnchorPosition(initialPos: Vec2): Vec2 {
        return { x: initialPos.y, y: initialPos.x } as Vec2;
    }

    private formPossibleWords(from: number, ofLetPos: number, listOfLetPos: serviceConstants.LetPos[][], playerLetters: string): Set<string>[] {
        let possibleWords: Set<string>[] = [];
        this.clearCurrentPaths();
        this.addPlayerLettersToPath(playerLetters);
        let i = 1;
        while (i <= MAX_TILES_PER_PLAYER) {
            possibleWords = this.formUpPossibleWords({
                possibleWords,
                index: i,
                from,
                ofLetPos,
                listOfLetPos,
                playerLetters,
            } as serviceConstants.PossibleWordFormingData);
            possibleWords = this.formDownPossibleWords({
                possibleWords,
                index: i,
                from,
                ofLetPos,
                listOfLetPos,
                playerLetters,
            } as serviceConstants.PossibleWordFormingData);
            ++i;
        }
        return possibleWords;
    }

    private isAbleToBeFormedUpwards(possibleWordFormingData: serviceConstants.PossibleWordFormingData): boolean {
        return (
            possibleWordFormingData.from - possibleWordFormingData.index >= 0 &&
            (possibleWordFormingData.from + 1 >= possibleWordFormingData.listOfLetPos[possibleWordFormingData.ofLetPos].length ||
                !possibleWordFormingData.listOfLetPos[possibleWordFormingData.ofLetPos][possibleWordFormingData.from + 1].letter)
        );
    }

    private isUpPossibleWordWorthy(possibleWordFormingData: serviceConstants.PossibleWordFormingData): boolean {
        return (
            this.upCurrentPaths.size > 0 &&
            (possibleWordFormingData.from - possibleWordFormingData.index - 1 < 0 ||
                !possibleWordFormingData.listOfLetPos[possibleWordFormingData.ofLetPos][
                    possibleWordFormingData.from - possibleWordFormingData.index - 1
                ].letter)
        );
    }

    private formUpPossibleWords(possibleWordFormingData: serviceConstants.PossibleWordFormingData): Set<string>[] {
        if (this.isAbleToBeFormedUpwards(possibleWordFormingData)) {
            this.percolateUp(
                possibleWordFormingData.listOfLetPos[possibleWordFormingData.ofLetPos],
                possibleWordFormingData.listOfLetPos[possibleWordFormingData.ofLetPos][possibleWordFormingData.from - possibleWordFormingData.index]
                    ?.letter,
                possibleWordFormingData.playerLetters,
            );
            if (this.isUpPossibleWordWorthy(possibleWordFormingData)) {
                possibleWordFormingData.possibleWords.push(this.upCurrentPaths);
            }
        }
        return possibleWordFormingData.possibleWords;
    }

    private isAbleToBeFormedDownwards(possibleWordFormingData: serviceConstants.PossibleWordFormingData): boolean {
        return (
            possibleWordFormingData.from + possibleWordFormingData.index <
                possibleWordFormingData.listOfLetPos[possibleWordFormingData.ofLetPos].length &&
            (possibleWordFormingData.from - 1 < 0 ||
                !possibleWordFormingData.listOfLetPos[possibleWordFormingData.ofLetPos][possibleWordFormingData.from - 1].letter)
        );
    }

    private isDownPossibleWordWorthy(possibleWordFormingData: serviceConstants.PossibleWordFormingData): boolean {
        return (
            this.downCurrentPaths.size > 0 &&
            (possibleWordFormingData.from + possibleWordFormingData.index + 1 >=
                possibleWordFormingData.listOfLetPos[possibleWordFormingData.ofLetPos].length ||
                !possibleWordFormingData.listOfLetPos[possibleWordFormingData.ofLetPos][
                    possibleWordFormingData.from + possibleWordFormingData.index + 1
                ].letter)
        );
    }

    private formDownPossibleWords(possibleWordFormingData: serviceConstants.PossibleWordFormingData): Set<string>[] {
        if (this.isAbleToBeFormedDownwards(possibleWordFormingData)) {
            this.percolateDown(
                possibleWordFormingData.listOfLetPos[possibleWordFormingData.ofLetPos],
                possibleWordFormingData.listOfLetPos[possibleWordFormingData.ofLetPos][possibleWordFormingData.from + possibleWordFormingData.index]
                    ?.letter,
                possibleWordFormingData.playerLetters,
            );
            if (this.isDownPossibleWordWorthy(possibleWordFormingData)) {
                possibleWordFormingData.possibleWords.push(this.downCurrentPaths);
            }
        }
        return possibleWordFormingData.possibleWords;
    }

    private clearCurrentPaths(): void {
        this.upCurrentPaths.clear();
        this.downCurrentPaths.clear();
    }

    private addPlayerLettersToPath(playerLetters: string): void {
        for (const letter of playerLetters) {
            this.upCurrentPaths.add(letter);
            this.downCurrentPaths.add(letter);
        }
    }

    private percolateUp(ofLetPos: serviceConstants.LetPos[], upLetter: string | null, playerLetters: string): void {
        if (upLetter) {
            this.addLetterToCurrentPaths({
                paths: this.upCurrentPaths,
                percolationDirection: serviceConstants.PercolationDirection.UP,
                ofLetPos,
                letters: upLetter,
                reverse: true,
            } as serviceConstants.LetterAdditionInformation);
        } else {
            this.addLetterToCurrentPaths({
                paths: this.upCurrentPaths,
                percolationDirection: serviceConstants.PercolationDirection.UP,
                ofLetPos,
                letters: playerLetters,
                reverse: true,
            } as serviceConstants.LetterAdditionInformation);
        }
    }

    private percolateDown(ofLetPos: serviceConstants.LetPos[], downLetter: string | null, playerLetters: string): void {
        this.addLetterToCurrentPaths({
            paths: this.downCurrentPaths,
            percolationDirection: serviceConstants.PercolationDirection.DOWN,
            ofLetPos,
            letters: downLetter ? downLetter : playerLetters,
            reverse: false,
        } as serviceConstants.LetterAdditionInformation);
    }

    private addLetterToCurrentPaths(letterAdditionInformation: serviceConstants.LetterAdditionInformation): void {
        const newPaths: Set<string> = new Set<string>();
        for (const path of letterAdditionInformation.paths) {
            const lettersPlaced: string = this.getLettersPlaced(path, letterAdditionInformation.ofLetPos);
            for (const letter of letterAdditionInformation.letters) {
                if (this.getLetterOccurrence(letter, lettersPlaced) >= this.getLetterOccurrence(letter, letterAdditionInformation.letters)) continue;
                if (letterAdditionInformation.reverse) {
                    newPaths.add(letter + path);
                } else {
                    newPaths.add(path + letter);
                }
            }
        }
        switch (letterAdditionInformation.percolationDirection) {
            case serviceConstants.PercolationDirection.UP:
                this.upCurrentPaths = newPaths;
                break;
            case serviceConstants.PercolationDirection.DOWN:
                this.downCurrentPaths = newPaths;
                break;
        }
    }

    private getLetterOccurrence(letter: string, occurrence: string): number {
        return occurrence.split('').filter((occ: string) => occ === letter).length;
    }

    private getLettersPlaced(path: string, initialPossibilities: serviceConstants.LetPos[]): string {
        const unplaceableLetPos: serviceConstants.LetPos[] = initialPossibilities.filter((letPos: serviceConstants.LetPos) => letPos.letter);
        const pathArr: string[] = path.split('');
        for (const letPos of unplaceableLetPos) {
            const index: number = pathArr.findIndex((pathLetter: string) => pathLetter === letPos.letter);
            if (index !== serviceConstants.LETTER_PLACED_INDEX_NOT_FOUND) {
                pathArr[index] = '';
            }
        }
        let remindingLetters = '';
        for (const letter of pathArr) {
            remindingLetters += letter;
        }
        return remindingLetters;
    }

    private getAnchorsIndexesOfPossibility(possibility: serviceConstants.LetPos[]): Set<serviceConstants.AnchorAndPosition> {
        const anchorsIndexes: Set<serviceConstants.AnchorAndPosition> = new Set<serviceConstants.AnchorAndPosition>();
        for (let i = 1; i < possibility.length - 1; ++i) {
            if (this.isAnchorIndexable(i, possibility)) {
                anchorsIndexes.add({ anchor: i, position: possibility[i].pos });
            }
        }
        return anchorsIndexes;
    }

    private isAnchorIndexable(index: number, possibility: serviceConstants.LetPos[]): boolean {
        return possibility[index].letter === null && possibility[index + 1].letter !== null && possibility[index - 1].letter === null;
    }

    private getPossibilities(): serviceConstants.LetPos[][] {
        return this.convertPercolationToLetPos(this.percolate(this.liveBoard, this.crossChecksPos(this.liveBoard)), this.liveBoard);
    }

    private getPossibilitiesT(): serviceConstants.LetPos[][] {
        return this.convertPercolationToLetPos(this.percolate(this.liveBoardT, this.crossChecksPos(this.liveBoardT)), this.liveBoardT);
    }

    private convertPercolationToLetPos(percolation: Set<number>[], board: serviceConstants.LetPos[]): serviceConstants.LetPos[][] {
        const letPosListOfLists: serviceConstants.LetPos[][] = [];
        for (const sets of percolation) {
            const letPosList: serviceConstants.LetPos[] = [];
            for (const possiblePercolation of sets) {
                letPosList.push({
                    // @ts-ignore cannot be undefined -- condition verified before
                    letter: board.find((letPos: serviceConstants.LetPos) =>
                        this.isVectorEqual(letPos.pos, this.convert1DPosTo2DVec2(possiblePercolation)),
                    ).letter,
                    pos: this.convert1DPosTo2DVec2(possiblePercolation),
                } as serviceConstants.LetPos);
            }
            letPosList.sort((a: serviceConstants.LetPos, b: serviceConstants.LetPos) => a.pos.y - b.pos.y);
            letPosListOfLists.push(letPosList);
        }
        return letPosListOfLists;
    }

    private isVectorEqual(a: Vec2, b: Vec2): boolean {
        return a.x === b.x && a.y === b.y;
    }

    private convert1DPosTo2DVec2(pos1D: number): Vec2 {
        return { x: pos1D % GRID_SQUARES_PER_LINE, y: Math.floor(pos1D / GRID_SQUARES_PER_LINE) } as Vec2;
    }

    private percolate(board: serviceConstants.LetPos[], set: Set<number>): Set<number>[] {
        const groups: Set<number>[] = [];
        for (const anchor of set) {
            const group: Set<number> = new Set<number>();
            let continuePercolatingUp = true;
            let continuePercolatingDown = true;
            for (let i = 1; i <= MAX_TILES_PER_PLAYER; ++i) {
                const percolateUp: number = anchor - i * GRID_SQUARES_PER_LINE;
                const percolateDown: number = anchor + i * GRID_SQUARES_PER_LINE;
                if (continuePercolatingUp && this.boardHasLetter(percolateUp, board) !== undefined) {
                    group.add(percolateUp);
                } else {
                    continuePercolatingUp = false;
                }
                if (continuePercolatingDown && this.boardHasLetter(percolateDown, board) !== undefined) {
                    group.add(percolateDown);
                } else {
                    continuePercolatingDown = false;
                }
            }
            if (group.size > 0) {
                group.add(anchor);
                groups.push(group);
            }
        }
        return groups.sort((a: Set<number>, b: Set<number>): number => b.size - a.size);
    }

    private crossChecksPos(liveBoard: serviceConstants.LetPos[]): Set<number> {
        const positions: Set<number> = new Set<number>();
        for (let i = 0; i < liveBoard.length; ++i) {
            if (this.isCrossCheckValid(i, liveBoard)) {
                positions.add(i);
            }
        }
        return positions;
    }

    private pushLiveBoard(square: Square, position: Vec2): void {
        this.liveBoard.push({
            letter: square.tile ? square.tile.name : null,
            pos: position,
        } as serviceConstants.LetPos);
    }

    private pushLiveBoardT(square: Square, position: Vec2): void {
        this.liveBoardT.push({
            letter: square.tile ? square.tile.name : null,
            pos: position,
        } as serviceConstants.LetPos);
    }

    private transposeGridElements(grid: ScrabbleGrid): ScrabbleGrid {
        const scrabbleGridT: ScrabbleGrid = { elements: [] } as ScrabbleGrid;
        scrabbleGridT.elements = transpose(grid.elements);
        return scrabbleGridT;
    }

    private getScrabbleGridSquare(x: number, y: number, scrabbleGrid: ScrabbleGrid): Square {
        return scrabbleGrid.elements[y][x];
    }

    private isCrossCheckValid(pos: number, liveBoard: serviceConstants.LetPos[]): boolean {
        if (this.boardHasLetter(pos, liveBoard)) {
            return (
                this.boardHasLetter(pos - GRID_SQUARES_PER_LINE, liveBoard) === false ||
                this.boardHasLetter(pos + GRID_SQUARES_PER_LINE, liveBoard) === false
            );
        }
        return false;
    }

    private boardHasLetter(pos: number, liveBoard: serviceConstants.LetPos[]): boolean | undefined {
        if (pos < 0 || pos > liveBoard.length || !liveBoard[pos]) return undefined;
        return liveBoard[pos].letter !== null;
    }
}

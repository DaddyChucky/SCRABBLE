import { BoardAnalyzerService } from '@app/services/board-analyzer/board-analyzer.service';
import { WordPossibility } from '@app/services/board-analyzer/board-analyzer.service.constants';
import { ScrabbleGridService } from '@app/services/scrabble-grid/scrabble-grid.service';
import { TurnManagerService } from '@app/services/turn-manager/turn-manager.service';
import { DirectionType } from '@common/model/direction-type';
import { ParsedInfo } from '@common/model/parsed-info';
import { Player } from '@common/model/player';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Tile } from '@common/model/tile';
import { Vec2 } from '@common/model/vec2';
import { WordValidation } from '@common/model/word-validation';
import { Service } from 'typedi';
import { MIN_LENGHT_HINTS } from './hints-provider.service.constants';

@Service()
export class HintsProviderService {
    boardAnalyzerService: BoardAnalyzerService;
    dictionnary: string[];
    constructor(private turnManager: TurnManagerService, private scrabbleGridService: ScrabbleGridService, dictionnary: string[]) {
        this.dictionnary = dictionnary;
    }

    async getThreeHints(scrabbleGrid: ScrabbleGrid, player: Player): Promise<WordPossibility[]> {
        this.boardAnalyzerService = new BoardAnalyzerService(scrabbleGrid, this.dictionnary);
        const word = this.setWordWithTiles(player.tiles);
        const set = await this.boardAnalyzerService.calculateWordPossibilities(word);
        const chosenIndices = [];
        for (const chosenPossibility of set.values()) {
            const parsedInfo: ParsedInfo = {
                lobbyId: '',
                scrabbleGrid,
                lettersCommand: chosenPossibility.playerLetters,
                position: { x: chosenPossibility.anchor.x, y: chosenPossibility.anchor.y } as Vec2,
                direction: chosenPossibility.wordDirection,
            } as ParsedInfo;
            const wordValidation: WordValidation = this.scrabbleGridService.createWordValidation(parsedInfo);
            wordValidation.tiles.tilesOnGrid = this.getTilesOnGrid(scrabbleGrid);
            wordValidation.tiles.newTilesToAdd = this.getNewTilesToAdd(
                chosenPossibility,
                this.getOffSetX(chosenPossibility, scrabbleGrid),
                this.getOffSetY(chosenPossibility, scrabbleGrid),
            );
            if (!this.turnManager.checkWordValidationAndPoints(wordValidation)) continue;
            chosenIndices.push(chosenPossibility);
            if (chosenIndices.length >= MIN_LENGHT_HINTS) break;
        }
        return chosenIndices;
    }

    private getTilesOnGrid(scrabbleGrid: ScrabbleGrid): Tile[] {
        const tilesOnGrid: Tile[] = [];
        for (const ySquare of scrabbleGrid.elements)
            for (const xSquare of ySquare) if (ySquare && xSquare && xSquare.tile) tilesOnGrid.push(xSquare.tile);

        return tilesOnGrid;
    }
    private getOffSetX(chosenPossibility: WordPossibility, scrabbleGrid: ScrabbleGrid): number {
        let offSetX = 0;
        while (
            scrabbleGrid.elements[chosenPossibility.anchor.y] &&
            chosenPossibility.anchor.x - offSetX >= 0 &&
            scrabbleGrid.elements[chosenPossibility.anchor.y][chosenPossibility.anchor.x - offSetX].tile
        )
            offSetX += 1;

        return offSetX;
    }

    private getOffSetY(chosenPossibility: WordPossibility, scrabbleGrid: ScrabbleGrid): number {
        let offSetY = 0;
        while (
            scrabbleGrid.elements[chosenPossibility.anchor.y - offSetY] &&
            scrabbleGrid.elements[chosenPossibility.anchor.y - offSetY][chosenPossibility.anchor.x].tile
        )
            offSetY += 1;

        return offSetY;
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

    private setWordWithTiles(tiles: Tile[]): string {
        let word = '';
        for (const tile of tiles) word += tile.name;
        return word;
    }
}

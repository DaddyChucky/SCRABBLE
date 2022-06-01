/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { TestHelper } from '@app/classes/test-helper';
import { BoardAnalyzerService } from '@app/services/board-analyzer/board-analyzer.service';
import { WordPossibility } from '@app/services/command-message-creator/command-message-creator.service.constants';
import { EndGameManagementService } from '@app/services/end-game-management/end-game-management.service';
import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';
import { PointCalculatorService } from '@app/services/point-calculator/point-calculator.service';
import { ScrabbleGridService } from '@app/services/scrabble-grid/scrabble-grid.service';
import { TurnManagerService } from '@app/services/turn-manager/turn-manager.service';
import { WordValidatorService } from '@app/services/word-validator/word-validator.service';
import { DirectionType } from '@common/model/direction-type';
import { LetterBag } from '@common/model/letter-bag/letter-bag';
import { ParsedInfo } from '@common/model/parsed-info';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Square } from '@common/model/square';
import { Tile } from '@common/model/tile';
import { TilesValidation } from '@common/model/tiles-validation';
import { Vec2 } from '@common/model/vec2';
import { VirtualPlayerDifficulty } from '@common/model/virtual-player-difficulty';
import { WordValidation } from '@common/model/word-validation';
import { expect } from 'chai';
import { VirtualPlayerService } from './virtual-player.service';
import * as serviceConstants from './virtual-player.service.constants';
import * as specConstants from './virtual-player.service.spec.constants';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import sinon = require('sinon');

describe('VirtualPlayerService', () => {
    const letterBagStub: LetterBag = new LetterBag();
    const gridStub: ScrabbleGrid = new TestHelper({ elements: [] } as ScrabbleGrid).initializeGrid();
    let boardAnalyzerServiceStub: sinon.SinonStubbedInstance<BoardAnalyzerService>;
    const pointCalculatorServiceStub: sinon.SinonStubbedInstance<PointCalculatorService> = sinon.createStubInstance(PointCalculatorService);
    let scrabbleGridServiceStub: sinon.SinonStubbedInstance<ScrabbleGridService>;
    let turnManagerServiceStub: sinon.SinonStubbedInstance<TurnManagerService>;
    const realWordValidatorService: WordValidatorService = new WordValidatorService(specConstants.DICT_NAME);
    const realScrabbleGridService: ScrabbleGridService = new ScrabbleGridService();
    const realLetterBagService: LetterBagService = new LetterBagService();
    const realEndGameManagamentService: EndGameManagementService = new EndGameManagementService(realLetterBagService);
    const realPointCalculatorService: PointCalculatorService = new PointCalculatorService(
        gridStub,
        [] as Tile[],
        realWordValidatorService,
        realScrabbleGridService,
    );
    const realTurnManagerService: TurnManagerService = new TurnManagerService(
        realLetterBagService,
        realEndGameManagamentService,
        realPointCalculatorService,
    );
    const wordValidatorServiceStub: sinon.SinonStubbedInstance<WordValidatorService> = sinon.createStubInstance(WordValidatorService);
    wordValidatorServiceStub['isValid'].callsFake(realWordValidatorService.isValid);
    pointCalculatorServiceStub['inputGrid'] = gridStub;
    pointCalculatorServiceStub['tiles'] = [] as Tile[];
    pointCalculatorServiceStub['wordValidatorService'] = wordValidatorServiceStub;
    pointCalculatorServiceStub['update'].callsFake(realPointCalculatorService.update);
    let service: sinon.SinonStubbedInstance<VirtualPlayerService>;
    const real: VirtualPlayerService = new VirtualPlayerService(
        gridStub,
        new BoardAnalyzerService(gridStub, []),
        letterBagStub,
        specConstants.FAKE_PLAYER_LETTERS,
        realPointCalculatorService,
        realTurnManagerService,
        realScrabbleGridService,
        VirtualPlayerDifficulty.BEGINNER,
    );
    sinon.stub(pointCalculatorServiceStub, 'newPoints').callsFake(() => 0);
    beforeEach(() => {
        turnManagerServiceStub = sinon.createStubInstance(TurnManagerService);
        turnManagerServiceStub['checkWordValidationAndPoints'].returns(true);
        scrabbleGridServiceStub = sinon.createStubInstance(ScrabbleGridService);
        scrabbleGridServiceStub['convertTilesToWord'].callsFake(() => '');
        scrabbleGridServiceStub['getSquare'].callsFake(() => '');
        scrabbleGridServiceStub['convertTilesAndFindPosition'].callsFake(realScrabbleGridService['convertTilesAndFindPosition']);
        scrabbleGridServiceStub['addCompleteWord'].callsFake(realScrabbleGridService['addCompleteWord']);
        scrabbleGridServiceStub['createWordValidation'].callsFake(() => {
            return {
                tiles: {} as TilesValidation,
                parsedInfo: {} as ParsedInfo,
            } as WordValidation;
        });
        boardAnalyzerServiceStub = sinon.createStubInstance(BoardAnalyzerService);
        boardAnalyzerServiceStub['wordPossibilities'] = new Set<WordPossibility>();
        (boardAnalyzerServiceStub['dawg'] as any) = () => new Object();
        boardAnalyzerServiceStub['dawg']['has'] = () => true;
        boardAnalyzerServiceStub['crossChecksPos'].callsFake(() => new Set<number>());
        boardAnalyzerServiceStub['addLetterTilesWeightToPoints'].callsFake((val: string) => {
            return real['boardAnalyzerService']['addLetterTilesWeightToPoints'](val);
        });
        service = sinon.createStubInstance<VirtualPlayerService>(VirtualPlayerService);
        service['randomizeExchangeLetters'].callsFake(real['randomizeExchangeLetters']);
        service['chooseAction'].callsFake(real['chooseAction']);
        service['getRandomIndex'].callsFake(real['getRandomIndex']);
        service['playerLetters'] = specConstants.FAKE_PLAYER_LETTERS;
        service['scrabbleGridService'] = scrabbleGridServiceStub;
        scrabbleGridServiceStub.scrabbleGrid = gridStub;
        service['scrabbleGrid'] = gridStub;
        service['turnManagerService'] = turnManagerServiceStub;
        service['boardAnalyzerService'] = boardAnalyzerServiceStub;
        service['pointsCalculatorService'] = pointCalculatorServiceStub;
        service['letterBag'] = letterBagStub;
        service['play'].callsFake(real['play']);
        service['expertExchangeLettersRandomizer'].callsFake(real['expertExchangeLettersRandomizer']);
        service['selectPointsRange'].callsFake(real['selectPointsRange']);
        service['getTilesOnGrid'].callsFake(real['getTilesOnGrid']);
        service['isValidPointsRange'].callsFake(real['isValidPointsRange']);
        service['getNewTilesToAdd'].callsFake(real['getNewTilesToAdd']);
        service['getTilesCompleteWord'].callsFake(real['getTilesCompleteWord']);
        service['lettersLeftInLetterBag'].callsFake(real['lettersLeftInLetterBag']);
        service['beginnerExchangeLettersRandomizer'].callsFake(real['beginnerExchangeLettersRandomizer']);
        service['difficulty'] = VirtualPlayerDifficulty.BEGINNER;
        service['percolateWordPossibilities'].callsFake(real['percolateWordPossibilities']);
        service['chooseNoPossibilityCommand'].callsFake(real['chooseNoPossibilityCommand']);
        service['beginnerExchangeLettersRandomizer'].callsFake(real['beginnerExchangeLettersRandomizer']);
        service['expertExchangeLettersRandomizer'].callsFake(real['expertExchangeLettersRandomizer']);
        service['getOffSetX'].returns(0);
        service['getOffSetY'].returns(0);
        service['concatenatePlaceCommand'].callsFake(real['concatenatePlaceCommand']);
        service['convertWordPossibilityToCommand'].callsFake(real['convertWordPossibilityToCommand']);
        service['boardAnalyzerService']['calculateWordPossibilities'].callsFake(async () => new Set<WordPossibility>());
    });

    it('getOffSetX should return x offset of 0 for no offsets tiles', async () => {
        service['scrabbleGrid'].elements[0][0].tile = null;
        service['getOffSetX'].callsFake(real['getOffSetX']);
        expect(service['getOffSetX'](specConstants.FAKE_WORD_POSSIBILITY)).to.deep.equal(0);
    });

    it('chooseNoPossibilityCommand should randomizeExchangeLetters for EXPERT VP', async () => {
        service['difficulty'] = VirtualPlayerDifficulty.EXPERT;
        service['randomizeExchangeLetters'].callsFake(() => specConstants.FAKE_WORD_POSSIBILITY.word);
        expect(service['chooseNoPossibilityCommand']()).to.deep.equal(
            serviceConstants.EXCHANGE_COMMAND + serviceConstants.SPACE_STR + specConstants.FAKE_WORD_POSSIBILITY.word,
        );
    });

    it('getOffSetX should return valid x offset with offsets tiles', () => {
        service['getOffSetX'].callsFake(real['getOffSetX']);
        service['scrabbleGrid'].elements[0][0] = new Square();
        service['scrabbleGrid'].elements[0][0].tile = new Tile();
        expect(service['getOffSetX'](specConstants.FAKE_WORD_POSSIBILITY)).to.deep.equal(1);
    });

    it('getOffSetY should return valid y offset with offsets tiles', () => {
        service['getOffSetY'].callsFake(real['getOffSetY']);
        service['scrabbleGrid'].elements[0][0] = new Square();
        service['scrabbleGrid'].elements[0][0].tile = new Tile();
        expect(service['getOffSetY'](specConstants.FAKE_WORD_POSSIBILITY)).to.deep.equal(1);
    });

    it('percolateWordPossibilities should return undefined if wordPossibilities is of length 0', () => {
        expect(service['percolateWordPossibilities']([], [], serviceConstants.PointsRange.UPPER)).to.deep.equal(undefined);
    });

    it('percolateWordPossibilities should continue iterating if dawg does not contain word', () => {
        service['boardAnalyzerService']['dawg']['has'] = () => false;
        expect(service['percolateWordPossibilities']([specConstants.FAKE_WORD_POSSIBILITY], [], serviceConstants.PointsRange.UPPER)).to.eql(
            {} as WordPossibility,
        );
    });

    it('percolateWordPossibilities should continue iterating if word is not valid with adjacent tiles', () => {
        service['boardAnalyzerService']['dawg']['has'] = () => true;
        service['turnManagerService']['checkWordValidationAndPoints'].callsFake(() => false);
        expect(service['percolateWordPossibilities']([specConstants.FAKE_WORD_POSSIBILITY], [], serviceConstants.PointsRange.UPPER)).to.eql(
            {} as WordPossibility,
        );
    });

    it('percolateWordPossibilities should save the best possibility of word placement', () => {
        service['boardAnalyzerService']['dawg']['has'] = () => true;
        service['turnManagerService']['checkWordValidationAndPoints'].callsFake(() => true);
        service['difficulty'] = VirtualPlayerDifficulty.EXPERT;
        sinon.stub(service['pointsCalculatorService'], 'newPoints').get(() => 0);
        expect(service['percolateWordPossibilities']([specConstants.FAKE_WORD_POSSIBILITY], [], serviceConstants.PointsRange.UPPER)).to.eql(
            specConstants.FAKE_WORD_POSSIBILITY,
        );
    });

    it('percolateWordPossibilities should not save the best possibility of word placement if pointsFormed are not superior', () => {
        service['boardAnalyzerService']['dawg']['has'] = () => true;
        service['turnManagerService']['checkWordValidationAndPoints'].callsFake(() => true);
        service['difficulty'] = VirtualPlayerDifficulty.EXPERT;
        sinon.stub(service['pointsCalculatorService'], 'newPoints').get(() => specConstants.IMPOSSIBLE_POINTS_FORMED);
        expect(service['percolateWordPossibilities']([specConstants.FAKE_WORD_POSSIBILITY], [], serviceConstants.PointsRange.UPPER)).to.eql(
            {} as WordPossibility,
        );
    });

    it('getOffSetY should return y offset of 0 for no offsets tiles', () => {
        service['scrabbleGrid'].elements[0][0].tile = null;
        service['getOffSetY'].callsFake(real['getOffSetY']);
        expect(service['getOffSetY'](specConstants.FAKE_WORD_POSSIBILITY)).to.deep.equal(0);
    });

    it('play should return "!placer XXX XXXXXXX" for PLACE', async () => {
        service['chooseAction'].callsFake(() => serviceConstants.VirtualPlayerPossibleActions.PLACE);
        service['convertWordPossibilityToCommand'].returns(specConstants.EXPECTED_WORD_POSSIBILITY_CONVERSION);
        const commandResult: string = await service.play();
        expect(commandResult).to.deep.equal(specConstants.EXPECTED_WORD_POSSIBILITY_CONVERSION);
        sinon.assert.calledOnce(service['convertWordPossibilityToCommand']);
    });

    it('play should return "!passer" for EXCHANGE if letterBag is empty', async () => {
        service['chooseAction'].returns(serviceConstants.VirtualPlayerPossibleActions.EXCHANGE);
        service['randomizeExchangeLetters'].returns(specConstants.FAKE_PLAYER_LETTERS);
        service['lettersLeftInLetterBag'].returns(0);
        const commandResult: string = await service.play();
        expect(commandResult).to.deep.equal(serviceConstants.PASS_COMMAND);
    });

    it('play should return "!échanger XXXXXXX" for EXCHANGE if letterBag is not empty', async () => {
        service['chooseAction'].returns(serviceConstants.VirtualPlayerPossibleActions.EXCHANGE);
        service['randomizeExchangeLetters'].returns(specConstants.FAKE_PLAYER_LETTERS);
        const commandResult: string = await service.play();
        expect(commandResult).to.deep.equal(serviceConstants.EXCHANGE_COMMAND + ' ' + specConstants.FAKE_PLAYER_LETTERS);
    });

    it('play should return "!passer" for PASS', async () => {
        service['chooseAction'].returns(serviceConstants.VirtualPlayerPossibleActions.PASS);
        const commandResult: string = await service.play();
        expect(commandResult).to.deep.equal(serviceConstants.PASS_COMMAND);
    });

    it('getRandomIndex should return random index between 0 and ceil', () => {
        for (let i = 1; i < specConstants.AMOUNT_OF_RETRIES; ++i) {
            const randomIndex = service['getRandomIndex'](i);
            expect(randomIndex).to.be.lessThan(i);
            expect(randomIndex).to.be.greaterThanOrEqual(0);
        }
    });

    it('selectPointsRange should return around 30% UPPER & MID and 40% LOWER', () => {
        let lowerBounds = 0;
        let midBounds = 0;
        let upperBounds = 0;
        const upperAndMidBoundPercent = 0.3;
        const lowerBoundPercent = 0.4;
        const uncertaintyPercent = 0.1;
        for (let i = 1; i < specConstants.AMOUNT_OF_RETRIES; ++i) {
            switch (service['selectPointsRange']()) {
                case serviceConstants.PointsRange.LOWER:
                    lowerBounds += 1;
                    break;
                case serviceConstants.PointsRange.MID:
                    midBounds += 1;
                    break;
                case serviceConstants.PointsRange.UPPER:
                    upperBounds += 1;
                    break;
            }
        }
        expect(lowerBounds).to.be.greaterThanOrEqual(
            lowerBoundPercent * specConstants.AMOUNT_OF_RETRIES - uncertaintyPercent * specConstants.AMOUNT_OF_RETRIES,
        );
        expect(lowerBounds).to.be.lessThanOrEqual(
            lowerBoundPercent * specConstants.AMOUNT_OF_RETRIES + uncertaintyPercent * specConstants.AMOUNT_OF_RETRIES,
        );
        expect(midBounds).to.be.greaterThanOrEqual(
            upperAndMidBoundPercent * specConstants.AMOUNT_OF_RETRIES - uncertaintyPercent * specConstants.AMOUNT_OF_RETRIES,
        );
        expect(midBounds).to.be.lessThanOrEqual(
            upperAndMidBoundPercent * specConstants.AMOUNT_OF_RETRIES + uncertaintyPercent * specConstants.AMOUNT_OF_RETRIES,
        );
        expect(upperBounds).to.be.greaterThanOrEqual(
            upperAndMidBoundPercent * specConstants.AMOUNT_OF_RETRIES - uncertaintyPercent * specConstants.AMOUNT_OF_RETRIES,
        );
        expect(upperBounds).to.be.lessThanOrEqual(
            upperAndMidBoundPercent * specConstants.AMOUNT_OF_RETRIES + uncertaintyPercent * specConstants.AMOUNT_OF_RETRIES,
        );
    });

    it('getTilesOnGrid should return tiles on grid', () => {
        service['scrabbleGrid'].elements = [[{ tile: new Tile() } as Square]];
        expect(service['getTilesOnGrid']()).to.eql([new Tile()]);
    });

    it('getNewTilesToAdd should return new tiles to add for horizontal direction', () => {
        expect(
            service['getNewTilesToAdd'](
                { playerLetters: 'a', anchor: { x: 1, y: 0 } as Vec2, wordDirection: DirectionType.HORIZONTAL } as WordPossibility,
                0,
                0,
            ),
        ).to.eql([
            {
                position: { x: 1, y: 0 },
                name: 'a',
                weight: 1,
                width: specConstants.TILE_SIZE,
                height: specConstants.TILE_SIZE,
                rightClicked: false,
                leftClicked: false,
            } as Tile,
        ]);
    });

    it('getNewTilesToAdd should return new tiles to add for vertical direction', () => {
        expect(
            service['getNewTilesToAdd'](
                { playerLetters: 'a', anchor: { x: 1, y: 0 } as Vec2, wordDirection: DirectionType.VERTICAL } as WordPossibility,
                0,
                0,
            ),
        ).to.eql([
            {
                position: { x: 1, y: 0 },
                name: 'a',
                weight: 1,
                width: specConstants.TILE_SIZE,
                height: specConstants.TILE_SIZE,
                rightClicked: false,
                leftClicked: false,
            } as Tile,
        ]);
    });

    it('getTilesCompleteWord should return tiles of word added for horizontal direction', () => {
        expect(
            service['getTilesCompleteWord']({
                word: 'a',
                anchor: { x: 1, y: 0 } as Vec2,
                wordDirection: DirectionType.HORIZONTAL,
            } as WordPossibility),
        ).to.eql([
            {
                position: { x: 1, y: 0 },
                name: 'a',
                weight: 1,
                width: specConstants.TILE_SIZE,
                height: specConstants.TILE_SIZE,
                rightClicked: false,
                leftClicked: false,
            } as Tile,
        ]);
    });

    it('getTilesCompleteWord should return tiles of word added for vertical direction', () => {
        expect(
            service['getTilesCompleteWord']({
                word: 'a',
                anchor: { x: 1, y: 0 } as Vec2,
                wordDirection: DirectionType.VERTICAL,
            } as WordPossibility),
        ).to.eql([
            {
                position: { x: 1, y: 0 },
                name: 'a',
                weight: 1,
                width: specConstants.TILE_SIZE,
                height: specConstants.TILE_SIZE,
                rightClicked: false,
                leftClicked: false,
            } as Tile,
        ]);
    });

    it('convertWordPossibilityToCommand should automatically return PASS_COMMAND if no possibilities', () => {
        service['convertWordPossibilityToCommand'].callsFake(real['convertWordPossibilityToCommand']);
        expect(service['convertWordPossibilityToCommand'](new Set<WordPossibility>())).to.deep.equal(serviceConstants.PASS_COMMAND);
    });

    it('getOffSetX should get x offset', () => {
        expect(service['getOffSetX']({ anchor: { x: 0, y: 0 } as Vec2 } as WordPossibility)).to.deep.equal(0);
    });

    it('getOffSetY should get y offset', () => {
        expect(service['getOffSetY']({ anchor: { x: 0, y: 0 } as Vec2 } as WordPossibility)).to.deep.equal(0);
    });

    it('concatenatePlaceCommand should concatenate place command', () => {
        const expectedAnchorToGridWords = 'a1';
        expect(
            service['concatenatePlaceCommand']({
                anchor: { x: 0, y: 0 } as Vec2,
                wordDirection: DirectionType.HORIZONTAL,
                playerLetters: specConstants.FAKE_WORD_POSSIBILITY.playerLetters,
            } as WordPossibility),
        ).to.deep.equal(
            serviceConstants.PLACE_COMMAND +
                serviceConstants.SPACE_STR +
                expectedAnchorToGridWords +
                DirectionType.HORIZONTAL +
                serviceConstants.SPACE_STR +
                specConstants.FAKE_WORD_POSSIBILITY.playerLetters,
        );
    });

    it('convertWordPossibilityToCommand should stop looping if pointsRange.LOWER is in bounds', () => {
        service['selectPointsRange'].returns(serviceConstants.PointsRange.LOWER);
        sinon.stub(service['pointsCalculatorService'], 'newPoints').callsFake(() => 0);
        const setOfWordPossibility: Set<WordPossibility> = new Set<WordPossibility>();
        setOfWordPossibility.add({
            word: 'a',
            playerLetters: 'b',
            weight: 1,
            anchor: { x: 0, y: 0 } as Vec2,
            wordDirection: DirectionType.HORIZONTAL,
        } as WordPossibility);
        service['concatenatePlaceCommand'].returns(serviceConstants.PASS_COMMAND);
        expect(service['convertWordPossibilityToCommand'](setOfWordPossibility)).to.deep.equal(serviceConstants.PASS_COMMAND);
    });

    it('convertWordPossibilityToCommand should stop looping if pointsRange.MID is in bounds', () => {
        service['selectPointsRange'].returns(serviceConstants.PointsRange.MID);
        sinon.stub(service['pointsCalculatorService'], 'newPoints').callsFake(() => serviceConstants.PointsRange.LOWER + 1);
        const setOfWordPossibility: Set<WordPossibility> = new Set<WordPossibility>();
        setOfWordPossibility.add({
            word: 'a',
            playerLetters: 'b',
            weight: 1,
            anchor: { x: 0, y: 0 } as Vec2,
            wordDirection: DirectionType.HORIZONTAL,
        } as WordPossibility);
        service['concatenatePlaceCommand'].returns(serviceConstants.PASS_COMMAND);
        expect(service['convertWordPossibilityToCommand'](setOfWordPossibility)).to.deep.equal(serviceConstants.PASS_COMMAND);
    });

    it('convertWordPossibilityToCommand should stop looping if pointsRange.UPPER is in bounds', () => {
        service['selectPointsRange'].returns(serviceConstants.PointsRange.UPPER);
        sinon.stub(service['pointsCalculatorService'], 'newPoints').callsFake(() => serviceConstants.PointsRange.MID + 1);
        const setOfWordPossibility: Set<WordPossibility> = new Set<WordPossibility>();
        setOfWordPossibility.add({
            word: 'a',
            playerLetters: 'b',
            weight: 1,
            anchor: { x: 0, y: 0 } as Vec2,
            wordDirection: DirectionType.HORIZONTAL,
        } as WordPossibility);
        service['concatenatePlaceCommand'].returns(serviceConstants.PASS_COMMAND);
        expect(service['convertWordPossibilityToCommand'](setOfWordPossibility)).to.deep.equal(serviceConstants.PASS_COMMAND);
    });

    // eslint-disable-next-line max-len
    it('convertWordPossibilityToCommand should call getTilesOnGrid, selectPointsRange, getOffSetX, getOffSetY, and getNewTilesToAdd for UPPER PointsRange', () => {
        const ranges = 3;
        const setOfWordPossibility: Set<WordPossibility> = new Set<WordPossibility>();
        service['isValidPointsRange'].returns(true);
        service['getTilesOnGrid'].resetHistory();
        service['selectPointsRange'].resetHistory();
        service['getOffSetX'].resetHistory();
        service['getOffSetY'].resetHistory();
        service['getNewTilesToAdd'].resetHistory();
        service['getTilesCompleteWord'].resetHistory();
        service['concatenatePlaceCommand'].resetHistory();
        setOfWordPossibility.add({
            word: 'a',
            playerLetters: 'b',
            anchor: { x: 0, y: 0 } as Vec2,
            wordDirection: DirectionType.HORIZONTAL,
        } as WordPossibility);
        service['selectPointsRange']
            .onCall(0)
            .returns(serviceConstants.PointsRange.LOWER)
            .onCall(1)
            .returns(serviceConstants.PointsRange.MID)
            .onCall(2)
            .returns(serviceConstants.PointsRange.UPPER);
        for (let i = 0; i < ranges; ++i) {
            service['convertWordPossibilityToCommand'](setOfWordPossibility);
        }
        sinon.assert.calledThrice(service['getTilesOnGrid']);
        sinon.assert.calledThrice(service['selectPointsRange']);
        sinon.assert.calledThrice(service['getOffSetX']);
        sinon.assert.calledThrice(service['getOffSetY']);
        sinon.assert.calledThrice(service['getNewTilesToAdd']);
        sinon.assert.calledThrice(service['getTilesCompleteWord']);
        sinon.assert.calledThrice(service['concatenatePlaceCommand']);
    });

    it('getTilesOnGrid should return nothing if tiles of ScrabbleGrid are invalid', () => {
        service['scrabbleGrid'].elements = [[{ tile: null } as Square]];
        expect(service['getTilesOnGrid']()).to.eql([]);
    });

    it('isValidPointsRange return false for UPPER PointsRange if out of bounds', () => {
        sinon.stub(service['pointsCalculatorService'], 'newPoints').get(() => serviceConstants.PointsRange.UPPER + 1);
        expect(service['isValidPointsRange'](serviceConstants.PointsRange.UPPER)).to.deep.equal(false);
    });

    it('isValidPointsRange return false for MID PointsRange if out of bounds', () => {
        sinon.stub(service['pointsCalculatorService'], 'newPoints').get(() => serviceConstants.PointsRange.MID + 1);
        expect(service['isValidPointsRange'](serviceConstants.PointsRange.MID)).to.deep.equal(false);
    });

    it('randomizeExchangeLetters should seek next index while it is equal to 0', () => {
        service['getRandomIndex'].resetHistory();
        service['getRandomIndex'].onCall(0).returns(0).onCall(1).returns(1).onCall(2).returns(0);
        service['randomizeExchangeLetters']();
        sinon.assert.calledThrice(service['getRandomIndex']);
    });

    it('randomizeExchangeLetters should call expertExchangeLettersRandomizer for EXPERT VP', () => {
        service['expertExchangeLettersRandomizer'].resetHistory();
        service['difficulty'] = VirtualPlayerDifficulty.EXPERT;
        service['randomizeExchangeLetters']();
        sinon.assert.calledOnce(service['expertExchangeLettersRandomizer']);
    });

    it('expertExchangeLettersRandomizer should return beginner randomizer for EXPERT VP when letters do not suffice in letter bag', () => {
        service['beginnerExchangeLettersRandomizer'].resetHistory();
        service['lettersLeftInLetterBag'].callsFake(() => 0);
        service['difficulty'] = VirtualPlayerDifficulty.EXPERT;
        service['expertExchangeLettersRandomizer']();
        sinon.assert.calledOnce(service['beginnerExchangeLettersRandomizer']);
    });

    it('randomizeExchangeLetters should randomize letters to be exchanged', () => {
        service['randomizeExchangeLetters'].callsFake(real['randomizeExchangeLetters']);
        for (let i = 0; i < specConstants.AMOUNT_OF_RETRIES; ++i) {
            const lettersToBeExchanged = service['randomizeExchangeLetters']();
            expect(lettersToBeExchanged.length).to.be.above(0);
            expect(lettersToBeExchanged.length).to.be.lessThanOrEqual(specConstants.FAKE_PLAYER_LETTERS.length);
            for (const exchangedLetter of lettersToBeExchanged) {
                expect(specConstants.FAKE_PLAYER_LETTERS.includes(exchangedLetter)).to.deep.equal(true);
                expect(lettersToBeExchanged.split('').filter((letter: string) => letter === exchangedLetter)).to.eql(
                    specConstants.FAKE_PLAYER_LETTERS.split('').filter((letter: string) => letter === exchangedLetter),
                );
            }
        }
    });

    it('chooseAction should respect right probabilities of callings', () => {
        service['chooseAction'].callsFake(real['chooseAction']);
        let placeCommands = 0;
        let exchangeCommands = 0;
        let passCommands = 0;
        for (let i = 0; i < specConstants.AMOUNT_OF_RETRIES; ++i) {
            switch (service['chooseAction']()) {
                case serviceConstants.VirtualPlayerPossibleActions.PLACE:
                    placeCommands += 1;
                    break;
                case serviceConstants.VirtualPlayerPossibleActions.PASS:
                    passCommands += 1;
                    break;
                case serviceConstants.VirtualPlayerPossibleActions.EXCHANGE:
                    exchangeCommands += 1;
                    break;
            }
        }
        expect(
            placeCommands >=
                specConstants.AMOUNT_OF_RETRIES * (serviceConstants.EXCHANGE_PROBABILITY_LOWER_BOUND - specConstants.UNCERTAINTY_FACTOR) &&
                placeCommands <=
                    specConstants.AMOUNT_OF_RETRIES * (serviceConstants.EXCHANGE_PROBABILITY_LOWER_BOUND + specConstants.UNCERTAINTY_FACTOR),
        ).to.deep.equal(true);
        expect(
            passCommands >=
                specConstants.AMOUNT_OF_RETRIES * (1 - serviceConstants.PASS_PROBABILITY_LOWER_BOUND - specConstants.UNCERTAINTY_FACTOR) &&
                passCommands <=
                    specConstants.AMOUNT_OF_RETRIES * (1 - serviceConstants.PASS_PROBABILITY_LOWER_BOUND + specConstants.UNCERTAINTY_FACTOR),
        ).to.deep.equal(true);
        expect(
            exchangeCommands >=
                specConstants.AMOUNT_OF_RETRIES * (1 - serviceConstants.PASS_PROBABILITY_LOWER_BOUND - specConstants.UNCERTAINTY_FACTOR) &&
                exchangeCommands <=
                    specConstants.AMOUNT_OF_RETRIES * (1 - serviceConstants.PASS_PROBABILITY_LOWER_BOUND + specConstants.UNCERTAINTY_FACTOR),
        ).to.deep.equal(true);
    });

    it('chooseAction should always try to place for EXPERT VP', () => {
        service['chooseAction'].callsFake(real['chooseAction']);
        service['difficulty'] = VirtualPlayerDifficulty.EXPERT;
        expect(service['chooseAction']()).to.deep.equal(serviceConstants.VirtualPlayerPossibleActions.PLACE);
    });
});

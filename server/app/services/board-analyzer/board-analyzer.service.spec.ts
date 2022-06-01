/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { TestHelper } from '@app/classes/test-helper';
import { GRID_SQUARES_PER_LINE, MAX_TILES_PER_PLAYER } from '@common/model/constants';
import { DirectionType } from '@common/model/direction-type';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Square } from '@common/model/square';
import { Tile } from '@common/model/tile';
import { Vec2 } from '@common/model/vec2';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { BoardAnalyzerService } from './board-analyzer.service';
import * as serviceConstants from './board-analyzer.service.constants';
import { WILDCARD_CHAR, WordPossibility } from './board-analyzer.service.constants';
import * as specConstants from './board-analyzer.service.spec.constants';

describe('BoardAnalyzerService', () => {
    let service: sinon.SinonStubbedInstance<BoardAnalyzerService>;
    const gridStub: ScrabbleGrid = new TestHelper({ elements: [] } as ScrabbleGrid).initializeGrid();
    for (const tile of specConstants.TILES) gridStub.elements[tile.position.x][tile.position.y].tile = tile;
    const real: BoardAnalyzerService = new BoardAnalyzerService(gridStub, []);

    beforeEach(() => {
        service = sinon.createStubInstance<BoardAnalyzerService>(BoardAnalyzerService);
        service['letterBag'] = real['letterBag'];
        service['liveBoard'] = real['liveBoard'];
        service['liveBoardT'] = real['liveBoardT'];
        service['upCurrentPaths'] = real['upCurrentPaths'];
        service['downCurrentPaths'] = real['downCurrentPaths'];
        service['wordPossibilities'] = real['wordPossibilities'];
        service['scrabbleGrid'] = real['scrabbleGrid'];
        (service['dawg'] as any) = real['dawg'];
        service['calculateWordPossibilities'].callsFake(real['calculateWordPossibilities']);
        service['addLetterTilesWeightToPoints'].callsFake(real['addLetterTilesWeightToPoints']);
        service['convertScrabbleGridTileNamesToLowercase'].callsFake(real['convertScrabbleGridTileNamesToLowercase']);
        service['convert2DBoardTo1D'].callsFake(real['convert2DBoardTo1D']);
        service['travelPossibilitiesAndWords'].callsFake(real['travelPossibilitiesAndWords']);
        service['addWildCardWordsToPossibilities'].callsFake(real['addWildCardWordsToPossibilities']);
        service['getWildCardIndexesOfPossibleWord'].callsFake(real['getWildCardIndexesOfPossibleWord']);
        service['addWordToPossibilities'].callsFake(real['addWordToPossibilities']);
        service['hasWildCard'].callsFake(real['hasWildCard']);
        service['filterWordPossibilities'].callsFake(real['filterWordPossibilities']);
        service['updatePlayerLettersOfPossibilities'].callsFake(real['updatePlayerLettersOfPossibilities']);
        service['reverseAnchorPosition'].callsFake(real['reverseAnchorPosition']);
        service['formPossibleWords'].callsFake(real['formPossibleWords']);
        service['formUpPossibleWords'].callsFake(real['formUpPossibleWords']);
        service['formDownPossibleWords'].callsFake(real['formDownPossibleWords']);
        service['clearCurrentPaths'].callsFake(real['clearCurrentPaths']);
        service['isAbleToBeFormedUpwards'].callsFake(real['isAbleToBeFormedUpwards']);
        service['isAbleToBeFormedDownwards'].callsFake(real['isAbleToBeFormedDownwards']);
        service['isUpPossibleWordWorthy'].callsFake(real['isUpPossibleWordWorthy']);
        service['isDownPossibleWordWorthy'].callsFake(real['isDownPossibleWordWorthy']);
        service['addPlayerLettersToPath'].callsFake(real['addPlayerLettersToPath']);
        service['percolateUp'].callsFake(real['percolateUp']);
        service['percolateDown'].callsFake(real['percolateDown']);
        service['isElementAnchorIndexable'].callsFake(real['isElementAnchorIndexable']);
        service['doHorizontalUpdate'].callsFake(real['doHorizontalUpdate']);
        service['doVerticalUpdate'].callsFake(real['doVerticalUpdate']);
        service['flushCommonLetters'].callsFake(real['flushCommonLetters']);
        service['replacePlayerLettersWildCards'].callsFake(real['replacePlayerLettersWildCards']);
        service['addLetterToCurrentPaths'].callsFake(real['addLetterToCurrentPaths']);
        service['getLetterOccurrence'].callsFake(real['getLetterOccurrence']);
        service['getLettersPlaced'].callsFake(real['getLettersPlaced']);
        service['getAnchorsIndexesOfPossibility'].callsFake(real['getAnchorsIndexesOfPossibility']);
        service['isAnchorIndexable'].callsFake(real['isAnchorIndexable']);
        service['getPossibilities'].callsFake(real['getPossibilities']);
        service['getPossibilitiesT'].callsFake(real['getPossibilitiesT']);
        service['convertPercolationToLetPos'].callsFake(real['convertPercolationToLetPos']);
        service['isVectorEqual'].callsFake(real['isVectorEqual']);
        service['convert1DPosTo2DVec2'].callsFake(real['convert1DPosTo2DVec2']);
        service['percolate'].callsFake(real['percolate']);
        service['isElementAnchorIndexable'].callsFake(real['isElementAnchorIndexable']);
        service['crossChecksPos'].callsFake(real['crossChecksPos']);
        service['pushLiveBoard'].callsFake(real['pushLiveBoard']);
        service['pushLiveBoardT'].callsFake(real['pushLiveBoardT']);
        service['transposeGridElements'].callsFake(real['transposeGridElements']);
        service['getScrabbleGridSquare'].callsFake(real['getScrabbleGridSquare']);
        service['isCrossCheckValid'].callsFake(real['isCrossCheckValid']);
        service['boardHasLetter'].callsFake(real['boardHasLetter']);
    });

    it('doHorizontalUpdate should add tile names to board letters if iterated element is anchor indexable', () => {
        service['isElementAnchorIndexable'].callsFake(() => true);
        const expectedWord = 'cj';
        expect(service['doHorizontalUpdate'](specConstants.INITIAL_WORD_POSSIBILITY).split('undefined').join('')).to.deep.equal(expectedWord);
    });

    it('doHorizontalUpdate should not add tile names to board letters if iterated element is reached same iterable letter', () => {
        service['isElementAnchorIndexable'].callsFake(() => true);
        service['scrabbleGrid'].elements[0][2].tile = new Tile(undefined, 's');
        const expectedWord = 'bs';
        expect(
            service['doHorizontalUpdate']({ anchor: { x: 1, y: 0 }, word: 'ss' } as WordPossibility)
                .split('undefined')
                .join(''),
        ).to.deep.equal(expectedWord);
    });

    it('doVerticalUpdate should add tile names to board letters if iterated element is anchor indexable', () => {
        service['isElementAnchorIndexable'].callsFake(() => true);
        expect(service['doVerticalUpdate'](specConstants.INITIAL_WORD_POSSIBILITY).split('undefined').join('')).to.deep.equal('');
    });

    it('doVerticalUpdate should not add tile names to board letters if iterated element is reached same iterable letter', () => {
        service['isElementAnchorIndexable'].callsFake(() => true);
        service['scrabbleGrid'].elements[1][0].tile = new Tile(undefined, 's');
        const expectedWord = 's';
        expect(
            service['doVerticalUpdate']({ anchor: { x: 0, y: 0 }, word: 'ss' } as WordPossibility)
                .split('undefined')
                .join(''),
        ).to.deep.equal(expectedWord);
    });

    it('getWildCardIndexesOfPossibleWord should return wildcard indexes of word with wildcard', () => {
        const possibleWord = serviceConstants.WILDCARD_CHAR + specConstants.VALID_WORD + serviceConstants.WILDCARD_CHAR;
        expect(service['getWildCardIndexesOfPossibleWord'](possibleWord.split(''))).to.deep.equal([0, possibleWord.length - 1]);
    });

    it('calculateWordPossibilities should clear wordPossibilities if methods are stubbed', () => {
        service['travelPossibilitiesAndWords'].callsFake(() => {});
        service['getPossibilities'].callsFake(() => {});
        service['getPossibilitiesT'].callsFake(() => {});
        service['filterWordPossibilities'].callsFake(() => {});
        service['updatePlayerLettersOfPossibilities'].callsFake(() => {});
        service.calculateWordPossibilities(specConstants.STUB_LETTERS.toString());
        expect(service['wordPossibilities']).to.eql(new Set<serviceConstants.WordPossibility>());
    });

    it('flushCommonLetters should flush common letters', () => {
        expect(service['flushCommonLetters']([specConstants.VALID_WORD], [specConstants.VALID_WORD])).to.eql(['']);
    });

    it('flushCommonLetters should not flush if no letters are in common', () => {
        expect(service['flushCommonLetters']([specConstants.VALID_WORD], [specConstants.INVALID_WORD])).to.eql([specConstants.VALID_WORD]);
    });

    it('replacePlayerLettersWildCards should replace wild card chars to upper case letters if possibility does not include wordArr char', () => {
        expect(
            service['replacePlayerLettersWildCards'](
                { playerLetters: WILDCARD_CHAR } as WordPossibility,
                [specConstants.VALID_WORD],
                [WILDCARD_CHAR],
            ),
        ).to.eql([specConstants.VALID_WORD.toUpperCase()]);
    });

    it('replacePlayerLettersWildCards should not replace wild card chars if finalBoardLetters include wordArray char', () => {
        expect(
            service['replacePlayerLettersWildCards'](
                { playerLetters: WILDCARD_CHAR } as WordPossibility,
                [specConstants.VALID_WORD],
                [specConstants.VALID_WORD],
            ),
        ).to.eql([specConstants.VALID_WORD]);
    });

    // eslint-disable-next-line max-len
    it('calculateWordPossibilities should call wordPossibilities, getPossibilities, getPossibilitiesT, travelPossibilitiesAndWords, filterWordPossibilities, and updatePlayerLettersOfPossibilities', async () => {
        service['travelPossibilitiesAndWords'].resetHistory();
        service['getPossibilities'].resetHistory();
        service['getPossibilitiesT'].resetHistory();
        service['filterWordPossibilities'].resetHistory();
        service['updatePlayerLettersOfPossibilities'].resetHistory();
        service['travelPossibilitiesAndWords'].callsFake(() => {});
        service['getPossibilities'].callsFake(() => 'getPossibilitiesSpy');
        service['getPossibilitiesT'].callsFake(() => 'getPossibilitiesTSpy');
        service['filterWordPossibilities'].callsFake(() => {});
        service['updatePlayerLettersOfPossibilities'].callsFake(() => {});
        await service.calculateWordPossibilities(specConstants.STUB_LETTERS.toString());
        sinon.assert.calledOnce(service['getPossibilities']);
        sinon.assert.calledOnce(service['getPossibilitiesT']);
        expect(
            service['travelPossibilitiesAndWords'].getCall(0).calledWithExactly('getPossibilitiesSpy', specConstants.STUB_LETTERS.toString(), false),
        );
        expect(
            service['travelPossibilitiesAndWords'].getCall(1).calledWithExactly('getPossibilitiesTSpy', specConstants.STUB_LETTERS.toString(), false),
        );
        sinon.assert.calledOnce(service['filterWordPossibilities']);
        sinon.assert.calledOnce(service['updatePlayerLettersOfPossibilities']);
    });

    it('getAnchorsIndexesOfPossibility should return no indexes of possibility if anchor is not indexable', () => {
        service['isAnchorIndexable'].resetHistory();
        service['isAnchorIndexable'].callsFake(() => false);
        expect(service['getAnchorsIndexesOfPossibility'](specConstants.INDEXABLE_ANCHORS[0])).to.eql(new Set<serviceConstants.AnchorAndPosition>());
        sinon.assert.calledTwice(service['isAnchorIndexable']);
    });

    it('getAnchorsIndexesOfPossibility should return anchor indexes of possibility if anchor is indexable', () => {
        service['isAnchorIndexable'].resetHistory();
        service['isAnchorIndexable'].callsFake(() => true);
        const expectedSetOfAnchorAndPosition: Set<serviceConstants.AnchorAndPosition> = new Set<serviceConstants.AnchorAndPosition>();
        expectedSetOfAnchorAndPosition.add({ anchor: 1, position: specConstants.INDEXABLE_ANCHORS[0][1].pos } as serviceConstants.AnchorAndPosition);
        expectedSetOfAnchorAndPosition.add({ anchor: 2, position: specConstants.INDEXABLE_ANCHORS[0][2].pos } as serviceConstants.AnchorAndPosition);
        expect(service['getAnchorsIndexesOfPossibility'](specConstants.INDEXABLE_ANCHORS[0])).to.eql(expectedSetOfAnchorAndPosition);
        sinon.assert.calledTwice(service['isAnchorIndexable']);
    });

    // eslint-disable-next-line max-len
    it('travelPossibilitiesAndWords should call getAnchorsIndexesOfPossibility, formPossibleWords, hasWildCard, and addWordToPossibilities if possibleWord has no wildcard', () => {
        const anchorAndPositionSet: Set<serviceConstants.AnchorAndPosition> = new Set<serviceConstants.AnchorAndPosition>();
        anchorAndPositionSet.add({ anchor: 0, position: specConstants.EXPECTED_VEC2[0] } as serviceConstants.AnchorAndPosition);
        service['getAnchorsIndexesOfPossibility'].resetHistory();
        service['getAnchorsIndexesOfPossibility'].callsFake(() => anchorAndPositionSet);
        const possibleWords: Set<string> = new Set<string>();
        possibleWords.add(specConstants.STUB_LETTERS[0]);
        service['formPossibleWords'].resetHistory();
        service['formPossibleWords'].callsFake(() => possibleWords);
        service['hasWildCard'].callsFake(() => false);
        service['addWordToPossibilities'].resetHistory();
        service['addWordToPossibilities'].callsFake(() => {});
        service['travelPossibilitiesAndWords'](specConstants.INDEXABLE_ANCHORS, specConstants.STUB_LETTERS.toString(), false);
        sinon.assert.calledOnce(service['getAnchorsIndexesOfPossibility']);
        sinon.assert.calledOnce(service['formPossibleWords']);
        sinon.assert.calledOnce(service['addWordToPossibilities']);
    });

    // eslint-disable-next-line max-len
    it('travelPossibilitiesAndWords should call getAnchorsIndexesOfPossibility, formPossibleWords, hasWildCard, and addWildCardWordsToPossibilities if possibleWord has wildcard', () => {
        const anchorAndPositionSet: Set<serviceConstants.AnchorAndPosition> = new Set<serviceConstants.AnchorAndPosition>();
        anchorAndPositionSet.add({ anchor: 0, position: specConstants.EXPECTED_VEC2[0] } as serviceConstants.AnchorAndPosition);
        service['getAnchorsIndexesOfPossibility'].resetHistory();
        service['getAnchorsIndexesOfPossibility'].callsFake(() => anchorAndPositionSet);
        const possibleWords: Set<string> = new Set<string>();
        possibleWords.add(specConstants.STUB_LETTERS[0]);
        service['formPossibleWords'].resetHistory();
        service['formPossibleWords'].callsFake(() => possibleWords);
        service['hasWildCard'].callsFake(() => true);
        service['addWildCardWordsToPossibilities'].resetHistory();
        service['addWildCardWordsToPossibilities'].callsFake(() => {});
        service['travelPossibilitiesAndWords'](specConstants.INDEXABLE_ANCHORS, specConstants.STUB_LETTERS.toString(), false);
        sinon.assert.calledOnce(service['getAnchorsIndexesOfPossibility']);
        sinon.assert.calledOnce(service['formPossibleWords']);
        sinon.assert.calledOnce(service['addWildCardWordsToPossibilities']);
    });

    it('calculateWordPossibilities should call travelPossibilitiesAndWords, filterWordPossibilities, and updatePlayerLetters', async () => {
        service['travelPossibilitiesAndWords'].resetHistory();
        service['travelPossibilitiesAndWords'].callsFake(() => {});
        service['filterWordPossibilities'].resetHistory();
        service['filterWordPossibilities'].callsFake(() => {});
        service['updatePlayerLettersOfPossibilities'].resetHistory();
        service['updatePlayerLettersOfPossibilities'].callsFake(() => {});
        await service.calculateWordPossibilities(specConstants.STUB_LETTERS[0]);
        sinon.assert.called(service['travelPossibilitiesAndWords']);
        sinon.assert.called(service['filterWordPossibilities']);
        sinon.assert.called(service['updatePlayerLettersOfPossibilities']);
        expect(service['wordPossibilities'].size).to.deep.equal(0);
    });

    it('filterWordPossibilities should filter word possibilities by removing duplicates', () => {
        service['wordPossibilities'].clear();
        service['wordPossibilities'] = new Set<serviceConstants.WordPossibility>();
        service['wordPossibilities'].add({ word: specConstants.STUB_LETTERS[0] } as serviceConstants.WordPossibility);
        service['wordPossibilities'].add({ word: specConstants.STUB_LETTERS[1] } as serviceConstants.WordPossibility);
        service['isVectorEqual'].callsFake(() => true);
        const expectedPossibilities: Set<serviceConstants.WordPossibility> = new Set<serviceConstants.WordPossibility>();
        expectedPossibilities.add({ word: specConstants.STUB_LETTERS[0] } as serviceConstants.WordPossibility);
        expectedPossibilities.add({ word: specConstants.STUB_LETTERS[1] } as serviceConstants.WordPossibility);
        service['filterWordPossibilities']();
        expect(service['wordPossibilities']).to.eql(expectedPossibilities);
    });

    it('convert2DBoardTo1D should call transposeGridElements, pushLiveBoard, pushLiveBoardT, and getScrabbleGridSquare', () => {
        service['transposeGridElements'].resetHistory();
        service['pushLiveBoard'].resetHistory();
        service['pushLiveBoardT'].resetHistory();
        service['getScrabbleGridSquare'].resetHistory();
        service['transposeGridElements'].callsFake(() => {});
        service['pushLiveBoard'].callsFake(() => {});
        service['pushLiveBoardT'].callsFake(() => {});
        service['getScrabbleGridSquare'].callsFake(() => {});
        service['convert2DBoardTo1D']();
        expect(service['transposeGridElements'].callCount).to.deep.equal(1);
        expect(service['pushLiveBoard'].callCount).to.deep.equal(GRID_SQUARES_PER_LINE * GRID_SQUARES_PER_LINE);
        expect(service['pushLiveBoardT'].callCount).to.deep.equal(GRID_SQUARES_PER_LINE * GRID_SQUARES_PER_LINE);
        expect(service['getScrabbleGridSquare'].callCount).to.deep.equal(2 * GRID_SQUARES_PER_LINE * GRID_SQUARES_PER_LINE);
    });

    // eslint-disable-next-line max-len
    it('travelPossibilitiesAndWords should call getAnchorsIndexesOfPossibility, formPossibleWords, hasWildCard, and addWordToPossibilities if possibleWord has wildCard', () => {
        const anchorAndPositionSet: Set<serviceConstants.AnchorAndPosition> = new Set<serviceConstants.AnchorAndPosition>();
        anchorAndPositionSet.add({ anchor: 0, position: specConstants.EXPECTED_VEC2[0] } as serviceConstants.AnchorAndPosition);
        const possibleWordsSets: Set<string>[] = [];
        const possibleWordsSet: Set<string> = new Set<string>();
        possibleWordsSet.add(specConstants.STUB_LETTERS[0]);
        possibleWordsSets.push(possibleWordsSet);
        service['getAnchorsIndexesOfPossibility'].resetHistory();
        service['formPossibleWords'].resetHistory();
        service['hasWildCard'].resetHistory();
        service['addWordToPossibilities'].resetHistory();
        service['getAnchorsIndexesOfPossibility'].callsFake(() => anchorAndPositionSet);
        service['formPossibleWords'].callsFake(() => possibleWordsSets);
        service['hasWildCard'].callsFake(() => false);
        service['addWordToPossibilities'].callsFake(() => {});
        service['travelPossibilitiesAndWords'](specConstants.INDEXABLE_ANCHORS, specConstants.STUB_LETTERS[0], false);
        sinon.assert.calledOnce(service['getAnchorsIndexesOfPossibility']);
        sinon.assert.calledOnce(service['formPossibleWords']);
        sinon.assert.calledOnce(service['hasWildCard']);
        sinon.assert.calledOnce(service['addWordToPossibilities']);
    });

    // eslint-disable-next-line max-len
    it('travelPossibilitiesAndWords should call getAnchorsIndexesOfPossibility, formPossibleWords, hasWildCard, and addWildCardWordsToPossibilities if possibleWord has wildCard', () => {
        const anchorAndPositionSet: Set<serviceConstants.AnchorAndPosition> = new Set<serviceConstants.AnchorAndPosition>();
        anchorAndPositionSet.add({ anchor: 0, position: specConstants.EXPECTED_VEC2[0] } as serviceConstants.AnchorAndPosition);
        const possibleWordsSets: Set<string>[] = [];
        const possibleWordsSet: Set<string> = new Set<string>();
        possibleWordsSet.add(specConstants.STUB_LETTERS[0]);
        possibleWordsSets.push(possibleWordsSet);
        service['getAnchorsIndexesOfPossibility'].resetHistory();
        service['formPossibleWords'].resetHistory();
        service['hasWildCard'].resetHistory();
        service['addWildCardWordsToPossibilities'].resetHistory();
        service['getAnchorsIndexesOfPossibility'].callsFake(() => anchorAndPositionSet);
        service['formPossibleWords'].callsFake(() => possibleWordsSets);
        service['hasWildCard'].callsFake(() => true);
        service['addWildCardWordsToPossibilities'].callsFake(() => {});
        service['travelPossibilitiesAndWords'](specConstants.INDEXABLE_ANCHORS, specConstants.STUB_LETTERS[0], false);
        sinon.assert.calledOnce(service['getAnchorsIndexesOfPossibility']);
        sinon.assert.calledOnce(service['formPossibleWords']);
        sinon.assert.calledOnce(service['hasWildCard']);
        sinon.assert.calledOnce(service['addWildCardWordsToPossibilities']);
    });

    it('addWildCardWordsToPossibilities should correctly add wildcards to possibilities by traversing the alphabet for indexes', () => {
        service['getWildCardIndexesOfPossibleWord'].callsFake(() => [0, 1]);
        service['addWordToPossibilities'].resetHistory();
        service['addWordToPossibilities'].callsFake(() => {});
        service['addWildCardWordsToPossibilities'](
            specConstants.STUB_LETTERS[0] + specConstants.STUB_LETTERS[1],
            false,
            specConstants.STUB_LETTERS.toString(),
            {
                anchor: 0,
                position: specConstants.EXPECTED_VEC2[0],
            } as serviceConstants.AnchorAndPosition,
        );
        const expectedCount: number = 2 * serviceConstants.ALPHABET.length * serviceConstants.ALPHABET.length;
        sinon.assert.callCount(service['addWordToPossibilities'], expectedCount);
    });

    it('addWildCardWordsToPossibilities should correctly add wildcards to possibilities by traversing the alphabet for a given index', () => {
        service['getWildCardIndexesOfPossibleWord'].callsFake(() => [0]);
        service['addWordToPossibilities'].resetHistory();
        service['addWordToPossibilities'].callsFake(() => {});
        service['addWildCardWordsToPossibilities'](specConstants.STUB_LETTERS[0], false, specConstants.STUB_LETTERS.toString(), {
            anchor: 0,
            position: specConstants.EXPECTED_VEC2[0],
        } as serviceConstants.AnchorAndPosition);
        sinon.assert.callCount(service['addWordToPossibilities'], serviceConstants.ALPHABET.length);
        serviceConstants.ALPHABET.split('').forEach((letter: string, idx: number) => {
            expect(
                service['addWordToPossibilities'].getCall(idx).calledWithExactly(letter, false, specConstants.STUB_LETTERS.toString(), {
                    anchor: 0,
                    position: specConstants.EXPECTED_VEC2[0],
                } as serviceConstants.AnchorAndPosition),
            ).to.deep.equal(true);
        });
    });

    it('addWordToPossibilities should correctly add word to possibilities for non transposed word', () => {
        service['wordPossibilities'].clear();
        service['dawg']['has'] = () => true;
        service['addWordToPossibilities'](specConstants.STUB_LETTERS[0], false, specConstants.STUB_LETTERS.toString(), {
            position: specConstants.EXPECTED_VEC2[0],
        } as serviceConstants.AnchorAndPosition);
        expect(service['wordPossibilities'].size).not.to.deep.equal(0);
        const expectedWordPossibilitiesSet: Set<serviceConstants.WordPossibility> = new Set<serviceConstants.WordPossibility>();
        expectedWordPossibilitiesSet.add({
            word: specConstants.STUB_LETTERS[0],
            playerLetters: specConstants.STUB_LETTERS.toString(),
            anchor: specConstants.EXPECTED_VEC2[0],
            wordDirection: DirectionType.VERTICAL,
        } as serviceConstants.WordPossibility);
        expect(service['wordPossibilities']).to.eql(expectedWordPossibilitiesSet);
    });

    it('addWordToPossibilities should not add word to possibilities if word is not in Dawg', () => {
        service['wordPossibilities'].clear();
        service['dawg']['has'] = () => false;
        service['reverseAnchorPosition'].callsFake(() => specConstants.EXPECTED_VEC2[1]);
        service['addWordToPossibilities'](specConstants.STUB_LETTERS[0], true, specConstants.STUB_LETTERS.toString(), {
            position: specConstants.EXPECTED_VEC2[0],
        } as serviceConstants.AnchorAndPosition);
        expect(service['wordPossibilities'].size).to.deep.equal(0);
    });

    it('addWordToPossibilities should correctly add word to possibilities for transposed word', () => {
        service['wordPossibilities'].clear();
        service['dawg']['has'] = () => true;
        service['reverseAnchorPosition'].callsFake(() => specConstants.EXPECTED_VEC2[1]);
        service['addWordToPossibilities'](specConstants.STUB_LETTERS[0], true, specConstants.STUB_LETTERS.toString(), {
            position: specConstants.EXPECTED_VEC2[0],
        } as serviceConstants.AnchorAndPosition);
        expect(service['wordPossibilities'].size).not.to.deep.equal(0);
        const expectedWordPossibilitiesSet: Set<serviceConstants.WordPossibility> = new Set<serviceConstants.WordPossibility>();
        expectedWordPossibilitiesSet.add({
            word: specConstants.STUB_LETTERS[0],
            playerLetters: specConstants.STUB_LETTERS.toString(),
            anchor: specConstants.EXPECTED_VEC2[1],
            wordDirection: DirectionType.HORIZONTAL,
        } as serviceConstants.WordPossibility);
        expect(service['wordPossibilities']).to.eql(expectedWordPossibilitiesSet);
    });

    it('addLetterTilesWeightToPoints should add letter tiles weight to fiction points', () => {
        expect(service['addLetterTilesWeightToPoints'](specConstants.STUB_LETTERS[0])).to.deep.equal(specConstants.EXPECTED_POINTS_NON_HOT_A);
    });

    it('hasWildCard should return whether word contains wildcard', () => {
        expect(service['hasWildCard'](specConstants.INVALID_WORD + serviceConstants.WILDCARD_CHAR)).to.deep.equal(true);
        expect(service['hasWildCard'](specConstants.VALID_WORD)).to.deep.equal(false);
    });

    it('reverseAnchorPosition should reverse anchor position', () => {
        for (const vect of specConstants.EXPECTED_VEC2) {
            expect(service['reverseAnchorPosition'](vect)).to.eql({ x: vect.y, y: vect.x } as Vec2);
        }
    });

    it('clearCurrentPaths should clear current paths', () => {
        service['upCurrentPaths'].clear();
        service['downCurrentPaths'].clear();
        service['upCurrentPaths'].add(specConstants.STUB_LETTERS[0]);
        service['downCurrentPaths'].add(specConstants.STUB_LETTERS[0]);
        service['clearCurrentPaths']();
        expect(service['upCurrentPaths'].size).to.deep.equal(0);
        expect(service['downCurrentPaths'].size).to.deep.equal(0);
    });

    it('addPlayerLettersToPath should add player letters to path', () => {
        service['upCurrentPaths'].clear();
        service['downCurrentPaths'].clear();
        service['addPlayerLettersToPath'](specConstants.STUB_LETTERS[0]);
    });

    it('percolateUp should call addLetterToCurrentPaths with upLetter if upLetter is not null', () => {
        service['addLetterToCurrentPaths'].resetHistory();
        service['addLetterToCurrentPaths'].callsFake(() => {});
        service['percolateUp']([{} as serviceConstants.LetPos], specConstants.STUB_LETTERS[0], specConstants.STUB_LETTERS.toString());
        sinon.assert.calledWith(service['addLetterToCurrentPaths'], {
            paths: service['upCurrentPaths'],
            percolationDirection: serviceConstants.PercolationDirection.UP,
            ofLetPos: [{} as serviceConstants.LetPos],
            letters: specConstants.STUB_LETTERS[0],
            reverse: true,
        } as serviceConstants.LetterAdditionInformation);
    });

    it('percolateUp should call addLetterToCurrentPaths with playerLetters if upLetter is null', () => {
        service['addLetterToCurrentPaths'].resetHistory();
        service['addLetterToCurrentPaths'].callsFake(() => {});
        service['percolateUp']([{} as serviceConstants.LetPos], null, specConstants.STUB_LETTERS.toString());
        sinon.assert.calledWith(service['addLetterToCurrentPaths'], {
            paths: service['upCurrentPaths'],
            percolationDirection: serviceConstants.PercolationDirection.UP,
            ofLetPos: [{} as serviceConstants.LetPos],
            letters: specConstants.STUB_LETTERS.toString(),
            reverse: true,
        } as serviceConstants.LetterAdditionInformation);
    });

    it('percolateDown should call addLetterToCurrentPaths with playerLetters if downLetter is null', () => {
        service['addLetterToCurrentPaths'].resetHistory();
        service['addLetterToCurrentPaths'].callsFake(() => {});
        service['percolateDown']([{} as serviceConstants.LetPos], null, specConstants.STUB_LETTERS.toString());
        sinon.assert.calledWith(service['addLetterToCurrentPaths'], {
            paths: service['downCurrentPaths'],
            percolationDirection: serviceConstants.PercolationDirection.DOWN,
            ofLetPos: [{} as serviceConstants.LetPos],
            letters: specConstants.STUB_LETTERS.toString(),
            reverse: false,
        } as serviceConstants.LetterAdditionInformation);
    });

    it('percolateDown should call addLetterToCurrentPaths with downLetter if downLetter is not null', () => {
        service['addLetterToCurrentPaths'].resetHistory();
        service['addLetterToCurrentPaths'].callsFake(() => {});
        service['percolateDown']([{} as serviceConstants.LetPos], specConstants.STUB_LETTERS[0], specConstants.STUB_LETTERS.toString());
        sinon.assert.calledWith(service['addLetterToCurrentPaths'], {
            paths: service['downCurrentPaths'],
            percolationDirection: serviceConstants.PercolationDirection.DOWN,
            ofLetPos: [{} as serviceConstants.LetPos],
            letters: specConstants.STUB_LETTERS[0],
            reverse: false,
        } as serviceConstants.LetterAdditionInformation);
    });

    it('addLetterToCurrentPaths should reverse add if reverse is true', () => {
        service['upCurrentPaths'].clear();
        specConstants.STUB_SET_PATH.clear();
        specConstants.STUB_SET_PATH.add(specConstants.STUB_LETTERS[0]);
        specConstants.LETTER_ADDITION_INFORMATION_STUB.paths = specConstants.STUB_SET_PATH;
        specConstants.LETTER_ADDITION_INFORMATION_STUB.reverse = true;
        specConstants.LETTER_ADDITION_INFORMATION_STUB.percolationDirection = serviceConstants.PercolationDirection.UP;
        service['getLetterOccurrence'].onCall(0).returns(0).onCall(1).returns(1);
        service['getLettersPlaced'].callsFake(() => {});
        const expectedNewPaths: Set<string> = new Set<string>();
        expectedNewPaths.add(specConstants.LETTER_ADDITION_INFORMATION_STUB.letters + specConstants.STUB_LETTERS[0]);
        service['addLetterToCurrentPaths'](specConstants.LETTER_ADDITION_INFORMATION_STUB);
        expect(service['upCurrentPaths']).to.eql(expectedNewPaths);
    });

    it('addLetterToCurrentPaths should not change path addition order if reverse is set to false', () => {
        const downCurrentPathsStub = sinon.stub(service, 'downCurrentPaths' as any);
        service['upCurrentPaths'] = new Set<string>();
        specConstants.STUB_SET_PATH.clear();
        specConstants.STUB_SET_PATH.add(specConstants.STUB_LETTERS[0]);
        specConstants.LETTER_ADDITION_INFORMATION_STUB.paths = specConstants.STUB_SET_PATH;
        specConstants.LETTER_ADDITION_INFORMATION_STUB.reverse = false;
        specConstants.LETTER_ADDITION_INFORMATION_STUB.percolationDirection = serviceConstants.PercolationDirection.DOWN;
        service['getLettersPlaced'].callsFake(() => {});
        service['getLetterOccurrence'].onCall(0).returns(0).onCall(1).returns(1);
        service['addLetterToCurrentPaths'](specConstants.LETTER_ADDITION_INFORMATION_STUB);
        expect(downCurrentPathsStub.calledWith(specConstants.STUB_LETTERS[0] + specConstants.LETTER_ADDITION_INFORMATION_STUB.letters));
        expect(service['upCurrentPaths']).to.eql(new Set<string>());
    });

    // eslint-disable-next-line max-len
    it('formPossibleWords should call clearCurrentPaths, addPlayerLettersToPath, formUpPossibleWords, and formDownPossibleWords', () => {
        service['clearCurrentPaths'].callsFake(() => {});
        service['addPlayerLettersToPath'].callsFake(() => {});
        service['formUpPossibleWords'].callsFake(() => {});
        service['formDownPossibleWords'].callsFake(() => {});
        service['formPossibleWords'](0, 0, specConstants.INDEXABLE_ANCHORS, specConstants.STUB_LETTERS[0]);
        sinon.assert.calledOnce(service['clearCurrentPaths']);
        sinon.assert.calledOnce(service['addPlayerLettersToPath']);
        expect(service['formUpPossibleWords'].callCount).to.deep.equal(MAX_TILES_PER_PLAYER);
        expect(service['formDownPossibleWords'].callCount).to.deep.equal(MAX_TILES_PER_PLAYER);
    });

    it('formUpPossibleWords should call percolateUp, and return possible words', () => {
        service['percolateUp'].resetHistory();
        service['percolateUp'].callsFake(() => {});
        expect(service['formUpPossibleWords'](specConstants.POSSIBLE_WORD_FORMING_DATA)).to.eql([new Set<string>()]);
        sinon.assert.calledOnce(service['percolateUp']);
    });

    it('formUpPossibleWords should return empty list of sets if index is out of range', () => {
        service['percolateUp'].resetHistory();
        service['percolateUp'].callsFake(() => {});
        const possibleWordFormingData: serviceConstants.PossibleWordFormingData = specConstants.POSSIBLE_WORD_FORMING_DATA;
        possibleWordFormingData.from = 0;
        possibleWordFormingData.index = 1;
        expect(service['formUpPossibleWords'](possibleWordFormingData)).to.eql([new Set<string>()]);
        sinon.assert.notCalled(service['percolateUp']);
    });

    it('addLetterToCurrentPaths should update paths if letters already placed do not exceed or equal letters in my inventory', () => {
        service['downCurrentPaths'].clear();
        service['upCurrentPaths'].clear();
        const upCurrentPathsStub = sinon.stub(service, 'upCurrentPaths' as any);
        specConstants.STUB_SET_PATH.clear();
        specConstants.STUB_SET_PATH.add(specConstants.STUB_LETTERS[0]);
        specConstants.LETTER_ADDITION_INFORMATION_STUB.paths = specConstants.STUB_SET_PATH;
        specConstants.LETTER_ADDITION_INFORMATION_STUB.reverse = false;
        specConstants.LETTER_ADDITION_INFORMATION_STUB.percolationDirection = serviceConstants.PercolationDirection.DOWN;
        service['getLettersPlaced'].callsFake(() => {});
        service['getLetterOccurrence'].onCall(0).returns(0).onCall(1).returns(1);
        service['addLetterToCurrentPaths'](specConstants.LETTER_ADDITION_INFORMATION_STUB);
        expect(upCurrentPathsStub.calledWith(specConstants.LETTER_ADDITION_INFORMATION_STUB.letters + specConstants.STUB_LETTERS[0]));
        const expectedPaths: Set<string> = new Set<string>();
        expectedPaths.add(specConstants.STUB_LETTERS[0] + specConstants.LETTER_ADDITION_INFORMATION_STUB.letters);
        expect(service['downCurrentPaths']).to.eql(expectedPaths);
    });

    it('addLetterToCurrentPaths should not update paths if letters already placed surpass or equal letters in my inventory', () => {
        service['downCurrentPaths'].clear();
        service['upCurrentPaths'].clear();
        const path: Set<string> = new Set<string>();
        path.add(specConstants.STUB_LETTERS[0]);
        specConstants.LETTER_ADDITION_INFORMATION_STUB.paths = path;
        service['getLettersPlaced'].callsFake(() => specConstants.STUB_LETTERS[0]);
        service['getLetterOccurrence'].callsFake(() => 0);
        service['addLetterToCurrentPaths'](specConstants.LETTER_ADDITION_INFORMATION_STUB);
        expect(service['upCurrentPaths']).to.eql(new Set<string>());
        expect(service['downCurrentPaths']).to.eql(new Set<string>());
    });

    it('getLetterOccurrence should return letter occurrence', () => {
        for (let i = 0; i < specConstants.STUB_LETTERS.length; ++i) {
            expect(service['getLetterOccurrence'](specConstants.STUB_LETTERS[i], specConstants.STUB_OCCURRENCES[i])).to.deep.equal(
                specConstants.EXPECTED_OCCURRENCES[i],
            );
        }
    });

    it('getLettersPlaced should return letters placed', () => {
        for (let i = 0; i < specConstants.STUB_PATHS.length; ++i) {
            expect(service['getLettersPlaced'](specConstants.STUB_PATHS[i], specConstants.STUB_POSSIBILITIES[i])).to.deep.equal(
                specConstants.EXPECTED_LETTERS_LEFT[i],
            );
        }
    });

    it('isAnchorIndexable should return true for indexable anchors', () => {
        expect(service['isAnchorIndexable'](specConstants.ANCHOR_INDEX, specConstants.INDEXABLE_ANCHORS[0])).to.deep.equal(true);
    });

    it('isAnchorIndexable should return false for anchors impossible to index', () => {
        for (const indexableAnchor of specConstants.INDEXABLE_ANCHORS) {
            expect(service['isAnchorIndexable'](specConstants.IMPOSSIBLE_ANCHOR_INDEX, indexableAnchor)).to.deep.equal(false);
        }
    });

    it('getPossibilities should percolate liveBoard with crosschecks and convert to LetPos 2D array', () => {
        const letPosStub = {} as serviceConstants.LetPos;
        const setStub = new Set<number>();
        setStub.add(specConstants.DEFAULT_PERCOLATE_OFFSET);
        service['crossChecksPos'].resetHistory();
        service['percolate'].resetHistory();
        service['convertPercolationToLetPos'].resetHistory();
        service['crossChecksPos'].callsFake(() => [letPosStub]);
        service['percolate'].callsFake(() => [setStub]);
        service['convertPercolationToLetPos'].callsFake(() => {});
        service['getPossibilities']();
        service['getPossibilitiesT']();
        expect(service['crossChecksPos'].calledWith(letPosStub));
        expect(service['crossChecksPos'].calledTwice);
        expect(service['percolate'].calledWith(letPosStub, [letPosStub]));
        expect(service['percolate'].calledTwice);
        expect(service['convertPercolationToLetPos'].calledWith([setStub], letPosStub));
        expect(service['convertPercolationToLetPos'].calledTwice);
    });

    it('convertPercolationToLetPos should convert set of numbers to 2D array of LetPos', () => {
        service['isVectorEqual'].callsFake(() => true);
        service['convert1DPosTo2DVec2'].callsFake(() => specConstants.EXPECTED_VEC2[0]);
        const set: Set<number> = new Set<number>();
        set.add(specConstants.DEFAULT_PERCOLATE_OFFSET);
        const defaultLetPos: serviceConstants.LetPos = { letter: 'a' } as serviceConstants.LetPos;
        expect(service['convertPercolationToLetPos']([set], [defaultLetPos])).to.eql([
            [{ letter: defaultLetPos.letter, pos: specConstants.EXPECTED_VEC2[0] } as serviceConstants.LetPos],
        ]);
    });

    it('convertPercolationToLetPos should not convert set of numbers to 2D array of LetPos if given set has not LetPos', () => {
        service['isVectorEqual'].callsFake(() => false);
        service['convert1DPosTo2DVec2'].callsFake(() => specConstants.EXPECTED_VEC2[0]);
        const set: Set<number> = new Set<number>();
        const defaultLetPos: serviceConstants.LetPos = { letter: 'a' } as serviceConstants.LetPos;
        expect(service['convertPercolationToLetPos']([set], [defaultLetPos])).to.deep.equal([[]]);
    });

    it('isVectorEqual should return true for equal vectors', () => {
        expect(service['isVectorEqual'](specConstants.EXPECTED_VEC2[0], specConstants.EXPECTED_VEC2[0])).to.deep.equal(true);
    });

    it('isVectorEqual should return false for unequal vectors', () => {
        expect(service['isVectorEqual'](specConstants.EXPECTED_VEC2[0], specConstants.EXPECTED_VEC2[1])).to.deep.equal(false);
    });

    it('convert1DPosTo2DVec2 should convert 1D position to Vec2', () => {
        for (let i = 0; i < specConstants.LIST_OF_1D_POS.length; ++i) {
            expect(service['convert1DPosTo2DVec2'](specConstants.LIST_OF_1D_POS[i])).to.eql(specConstants.EXPECTED_VEC2[i]);
        }
    });

    it('percolate should correctly add group anchors if board has letters', () => {
        service['boardHasLetter'].callsFake(() => true);
        const set: Set<number> = new Set<number>();
        set.add(specConstants.DEFAULT_PERCOLATE_OFFSET);
        const expectedSet: Set<number> = new Set<number>();
        for (const num of specConstants.EXPECTED_PERCOLATE_NUMBERS) {
            expectedSet.add(num);
        }
        expect(service['percolate']([], set)).to.eql([expectedSet]);
    });

    it('percolate should not add group anchors if board has no letters', () => {
        service['boardHasLetter'].callsFake(() => undefined);
        const set: Set<number> = new Set<number>();
        set.add(specConstants.DEFAULT_PERCOLATE_OFFSET);
        expect(service['percolate']([], set)).to.eql([]);
    });

    it('crossChecksPos should convert liveBoard to set of positions if crosschecks are valid', () => {
        const expectedSetOfCrosschecksPositions: Set<number> = new Set<number>();
        service['isCrossCheckValid'].callsFake((i: number): boolean => {
            expectedSetOfCrosschecksPositions.add(i);
            return true;
        });
        const expectedLetPos: serviceConstants.LetPos = { letter: 'x', pos: { x: 0, y: 0 } as Vec2 } as serviceConstants.LetPos;
        expect(service['crossChecksPos']([expectedLetPos] as serviceConstants.LetPos[])).to.deep.equal(expectedSetOfCrosschecksPositions);
    });

    it('crossChecksPos should not convert liveBoard to set of positions if crosschecks are not valid', () => {
        const expectedSetOfCrosschecksPositions: Set<number> = new Set<number>();
        service['isCrossCheckValid'].callsFake((i: number): boolean => {
            expectedSetOfCrosschecksPositions.add(i);
            return false;
        });
        const expectedLetPos: serviceConstants.LetPos = { letter: 'x', pos: { x: 0, y: 0 } as Vec2 } as serviceConstants.LetPos;
        expect(service['crossChecksPos']([expectedLetPos] as serviceConstants.LetPos[])).not.to.deep.equal(expectedSetOfCrosschecksPositions);
        expect(service['crossChecksPos']([expectedLetPos] as serviceConstants.LetPos[])).to.deep.equal(new Set<number>());
    });

    it('pushLiveBoard should push a LetPos to liveBoard', () => {
        const currentLiveBoardIdx = service['liveBoard'].length;
        service['pushLiveBoard'](specConstants.VALID_SQUARE, { x: 0, y: 0 } as Vec2);
        expect(service['liveBoard'][currentLiveBoardIdx]).to.deep.equal({
            letter: specConstants.VALID_SQUARE?.tile?.name,
            pos: { x: 0, y: 0 } as Vec2,
        } as serviceConstants.LetPos);
    });

    it('pushLiveBoardT should push a LetPos to liveBoardT', () => {
        const currentLiveBoardIdx = service['liveBoardT'].length;
        service['pushLiveBoardT'](specConstants.VALID_SQUARE, { x: 0, y: 0 } as Vec2);
        expect(service['liveBoardT'][currentLiveBoardIdx]).to.deep.equal({
            letter: specConstants.VALID_SQUARE?.tile?.name,
            pos: { x: 0, y: 0 } as Vec2,
        } as serviceConstants.LetPos);
    });

    it('transposeGridElements should transpose grid elements', () => {
        const transposedGrid: ScrabbleGrid = service['transposeGridElements'](gridStub);
        for (let y = 0; y < GRID_SQUARES_PER_LINE; ++y) {
            for (let x = 0; x < GRID_SQUARES_PER_LINE; ++x) {
                const square: Square = gridStub.elements[y][x];
                const squareT: Square = transposedGrid.elements[y][x];
                if (x === y) {
                    expect(square.name).to.equal(squareT.name);
                } else {
                    if (square.tile !== null && squareT.tile !== null) {
                        expect(square.name).not.to.deep.equal(squareT.name);
                    }
                }
            }
        }
    });

    it('getScrabbleGridSquare should get scrabble grid square', () => {
        const squareStub: Square = specConstants.VALID_SQUARE;
        const scrabbleGridStub: ScrabbleGrid = { elements: [] } as ScrabbleGrid;
        scrabbleGridStub.elements.push([squareStub]);
        expect(service['getScrabbleGridSquare'](0, 0, scrabbleGridStub)).to.deep.equal(squareStub);
    });

    it('isCrossCheckValid should return true if board has letter on current position and no letters on above or below row position', () => {
        service['boardHasLetter'].callsFake((pos: number): boolean => pos === specConstants.POSITION_STUB);
        service['isCrossCheckValid'].callsFake(real['isCrossCheckValid']);
        expect(service['isCrossCheckValid'](specConstants.POSITION_STUB)).to.deep.equal(true);
    });

    it('isCrossCheckValid should return false if board has a letter above row position', () => {
        service['boardHasLetter'].callsFake((pos: number): boolean => pos === specConstants.POSITION_STUB + GRID_SQUARES_PER_LINE);
        service['isCrossCheckValid'].callsFake(real['isCrossCheckValid']);
        expect(service['isCrossCheckValid'](specConstants.POSITION_STUB)).to.deep.equal(false);
    });

    it('isCrossCheckValid should return false if board has a letter below row position', () => {
        service['boardHasLetter'].callsFake((pos: number): boolean => pos === specConstants.POSITION_STUB - GRID_SQUARES_PER_LINE);
        service['isCrossCheckValid'].callsFake(real['isCrossCheckValid']);
        expect(service['isCrossCheckValid'](specConstants.POSITION_STUB)).to.deep.equal(false);
    });

    it('boardHasLetter should return undefined if position is out of bounds', () => {
        expect(service['boardHasLetter'](specConstants.INVALID_POSITION, service['liveBoard'])).to.deep.equal(undefined);
        expect(service['boardHasLetter'](specConstants.OUT_OF_BOUNDS_POSITION, service['liveBoard'])).to.deep.equal(undefined);
    });

    it('boardHasLetter should return true if position is not out of bounds and has letter', () => {
        sinon.stub(service, 'scrabbleGrid' as any).returns(gridStub);
        const squareStub: Square = specConstants.VALID_SQUARE;
        const scrabbleGridStub: ScrabbleGrid = { elements: [] } as ScrabbleGrid;
        scrabbleGridStub.elements.push([squareStub]);
        service['convert2DBoardTo1D']();
        expect(service['boardHasLetter'](0, service['liveBoard'])).to.deep.equal(true);
        expect(service['boardHasLetter'](0, service['liveBoardT'])).to.deep.equal(true);
    });

    it('boardHasLetter should return false if position is not out of bounds and has no letter', () => {
        sinon.stub(service, 'scrabbleGrid' as any).returns(gridStub);
        service['convert2DBoardTo1D']();
        service['liveBoard'][0].letter = null;
        expect(service['boardHasLetter'](0, service['liveBoard'])).to.deep.equal(false);
        service['liveBoardT'][0].letter = null;
        expect(service['boardHasLetter'](0, service['liveBoardT'])).to.deep.equal(false);
    });

    it('updatePlayerLettersOfPossibilities should update wordPossibilities with horizontal direction', () => {
        sinon.stub(service, 'scrabbleGrid' as any).returns(gridStub);
        service['wordPossibilities'] = new Set<serviceConstants.WordPossibility>();
        for (let y = 0; y < specConstants.GRID_SIZE; ++y) {
            for (let x = 0; x < specConstants.GRID_SIZE; ++x) {
                if (service['scrabbleGrid'].elements[y][x].tile) service['scrabbleGrid'].elements[y][x].tile = null;
            }
        }
        for (const tile of specConstants.TILES_ONE_WORD) {
            service['scrabbleGrid'].elements[tile.position.y][tile.position.x].tile = tile;
        }
        service['wordPossibilities'].add(specConstants.INITIAL_WORD_POSSIBILITY);
        service['updatePlayerLettersOfPossibilities']();
        service['wordPossibilities'].forEach((element: WordPossibility) => {
            expect(element).to.eql(specConstants.EXPECTED_WORD_POSSIBILITY);
        });
    });

    it('updatePlayerLettersOfPossibilities should update wordPossibilities with vertical direction', () => {
        sinon.stub(service, 'scrabbleGrid' as any).returns(gridStub);
        service['wordPossibilities'] = new Set<serviceConstants.WordPossibility>();
        for (let y = 0; y < specConstants.GRID_SIZE; ++y) {
            for (let x = 0; x < specConstants.GRID_SIZE; ++x) {
                if (service['scrabbleGrid'].elements[y][x].tile) service['scrabbleGrid'].elements[y][x].tile = null;
            }
        }
        for (const tile of specConstants.TILES_ONE_WORD) {
            service['scrabbleGrid'].elements[tile.position.y][tile.position.x].tile = tile;
        }
        const wordPossibilities: serviceConstants.WordPossibility = specConstants.INITIAL_WORD_POSSIBILITY;
        wordPossibilities.wordDirection = DirectionType.VERTICAL;
        wordPossibilities.anchor = specConstants.ANCHOR_VERTICAL;
        service['wordPossibilities'].add(wordPossibilities);
        service['updatePlayerLettersOfPossibilities']();
        service['wordPossibilities'].forEach((element: WordPossibility) => {
            expect(element).to.eql(specConstants.EXPECTED_WORD_POSSIBILITY_VERTICAL);
        });
    });

    it('formDownPossibleWords should return a Set on possible words', () => {
        service['downCurrentPaths'] = specConstants.STUB_SET_PATH;
        expect(service['formDownPossibleWords'](specConstants.POSSIBLE_WORD_FORMING_DATA)).to.eql(
            specConstants.POSSIBLE_WORD_FORMING_DATA.possibleWords,
        );
    });

    it('formUpPossibleWords should form up possible words', () => {
        service['isAbleToBeFormedUpwards'].callsFake(() => true);
        service['percolateUp'].callsFake(() => {});
        service['isUpPossibleWordWorthy'].callsFake(() => true);
        expect(service['formUpPossibleWords'](specConstants.POSSIBLE_WORD_FORMING_DATA)).to.eql([new Set<string>(), new Set<string>()]);
    });

    it('formDownPossibleWords should form down possible words', () => {
        service['isAbleToBeFormedDownwards'].callsFake(() => true);
        service['percolateDown'].callsFake(() => {});
        service['isDownPossibleWordWorthy'].callsFake(() => true);
        expect(service['formDownPossibleWords'](specConstants.POSSIBLE_WORD_FORMING_DATA)).to.eql([
            new Set<string>(),
            new Set<string>(),
            new Set<string>(),
        ]);
    });

    it('formDownPossibleWords should not form down possible words if they are not worthy', () => {
        service['isAbleToBeFormedDownwards'].callsFake(() => true);
        service['percolateDown'].callsFake(() => {});
        service['isDownPossibleWordWorthy'].callsFake(() => false);
        expect(service['formDownPossibleWords'](specConstants.POSSIBLE_WORD_FORMING_DATA)).to.eql([
            new Set<string>(),
            new Set<string>(),
            new Set<string>(),
        ]);
    });

    it('isDownPossibleWordWorthy should return whether the word is possibly down worthy', () => {
        expect(service['isDownPossibleWordWorthy'](specConstants.POSSIBLE_WORD_FORMING_DATA)).to.deep.equal(false);
    });
});

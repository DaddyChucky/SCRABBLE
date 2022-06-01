import { MAX_NUMBER_OF_TILES } from '@app/services/letter-bag/letter-bag.service.spec.constants';
import { Tile } from '@common/model/tile';
import { expect } from 'chai';
import { describe } from 'mocha';
import { AdjacentTiles } from './adjacent-tiles';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import sinon = require('sinon');

describe('AdjacentTiles', () => {
    let tiles: AdjacentTiles;
    beforeEach(() => {
        tiles = new AdjacentTiles();
    });
    it('tiles constructor should call initialize', () => {
        // eslint-disable-next-line dot-notation
        const initializeSpy = sinon.spy(tiles['initialize']);
        tiles = new AdjacentTiles();
        expect(initializeSpy.called);
    });
    it('initialize that is called in constructor should create an array of 7 for the names and the weights', () => {
        tiles = new AdjacentTiles();
        expect(tiles.names.length).to.equal(MAX_NUMBER_OF_TILES);
        expect(tiles.weights.length).to.equal(MAX_NUMBER_OF_TILES);
    });
    it('addTile should not do anything if given tile is undefined', () => {
        const initialNames = tiles.names;
        const initialWeights = tiles.weights;
        const newUndefinedTile = undefined;
        tiles.addTile(0, newUndefinedTile);
        expect(tiles.names).to.equal(initialNames);
        expect(tiles.weights).to.equal(initialWeights);
    });

    it('addTile should not do anything if given tile is undefined', () => {
        const initialNames = tiles.names;
        const initialWeights = tiles.weights;
        const newUndefinedTile = new Tile();
        newUndefinedTile.weight = 2;
        tiles.addTile(0, newUndefinedTile);
        expect(tiles.names).to.equal(initialNames);
        expect(tiles.weights).to.equal(initialWeights);
    });
});

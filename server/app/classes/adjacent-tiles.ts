import { MAX_NUMBER_OF_TILES } from '@app/services/letter-bag/letter-bag.service.spec.constants';
import { Tile } from '@common/model/tile';

export class AdjacentTiles {
    names: string[] = [];
    weights: number[] = [];
    constructor() {
        this.initialize();
    }

    addTile(index: number, tile?: Tile) {
        this.names[index] += tile?.name;
        if (tile) this.weights[index] += tile.weight;
    }

    private initialize(): void {
        for (let i = 0; i < MAX_NUMBER_OF_TILES; i++) {
            this.names.push('');
            this.weights.push(0);
        }
    }
}

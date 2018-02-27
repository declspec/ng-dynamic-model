import { Model } from './../model';

export class ModelBuilder {
    constructor(q) {
        this.$$q = q;
    }

    build(initialState) {
        return new Model(this.$$q, initialState);
    }
}

ModelBuilder.$inject = [ '$q' ];

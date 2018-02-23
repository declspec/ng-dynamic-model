import { Model } from './../model';

export class ModelBuilder {
    constructor() {

    }

    build(initialState) {
        return new Model(initialState);
    }
}


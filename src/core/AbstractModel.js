export class AbstractModel {
    state = {};

    async init() {
        throw Error("Not implemented");
    }
}

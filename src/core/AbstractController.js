/**
 *
 * @template M
 * @template V
 *
 */
export class AbstractController {
    /** @type {M} */
    model;

    /** @type {V} */
    view;

    /**
     *
     * @param {M} model
     * @param {V} view
     * @constructor
     *
     */
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }
}

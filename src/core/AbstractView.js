export class AbstractView {
    /** @type {HTMLElement} */
    rootElement;

    /** @type {Map<string, HTMLElement>} */
    DOM;

    /**
     *
     * @param {HTMLElement} rootElement
     *
     */
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.DOM = new Map();
    }

    async init() {
        throw Error("Not implemented.");
    }

    /**
     *
     * @param {string} key
     *
     */
    findDOMById(key) {
        if (!this.DOM.has(key)) return;
        return this.DOM.get(key);
    }

    /**
     *
     * @param {string} key
     * @param {HTMLElement} element
     *
     */
    setToDom(key, element) {
        this.DOM.set(key, element);
    }

    /**
     *
     * @param {{[key: string]: HTMLElement}} arg
     */
    setAllToDom(arg) {
        Object.entries(arg).forEach(([key, val]) => this.setToDom(key, val));
    }
}

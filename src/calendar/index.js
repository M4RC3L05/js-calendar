import "./styles.css";

import { Controller } from "./Controller";
import { Model } from "./Model";
import { View } from "./View";

/**
 *
 * @param {HTMLElement} rootEle
 *
 */
export function Calendar(rootEle) {
    const ctl = new Controller(new Model(), new View(rootEle));
    return ctl.init();
}

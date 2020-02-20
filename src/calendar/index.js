import "./styles.css";

import { CalendarController } from "./CalendarController";
import { CalendarModel } from "./CalendarModel";
import { CalendarView } from "./CalendarView";

/**
 *
 * @param {HTMLElement} rootEle
 *
 */
export async function Calendar(rootEle) {
    const ctl = new CalendarController(
        new CalendarModel(),
        new CalendarView(rootEle)
    );
    await ctl.init();

    return ctl;
}

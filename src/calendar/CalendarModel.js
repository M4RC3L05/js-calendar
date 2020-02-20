import { AbstractModel } from "../core/AbstractModel";

/**
 *
 * @typedef {object} State
 * @property {{id: string, description: string, at: Date}[]} events
 * @property {Date} currDay
 * @property {Date} viewingDate
 * @property {string} currEventToManageId
 * @property {boolean} isManageModalOpen
 *
 */

export class CalendarModel extends AbstractModel {
    /** @type {State} */
    state = {
        events: [],
        currDay: undefined,
        viewingDate: undefined,
        currEventToManageId: undefined,
        isManageModalOpen: false
    };

    async init() {
        this.state.currDay = new Date();
        this.state.viewingDate = new Date(
            this.state.currDay.getFullYear(),
            this.state.currDay.getMonth(),
            this.state.currDay.getDate()
        );
        this.state.events = localStorage.getItem("@events")
            ? JSON.parse(localStorage.getItem("@events")).map(e => ({
                  ...e,
                  at: new Date(e.at)
              }))
            : [];
    }

    moveCalendarPrev() {
        const currentYear =
            this.state.viewingDate.getMonth() === 0
                ? this.state.viewingDate.getFullYear() - 1
                : this.state.viewingDate.getFullYear();
        const currentMonth =
            this.state.viewingDate.getMonth() === 0
                ? 11
                : this.state.viewingDate.getMonth() - 1;

        this.state.viewingDate = new Date(currentYear, currentMonth);
    }

    moveCalendarNext() {
        const currentYear =
            this.state.viewingDate.getMonth() === 11
                ? this.state.viewingDate.getFullYear() + 1
                : this.state.viewingDate.getFullYear();
        const currentMonth = (this.state.viewingDate.getMonth() + 1) % 12;

        this.state.viewingDate = new Date(currentYear, currentMonth);
    }

    setShouldManageModalBeOpen(isOpen) {
        this.state.isManageModalOpen = isOpen;
    }

    setEventToManage(id) {
        this.state.currEventToManageId = id;
    }

    deleteEvent(id) {
        this.state.events = this.state.events.filter(e => e.id !== id);
        this.saveEventsInLocalStorage();
    }

    updateEvent(id, { description, at }) {
        this.state.events = this.state.events.map(e =>
            e.id !== id
                ? e
                : {
                      ...e,
                      description: description ? description : e.description,
                      at: at ? at : e.at
                  }
        );

        this.saveEventsInLocalStorage();
    }

    createEvent({ description, at }) {
        this.state.events.push({
            id: Math.random()
                .toString(32)
                .slice(2),
            description,
            at
        });

        this.saveEventsInLocalStorage();
    }

    saveEventsInLocalStorage() {
        localStorage.setItem("@events", JSON.stringify(this.state.events));
    }
}

import { months, firstDay, daysInMonth } from "../utils";

export class View {
    /** @type {import("./Controller").Controller} */
    controller;

    /** @type {HTMLElement} */
    rootEle;

    CalendarDOM = {
        /** @type {HTMLElement} */
        calendarTable: undefined,
        /** @type {HTMLElement} */
        calendarHead: undefined,
        /** @type {HTMLElement} */
        calendarBody: undefined,
        /** @type {HTMLElement} */
        calendarPrev: undefined,
        /** @type {HTMLElement} */
        calendarNext: undefined,
        /** @type {HTMLElement} */
        calendarCurrDate: undefined,
        manageEventModal: {
            /** @type {HTMLElement} */
            modal: undefined,
            /** @type {HTMLElement} */
            close: undefined,
            /** @type {HTMLElement} */
            inputDescription: undefined,
            /** @type {HTMLElement} */
            inputDate: undefined,
            /** @type {HTMLElement} */
            eventIdShow: undefined,
            /** @type {HTMLElement} */
            ok: undefined,
            /** @type {HTMLElement} */
            delete: undefined
        }
    };

    /**
     *
     * @param {HTMLElement} rootEle
     *
     */
    constructor(rootEle) {
        this.rootEle = rootEle;
    }

    /**
     *
     * @param {import("./Controller").Controller} ctl
     *
     */
    bindController(ctl) {
        this.controller = ctl;
    }

    async init() {
        this.initRenderApp();
        this.populateCalendarDom();
    }

    initRenderApp() {
        const rootDiv = document.createElement("div");
        rootDiv.classList.add("calendar");
        rootDiv.innerHTML = `
        <div class="calendar-manage-event hiden">
            <span class="close"><ion-icon name="close-outline"></ion-icon></span>
            <div class="title">
                <span class="event-modal-title">Manage evento @</span> <span class="event-id"></span>
            </div>
            <div class="input-row">
                <label for="descricao">Descrição</label>
                <textarea type="text" id="descricao" rows="12" name="description"></textarea>
            </div>
            <div class="input-row">
                <label for="date">Data</label>
                <input type="datetime-local" id="date" name="date"/>
            </div>
            <div class="input-row__submit">
                <input type="submit" id="ok" value="Confirmar"/>
                <input type="submit" id="eliminar" value="Eliminar" class="danger"/>
            </div>
        </div>
        <div class="calendar-header">
            <button class="calendar-prev">
                <ion-icon name="arrow-back-outline"></ion-icon>
            </button>
            <p class="calendar-currDate"></p>
            <button class="calendar-next">
                <ion-icon name="arrow-forward-outline"></ion-icon>
            </button>
        </div>
        <table class="calendar-table">
            <thead class="calendar-head">
                <tr>
                    <th>D</th>
                    <th>S</th>
                    <th>T</th>
                    <th>Q</th>
                    <th>Q</th>
                    <th>S</th>
                    <th>S</th>
                </tr>
            </thead>
            <tbody class="calendar-body">
                <tr></tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
            </tbody>
        </table>`;

        this.rootEle.parentNode.replaceChild(rootDiv, this.rootEle);
        this.rootEle = rootDiv;
    }

    populateCalendarDom() {
        this.CalendarDOM = {
            calendarTable: this.rootEle.querySelector(".calendar-table"),
            calendarHead: this.rootEle.querySelector(".calendar-head"),
            calendarBody: this.rootEle.querySelector(".calendar-body"),
            calendarPrev: this.rootEle.querySelector(".calendar-prev"),
            calendarNext: this.rootEle.querySelector(".calendar-next"),
            calendarCurrDate: this.rootEle.querySelector(".calendar-currDate"),
            manageEventModal: {
                modal: this.rootEle.querySelector(".calendar-manage-event"),
                close: this.rootEle
                    .querySelector(".calendar-manage-event")
                    .querySelector(".close"),
                inputDescription: this.rootEle
                    .querySelector(".calendar-manage-event")
                    .querySelector("#descricao"),
                inputDate: this.rootEle
                    .querySelector(".calendar-manage-event")
                    .querySelector("#date"),
                eventIdShow: this.rootEle
                    .querySelector(".calendar-manage-event")
                    .querySelector(".event-id"),
                ok: this.rootEle
                    .querySelector(".calendar-manage-event")
                    .querySelector("#ok"),
                delete: this.rootEle
                    .querySelector(".calendar-manage-event")
                    .querySelector("#eliminar")
            }
        };
    }

    /**
     *
     * @param {Date} date
     * @param {{id: string, description: string, at: Date}[]} events
     *
     */
    getEventsForTheDate(date, events) {
        return events.filter(
            event =>
                event.at.getFullYear() === date.getFullYear() &&
                event.at.getMonth() === date.getMonth() &&
                event.at.getDate() === date.getDate()
        );
    }

    /**
     *
     * @param {import("./Model").State} state
     *
     */
    renderCalendarHeader(state) {
        this.CalendarDOM.calendarCurrDate.innerHTML = `${
            months[state.viewingDate.getMonth()].full
        } ${state.viewingDate.getFullYear()}`;
    }

    /**
     *
     * @param {import("./Model").State} state
     *
     */
    renderCalendar(state) {
        let monthStarted = false;
        let day = 1;
        for (let tr of this.CalendarDOM.calendarBody.children) {
            while (tr.firstChild) tr.removeChild(tr.firstChild);

            for (let dayCel = 0; dayCel < 7; dayCel += 1) {
                const td = document.createElement("td");
                td.className = "";

                if (
                    dayCel >=
                    firstDay(
                        state.viewingDate.getMonth(),
                        state.viewingDate.getFullYear()
                    )
                )
                    monthStarted = true;

                if (
                    day >
                    daysInMonth(
                        state.viewingDate.getMonth(),
                        state.viewingDate.getFullYear()
                    )
                ) {
                    td.classList.add("muted");
                    tr.appendChild(td);
                    continue;
                }

                if (!monthStarted) {
                    td.classList.add("muted");
                    tr.appendChild(td);
                    continue;
                }

                const events = this.getEventsForTheDate(
                    new Date(
                        state.viewingDate.getFullYear(),
                        state.viewingDate.getMonth(),
                        day
                    ),
                    state.events
                );

                const isCurrDay =
                    new Date(
                        state.viewingDate.getFullYear(),
                        state.viewingDate.getMonth(),
                        day
                    ).getTime() ===
                    new Date(
                        state.currDay.getFullYear(),
                        state.currDay.getMonth(),
                        state.currDay.getDate()
                    ).getTime();

                if (events && Array.isArray(events) && events.length > 0) {
                    const divEvents = document.createElement("div");
                    divEvents.classList.add("events-td");
                    events.forEach(event => {
                        const divEvent = document.createElement("div");
                        divEvent.textContent = event.description;
                        divEvent.addEventListener("dblclick", () =>
                            this.controller.manageEvent(event.id)
                        );
                        divEvents.appendChild(divEvent);
                    });
                    td.appendChild(divEvents);
                }

                const createEventSpan = document.createElement("span");
                createEventSpan.innerHTML = `<ion-icon name="add-outline"></ion-icon>`;
                createEventSpan.classList.add("add-event");
                const currDay = day;
                createEventSpan.addEventListener("click", () => {
                    this.controller.toggleCreateMode();
                    const now = new Date();
                    this.CalendarDOM.manageEventModal.inputDate.valueAsNumber = new Date(
                        state.viewingDate.getFullYear(),
                        state.viewingDate.getMonth(),
                        currDay,
                        now.getHours(),
                        now.getMinutes()
                    );
                });
                td.appendChild(createEventSpan);

                if (isCurrDay) td.classList.add("curr");

                const span = document.createElement("span");
                span.classList.add("numDay");
                span.textContent = day;
                td.appendChild(span);
                tr.appendChild(td);
                day += 1;
            }
        }
    }

    /**
     *
     * @param {import("./Model").State} state
     *
     */
    renderManageEventModal(state) {
        this.CalendarDOM.manageEventModal.modal.classList.remove("hidden");
        this.CalendarDOM.manageEventModal.modal.classList.remove("show");
        this.CalendarDOM.manageEventModal.delete.style.display = "inline-block";

        if (state.createMode) {
            this.CalendarDOM.manageEventModal.modal.classList.add("show");
            this.CalendarDOM.manageEventModal.modal.querySelector(
                ".event-modal-title"
            ).textContent = "Criara Evento";
            this.CalendarDOM.manageEventModal.delete.style.display = "none";
            this.CalendarDOM.manageEventModal.inputDescription.value = "";
            this.CalendarDOM.manageEventModal.eventIdShow.textContent = ``;
        } else if (state.currEventToManageId) {
            const event = state.events.find(
                e => e.id === state.currEventToManageId
            );
            this.CalendarDOM.manageEventModal.modal.classList.add("show");
            this.CalendarDOM.manageEventModal.modal.querySelector(
                ".event-modal-title"
            ).textContent = "Editar Evento";
            this.CalendarDOM.manageEventModal.eventIdShow.textContent = `@${state.currEventToManageId}`;
            this.CalendarDOM.manageEventModal.inputDescription.value =
                event.description;
            this.CalendarDOM.manageEventModal.inputDate.valueAsNumber = event.at.getTime();
        } else {
            this.CalendarDOM.manageEventModal.modal.classList.add("hidden");
        }
    }

    /**
     *
     * @param {import("./Model").State} state
     *
     */
    render(state) {
        this.renderManageEventModal(state);
        this.renderCalendarHeader(state);
        this.renderCalendar(state);
    }
}

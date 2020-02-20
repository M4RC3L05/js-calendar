import { months, firstDay, daysInMonth } from "../utils";
import { AbstractView } from "../core/AbstractView";

export class CalendarView extends AbstractView {
    static DOMKeys = {
        calendarTable: "calendarTable",
        calendarHead: "calendarHead",
        calendarBody: "calendarBody",
        calendarPrev: "calendarPrev",
        calendarNext: "calendarNext",
        calendarCurrDate: "calendarCurrDate",
        modal: "modal",
        modalClose: "modalClose",
        modalInputDescription: "modalInputDescription",
        modalInputDate: "modalInputDate",
        modalEventIdShow: "modalEventIdShow",
        modalOk: "modalOk",
        modalDelete: "modalDelete"
    };

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

        this.rootElement.parentNode.replaceChild(rootDiv, this.rootElement);
        this.rootElement = rootDiv;
    }

    populateCalendarDom() {
        this.setAllToDom({
            calendarTable: this.rootElement.querySelector(".calendar-table"),
            calendarHead: this.rootElement.querySelector(".calendar-head"),
            calendarBody: this.rootElement.querySelector(".calendar-body"),
            calendarPrev: this.rootElement.querySelector(".calendar-prev"),
            calendarNext: this.rootElement.querySelector(".calendar-next"),
            calendarCurrDate: this.rootElement.querySelector(
                ".calendar-currDate"
            ),
            modal: this.rootElement.querySelector(".calendar-manage-event"),
            modalClose: this.rootElement
                .querySelector(".calendar-manage-event")
                .querySelector(".close"),
            modalInputDescription: this.rootElement
                .querySelector(".calendar-manage-event")
                .querySelector("#descricao"),
            modalInputDate: this.rootElement
                .querySelector(".calendar-manage-event")
                .querySelector("#date"),
            modalEventIdShow: this.rootElement
                .querySelector(".calendar-manage-event")
                .querySelector(".event-id"),
            modalOk: this.rootElement
                .querySelector(".calendar-manage-event")
                .querySelector("#ok"),
            modalDelete: this.rootElement
                .querySelector(".calendar-manage-event")
                .querySelector("#eliminar")
        });
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
     * @param {import("./CalendarModel").State} state
     *
     */
    renderCalendarHeader(state) {
        this.findDOMById("calendarCurrDate").innerHTML = `${
            months[state.viewingDate.getMonth()].full
        } ${state.viewingDate.getFullYear()}`;
    }

    /**
     *
     * @param {import("./CalendarModel").State} state
     *
     */
    renderCalendar(state) {
        let monthStarted = false;
        let day = 1;
        for (let tr of this.findDOMById("calendarBody").children) {
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
                        divEvent.setAttribute("eventId", event.id);
                        divEvent.textContent = event.description;
                        divEvents.appendChild(divEvent);
                    });
                    td.appendChild(divEvents);
                }

                const createEventIcon = document.createElement("ion-icon");
                createEventIcon.classList.add("add-event");
                createEventIcon.setAttribute("name", "add-outline");
                td.appendChild(createEventIcon);

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
     * @param {import("./CalendarModel").State} state
     *
     */
    renderManageEventModal(state) {
        if (!state.isManageModalOpen) {
            this.findDOMById("modal").classList.add("hidden");
            this.findDOMById("modal").classList.remove("show");
            return;
        }

        if (state.currEventToManageId) {
            const event = state.events.find(
                e => e.id === state.currEventToManageId
            );
            this.findDOMById("modalDelete").style.display = "inline-block";
            this.findDOMById("modal").querySelector(
                ".event-modal-title"
            ).textContent = "Editar Evento";
            this.findDOMById(
                "modalEventIdShow"
            ).textContent = `@${state.currEventToManageId}`;
            this.findDOMById("modalInputDescription").value = event.description;
            this.findDOMById(
                "modalInputDate"
            ).valueAsNumber = event.at.getTime();
        } else {
            this.findDOMById("modal").querySelector(
                ".event-modal-title"
            ).textContent = "Criara Evento";
            this.findDOMById("modalDelete").style.display = "none";
            this.findDOMById("modalInputDescription").value = "";
            this.findDOMById("modalEventIdShow").textContent = ``;
        }

        this.findDOMById("modal").classList.add("show");
        this.findDOMById("modal").classList.remove("hidden");
    }

    /**
     *
     * @param {string} id
     *
     */
    removeEvent(id) {
        this.findDOMById("calendarBody")
            .querySelector(`[eventId="${id}"]`)
            .parentNode.removeChild(
                this.findDOMById("calendarBody").querySelector(
                    `[eventId="${id}"]`
                )
            );
    }

    /**
     *
     * @param {import("./CalendarModel").State} state
     *
     */
    render(state) {
        this.renderManageEventModal(state);
        this.renderCalendarHeader(state);
        this.renderCalendar(state);
    }
}

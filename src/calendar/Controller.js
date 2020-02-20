export class Controller {
    /** @type {import("./Model").Model} */
    model;

    /** @type {import("./View").View} */
    view;

    /**
     *
     * @param {import("./Model").Model} model
     * @param {import("./View").View} view
     */
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.moveCalendarNext = this.moveCalendarNext.bind(this);
        this.moveCalendarPrev = this.moveCalendarPrev.bind(this);
        this.onDeleteEvent = this.onDeleteEvent.bind(this);
        this.onEventManagerConfirm = this.onEventManagerConfirm.bind(this);
        this.onEventManagerClose = this.onEventManagerClose.bind(this);
        this.onShowCreateModal = this.onShowCreateModal.bind(this);
        this.onShowEditModal = this.onShowEditModal.bind(this);
    }

    async init() {
        await this.model.init();
        await this.view.init();
        this.view.render(this.model.state);

        this.bindEvents();
    }

    bindEvents() {
        this.view
            .findDOMById("calendarPrev")
            .addEventListener("click", this.moveCalendarPrev);
        this.view
            .findDOMById("calendarNext")
            .addEventListener("click", this.moveCalendarNext);
        this.view
            .findDOMById("modalClose")
            .addEventListener("click", this.onEventManagerClose);
        this.view
            .findDOMById("modalDelete")
            .addEventListener("click", this.onDeleteEvent);
        this.view
            .findDOMById("modalOk")
            .addEventListener("click", this.onEventManagerConfirm);
        this.view
            .findDOMById("calendarBody")
            .addEventListener("click", this.onShowCreateModal);

        this.view
            .findDOMById("calendarBody")
            .addEventListener("dblclick", this.onShowEditModal);
    }

    onShowCreateModal(e) {
        if (this.model.state.isManageModalOpen) return;
        if (!e.target.classList.contains("add-event")) return;

        const curr = e.target.parentNode.querySelector(".numDay");
        const now = new Date();

        this.view.findDOMById("modalInputDate").valueAsNumber = new Date(
            this.model.state.viewingDate.getFullYear(),
            this.model.state.viewingDate.getMonth(),
            Number(curr.textContent),
            now.getHours(),
            now.getMinutes()
        ).getTime();
        this.model.setEventToManage(undefined);
        this.model.setShouldManageModalBeOpen(true);
        this.view.renderManageEventModal(this.model.state);
    }

    onShowEditModal(e) {
        if (this.model.state.isManageModalOpen) return;
        if (!e.target.hasAttribute("eventId")) return;

        const eventId = String(e.target.getAttribute("eventId"));

        this.model.setEventToManage(eventId);
        this.model.setShouldManageModalBeOpen(true);
        this.view.renderManageEventModal(this.model.state);
    }

    onEventManagerConfirm() {
        const description = this.view.findDOMById("modalInputDescription")
            .value;
        const at = new Date(this.view.findDOMById("modalInputDate").value);
        if (this.model.state.currEventToManageId) {
            this.model.updateEvent(this.model.state.currEventToManageId, {
                description,
                at
            });
        } else {
            this.model.createEvent({ description, at });
        }

        this.model.setEventToManage(undefined);
        this.model.setShouldManageModalBeOpen(false);

        this.view.renderManageEventModal(this.model.state);
        this.view.renderCalendar(this.model.state);
    }

    onEventManagerClose() {
        this.model.setEventToManage(undefined);
        this.model.setShouldManageModalBeOpen(false);
        this.view.renderManageEventModal(this.model.state);
    }

    moveCalendarNext() {
        this.model.moveCalendarNext();
        this.view.renderCalendarHeader(this.model.state);
        this.view.renderCalendar(this.model.state);
    }
    moveCalendarPrev() {
        this.model.moveCalendarPrev();
        this.view.renderCalendarHeader(this.model.state);
        this.view.renderCalendar(this.model.state);
    }

    onDeleteEvent() {
        if (!this.model.state.currEventToManageId) return;
        const id = this.model.state.currEventToManageId;
        this.model.deleteEvent(this.model.state.currEventToManageId);
        this.model.setEventToManage(undefined);
        this.model.setShouldManageModalBeOpen(false);

        this.view.removeEvent(id);
        this.view.renderManageEventModal(this.model.state);
    }
}

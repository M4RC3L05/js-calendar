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
        this.manageEvent = this.manageEvent.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.toggleCreateMode = this.toggleCreateMode.bind(this);
        this.enableCreateMode = this.enableCreateMode.bind(this);
        this.onEventManagerConfirm = this.onEventManagerConfirm.bind(this);
        this.onEventManagerClose = this.onEventManagerClose.bind(this);
    }

    async init() {
        await this.model.init();
        this.view.bindController(this);
        await this.view.init();
        this.view.render(this.model.state);
    }

    onEventManagerConfirm() {
        if (
            !!this.model.state.createMode ===
            !!this.model.state.currEventToManageId
        )
            return;

        const description = this.view.CalendarDOM.manageEventModal
            .inputDescription.value;
        const at = new Date(
            this.view.CalendarDOM.manageEventModal.inputDate.value
        );
        if (this.model.state.currEventToManageId) {
            this.model.updateEvent({ description, at });
            this.model.toggleEventToManage(undefined);
        } else {
            this.model.createEvent({ description, at });
            this.toggleCreateMode();
        }

        this.view.renderManageEventModal(this.model.state);
        this.view.renderCalendar(this.model.state);
    }

    onEventManagerClose() {
        if (this.model.state.createMode) this.model.toggleCreateMode();
        else this.model.toggleEventToManage(undefined);

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

    manageEvent(id) {
        if (this.model.state.createMode) return;

        this.model.toggleEventToManage(id);
        this.view.renderManageEventModal(this.model.state);
    }

    enableCreateMode() {
        if (this.model.state.currEventToManageId) return;

        this.model.toggleCreateMode();
        this.view.renderManageEventModal(this.model.state);
    }

    deleteEvent() {
        if (this.model.state.createMode) return;
        if (!this.model.state.currEventToManageId) return;

        this.model.deleteEvent();
        this.model.toggleEventToManage(undefined);

        this.view.renderCalendar(this.model.state);
        this.view.renderManageEventModal(this.model.state);
    }

    toggleCreateMode() {
        if (this.model.state.currEventToManageId) return;

        this.model.toggleCreateMode();
        this.view.renderManageEventModal(this.model.state);
    }

    getState() {
        return this.model.state;
    }
}

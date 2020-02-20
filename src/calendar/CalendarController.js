import { CalendarView } from "./CalendarView";
import { AbstractController } from "../core/AbstractController";

/**
 *
 * @extends {AbstractController<import("./CalendarModel").CalendarModel, import("./CalendarView").CalendarView>}
 *
 */
export class CalendarController extends AbstractController {
    /**
     *
     * @param {import("./CalendarModel").CalendarModel} model
     * @param {import("./CalendarView").CalendarView} view
     *
     */
    constructor(model, view) {
        super(model, view);

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
            .findDOMById(CalendarView.DOMKeys.calendarPrev)
            .addEventListener("click", this.moveCalendarPrev);
        this.view
            .findDOMById(CalendarView.DOMKeys.calendarNext)
            .addEventListener("click", this.moveCalendarNext);
        this.view
            .findDOMById(CalendarView.DOMKeys.modalClose)
            .addEventListener("click", this.onEventManagerClose);
        this.view
            .findDOMById(CalendarView.DOMKeys.modalDelete)
            .addEventListener("click", this.onDeleteEvent);
        this.view
            .findDOMById(CalendarView.DOMKeys.modalOk)
            .addEventListener("click", this.onEventManagerConfirm);
        this.view
            .findDOMById(CalendarView.DOMKeys.calendarBody)
            .addEventListener("click", this.onShowCreateModal);

        this.view
            .findDOMById(CalendarView.DOMKeys.calendarBody)
            .addEventListener("dblclick", this.onShowEditModal);
    }

    /**
     *
     * @param {MouseEvent} e
     *
     */
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

    /**
     *
     * @param {MouseEvent} e
     *
     */
    onShowEditModal(e) {
        if (this.model.state.isManageModalOpen) return;
        if (!e.target.hasAttribute("eventId")) return;

        const eventId = String(e.target.getAttribute("eventId"));

        this.model.setEventToManage(eventId);
        this.model.setShouldManageModalBeOpen(true);
        this.view.renderManageEventModal(this.model.state);
    }

    onEventManagerConfirm() {
        const description = this.view.findDOMById(
            CalendarView.DOMKeys.modalInputDescription
        ).value;
        const at = new Date(
            this.view.findDOMById(CalendarView.DOMKeys.modalInputDate).value
        );
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

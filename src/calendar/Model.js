/**
 *
 * @typedef {object} State
 * @property {{id: string, description: string, at: Date}[]} events
 * @property {Date} currDay
 * @property {Date} viewingDate
 * @property {string} currEventToManageId
 * @property {boolean} createMode
 *
 */

// [
//     {
//         id: Math.random()
//             .toString(32)
//             .slice(2),
//         description: "aagsrgsrg",
//         at: new Date(
//             this.state.viewingDate.getTime() +
//                 1 * 24 * 60 * 60 * 1000
//         )
//     },
//     {
//         id: Math.random()
//             .toString(32)
//             .slice(2),
//         description: "aagsrgsrg",
//         at: new Date(
//             this.state.viewingDate.getTime() +
//                 (Math.random() * 10 + 1) * 24 * 60 * 60 * 1000
//         )
//     },
//     {
//         id: Math.random()
//             .toString(32)
//             .slice(2),
//         description: "aagfsaefaegfeagaegesrgsrg",
//         at: new Date(
//             this.state.viewingDate.getTime() +
//                 1 * 24 * 60 * 60 * 1000
//         )
//     },
//     {
//         id: Math.random()
//             .toString(32)
//             .slice(2),
//         description: "aagsrgsrg",
//         at: new Date(
//             this.state.viewingDate.getTime() +
//                 (Math.random() * 10 + 1) * 24 * 60 * 60 * 1000
//         )
//     },
//     {
//         id: Math.random()
//             .toString(32)
//             .slice(2),
//         description: "aagsrgsrg",
//         at: this.state.currDay
//     },
//     {
//         id: Math.random()
//             .toString(32)
//             .slice(2),
//         description: "aagsrgsrg",
//         at: new Date(
//             this.state.viewingDate.getTime() +
//                 (Math.random() * 10 + 1) * 24 * 60 * 60 * 1000
//         )
//     }
// ]

export class Model {
    /** @type {State} */
    state = {
        events: [],
        currDay: undefined,
        viewingDate: undefined,
        currEventToManageId: undefined,
        createMode: false
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

    toggleEventToManage(id) {
        this.state.currEventToManageId = id;
    }

    deleteEvent() {
        this.state.events = this.state.events.filter(
            e => e.id !== this.state.currEventToManageId
        );

        localStorage.setItem("@events", JSON.stringify(this.state.events));
    }

    updateEvent({ description, at }) {
        const event = this.state.events.find(
            e => e.id === this.state.currEventToManageId
        );
        if (!event) return;
        this.state.events = this.state.events.map(e =>
            e.id !== this.state.currEventToManageId
                ? e
                : {
                      ...e,
                      description: description ? description : e.description,
                      at: at ? at : e.at
                  }
        );
        localStorage.setItem("@events", JSON.stringify(this.state.events));
    }

    toggleCreateMode() {
        this.state.createMode = !this.state.createMode;
    }

    createEvent({ description, at }) {
        this.state.events.push({
            id: Math.random()
                .toString(32)
                .slice(2),
            description,
            at
        });
        localStorage.setItem("@events", JSON.stringify(this.state.events));
    }
}

import {JetView} from "webix-jet";

// import constants from "../../constants";

export default class SettingsPopupView extends JetView {
	config() {
		const dtPopup = {
			view: "popup",
			id: "myPopup",
			width: 300,
			head: "Icon",
			body: {
				view: "list",
				id: "pop-list",
				autoheight: true,
				template: "#title#",
				select: true,
				scroll: false,
				data: [
					{id: 1, title: "pencil"},
					{id: 2, title: "calendar"},
					{id: 3, title: "alert"},
					{id: 4, title: "plus"},
					{id: 5, title: "minus"},
					{id: 6, title: "user"},
					{id: 7, title: "clock"}
				]
			}
		};

		return dtPopup;
	}

	showPopup() {
		this.getRoot().show();
	}

	init() {
		// this.on(this.app, constants.EVENTS.GET_DATA_FROM_POPUP, (id) => {
		// 	// console.log("Данные из popup", this.$$("pop-list").data.pull);
		// 	// console.log("id=", id);
		// });
	}
}

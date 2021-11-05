import {JetView} from "webix-jet";

import constants from "../../constants";

export default class SettingsPopupView extends JetView {
	config() {
		const dtPopup = {
			view: "popup",
			// localId: dtPopupId,
			width: 100,
			head: "Icon",
			body: {
				view: "list",
				localId: constants.SETTINGS_VIEW.VIEW_IDS.POPUP_LIST_ID,
				autoheight: true,
				template: "<span class ='webix_icon wxi-#title#'></span> #title#",
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
				],
				on: {
					// onAfterSelect: (id) => {
					// 	console.log("выбран элемент попапа", id);
					// }
				}
			}
		};

		return dtPopup;
	}

	showPopup() {
		this.getRoot().show();
	}

	init() {
		// this.on(this.app, constants.EVENTS.GET_DATA_FROM_POPUP, (id) => {
		// 	console.log("Данные из popup", this
		// .$$(constants.SETTINGS_VIEW.VIEW_IDS.POPUP_LIST_ID).data.pull);
		// 	console.log("id=", id);
		// });
	}
}

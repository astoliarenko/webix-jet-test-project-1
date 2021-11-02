import {JetView} from "webix-jet";

import constants from "../constants";
import EditWindowView from "./activitiesViews/editwindow";
import ActivitiesTableView from "./activitiesViews/table";

export default class ActivitiesView extends JetView {
	config() {
		const btnAdd = {
			localId: constants.ACTIVITIES_VIEW.VIEW_IDS.BTN_SAVE_ID,
			width: constants.CONTACTS_VIEW.BTN_WIDTH,
			view: "button",
			value: "Add activity",
			click: () => {
				this.window.showWindow();
			}
		};

		const ui = {
			rows: [
				{
					css: "bg-white",
					cols: [
						{},
						btnAdd
					]
				},
				ActivitiesTableView
			]
		};

		return ui;
	}

	init() {
		this.window = this.ui(EditWindowView);
	}
}

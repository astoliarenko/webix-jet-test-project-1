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

		const table = new ActivitiesTableView(this.app);

		const activitiesTabbar = {
			borderless: true,
			view: "tabbar",
			options: [
				{id: "all", value: "All"},
				{id: "overdue", value: "Overdue"},
				{id: "completed", value: "Completed"},
				{id: "today", value: "Today"},
				{id: "tomorrow", value: "Tomorrow"},
				{id: "thisWeek", value: "This week"},
				{id: "thisMonth", value: "This month"}
			],
			multiview: true,
			value: "all",
			on: {
				onAfterTabClick: (tabbarId) => {
					// таблица.filterByAll();
					table.filterTable(null, tabbarId);
				}
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
				{css: "bg-white", cols: [activitiesTabbar, {}]},
				// activitiesTabbar,
				table
			]
		};

		return ui;
	}

	init() {
		this.window = this.ui(EditWindowView);
	}
}

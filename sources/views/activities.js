import {JetView} from "webix-jet";

import constants from "../constants";
import EditWindowView from "./activitiesViews/editwindow";
import ActivitiesTableView from "./activitiesViews/table";

export default class ActivitiesView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const btnAdd = {
			localId: constants.ACTIVITIES_VIEW.VIEW_IDS.BTN_SAVE_ID,
			width: constants.CONTACTS_VIEW.BTN_WIDTH,
			view: "button",
			value: _("Add activity"),
			click: () => {
				this.window.showWindow();
			}
		};

		const table = new ActivitiesTableView(this.app);

		const activitiesTabbar = {
			borderless: true,
			view: "tabbar",
			options: [
				{id: "all", value: _("All")},
				{id: "overdue", value: _("Overdue")},
				{id: "completed", value: _("Completed")},
				{id: "today", value: _("Today")},
				{id: "tomorrow", value: _("Tomorrow")},
				{id: "thisWeek", value: _("This week")},
				{id: "thisMonth", value: _("This month")}
			],
			multiview: true,
			value: "all",
			on: {
				onAfterTabClick: (tabbarId) => {
					// таблица.filterByAll();
					table.filterDtByAll();
					table.filterDtByTabbar(tabbarId);
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

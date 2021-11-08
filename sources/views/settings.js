import {JetView} from "webix-jet";

import activityTypeCollection from "../models/activityTypeCollection";
import statusesCollection from "../models/statusesCollection";
import SettingsTableView from "./settingsViews/table";
import AddWindowView from "./settingsViews/window";

export default class SettingsView extends JetView {
	config() {
		const param = this.app.getService("locale");
		const _ = param._;
		const language = param.getLang();

		const settingsBtnsWidth = 100;
		const spacerMaxWidth = 50;
		const btnsAddWidth = 200;

		const settingsBtns = {
			width: settingsBtnsWidth,
			view: "segmented",
			value: language,
			// вэлью задает дефолт состояние по id из options ( en - id: "en")
			options: [
				{id: "ru", value: _("RU")},
				{id: "en", value: _("EN")}
			],
			click() {
				param.setLang(this.getValue());
			}
		};

		const btnAddNewStatus = {
			width: btnsAddWidth,
			view: "button",
			css: "webix_primary",
			type: "icon",
			icon: "webix_icon wxi-plus",
			label: _("Add new"),
			// align: "center",
			click: () => this.windowStatus.showWindow()
		};

		const btnAddNewActType = {
			width: btnsAddWidth,
			view: "button",
			css: "webix_primary",
			type: "icon",
			icon: "webix_icon wxi-plus",
			label: _("Add new"),
			// align: "center",
			click: () => this.windowActivityType.showWindow()
		};

		const headerStatusesDt = {
			view: "template", // optional
			template: _("Statuses"),
			type: "header"
		};

		const headerActivityTypeDt = {
			view: "template", // optional
			template: _("Activity type"),
			type: "header"
		};

		const statusesDt = new SettingsTableView(this.app, statusesCollection);
		const activityTypeDt = new SettingsTableView(this.app, activityTypeCollection);

		const ui = {
			rows: [
				{
					cols: [
						settingsBtns,
						{}
					]
				},
				{rows: [{cols: [headerStatusesDt, btnAddNewStatus]}, statusesDt]},
				{maxHeight: spacerMaxWidth},
				{rows: [{cols: [headerActivityTypeDt, btnAddNewActType]}, activityTypeDt]}
				// {}
			]
		};

		return ui;
	}

	init() {
		this.windowStatus = this.ui(new AddWindowView(this.app, statusesCollection, "status"));
		this.windowActivityType = this.ui(new AddWindowView(this.app, activityTypeCollection, "activity type"));
	}
}

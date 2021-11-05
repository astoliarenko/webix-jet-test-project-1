import {JetView} from "webix-jet";

import activityTypeCollection from "../models/activityTypeCollection";
import statusesCollection from "../models/statusesCollection";
import SettingsTableView from "./settingsViews/table";

export default class SettingsView extends JetView {
	config() {
		const param = this.app.getService("locale");
		const _ = param._;
		const language = param.getLang();

		const settingsBtns = {
			width: 100,
			localId: "idddd",
			view: "segmented",
			value: language,
			// вэлью задает дефолт состояние по id из options ( en - id: "en")
			options: [
				{id: "ru", value: _("RU")},
				{id: "en", value: _("EN")}
			],
			click: () => {
				param.setLang(this.$$("idddd").getValue());
			}
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
				{rows: [headerStatusesDt, statusesDt]},
				{},
				{rows: [headerActivityTypeDt, activityTypeDt]},
				{},
				{
					cols: [
						{},
						settingsBtns
					]
				}
			]
		};

		return ui;
	}
}

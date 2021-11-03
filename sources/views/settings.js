import {JetView} from "webix-jet";

export default class SettingsView extends JetView {
	config() {
		const param = this.app.getService("locale");
		const _ = param._;
		const language = param.getLang();

		const settingsBtns = {
			width: 100,
			view: "segmented",
			value: language,
			// вэлью задает дефолт состояние по id из options ( en - id: "en")
			options: [
				{id: "ru", value: _("RU")},
				{id: "en", value: _("EN")}
			],
			click: () => {
				param.setLang(this.getRoot().getValue());
			}
		};
		return settingsBtns;
	}
}

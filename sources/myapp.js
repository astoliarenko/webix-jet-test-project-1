/* eslint-disable no-undef */
import {JetApp, HashRouter} from "webix-jet";
import "./styles/app.css";

export default class MyApp extends JetApp {
	constructor(config) {
		const defaults = {
			id: APPNAME,
			version: VERSION,
			router: HashRouter,
			debug: true,
			start: "/top/contacts"
		};

		super({...defaults, ...config});
	}
}

webix.ready(() => new MyApp().render());

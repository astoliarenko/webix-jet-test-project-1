/* eslint-disable no-undef */
import {JetApp, EmptyRouter, HashRouter, plugins} from "webix-jet";
import "./styles/app.css";

export default class MyApp extends JetApp {
	constructor(config) {
		const defaults = {
			id: APPNAME,
			version: VERSION,
			router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug: true,
			start: "/top/contacts",
			views: {form: "contactsViews.form", details: "contactsViews.details"}
		};

		super({...defaults, ...config});
	}
}

if (!BUILD_AS_MODULE) {
	const app = new MyApp();
	// webix.debug({events: true});
	webix.ready(() => {
		app.render();
		app.use(plugins.Locale);
		app.attachEvent("app:error:resolve", () => {
			webix.delay(() => app.show(app.config.start));
		});
	});
}

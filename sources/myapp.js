/* eslint-disable no-undef */
import {JetApp, HashRouter} from "webix-jet";
import "./styles/app.css";

export default class MyApp extends JetApp {
	constructor(config) {
		const defaults = {
			id: APPNAME,
			version: VERSION,
			router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug: true,
			start: "/top/contacts"
			// routes: {
			// 	"/top/contacts/form": "/top/contacts/contactsViews.form",
			// 	"/top/contacts/details": "/top/contacts/contactsViews.details"
			// }
			// routes: {"/form": "/contactsViews.form", "/details": "/contactsViews.details"}
			// views: {"/form": "/contactsViews.form", "/details": "/contactsViews.details"}
		};

		super({...defaults, ...config});
	}
}

if (!BUILD_AS_MODULE) {
	const app = new MyApp();
	webix.ready(() => {
		app.render();
		app.attachEvent("app:error:resolve", () => {
			webix.delay(() => app.show(app.config.start));
		});
	});
}

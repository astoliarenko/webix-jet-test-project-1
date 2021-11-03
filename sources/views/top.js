import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const header = {
			type: "header",
			template: this.app.config.name,
			css: "webix_header app_header"
		};

		const menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{value: "Contacts", id: "contacts", icon: "wxi-user"},
				{value: "Activities", id: "activities", icon: "wxi-calendar"},
				{value: "Settings", id: "settings", icon: "wxi-pencil"}
			]
		};

		const ui = {
			type: "clean",
			paddingX: 10,
			paddingY: 10,
			margin: 10,
			css: "app_layout",
			cols: [
				{
					rows: [{css: "webix_shadow_medium", rows: [header, menu]}]
				},
				{type: "wide", rows: [{$subview: true}]}
			]
		};

		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");
	}
}

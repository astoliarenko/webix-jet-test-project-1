import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const header = {
			type: "header",
			// template: _(this.app.config.name),
			template: _("Menu"),
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
				{value: _("Contacts"), id: "contacts", icon: "wxi-user"},
				{value: _("Activities"), id: "activities", icon: "wxi-calendar"},
				{value: _("Settings"), id: "settings", icon: "wxi-pencil"}
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

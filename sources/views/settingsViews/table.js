import {JetView} from "webix-jet";

import constants from "../../constants";

export default class SettingsTableView extends JetView {
	constructor(app, collection) {
		super(app);
		this.dataCollection = collection;
	}

	config() {
		const _ = this.app.getService("locale")._;

		const iconColumnWidth = 80;
		const dtMinHeight = 200;

		const datatable = {
			view: "datatable",
			hover: "myHover",
			editable: true,
			minHeight: dtMinHeight,
			// maxWidth: dtMaxWidth,
			localId: constants.SETTINGS_VIEW.VIEW_IDS.DATATABLE_ID,
			columns: [
				{
					css: "list-column-icon",
					id: "Icon",
					header: _("Icon"),
					template: "<span class ='webix_icon wxi-#Icon#'</span>",
					width: iconColumnWidth,
					editor: "richselect",
					options: [
						{id: "pencil", value: "pencil"},
						{id: "calendar", value: "calendar"},
						{id: "alert", value: "alert"},
						{id: "plus", value: "plus"},
						{id: "minus", value: "minus"},
						{id: "user", value: "user"},
						{id: "clock", value: "clock"}
					]
				},
				{
					id: "value",
					header: _("Name"),
					editor: "text",
					fillspace: true
				},
				{
					id: "delete",
					header: "",
					width: iconColumnWidth,
					template: "<span class ='webix_icon wxi-trash remove-item-datatable'></span>"
				}
			],
			scrollX: false,
			// select: true,
			onClick: {
				"remove-item-datatable": (e, id) => {
					webix.confirm("Delete this activity?").then(() => {
						this.dataCollection.remove(id);
					});
					return false;
				}
			},
			rules: {
				value: webix.rules.isNotEmpty
			}
		};

		return datatable;
	}

	init(view) {
		view.sync(this.dataCollection);
	}
}

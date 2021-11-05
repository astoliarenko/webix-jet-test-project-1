import {JetView} from "webix-jet";

import constants from "../../constants";
// import EditWindowView from "./editwindow";

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
					width: iconColumnWidth
				},
				{
					id: "value",
					header: _("Name"),
					editor: "text",
					fillspace: true
				},
				// {
				// 	id: "edit",
				// 	width: iconColumnWidth,
				// 	header: "",
				// 	template:
				// 	`<span class ='webix_icon wxi-pencil
				//  ${constants.CSS.ACTIVITIES_VIEW.EDIT_DATATABLE}'></span>`
				// },
				{
					id: "delete",
					header: "",
					width: iconColumnWidth,
					template:
					"<span class ='webix_icon wxi-trash remove-item-datatable'></span>"
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
				},
				"list-column-icon": (e, id) => {
					// this.popup.show();
					// console.log("щелчок по колонке иконки");
					// console.log("id колонки", id.row);
					this.app.callEvent(constants.EVENTS.GET_DATA_FROM_POPUP, [id]);
					this.app.callEvent(constants.EVENTS.SHOW_POPUP);
				}
				// constants.CSS.ACTIVITIES_VIEW.REMOVE_ITEM_DATATABLE: () => {
				// "edit-datatable": (e, id) => this.window.showWindow(id, this.hideInfo)
			},
			// on: {
			// 	onAfterFilter: () => this.filterTable(this.contactId)
			// 	// onAfterFilter: () => (this.contactId ? this.getRoot()
			// 	// .filter("#ContactID#", this.contactId, true) : false)
			// }
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

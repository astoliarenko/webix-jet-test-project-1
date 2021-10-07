import {JetView} from "webix-jet";

import constants from "../constants";
import {contactsCollection, activitiesCollection, activityTypeCollection} from "../models/collections";
// import EditPopupView from "./editpopup";

export default class ActivitiesView extends JetView {
	config() {
		const btnAdd = {
			width: constants.CONTACTS_VIEW.BTN_WIDTH,
			view: "button",
			type: "button",
			value: "Add activity",
			click: () => {
				this.app.callEvent(constants.EVENTS.EDIT_POPUP_VIEW.SHOW_POPUP);
			}
		};

		const datatable = {
			view: "datatable",
			hover: "myHover",
			localId: constants.ACTIVITIES_VIEW.VIEW_IDS.DATATABLE_ID,
			columns: [
				{
					id: "checkbox",
					header: "",
					css: "rank head_row cell-border-right",
					width: 50
				},
				{
					id: "TypeID",
					header: ["Activity type", {content: "selectFilter"}],
					template: "#TypeID#",
					collection: activityTypeCollection
				},
				{
					id: "DueDate",
					header: ["Due date", {content: "textFilter"}],
					template: obj => obj.DueDate,
					// const date = Date.parse(obj.DueDate);
					// return date;

					collection: activitiesCollection
				},
				{
					id: "Details",
					header: ["Details", {content: "textFilter"}],
					template: "#Details#",
					collection: activitiesCollection,
					fillspace: true
				},
				{
					id: "ContactID",
					header: ["Contact", {content: "selectFilter"}],
					collection: contactsCollection
				},
				{
					id: "edit",
					header: "",
					css: "rank",
					template:
					"<span class ='webix_icon wxi-pencil edit-datatable'></span>"
				},
				{
					id: "delete",
					header: "",
					css: "rank",
					template:
					"<span class ='webix_icon wxi-trash remove-item-datatable'></span>"
				}
			],
			scrollX: false,
			select: true,
			onClick: {
				"remove-item-datatable": function (e, id) {
					activitiesCollection.remove(id);
					return false;
				}
				// "edit-datatable": () => {}
				//	вызвать попап
			},
			on: {
				// onItemClick: (item) => {
				// 	console.log("id=", item.row);
				// }
			}
		};

		const ui = {
			rows: [
				{
					cols: [
						{},
						btnAdd
					]
				},
				datatable
				// EditPopupView
			]
		};

		return ui;
	}

	init() {
		// this.popup1 = this.ui(EditPopupView);
		const datatable = this.$$(constants.ACTIVITIES_VIEW.VIEW_IDS.DATATABLE_ID);
		webix.promise.all([
			activitiesCollection.waitData,
			contactsCollection.waitData,
			activityTypeCollection.waitData
		]).then(() => {
			datatable.sync(activitiesCollection);
			// console.log(activitiesCollection.data.pull);
			// console.log(datatable.data.pull);
		});
	}
}

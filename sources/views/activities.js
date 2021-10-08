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
					id: "checked",
					header: [{content: "masterCheckbox"}],
					template: "{common.checkbox()}",
					width: 50
				},
				{
					id: "TypeID",
					// name: "TypeID",
					header: ["Activity type", {content: "selectFilter"}],
					// template: "#TypeID#",
					template: (obj) => {
						const id = obj.TypeID;
						return activityTypeCollection.getItem(id).Value;
					},
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
					// name: "Details",
					template: "#Details#",
					header: ["Details", {content: "textFilter"}],
					collection: activitiesCollection,
					fillspace: true
				},
				{
					id: "ContactID",
					// name: "ContactID",
					// width: auto,
					// template: "#ContactID#",
					template: (obj) => {
						const contact = contactsCollection.getItem(obj.ContactID);
						return `${contact.FirstName} ${contact.LastName}`;
					},
					header: ["Contact", {content: "selectFilter"}],
					collection: contactsCollection
				},
				{
					id: "edit",
					header: "",
					css: "rank",
					template:
					`<span class ='webix_icon wxi-pencil ${constants.CSS.ACTIVITIES_VIEW.EDIT_DATATABLE}'></span>`
				},
				{
					id: "delete",
					header: "",
					css: "rank",
					template:
					`<span class ='webix_icon wxi-trash ${constants.CSS.ACTIVITIES_VIEW.REMOVE_ITEM_DATATABLE}'></span>`
				}
			],
			scrollX: false,
			select: true,
			onClick: {
				"remove-item-datatable": function (e, id) {
				// constants.CSS.ACTIVITIES_VIEW.REMOVE_ITEM_DATATABLE: function (e, id) {
					activitiesCollection.remove(id);
					return false;
				}
				// "edit-datatable": () => {}
				//	вызвать попап
			},
			on: {
				onAfterSelect: (id) => {
					this.show(`/top/activities?id=${id}`);
				}
			}
		};

		const ui = {
			rows: [
				{
					css: "bg-white",
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

import {JetView} from "webix-jet";

import constants from "../constants";
import {contactsCollection, activitiesCollection, activityTypeCollection} from "../models/collections";
import EditPopupView from "./editpopup";

export default class ActivitiesView extends JetView {
	config() {
		const btnAdd = {
			localId: constants.ACTIVITIES_VIEW.VIEW_IDS.BTN_SAVE_ID,
			width: constants.CONTACTS_VIEW.BTN_WIDTH,
			view: "button",
			type: "button",
			value: "Add activity",
			click: () => {
				// this.app.callEvent(constants.EVENTS.EDIT_POPUP_VIEW.SHOW_POPUP);
				this.popup.showPopup();
			}
		};

		const xmlFormat = webix.Date.strToDate("%Y-%m-%d");
		// const xmlFormat = webix.Date.strToDate("%d.%m.%Y");

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
					header: ["Due date", {content: "dateFilter"}],
					format: webix.i18n.dateFormatStr,
					template: obj => obj.DueDate
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
					width: 150,
					// name: "ContactID",
					// width: auto,
					// template: "#ContactID#",
					template: (obj) => {
						// console.log(obj);
						// console.log(contactsCollection.data.pull);
						const contact = contactsCollection.getItem(obj.ContactID);
						return `${contact.FirstName} ${contact.LastName}`;
					},
					header: ["Contact", {content: "selectFilter"}],
					// header: ["Contact", {content: "selectFilter", template: (obj) = {console.log(obj)}}],
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
				"remove-item-datatable": (e, id) => {
				// constants.CSS.ACTIVITIES_VIEW.REMOVE_ITEM_DATATABLE: function (e, id) {
					activitiesCollection.remove(id);
					return false;
				},
				// constants.CSS.ACTIVITIES_VIEW.REMOVE_ITEM_DATATABLE: () => {
				"edit-datatable": () => {
					this.popup.showPopup();
				}
			},
			on: {
				onAfterSelect: (id) => {
					this.show(`/top/activities?id=${id}`);
				}
			},
			scheme: {
				$init(obj) {
					// console.log("datetetetete");
					// const date = obj.DueDate.substring(0, 9);
					// console.log(date);
					// obj.DueDate = xmlFormat(obj.DueDate);
					obj.DueDate = transformToDataObj(obj.DueDate);
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
			]
		};

		return ui;
	}

	init() {
		// this.popup = this.ui(new EditPopupView("Save"));
		this.popup = this.ui(EditPopupView);
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

export function transformToDataObj(date) {
	const year = date.substring(0, 4);
	const month = date.substring(5, 7);
	const day = date.substring(8, 10);
	const hours = date.substring(11, 13);
	const minutes = date.substring(14);
	const newDate = new Date(year, month, day, hours, minutes);
	return newDate;
}

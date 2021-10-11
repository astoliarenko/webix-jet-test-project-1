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

		// const myFormat = webix.Date.strToDate("%Y-%m-%d");
		// const xmlFormat = webix.Date.strToDate("%d.%m.%Y");

		const datatable = {
			view: "datatable",
			hover: "myHover",
			localId: constants.ACTIVITIES_VIEW.VIEW_IDS.DATATABLE_ID,
			columns: [
				{
					id: "State",
					checkValue: "Close",
					uncheckValue: "Open",
					header: "",
					template: "{common.checkbox()}",
					width: 50
				},
				{
					id: "TypeID",
					header: ["Activity type", {content: "selectFilter"}],
					// template: (obj) => {
					// 	const id = obj.TypeID;
					// 	return activityTypeCollection.getItem(id).Value;
					// },
					collection: activityTypeCollection
				},
				{
					id: "DueDate",
					header: ["Due date", {content: "dateFilter"}],
					format: webix.Date.dateToStr(constants.ACTIVITIES_VIEW.DATE_FORMAT),
					sort: "date"
					// template: obj => obj.DueDate
				},
				{
					id: "Details",
					template: "#Details#",
					header: ["Details", {content: "textFilter"}],
					collection: activitiesCollection,
					fillspace: true
				},
				{
					id: "ContactID",
					width: 150,
					// template: (obj) => {
					// 	const contact = contactsCollection.getItem(obj.ContactID);
					// 	return `${contact.FirstName} ${contact.LastName}`;
					// },
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
				"remove-item-datatable": (e, id) => {
				// constants.CSS.ACTIVITIES_VIEW.REMOVE_ITEM_DATATABLE: function (e, id) {
					webix.confirm("Delete this activitiy?").then(() => {
						activitiesCollection.remove(id);
					});
					return false;
				},
				// constants.CSS.ACTIVITIES_VIEW.REMOVE_ITEM_DATATABLE: () => {
				"edit-datatable": (e, id) => {
					const item = activitiesCollection.getItem(id);
					this.popup.showPopup(item);
					console.log(item);
					// this.$$(constants.EDIT_POPUP_VIEW.VIEW_IDS.FORM_ID).parse(item);
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
					// obj.DueDate = transformToDataObj(obj.DueDate);
					obj.DueDate = webix.Date.strToDate(constants.ACTIVITIES_VIEW.DATE_FORMAT)(obj.DueDate);
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

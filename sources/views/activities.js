import {JetView} from "webix-jet";

import constants from "../constants";
import activitiesCollection from "../models/activitiesCollection";
import activityTypeCollection from "../models/activityTypeCollection";
import contactsCollection from "../models/contactsСollections";
import EditPopupView from "./editpopup";

export default class ActivitiesView extends JetView {
	config() {
		const datepickerWidth = 150;
		const stateWidth = 50;
		const iconColumnWidth = 50;
		const contactWidth = 150;

		const btnAdd = {
			localId: constants.ACTIVITIES_VIEW.VIEW_IDS.BTN_SAVE_ID,
			width: constants.CONTACTS_VIEW.BTN_WIDTH,
			view: "button",
			type: "button",
			value: "Add activity",
			click: () => {
				this.popup.showPopup();
			}
		};

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
					width: stateWidth
				},
				{
					id: "TypeID",
					header: ["Activity type", {content: "selectFilter"}],
					// template: (obj) => {
					// 	const id = obj.TypeID;
					// 	return activityTypeCollection.getItem(id).Value;
					// },
					collection: activityTypeCollection,
					sort: "text"
				},
				// {
				// 	id: "DueDate",
				// 	header: ["Due date", {content: "dateFilter"}],
				// 	format: webix.Date.dateToStr(constants.ACTIVITIES_VIEW.DATE_FORMAT),
				// 	sort: "date"
				// 	// template: obj => obj.DueDate
				// },
				{
					id: "DueDate",
					width: datepickerWidth,
					header: [
						"Due date",
						{
							content: "datepickerFilter",
							inputConfig: {format: webix.Date.dateToStr(constants.ACTIVITIES_VIEW.DATE_FORMAT)}
						}
					],
					format: webix.Date.dateToStr(constants.ACTIVITIES_VIEW.DATE_FORMAT),
					sort: "date"
				},
				{
					id: "Details",
					template: "#Details#",
					header: ["Details", {content: "textFilter"}],
					// collection: activitiesCollection,
					fillspace: true,
					sort: "string"
				},
				{
					id: "ContactID",
					width: contactWidth,
					// template: (obj) => {
					// 	const contact = contactsCollection.getItem(obj.ContactID);
					// 	return `${contact.FirstName} ${contact.LastName}`;
					// },
					header: ["Contact", {content: "selectFilter"}],
					collection: contactsCollection,
					sort: "text"
				},
				{
					id: "edit",
					width: iconColumnWidth,
					header: "",
					template:
					`<span class ='webix_icon wxi-pencil ${constants.CSS.ACTIVITIES_VIEW.EDIT_DATATABLE}'></span>`
				},
				{
					id: "delete",
					header: "",
					width: iconColumnWidth,
					template:
					`<span class ='webix_icon wxi-trash ${constants.CSS.ACTIVITIES_VIEW.REMOVE_ITEM_DATATABLE}'></span>`
				}
			],
			scrollX: false,
			select: true,
			onClick: {
				"remove-item-datatable": (e, id) => {
				// constants.CSS.ACTIVITIES_VIEW.REMOVE_ITEM_DATATABLE: function (e, id) {
					webix.confirm("Delete this activity?").then(() => {
						activitiesCollection.remove(id);
					});
					return false;
				},
				// constants.CSS.ACTIVITIES_VIEW.REMOVE_ITEM_DATATABLE: () => {
				// "edit-datatable": (e, id) => {
				// 	const item = activitiesCollection.getItem(id);
				// 	this.popup.showPopup(item);
				// }
				"edit-datatable": (e, id) => {
					if (id) this.popup.showPopup(id);
					else return false;
				}
			},
			on: {
				onAfterSelect: (id) => {
					this.show(`/top/activities?id=${id}`);
				}
			}
			// scheme: {
			// 	$init(obj) {
			// 		obj.DueDate = webix.Date.strToDate(constants.ACTIVITIES_VIEW.DATE_FORMAT)(obj.DueDate);
			// 	}
			// }
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
		});
	}
}

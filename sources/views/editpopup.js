import {JetView} from "webix-jet";

import constants from "../constants";
import {contactsCollection, activityTypeCollection} from "../models/collections";

export default class EditPopupView extends JetView {
	config() {
		// const btnAdd = {
		// 	view: "button",
		// 	localId: constants.EDIT_POPUP_VIEW.VIEW_IDS.BTN_ADD_ID,
		// 	value: "Add"
		// 	// click: clearForm,
		// };

		const btnSave = {
			view: "button",
			localId: constants.EDIT_POPUP_VIEW.VIEW_IDS.BTN_SAVE_ID,
			value: "Save"
			// click: clearForm,
		};

		const btnCancel = {
			view: "button",
			localId: constants.EDIT_POPUP_VIEW.VIEW_IDS.BTN_CANCEL_ID,
			value: "Cancel"
			// click: clearForm,
		};

		const checkbox = {
			view: "checkbox",
			localId: constants.EDIT_POPUP_VIEW.VIEW_IDS.CHECKBOX_ID,
			label: "Completed",
			value: 1
		};

		const form = {
			view: "form",
			localId: constants.EDIT_POPUP_VIEW.VIEW_IDS.FORM_ID,
			elements: [
				{
					rows: [
						{
							view: "text",
							label: "Details",
							id: "inpDetails",
							name: "Details",
							invalidMessage: "Title must not be empty"
						},
						{
							view: "richselect",
							label: "Type",
							name: "TypeID",
							options: activityTypeCollection
						},
						{
							view: "richselect",
							label: "Contact",
							name: "ContactID",
							options: contactsCollection
						},
						{
							cols: [
								{
									view: "calendar",
									date: new Date(2015, 3, 16),
									events: webix.Date.isHoliday,
									weekHeader: true
								},
								{
									view: "calendar",
									date: new Date(2015, 3, 16),
									events: webix.Date.isHoliday,
									weekHeader: true
								}
							]
						},
						checkbox,
						{
							cols: [
								// (this.action === "Save") ? btnSave : btnAdd,
								btnSave,
								btnCancel
							]
						}
					]
				}

			]
		};

		return {
			localId: constants.EDIT_POPUP_VIEW.VIEW_IDS.POPUP_ID,
			view: "popup",
			top: 200,
			left: 300,
			body: {form}
		};
	}

	showPopup() {
		this.getRoot().show();
	}

	setAction(action) {
		if (action === "Edit") {
			console.log("param");
		}
	}

	// init() {
	// 	this.on(this.app, constants.EVENTS.EDIT_POPUP_VIEW.SHOW_POPUP, () => {
	// 		// console.log("show popup");
	// 		this.$$(constants.EDIT_POPUP_VIEW.VIEW_IDS.POPUP_ID).show();
	// 	});
	// }
}

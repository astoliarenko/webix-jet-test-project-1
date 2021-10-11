import {JetView} from "webix-jet";

import constants from "../constants";
import {contactsCollection, activityTypeCollection, activitiesCollection} from "../models/collections";

export default class EditPopupView extends JetView {
	config() {
		const btnSave = {
			view: "button",
			localId: constants.EDIT_POPUP_VIEW.VIEW_IDS.BTN_SAVE_ID,
			label: "",
			css: "webix_primary",
			click: () => {
				const form = this.$$(constants.EDIT_POPUP_VIEW.VIEW_IDS.FORM_ID);

				const formValues = form.getValues();
				if (form.validate() && form.isDirty()) {
					if (formValues.id) {
						activitiesCollection.updateItem(formValues.id, formValues);
					}
					else activitiesCollection.add(formValues);
				}


				form.clear();
				form.clearValidation();
				this.getRoot().hide();
			}
		};

		const btnCancel = {
			view: "button",
			localId: constants.EDIT_POPUP_VIEW.VIEW_IDS.BTN_CANCEL_ID,
			value: "Cancel",
			click: () => {
				const form = this.$$(constants.EDIT_POPUP_VIEW.VIEW_IDS.FORM_ID);
				form.clear();
				form.clearValidation();
				this.getRoot().hide();
			}
		};

		const checkbox = {
			view: "checkbox",
			localId: constants.EDIT_POPUP_VIEW.VIEW_IDS.CHECKBOX_ID,
			label: "Completed",
			name: "State",
			checkValue: "Close",
			uncheckValue: "Open"
		};

		const form = {
			view: "form",
			localId: constants.EDIT_POPUP_VIEW.VIEW_IDS.FORM_ID,
			elements: [
				{
					rows: [
						{
							localId: constants.EDIT_POPUP_VIEW.VIEW_IDS.HEADER_ID,
							view: "template",
							template: "",
							type: "header"
						},
						{
							view: "textarea",
							label: "Details",
							id: "inpDetails",
							name: "Details"
						},
						{
							view: "richselect",
							label: "Type",
							name: "TypeID",
							options: activityTypeCollection,
							invalidMessage: "Cannot be empty"
						},
						{
							view: "richselect",
							label: "Contact",
							name: "ContactID",
							options: contactsCollection,
							invalidMessage: "Cannot be empty"
						},
						{
							cols: [
								{
									view: "datepicker",
									value: "",
									name: "DueDate",
									label: "Date",
									timepicker: true,
									width: 300
								},
								{
									view: "datepicker",
									value: "",
									name: "Time",
									type: "time",
									label: "Time",
									timepicker: true,
									width: 300
								}
							]
						},
						checkbox,
						{
							cols: [
								btnSave,
								btnCancel
							]
						}
					]
				}
			],
			rules: {
				TypeID: webix.rules.isNotEmpty,
				ContactID: webix.rules.isNotEmpty
			}
		};

		return {
			localId: constants.EDIT_POPUP_VIEW.VIEW_IDS.POPUP_ID,
			view: "popup",
			position: "center",
			body: form
		};
	}

	showPopup(activity) {
		const header = this.$$(constants.EDIT_POPUP_VIEW.VIEW_IDS.HEADER_ID);
		const btnSave = this.$$(constants.EDIT_POPUP_VIEW.VIEW_IDS.BTN_SAVE_ID);

		const headerText = activity ? "Edit activity" : "Add activity";
		const btnName = activity ? "Save" : "Add";

		header.define("template", headerText);
		btnSave.define("label", btnName);
		// header.config.template = headerText;
		// btnSave.config.label = btnName;
		header.refresh();
		btnSave.refresh();

		const form = this.$$(constants.EDIT_POPUP_VIEW.VIEW_IDS.FORM_ID);
		if (activity) {
			form.setValues(activity);
		}
		else {
			form.clear();
			form.clearValidation();
		}

		this.getRoot().show();
	}
}

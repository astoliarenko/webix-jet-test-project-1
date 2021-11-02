import {JetView} from "webix-jet";

import constants from "../../constants";
import activitiesCollection from "../../models/activitiesCollection";
import activityTypeCollection from "../../models/activityTypeCollection";
import contactsCollection from "../../models/contactsСollections";

export default class EditWindowView extends JetView {
	config() {
		const btnWidth = 150;

		const btnSave = {
			view: "button",
			width: btnWidth,
			localId: constants.EDIT_WINDOW_VIEW.VIEW_IDS.BTN_SAVE_ID,
			label: "",
			css: "webix_primary",
			click: () => this.saveActivity()
		};

		const btnCancel = {
			view: "button",
			width: btnWidth,
			localId: constants.EDIT_WINDOW_VIEW.VIEW_IDS.BTN_CANCEL_ID,
			value: "Cancel",
			click: () => {
				const form = this.$$(constants.EDIT_WINDOW_VIEW.VIEW_IDS.FORM_ID);
				form.clear();
				form.clearValidation();
				this.getRoot().hide();
			}
		};

		const checkbox = {
			view: "checkbox",
			css: "cursor-pointer",
			localId: constants.EDIT_WINDOW_VIEW.VIEW_IDS.CHECKBOX_ID,
			label: "Completed",
			name: "State",
			checkValue: "Close",
			uncheckValue: "Open"
		};

		const form = {
			view: "form",
			localId: constants.EDIT_WINDOW_VIEW.VIEW_IDS.FORM_ID,
			elements: [
				{
					rows: [
						{
							view: "textarea",
							label: "Details",
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
							localId: constants.ACTIVITIES_VIEW.VIEW_IDS.RICHSELECT_CONTACT_ID,
							label: "Contact",
							name: "ContactID",
							options: contactsCollection,
							invalidMessage: "Cannot be empty"
							// disabled: true - indicates whether an item is enabled
						},
						{
							cols: [
								{
									view: "datepicker",
									value: "",
									name: "DateObj",
									label: "Date",
									width: 300,
									timepicker: false,
									format: webix.Date.dateToStr(constants.ACTIVITIES_VIEW.DATE_FORMAT)
								},
								{
									view: "datepicker",
									value: "",
									name: "Time",
									type: "time",
									label: "Time",
									// timepicker: true,
									width: 300,
									format: webix.Date.dateToStr(constants.ACTIVITIES_VIEW.TIME_FORMAT)
								}
							]
						},
						checkbox,
						{
							cols: [
								{},
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
			localId: constants.EDIT_WINDOW_VIEW.VIEW_IDS.POPUP_ID,
			view: "window",
			modal: true,
			head: {localId: constants.EDIT_WINDOW_VIEW.VIEW_IDS.HEADER_ID, template: "Hello"},
			position: "center",
			body: form
		};
	}

	// eslint-disable-next-line consistent-return
	saveActivity() {
		const form = this.$$(constants.EDIT_WINDOW_VIEW.VIEW_IDS.FORM_ID);
		const formValues = form.getValues();

		if (!form.validate() || !form.isDirty()) return false;

		const date = formValues.DateObj;

		if (date) {
			const formTime = formValues.Time ? webix.Date
				.dateToStr(constants.ACTIVITIES_VIEW.TIME_FORMAT)(formValues.Time) : "00:00";
			formValues.DueDate = `${webix.Date
				.dateToStr(constants.ACTIVITIES_VIEW.DATE_FORMAT)(date)} ${formTime}`;
		}
		else {
			formValues.DueDate = "";
			formValues.Time = "";
		}
		// delete formValues.Time;
		// delete formValues.DateObj;

		if (formValues.id) {
			activitiesCollection.updateItem(formValues.id, formValues);
		}
		else activitiesCollection.add(formValues);

		form.clear();
		form.clearValidation();
		this.getRoot().hide();
	}

	showWindow(activityId, contactId) {
		let activity;

		if (activityId) activity = activitiesCollection.getItem(activityId);

		const header = this.$$(constants.EDIT_WINDOW_VIEW.VIEW_IDS.HEADER_ID);
		const btnSave = this.$$(constants.EDIT_WINDOW_VIEW.VIEW_IDS.BTN_SAVE_ID);
		const form = this.$$(constants.EDIT_WINDOW_VIEW.VIEW_IDS.FORM_ID);
		const richselectContact = this.$$(constants.ACTIVITIES_VIEW.VIEW_IDS.RICHSELECT_CONTACT_ID);
		const headerText = activity ? "Edit activity" : "Add activity";
		const btnName = activity ? "Save" : "Add";
		const activityCopy = Object.assign({}, activity);

		header.define("template", headerText);
		btnSave.define("label", btnName);

		header.refresh();
		btnSave.refresh();

		if (!activityId && contactId) {
			form.setValues({ContactID: contactsCollection.getItem(contactId)});
			richselectContact.disable();
		}
		else if (activityId && contactId) {
			form.setValues(activityCopy);
			richselectContact.disable();
		}
		else if (activityId) {
			form.setValues(activityCopy);
		}
		else {
			form.clear();
			form.clearValidation();
		}

		this.getRoot().show();
	}
}

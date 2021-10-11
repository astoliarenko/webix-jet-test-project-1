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
					const date = formValues.DueDate;
					if (date) {
						date.setHours(formValues.Time.getHours());
						date.setMinutes(formValues.Time.getMinutes());
					}
					// Удаляю ключ тайм, который создавал при вызове метода ShowPopup()
					delete formValues.Time;
					formValues.DueDate = webix.Date.dateToStr(constants.ACTIVITIES_VIEW.DATE_SERVER_FORMAT)(date);
					console.log(formValues.Time);

					if (formValues.id) {
						activitiesCollection.updateItem(formValues.id, formValues);
					}
					else activitiesCollection.add(formValues);
					console.log("new item = ", formValues);
					console.log("collection activities  after add or update= ", activitiesCollection.data.pull);
				}
				else return;


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
							id: "TypeID",
							view: "richselect",
							label: "Type",
							name: "TypeID",
							options: activityTypeCollection,
							invalidMessage: "Cannot be empty"
						},
						{
							id: "ContactID",
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
		const form = this.$$(constants.EDIT_POPUP_VIEW.VIEW_IDS.FORM_ID);
		const headerText = activity ? "Edit activity" : "Add activity";
		const btnName = activity ? "Save" : "Add";
		// const activityCopy = Object.assign({}, activity);

		header.define("template", headerText);
		btnSave.define("label", btnName);
		// header.config.template = headerText;
		// btnSave.config.label = btnName;
		header.refresh();
		btnSave.refresh();

		if (activity) {
			activity.DueDate = webix.Date.strToDate(constants.ACTIVITIES_VIEW.DATE_FORMAT)(activity.DueDate);
			// console.log(activitiesCollection.data.pull);

			activity.Time = activity.DueDate;
			// activity.Time = webix.Date.strToDate(constants.ACTIVITIES_VIEW.DATE_FORMAT)(activity.DueDate);
			console.log("activity time", activity.Time);
			form.setValues(activity);
		}
		else {
			form.clear();
			form.clearValidation();
		}

		this.getRoot().show();
	}
}

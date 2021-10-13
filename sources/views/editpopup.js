import {JetView} from "webix-jet";

import constants from "../constants";
import activitiesCollection from "../models/activitiesCollection";
import activityTypeCollection from "../models/activityTypeCollection";
import contactsCollection from "../models/contactsСollections";

export default class EditPopupView extends JetView {
	config() {
		const btnWidth = 150;
		const saveActivity = () => {
			const form = this.$$(constants.EDIT_POPUP_VIEW.VIEW_IDS.FORM_ID);
			const formValues = form.getValues();
			// console.log("значение формы после сабмита", formValues);
			if (form.validate() && form.isDirty()) {
				const date = formValues.DueDate;
				if (date && formValues.Time) {
					date.setHours(formValues.Time.getHours());
					date.setMinutes(formValues.Time.getMinutes());
				}
				// Удаляю ключ тайм, который создавал при вызове метода ShowPopup()
				delete formValues.Time;
				//	преобразовать дату в строку формата серверного, а потом уже обновлять и добавлять
				formValues.DueDate = webix.Date
					.dateToStr(constants.ACTIVITIES_VIEW.DATE_SERVER_FORMAT)(date);

				if (formValues.id) {
					activitiesCollection.updateItem(formValues.id, formValues);
					// formValues.DueDate = webix.Date
					// 	.strToDate(constants.ACTIVITIES_VIEW.DATE_SERVER_FORMAT)(date);
				}
				else {
					activitiesCollection.add(formValues);
					activitiesCollection.getLastId();
					// formValues.DueDate = webix.Date
					// 	.strToDate(constants.ACTIVITIES_VIEW.DATE_SERVER_FORMAT)(date);
				}
				//	при добавлении нового элемента у него пропадает время при перезагрузке страницы
			}
			else return;

			form.clear();
			form.clearValidation();
			this.getRoot().hide();
		};

		const btnSave = {
			view: "button",
			width: btnWidth,
			localId: constants.EDIT_POPUP_VIEW.VIEW_IDS.BTN_SAVE_ID,
			label: "",
			css: "webix_primary",
			click: saveActivity
		};

		const btnCancel = {
			view: "button",
			width: btnWidth,
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
			css: "cursor-pointer",
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
			localId: constants.EDIT_POPUP_VIEW.VIEW_IDS.POPUP_ID,
			view: "popup",
			position: "center",
			body: form
		};
	}

	showPopup(id) {
		let activity;
		if (id) activity = activitiesCollection.getItem(id);
		const header = this.$$(constants.EDIT_POPUP_VIEW.VIEW_IDS.HEADER_ID);
		const btnSave = this.$$(constants.EDIT_POPUP_VIEW.VIEW_IDS.BTN_SAVE_ID);
		const form = this.$$(constants.EDIT_POPUP_VIEW.VIEW_IDS.FORM_ID);
		const headerText = activity ? "Edit activity" : "Add activity";
		const btnName = activity ? "Save" : "Add";
		const activityCopy = Object.assign({}, activity);

		header.define("template", headerText);
		btnSave.define("label", btnName);
		// header.config.template = headerText;
		// btnSave.config.label = btnName;
		header.refresh();
		btnSave.refresh();

		if (id) {
			// activityCopy.DueDate = webix.Date
			// 	.strToDate(constants.ACTIVITIES_VIEW.DATE_SERVER_FORMAT)(activityCopy.DueDate);
			// console.log(activityCopy.DueDate);
			activityCopy.Time = activityCopy.DueDate;
			// console.log("activity time", activityCopy.Time);
			form.setValues(activityCopy);
		}
		else {
			form.clear();
			form.clearValidation();
		}

		this.getRoot().show();
	}
}

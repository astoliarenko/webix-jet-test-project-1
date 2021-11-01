import {JetView} from "webix-jet";

import constants from "../../constants";
import contactsCollection from "../../models/contactsСollections";
import statusesCollection from "../../models/statusesCollection";

export default class ContactsFormView extends JetView {
	config() {
		const btnsPhotoBoxWidth = 150;
		const photoWidth = 130;
		const photoHeight = 130;
		const btnWidth = 100;
		const inputHeight = 40;
		const minWidthCols = 300;

		const header = {
			localId: constants.CONTACTS_VIEW.VIEW_IDS.FORM_HEADER_ID,
			view: "template",
			type: "header",
			template: "Add contact"
		};

		const btnSave = {
			view: "button",
			width: btnWidth,
			localId: constants.CONTACTS_VIEW.VIEW_IDS.BTN_SAVE_FORM_ID,
			label: "Save",
			css: "webix_primary",
			click: () => this.saveContact()
		};

		const btnCancel = {
			view: "button",
			width: btnWidth,
			value: "Cancel",
			click: () => {
				const form = this.$$(constants.CONTACTS_VIEW.VIEW_IDS.FORM_ID);

				form.clear();
				form.clearValidation();

				if (this.contactId) {
					this.app.callEvent(constants.EVENTS.SELECT_CONTACT, [this.contactId]);
				}
				else {
					this.app.callEvent(constants.EVENTS.SELECT_CONTACT, [contactsCollection.getFirstId()]);
				}
			}
		};

		const btnChangePhoto = {
			view: "uploader",
			width: btnsPhotoBoxWidth,
			label: "Change photo",
			autosend: false,
			accept: "image/jpeg, image/png",
			multiple: false,
			on: {
				onBeforeFileAdd: (obj) => {
					this.loadFile(obj);
				}
			}
		};

		const btnDeletePhoto = {
			view: "button",
			width: btnsPhotoBoxWidth,
			label: "Delete photo",
			click: () => this.$$(constants.CONTACTS_VIEW.VIEW_IDS.CONTACT_PHOTO_ID).setValues({src: ""})
		};

		const btns = {
			cols: [
				{},
				btnCancel,
				btnSave
			]
		};

		const photoBox = {
			cols: [
				{
					css: "photo-container",
					template: obj => `<img class="contacts-form-img" src=${obj.src || "./sources/img/man.png"}>`,
					localId: constants.CONTACTS_VIEW.VIEW_IDS.CONTACT_PHOTO_ID,
					width: photoWidth,
					height: photoHeight
				},
				{},
				{
					rows: [
						{},
						btnChangePhoto,
						btnDeletePhoto
					]
				}
			]
		};

		const contactsInfo = {
			margin: 40,
			cols: [
				{
					minWidth: minWidthCols,
					margin: 10,
					rows: [
						{
							height: inputHeight,
							view: "textarea",
							label: "First Name",
							name: "FirstName"
						},
						{
							height: inputHeight,
							view: "textarea",
							label: "Last Name",
							name: "LastName"
						},
						{
							height: inputHeight,
							view: "richselect",
							label: "Status",
							name: "StatusID",
							options: statusesCollection,
							invalidMessage: "Cannot be empty"
						},
						{
							height: inputHeight,
							view: "textarea",
							label: "Job",
							name: "Job"
						},
						{
							height: inputHeight,
							view: "textarea",
							label: "Company",
							name: "Company"
						},
						{
							height: inputHeight,
							view: "textarea",
							label: "Website",
							name: "Website"
						},
						{
							height: inputHeight,
							view: "textarea",
							label: "Address",
							name: "Address"
						}
					]
				},
				{
					minWidth: minWidthCols,
					margin: 10,
					rows: [
						{
							height: inputHeight,
							view: "textarea",
							label: "Email",
							name: "Email"
						},
						{
							height: inputHeight,
							view: "textarea",
							label: "Skype",
							name: "Skype"
						},
						{
							height: inputHeight,
							view: "textarea",
							label: "Phone",
							name: "Phone"
						},
						{
							height: inputHeight,
							view: "datepicker",
							value: "",
							name: "BirthdayObj",
							label: "Birthday",
							width: 300,
							timepicker: false,
							format: webix.Date.dateToStr(constants.ACTIVITIES_VIEW.DATE_FORMAT)
						},
						photoBox,
						{}
					]
				}
			]
		};

		const form = {
			localId: constants.CONTACTS_VIEW.VIEW_IDS.FORM_ID,
			view: "form",
			elements: [
				{
					cols: [
						{},
						{
							rows: [
								contactsInfo,
								{},
								btns
							]
						},
						{}
					]
				}
			],
			rules: {
				FirstName: webix.rules.isNotEmpty,
				LastName: webix.rules.isNotEmpty
			}
		};

		const ui = {
			rows: [
				header,
				form
				// {}
			]
		};

		return ui;
	}

	saveContact() {
		const form = this.$$(constants.CONTACTS_VIEW.VIEW_IDS.FORM_ID);

		if (!form.validate() && !form.isDirty()) return false;

		const formValues = form.getValues();

		formValues.Photo = this.$$(constants.CONTACTS_VIEW.VIEW_IDS.CONTACT_PHOTO_ID).getValues().src;
		formValues.Birthday = webix.Date
			.dateToStr(constants.ACTIVITIES_VIEW.DATE_FORMAT)(formValues.BirthdayObj);

		if (this.contactId) {
			contactsCollection.updateItem(formValues.id, formValues);
			this.app.callEvent(constants.EVENTS.SELECT_CONTACT, [this.contactId]);
		}
		else {
			contactsCollection.add(formValues);
			this.app.callEvent(constants.EVENTS.SELECT_CONTACT, [contactsCollection.getLastId()]);
		}

		form.clear();
		form.clearValidation();

		return false;
	}

	urlChange() {
		this.contactId = this.getParam("id", true);

		const header = this.$$(constants.CONTACTS_VIEW.VIEW_IDS.FORM_HEADER_ID);
		const btnSave = this.$$(constants.CONTACTS_VIEW.VIEW_IDS.BTN_SAVE_FORM_ID);
		const form = this.$$(constants.CONTACTS_VIEW.VIEW_IDS.FORM_ID);
		const headerText = this.contactId ? "Edit contact" : "Add contact";
		const btnName = this.contactId ? "Save" : "Add";

		header.define("template", headerText);
		btnSave.define("label", btnName);

		header.refresh();
		btnSave.refresh();

		if (this.contactId) {
			form.parse(contactsCollection.getItem(this.contactId));
		}
		else {
			form.clear();
			form.clearValidation();
		}
	}

	loadFile(obj) {
		const file = obj.file;
		const reader = new FileReader();

		reader.onload = (e) => {
			const res = e.target.result;
			this.$$(constants.CONTACTS_VIEW.VIEW_IDS.CONTACT_PHOTO_ID)
				.setValues({src: res});
		};

		if (file) {
			reader.readAsDataURL(file);
		}

		return false;
	}
}

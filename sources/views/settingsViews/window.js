import {JetView} from "webix-jet";

import constants from "../../constants";

export default class AddWindowView extends JetView {
	constructor(app, collection, text) {
		super(app);
		this.dataCollection = collection;
		this.text = `Add new ${text}`;
	}

	config() {
		const _ = this.app.getService("locale")._;
		const btnWidth = 150;

		const btnAdd = {
			view: "button",
			width: btnWidth,
			// localId: ,
			label: _("Add"),
			css: "webix_primary",
			click: () => this.save()
		};

		const btnCancel = {
			view: "button",
			width: btnWidth,
			// localId: ,
			label: _("Cancel"),
			click: () => this.hideWindow()
		};

		const form = {
			view: "form",
			localId: constants.SETTINGS_VIEW.VIEW_IDS.FORM_ID,
			elements: [
				{
					rows: [
						{
							view: "richselect",
							label: _("Icon"),
							name: "Icon",
							// template: "<span class ='webix_icon wxi-#Icon#'</span>",
							options: [
								{id: "pencil", value: "pencil"},
								{id: "calendar", value: "calendar"},
								{id: "alert", value: "alert"},
								{id: "plus", value: "plus"},
								{id: "minus", value: "minus"},
								{id: "user", value: "user"},
								{id: "clock", value: "clock"}
							],
							invalidMessage: "Cannot be empty"
						},
						{
							view: "text",
							label: _("Name"),
							name: "Value",
							invalidMessage: "Cannot be empty"
						},
						{
							cols: [
								{},
								btnAdd,
								btnCancel
							]
						}
					]
				}
			],
			rules: {
				Icon: webix.rules.isNotEmpty,
				Value: webix.rules.isNotEmpty
			}
		};

		return {
			localId: constants.EDIT_WINDOW_VIEW.VIEW_IDS.POPUP_ID,
			view: "window",
			modal: true,
			head: {localId: constants.EDIT_WINDOW_VIEW.VIEW_IDS.HEADER_ID, template: _(this.text)},
			position: "center",
			body: form
		};
	}

	// eslint-disable-next-line consistent-return
	save() {
		const formValues = this.form.getValues();

		if (!this.form.validate()) return false;

		this.dataCollection.add(formValues);

		this.hideWindow();
	}

	hideWindow() {
		this.form.clear();
		this.form.clearValidation();
		this.getRoot().hide();
	}

	showWindow() {
		this.getRoot().show();
	}

	init() {
		this.form = this.$$(constants.SETTINGS_VIEW.VIEW_IDS.FORM_ID);
	}
}

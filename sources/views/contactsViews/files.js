import {JetView} from "webix-jet";

import constants from "../../constants";
import filesCollection from "../../models/filesCollection";

export default class ContactsFilesView extends JetView {
	config() {
		const iconColumnWidth = 50;
		const dateColumnWidth = 250;
		const sizeColumnWidth = 200;
		const btnUploadWidth = 200;

		const filesDatatable = {
			view: "datatable",
			localId: constants.CONTACTS_VIEW.VIEW_IDS.FILES_DATATABLE_ID,
			columns: [
				{
					id: "name",
					header: "Name",
					fillspace: true,
					sort: "text"
				},
				{
					id: "date",
					header: "Change date",
					width: dateColumnWidth,
					template(obj) {
						return webix.Date.dateToStr(constants.ACTIVITIES_VIEW.DATE_FORMAT)(obj.Date);
					},
					sort: "date"
				},
				{
					id: "size",
					header: "Size",
					width: sizeColumnWidth,
					template: "#sizetext#",
					sort: "int"
				},
				{
					id: "delete",
					header: "",
					width: iconColumnWidth,
					template:
					"<span class ='webix_icon wxi-trash remove-item-datatable'></span>"
				}
			],
			onClick: {
				"remove-item-datatable": (e, id) => {
					webix.confirm("Delete this file?").then(() => {
						filesCollection.remove(id);
						this.$$(constants.CONTACTS_VIEW.VIEW_IDS.FILES_DATATABLE_ID).filter("#ContactID", this.contactId);
					});
					return false;
				}
			}
		};

		const btnUploadFile = {
			view: "uploader",
			width: btnUploadWidth,
			upload: "",
			autosend: false,
			label: "<span class='webix_icon wxi-file'></span>Upload file",
			on: {
				onBeforeFileAdd: (file) => {
					file.Date = new Date();
				},
				onAfterFileAdd: (file) => {
					file.ContactID = this.contactId;
					filesCollection.add({...file});
					this.$$(constants.CONTACTS_VIEW.VIEW_IDS.FILES_DATATABLE_ID).filter("#ContactID#", file.ContactID);
				}
			}
		};

		const ui = {
			rows: [
				filesDatatable,
				{
					cols: [
						{},
						btnUploadFile,
						{}
					]
				}
			]
		};

		return ui;
	}

	init() {
		const filesDatatable = this.$$(constants.CONTACTS_VIEW.VIEW_IDS.FILES_DATATABLE_ID);
		filesDatatable.sync(filesCollection);
	}

	urlChange() {
		this.contactId = this.getParam("id");
		this.$$(constants.CONTACTS_VIEW.VIEW_IDS.FILES_DATATABLE_ID).filter("#ContactID#", this.contactId);
	}
}

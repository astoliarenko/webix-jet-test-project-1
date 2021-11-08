import {JetView} from "webix-jet";

import constants from "../../constants";
import activitiesCollection from "../../models/activitiesCollection";
import contactsCollection from "../../models/contactsСollections";
import filesCollection from "../../models/filesCollection";
import statusesCollection from "../../models/statusesCollection";
import EditWindowView from "../activitiesViews/editwindow";
import ActivitiesTableView from "../activitiesViews/table";
import ContactsFilesView from "./files";

export default class ContactsDetailsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const tableTabbarActivitiesId = "activities";
		const tableTabbarFilesId = "files";

		const btnDelete = {
			width: constants.CONTACTS_VIEW.BTN_WIDTH,
			view: "button",
			type: "icon",
			icon: "webix_icon wxi-trash",
			label: _("Delete"),
			click: () => this.deleteContact()
		};

		const btnEdit = {
			width: constants.CONTACTS_VIEW.BTN_WIDTH,
			view: "button",
			css: "webix_primary",
			type: "icon",
			icon: "webix_icon wxi-pencil",
			label: _("Edit"),
			click: () => this.show(`form?id=${this.contactId}`)
		};

		const btnAddActivity = {
			width: constants.CONTACTS_VIEW.BTN_WIDTH,
			view: "button",
			css: "webix_primary",
			type: "icon",
			icon: "webix_icon wxi-plus",
			label: _("Add activity"),
			click: () => this.window.showWindow(null, this.contactId)
		};

		const clientsDetails = {
			height: 250,
			cols: [
				{
					borderless: true,
					minWidth: 500,
					view: "template",
					localId: constants.CONTACTS_VIEW.VIEW_IDS.TEMPLATE_ID,
					template: this.renderContactDetails
				},
				{},
				{
					css: "bg-white",
					rows: [
						{
							paddingY: 20,
							cols: [
								btnDelete,
								btnEdit
							]
						},
						{}
					]
				}
			]
		};

		const tableTabbar = {
			borderless: true,
			view: "tabbar",
			options: [{id: tableTabbarActivitiesId, value: _("Activities")}, {id: tableTabbarFilesId, value: _("Files")}],
			multiview: true,
			value: tableTabbarActivitiesId
		};

		const ui = {
			css: "bg-white",
			rows: [
				clientsDetails,
				// {},
				tableTabbar,
				{
					cells: [
						{
							id: tableTabbarActivitiesId,
							rows: [
								{$subview: new ActivitiesTableView(this.app, true)},
								{cols: [{}, btnAddActivity]}
							]
						},
						{
							id: tableTabbarFilesId,
							rows: [{$subview: ContactsFilesView}]
						}
					]
				}
			]
		};

		return ui;
	}

	renderContactDetails({FirstName, LastName, Photo, StatusID,
		Email, Skype, Job, Company, Birthday}) {
		const photoUrl = Photo || "./sources/img/man.png";
		const item = statusesCollection.getItem(StatusID);
		const Status = item ? item.Value : "unknown";
		let birthday;
		if (Birthday) birthday = Birthday.length === 10 ? Birthday : Birthday.slice(0, 10);
		const res = `
			<div class='details_container df f-d-col'>
				<h2 class='details_header'>${FirstName} ${LastName}</h2>
				<div class='df f-d-row row1'>
					<div class ='df f-d-col column1'>
						<img class="details_img" src=${photoUrl}>
						<span>${Status}</span>
					</div>
					
					<div class='df f-d-col column2'>
						<div class='details-item df f-d-row'>
							<i class="icon-skype"></i>
							<span>${Skype}</span>
						</div>
						<div class='details-item df f-d-row'>
							<i class="icon-mail-forward"></i>
							<span>${Email}</span>
						</div>
						<div class='details-item df f-d-row'>
							<i class="icon-user"></i>
							<span>${Job}</span>
						</div>
						<div class='details-item df f-d-row'>
							<i class="icon-key"></i>
							<span>${Company}</span>
						</div>
						<div class='details-item df f-d-row'>
							<i class="icon-calendar"></i>
							<span>${birthday}</span>
						</div>
					</div>
				</div>
			</div>
		`;
		//  need to add location
		return res;
	}

	deleteContact() {
		const _ = this.app.getService("locale")._;
		webix.confirm(_("Delete this contact and related activities, files?")).then(() => {
			contactsCollection.remove(this.contactId);

			activitiesCollection.data.each((activity) => {
				if (activity.ContactID === this.contactId) {
					activitiesCollection.remove(activity.id);
				}
			});

			filesCollection.data.each((file) => {
				if (file.ContactID === this.contactId) {
					filesCollection.remove(file.id);
				}
			});

			this.app.callEvent(constants.EVENTS.SELECT_CONTACT);
		});
		return false;
	}

	init() {
		this.window = this.ui(EditWindowView);
	}

	urlChange() {
		this.contactId = this.getParam("id");
		webix.promise.all([
			activitiesCollection.waitData,
			contactsCollection.waitData
		])
			.then(() => {
				const item = contactsCollection.getItem(this.contactId);
				if (item) {
					this.$$(constants.CONTACTS_VIEW.VIEW_IDS.TEMPLATE_ID).parse(item);
					// this.app.callEvent(constants.EVENTS.FILTER_ACTIVITIESTABLE, [this.contactId]);
				}
			});
	}
}

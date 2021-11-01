import {JetView} from "webix-jet";

import constants from "../constants";
import contactsCollection from "../models/contactsСollections";
import statusesCollection from "../models/statusesCollection";

export default class ContactsView extends JetView {
	config() {
		const сontactsList = {
			localId: constants.CONTACTS_VIEW.VIEW_IDS.LIST_ID,
			view: "list",
			css: "contacts-list-style",
			width: constants.CONTACTS_VIEW.LIST_WIDTH,
			select: true,
			template: this.renderContactListShortInfo,
			on: {
				onAfterSelect: (id) => {
					this.show(`details?id=${id}`);
					this.app.callEvent(constants.EVENTS.FILTER_ACTIVITIESTABLE, [id]);
				}
			}
		};

		const btnAddContact = {
			width: constants.CONTACTS_VIEW.BTN_WIDTH,
			view: "button",
			type: "icon",
			icon: "webix_icon wxi-plus",
			label: "Add Contact",
			align: "center",
			click: () => this.show("form")
		};

		const ui = {
			cols: [
				{
					css: "bg-white",
					rows: [
						сontactsList,
						btnAddContact
					]
				},
				{$subview: true}
			]
		};

		return ui;
	}

	renderContactListShortInfo({FirstName, LastName, Photo, Company}) {
		const photoUrl = Photo || "./sources/img/man.png";
		const res = `
			<div class='item-list_container'>
				<div class='df f-d-row'>
					<img src=${photoUrl}>
					<div class='df f-d-col'>
						<h4>${FirstName} ${LastName}</h4>
						<span>${Company}</span>
					</div>
				</div>
			</div>
		`;
		return res;
	}

	init() {
		const list = this.$$(constants.CONTACTS_VIEW.VIEW_IDS.LIST_ID);
		// const clientsDetailsTemplate = this.$$(constants.CONTACTS_VIEW.VIEW_IDS.TEMPLATE_ID);

		this.on(this.app, constants.EVENTS.SELECT_CONTACT, (id) => {
			list.unselectAll();
			if (id) list.select(id);
			else list.select(list.getFirstId());
		});

		list.sync(contactsCollection);

		webix.promise.all([
			contactsCollection.waitData,
			statusesCollection.waitData
		]).then(() => {
			if (list.count()) {
				list.select(list.getFirstId());
			}
		});
	}
}

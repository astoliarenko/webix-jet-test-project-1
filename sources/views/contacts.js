import {JetView} from "webix-jet";

import constants from "../constants";
import contactsCollection from "../models/contactsСollections";
import statusesCollection from "../models/statusesCollection";

export default class ContactsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const сontactsList = {
			localId: constants.CONTACTS_VIEW.VIEW_IDS.LIST_ID,
			view: "list",
			css: "contacts-list-style",
			width: constants.CONTACTS_VIEW.LIST_WIDTH,
			select: true,
			template: this.renderContactListShortInfo,
			on: {
				onAfterSelect: id => this.show(`details?id=${id}`)
			}
		};

		const btnAddContact = {
			width: constants.CONTACTS_VIEW.BTN_WIDTH,
			view: "button",
			css: "webix_primary",
			type: "icon",
			icon: "webix_icon wxi-plus",
			label: _("Add contact"),
			align: "center",
			click: () => this.show("form")
		};

		const filter = {
			view: "text",
			placeholder: _("type to find matching contacts"),
			localId: constants.CONTACTS_VIEW.VIEW_IDS.FILTER_ID,
			name: "contactsFilter",
			on: {
				onTimedKeyPress: () => {
					this.filterContactList();
				}
			}
		};

		const ui = {
			cols: [
				{
					css: "bg-white",
					rows: [
						filter,
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

	filterContactList() {
		const contactsList = this.$$(constants.CONTACTS_VIEW.VIEW_IDS.LIST_ID);
		const contactsFilter = this.$$(constants.CONTACTS_VIEW.VIEW_IDS.FILTER_ID);
		const filterValue = contactsFilter.getValue().toLowerCase().trim();
		const condition = filterValue[0];
		const keys = ["FirstName", "LastName", "Job", "Company", "Website", "Address", "Email", "Skype", "Phone"];
		contactsList.filter((obj) => {
			if (condition === "<" || condition === ">" || condition === "=") {
				if (obj.Birthday && (filterValue.length === 5)) {
					const filterYear = +filterValue.slice(1);
					if (!Number.isNaN(filterYear) && filterYear > 1969 && filterYear < 2040) {
						const birthdayYear = obj.BirthObj.getFullYear();
						switch (condition) {
							case "<":
								return birthdayYear < filterYear;
							case ">":
								return birthdayYear > filterYear;
							case "=":
								return birthdayYear === filterYear;
							default: break;
						}
					}
				}
				return false;
			}
			for (let i = 0; i < keys.length; i++) {
				if (obj[keys[i]].toString().toLowerCase().indexOf(filterValue) !== -1) {
					return true;
				}
			}
			if (obj.StatusID) {
				const status = statusesCollection.getItem(obj.StatusID);
				if (status && status.Value.toLowerCase().indexOf(filterValue) !== -1) {
					return true;
				}
			}

			return false;
		});
		contactsList.select(contactsList.getFirstId());
	}

	init() {
		const list = this.$$(constants.CONTACTS_VIEW.VIEW_IDS.LIST_ID);

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

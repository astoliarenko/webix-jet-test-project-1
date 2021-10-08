import {JetView} from "webix-jet";

import constants from "../constants";
import {contactsCollection, statusesCollection} from "../models/collections";

export default class ContactsView extends JetView {
	config() {
		const сontactsList = {
			localId: constants.CONTACTS_VIEW.VIEW_IDS.LIST_ID,
			view: "list",
			css: "contacts-list-style",
			width: constants.CONTACTS_VIEW.LIST_WIDTH,
			select: true,
			template: ({FirstName, LastName, Photo, Company}) => {
			// template: (obj) => {
				// console.log(obj);
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
				// const res = `${obj.FirstName} ${obj.LastName}`;
				// const res = `${FirstName} ${LastName}`;
				return res;
			},
			on: {
				onItemClick: (id) => {
					const item = contactsCollection.getItem(id);
					//	this.app.callEvent("select", [item]);
					this.$$(constants.CONTACTS_VIEW.VIEW_IDS.LIST_ID).select(id);
					this.$$(constants.CONTACTS_VIEW.VIEW_IDS.TEMPLATE_ID).parse(item);
					this.setParam("id", id, true);
				}
			}
		};

		const btnDelete = {
			width: constants.CONTACTS_VIEW.BTN_WIDTH,
			view: "button",
			type: "button",
			value: "Add"
			// click: () => {}
		};

		const btnEdit = {
			width: constants.CONTACTS_VIEW.BTN_WIDTH,
			view: "button",
			type: "button",
			value: "Edit"
			// click: () => {}
		};

		const clientsDetails = {
			cols: [
				{
					view: "template",
					localId: constants.CONTACTS_VIEW.VIEW_IDS.TEMPLATE_ID,
					template: ({FirstName, LastName, Photo, StatusID, Email, Skype, Job, Company, Birthday}) => {
						const photoUrl = Photo || "./sources/img/man.png";
						const Status = statusesCollection.getItem(StatusID) ? statusesCollection.getItem(StatusID).Value : "unknown";
						// need to add icons into column2
						const res = `
							<div class='details_container df f-d-col'>
								<h2 class='details_header'>${FirstName} ${LastName}</h2>
								<div class='df f-d-row row1'>
									<div class ='df f-d-col column1'>
										<img class="details_img" src=${photoUrl}>
										<span>${Status}</span>
									</div>
									<div class='df f-d-col column2'>
										<span>${Email}</span>
										<span>${Skype}</span>
										<span>${Job}</span>
										<span>${Company}</span>
										<span>${Birthday}</span>
									</div>
								</div>
							</div>
						`;
						// date of birth, location
						return res;
					}
				},
				{
					css: "bg-white",
					rows: [
						{
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

		const ui = {
			cols: [сontactsList, clientsDetails]
			// cols: [сontactsList, {$subview: true}]
		};

		return ui;
	}

	init() {
		const list = this.$$(constants.CONTACTS_VIEW.VIEW_IDS.LIST_ID);
		const clientsDetailsTemplate = this.$$(constants.CONTACTS_VIEW.VIEW_IDS.TEMPLATE_ID);
		webix.promise.all([
			contactsCollection.waitData,
			statusesCollection.waitData
		]).then(() => {
			list.sync(contactsCollection);
			clientsDetailsTemplate.bind(list);
			if (list.count() > 0) {
				list.select(1);
				this.show("/top/contacts?id=1");
			}
		});
	}
}

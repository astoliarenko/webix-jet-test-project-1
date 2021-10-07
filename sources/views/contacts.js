import {JetView} from "webix-jet";

import constants from "../constants";
import {contactsCollection, statusesCollection} from "../models/collections";

export default class ContactsView extends JetView {
	config() {
		const сontactsList = {
			localId: constants.CONTACTS_VIEW.VIEW_IDS.LIST_ID,
			view: "list",
			width: constants.CONTACTS_VIEW.LIST_WIDTH,
			select: true,
			template: ({FirstName, LastName}) => {
				// const res = `
				// 	<div class='details_container'>
				// 	<h6>${FirstName} ${LastName}</h6>
				// 		<div class='column'>
				// 			<div class ='column'>
				// 				<img>
				// 				<span>${Status}</span>
				// 			</div>
				// 			<div class='column'>
				// 				<span>${Email}</span>
				// 				<span>${Skype}</span>
				// 				<span>${Job}</span>
				// 			</div>
				// 		</div>
				// 	</div>
				// `;
				const res = `${FirstName} ${LastName}`;
				return res;
			},
			on: {
				onItemClick: (id) => {
					// const item = contactsCollection.getItem(id);
					//	this.app.callEvent("select", [item]);
					//
					this.$$(constants.CONTACTS_VIEW.VIEW_IDS.LIST_ID).select(id);
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
					localId: constants.CONTACTS_VIEW.VIEW_IDS.TEMPLATE_ID,
					template: () => "<div>ALL WILL GOOD</div>"
					// const res = `
					// 	<div class='details_container'>
					// 	<h6>${FirstName} ${LastName}</h6>
					// 		<div class='column'>
					// 			<div class ='column'>
					// 				<img>
					// 				<span>${Status}</span>
					// 			</div>
					// 			<div class='column'>
					// 				<span>${Email}</span>
					// 				<span>${Skype}</span>
					// 				<span>${Job}</span>
					// 			</div>
					// 		</div>
					// 	</div>
					// `;
				},
				{
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
			// clientsDetailsTemplate.bind(list);
			clientsDetailsTemplate.sync(contactsCollection);
			if (list.count() > 0) {
				list.select(1);
				this.show("/top/contacts?id=1");
			}
		});
	}
}

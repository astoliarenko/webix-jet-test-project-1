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
			// template: (obj) => {
				// console.log(obj);
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
				// const res = `${obj.FirstName} ${obj.LastName}`;
				const res = `${FirstName} ${LastName}`;
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
					template: ({FirstName, LastName, Photo, Status, Email, Skype, Job, Company}) => {
						const photoUrl = Photo ? Photo : "./sources/img/man.png";
						// need to add icons into column2
						const res = `
							<div class='details_container'>
								<h2 class='details_header'>${FirstName} ${LastName}</h2>
								<div class='details_row row1'>
									<div class ='details_column column1'>
										<img class="details_img" src=${photoUrl}>
										<span>${Status}</span>
									</div>
									<div class='details_column column2'>
										<span>${Email}</span>
										<span>${Skype}</span>
										<span>${Job}</span>
										<span>${Company}</span>
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

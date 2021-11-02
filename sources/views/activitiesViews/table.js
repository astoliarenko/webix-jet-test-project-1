import {JetView} from "webix-jet";

import constants from "../../constants";
import activitiesCollection from "../../models/activitiesCollection";
import activityTypeCollection from "../../models/activityTypeCollection";
import contactsCollection from "../../models/contactsСollections";
import EditWindowView from "./editwindow";

export default class ActivitiesTableView extends JetView {
	constructor(app, hide) {
		super(app);
		this.hideInfo = hide;
	}

	config() {
		const datepickerWidth = 150;
		const stateWidth = 50;
		const iconColumnWidth = 50;
		const contactWidth = 150;

		const datatable = {
			view: "datatable",
			hover: "myHover",
			localId: constants.ACTIVITIES_VIEW.VIEW_IDS.DATATABLE_ID,
			columns: [
				{
					id: "State",
					checkValue: "Close",
					uncheckValue: "Open",
					header: "",
					template: "{common.checkbox()}",
					width: stateWidth
				},
				{
					id: "TypeID",
					header: ["Activity type", {content: "selectFilter"}],
					collection: activityTypeCollection,
					sort: "text"
				},
				{
					id: "DateObj",
					width: datepickerWidth,
					header: [
						"Due date",
						{
							content: "datepickerFilter",
							inputConfig: {format: webix.Date.dateToStr(constants.ACTIVITIES_VIEW.DATE_FORMAT)}
						}
					],
					format: webix.Date.dateToStr(constants.ACTIVITIES_VIEW.DATE_FORMAT),
					sort: "date"
				},
				{
					id: "Details",
					template: "#Details#",
					header: ["Details", {content: "textFilter"}],
					fillspace: true,
					sort: "string"
				},
				{
					// hide column for contacts
					hidden: this.hideInfo,
					id: "ContactID",
					width: contactWidth,
					header: ["Contact", {content: "selectFilter"}],
					collection: contactsCollection,
					sort: "text"
				},
				{
					id: "edit",
					width: iconColumnWidth,
					header: "",
					template:
					`<span class ='webix_icon wxi-pencil ${constants.CSS.ACTIVITIES_VIEW.EDIT_DATATABLE}'></span>`
				},
				{
					id: "delete",
					header: "",
					width: iconColumnWidth,
					template:
					`<span class ='webix_icon wxi-trash ${constants.CSS.ACTIVITIES_VIEW.REMOVE_ITEM_DATATABLE}'></span>`
				}
			],
			scrollX: false,
			// select: true,
			onClick: {
				"remove-item-datatable": (e, id) => {
				// constants.CSS.ACTIVITIES_VIEW.REMOVE_ITEM_DATATABLE: function (e, id) {
					webix.confirm("Delete this activity?").then(() => {
						activitiesCollection.remove(id);
					});
					return false;
				},
				// constants.CSS.ACTIVITIES_VIEW.REMOVE_ITEM_DATATABLE: () => {
				"edit-datatable": (e, id) => this.window.showWindow(id, this.hideInfo)
			},
			on: {
				onAfterFilter: () => (this.contactId ? this.getRoot().filter("#ContactID#", this.contactId, true) : false)
			}
		};

		return datatable;
	}

	urlChange(view) {
		webix.promise.all([
			activitiesCollection.waitData,
			activityTypeCollection.waitData,
			contactsCollection.waitData
		])
			.then(() => {
				this.contactId = this.getParam("id");
				view.filterByAll();
				if (this.contactId) {
					view.filter("#ContactID#", this.contactId, true);
				}
			});
	}

	callEventFilterTable(id) {
		if (id) {
			this.app.callEvent(constants.EVENTS.FILTER_ACTIVITIESTABLE, [id]);
		}
	}

	init(view) {
		this.window = this.ui(EditWindowView);
		view.sync(activitiesCollection);
		this.on(this.app, constants.EVENTS.FILTER_ACTIVITIESTABLE, (id) => {
			if (id) view.filter("#ContactID#", id);
		});
		this.on(activitiesCollection, "onAfterAdd", () => this.callEventFilterTable(this.contactId));
		this.on(activitiesCollection, "onAfterDelete", () => this.callEventFilterTable(this.contactId));
		this.on(activitiesCollection, "onDataUpdate", () => this.callEventFilterTable(this.contactId));
	}
}

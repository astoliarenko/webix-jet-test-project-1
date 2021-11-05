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
		const _ = this.app.getService("locale")._;

		const datepickerWidth = 160;
		const stateWidth = 50;
		const iconColumnWidth = 50;
		const contactWidth = 150;
		const activityTypeWidth = 140;

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
					width: activityTypeWidth,
					header: [_("Activity type"), {content: "selectFilter"}],
					collection: activityTypeCollection,
					sort: "text"
				},
				{
					id: "DateObj",
					width: datepickerWidth,
					header: [
						_("Due date"),
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
					header: [_("Details"), {content: "textFilter"}],
					fillspace: true,
					sort: "string"
				},
				{
					// hide column for contacts
					hidden: this.hideInfo,
					id: "ContactID",
					width: contactWidth,
					header: [_("Contact"), {content: "selectFilter"}],
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
					webix.confirm(_("Delete this activity?")).then(() => {
						activitiesCollection.remove(id);
					});
					return false;
				},
				// constants.CSS.ACTIVITIES_VIEW.REMOVE_ITEM_DATATABLE: () => {
				"edit-datatable": (e, id) => this.window.showWindow(id, this.hideInfo)
			},
			on: {
				onAfterFilter: () => this.filterTable(this.contactId)
				// onAfterFilter: () => (this.contactId ? this.getRoot()
				// .filter("#ContactID#", this.contactId, true) : false)
			}
		};

		return datatable;
	}

	filterDtByAll() {
		this.$$(constants.ACTIVITIES_VIEW.VIEW_IDS.DATATABLE_ID).filterByAll();
	}

	filterDtByTabbar(tabbarId) {
		const table = this.$$(constants.ACTIVITIES_VIEW.VIEW_IDS.DATATABLE_ID);
		if (tabbarId) {
			// table.filter(obj => obj, null, true);
			const currentDateObj = new Date();
			const currentDateStr = webix.Date
				.dateToStr(constants.ACTIVITIES_VIEW.DATE_FORMAT)(currentDateObj);
			const currentDateInMSec = Date.parse(currentDateObj);
			const currentDay = currentDateObj.getDay() - 1;
			const oneDayInMSec = 86400000;
			// 1000 * 60 * 60 * 24 = 86400000 = 1 day in msec
			const tomorrowDateObj = new Date(currentDateInMSec + oneDayInMSec);
			const currentMonth = currentDateObj.getMonth();
			const startCurWeekObj = new Date(currentDateInMSec - oneDayInMSec * currentDay);
			const startCurWeekStr = webix.Date
				.dateToStr(constants.ACTIVITIES_VIEW.DATE_FORMAT)(startCurWeekObj);
			const endCurWeekObj = new Date(currentDateInMSec + oneDayInMSec * (7 - currentDay));
			const endCurWeekStr = webix.Date
				.dateToStr(constants.ACTIVITIES_VIEW.DATE_FORMAT)(endCurWeekObj);
			const matchItem = (obj) => {
				const activityDateStr = obj.DueDate.slice(0, 10);
				switch (tabbarId) {
					case "overdue":
						return obj.DateObj < currentDateObj;
					case "completed":
						return obj.State === "Close";
					case "today":
						// eslint-disable-next-line no-case-declarations
						return activityDateStr === currentDateStr;
					case "tomorrow":
						return (webix.Date
							.dateToStr(constants.ACTIVITIES_VIEW.DATE_FORMAT)(tomorrowDateObj)
							.slice(0, 10) === activityDateStr);
					case "thisWeek":
						return (startCurWeekStr <= activityDateStr) && (activityDateStr < endCurWeekStr);
					case "thisMonth":
						return obj.DateObj.getMonth() === currentMonth;
					default:
						return obj;
				}
			};

			table.filter(obj => matchItem(obj), null, false);
		}
	}

	filterTable(id) {
		// 	if third param in .filter() set to true, each next filtering criteria
		// will be applied to the already filtered list
		const table = this.$$(constants.ACTIVITIES_VIEW.VIEW_IDS.DATATABLE_ID);

		if (id) {
			table.filter("#ContactID#", this.contactId, true);
		}
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
				this.filterTable(this.contactId);
			});
	}

	init(view) {
		this.window = this.ui(EditWindowView);
		view.sync(activitiesCollection);
		this.on(activitiesCollection, "onAfterAdd", () => this.filterTable(this.contactId));
		this.on(activitiesCollection, "onAfterDelete", () => this.filterTable(this.contactId));
		this.on(activitiesCollection, "onDataUpdate", () => this.filterTable(this.contactId));
	}
}

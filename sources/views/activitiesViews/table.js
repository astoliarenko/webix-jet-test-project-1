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
		this.tabbarValue = "all";
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
					template: "<span class ='webix_icon wxi-pencil edit-datatable'></span>"
				},
				{
					id: "delete",
					header: "",
					width: iconColumnWidth,
					template: "<span class ='webix_icon wxi-trash remove-item-datatable'></span>"
				}
			],
			scrollX: false,
			// select: true,
			onClick: {
				"remove-item-datatable": (e, id) => {
					webix.confirm(_("Delete this activity?")).then(() => {
						activitiesCollection.remove(id);
					});
					return false;
				},
				"edit-datatable": (e, id) => this.window.showWindow(id, this.hideInfo)
			},
			on: {
				onAfterFilter: () => {
					this.filterDtByContact(this.contactId);
					setTimeout(() => {
						this.filterDtByTabbar(this.tabbarValue);
					}, 50);
				}
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
			this.tabbarValue = tabbarId;

			// webix.Date.dayStart(obj.DateObj) откинуть время
			// object add(object date,number inc,string mode, [boolean copy] );

			const matchItem = (obj) => {
				switch (tabbarId) {
					case "overdue":
						return obj.DateObj < new Date() && obj.State === "Open";
					case "completed":
						return obj.State === "Close";
					case "today":
						return (webix.Date
							.equal(webix.Date.dayStart(new Date()), webix.Date.dayStart(obj.DateObj)));
					case "tomorrow":
						return webix.Date.equal(webix.Date.add(webix.Date.dayStart(new Date()), 1, "day", true), webix.Date.dayStart(obj.DateObj));
					case "thisWeek":
					// start week - Sunday, end - Saturday, оставил как в дейтпикере
					{
						const startWeek = webix.Date.weekStart(webix.Date.dayStart(new Date()));
						const endWeek = webix.Date.add(startWeek, 6, "day", true);
						return (startWeek <= obj.DateObj && obj.DateObj <= endWeek);
					}
					case "thisMonth":
					{
						const curDate = new Date();
						return (obj.DateObj.getMonth() === curDate.getMonth()
							&& obj.DateObj.getFullYear() === curDate.getFullYear());
					}
					case "all":
					default:
						return true;
						// table.filter();
				}
			};

			table.filter(obj => matchItem(obj), null, true);
		}
	}

	filterDtByContact(id) {
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
				this.filterDtByContact(this.contactId);
			});
	}

	init(view) {
		this.window = this.ui(EditWindowView);

		view.sync(activitiesCollection);

		this.on(activitiesCollection.data, "onStoreUpdated", (id, obj, mode) => {
			if (mode === "add" || mode === "delete" || mode === "update") {
				this.filterDtByContact(this.contactId);
				if (!this.contactId) {
					view.filterByAll();
					this.filterDtByTabbar(this.tabbarValue);
				}
			}
		});
	}
}

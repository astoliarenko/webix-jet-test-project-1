import constants from "../constants";

export const contactsCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	// save: "rest->http://localhost:8096/api/v1/contacts/"
	scheme: {
		$init: (obj) => {
			obj.value = `${obj.FirstName} ${obj.LastName}`;
			// was created new key "value", but it mb necessary to delete old one ("Value")
		}
	}
});

export const statusesCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/statuses/"
	// save: "rest->http://localhost:8096/api/v1/statuses/"
});

export const activitiesCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init(obj) {
			obj.DueDate = webix.Date.strToDate(constants.ACTIVITIES_VIEW.DATE_FORMAT)(obj.DueDate);
		}
	}
});

export const activityTypeCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activitytypes/",
	// save: "rest->http://localhost:8096/api/v1/activitytypes/"
	scheme: {
		$init: (obj) => {
			obj.value = obj.Value;
			// was created new key "value", but it mb necessary to delete old one ("Value")
		}
	}
});

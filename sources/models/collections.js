export const contactsCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/"
	// save: "rest->http://localhost:8096/api/v1/contacts/"
});

export const statusesCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/statuses/"
	// save: "rest->http://localhost:8096/api/v1/statuses/"
});

export const activitiesCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/"
	// save: "rest->http://localhost:8096/api/v1/countries/"
});

export const activityTypeCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activitytypes/"
	// save: "rest->http://localhost:8096/api/v1/activitytypes/"
});

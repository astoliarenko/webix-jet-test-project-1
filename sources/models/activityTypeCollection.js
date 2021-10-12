const activityTypeCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activitytypes/",
	// save: "rest->http://localhost:8096/api/v1/activitytypes/"
	scheme: {
		$init: (obj) => {
			obj.value = obj.Value;
			// was created new key "value", but it mb necessary to delete old one ("Value")
		}
	}
});

export default activityTypeCollection;

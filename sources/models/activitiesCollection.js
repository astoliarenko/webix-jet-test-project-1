import constants from "../constants";

const activitiesCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init(obj) {
			obj.DateObj = webix.Date.strToDate(constants.ACTIVITIES_VIEW.DATE_FORMAT)(obj.DueDate);
			obj.Time = new Date(obj.DueDate);
		}
	}
});

export default activitiesCollection;

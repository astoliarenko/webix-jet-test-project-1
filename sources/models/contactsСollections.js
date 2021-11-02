import constants from "../constants";

const contactsCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: (obj) => {
			obj.value = `${obj.FirstName} ${obj.LastName}`;
			obj.BirthdayObj = webix.Date.strToDate(constants.ACTIVITIES_VIEW.DATE_FORMAT)(obj.Birthday);
		}
	}
});

export default contactsCollection;

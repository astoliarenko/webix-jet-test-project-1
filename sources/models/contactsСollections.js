import constants from "../constants";

const contactsCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: (obj) => {
			obj.value = `${obj.FirstName} ${obj.LastName}`;
			obj.BirthObj = webix.Date.strToDate(constants.ACTIVITIES_VIEW.DATE_FORMAT)(obj.Birthday);
			// console.log("Birthday=", obj.Birthday);
			// console.log("BirthdayObj=", obj.BirthdayObj);
			// неправильно сохраняет Birthday
		}
	}
});

export default contactsCollection;

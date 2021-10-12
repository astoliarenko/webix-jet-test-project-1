const contactsCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	// save: "rest->http://localhost:8096/api/v1/contacts/"
	scheme: {
		$init: (obj) => {
			obj.value = `${obj.FirstName} ${obj.LastName}`;
			// was created new key "value", but it mb necessary to delete old one ("Value")
		}
	}
});

export default contactsCollection;

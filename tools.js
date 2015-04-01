module.exports = {
	getEvents: function(username) {
		var Parse = require('parse').Parse;
		var MeetupDataTable = Parse.Object.extend('meetup_users');
		var MeetupTable = Parse.Object.extend('meetup');
		var UserTable = Parse.Object.extend('User');
		var meetupData = new MeetupDataTable();
		var meetup = new MeetupTable();
		var user = new UserTable();
		Parse.initialize("KNZvn9YyTZ4c0EQIp37V5oQZgdiLl6aaBEYbGyJ6", "kVaVcbgtedII0kxbBxR6FxKbxuZ0uD7vv6OQoz4d");

		var query = new Parse.Query(MeetupDataTable);
		query.equalTo('user_id', username);
		query.find({
			succes: function(results) {
				// Do things after successful query
				console.log(results);
				return results
			},
			error: function(results, error) {
				console.log(error);
				return error
			}
		});
	}
}
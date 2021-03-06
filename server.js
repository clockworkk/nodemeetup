// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Promise 	= require('promise');
var Parse = require('parse').Parse;
var MeetupDataTable = Parse.Object.extend('meetup_users');
var MeetupTable = Parse.Object.extend('meetup');
var UserTable = Parse.Object.extend('User');
var meetupData = new MeetupDataTable();
var meetup = new MeetupTable();
var user = new UserTable();


// Setup parse stuff
Parse.initialize("KNZvn9YyTZ4c0EQIp37V5oQZgdiLl6aaBEYbGyJ6", "kVaVcbgtedII0kxbBxR6FxKbxuZ0uD7vv6OQoz4d");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});


router.route('/home')
	.post(function(req, res) {
		// Get all of the events that the user has been invited to or has accepted invitation
		var query = new Parse.Query(MeetupDataTable);
		var username = req.body.username;
		var userEvents = [];

		// Create a promise to avoid callback hell
		var promise = new Promise(function(resolve, reject){
			query.equalTo('user_id', username);
			query.find({
				success: function(results) {
					resolve(results);
				},
				error: function(error) {
					resolve(errors);
				}
			});
		});

		// Use promise to get results
		promise.then(function(results){
			userEvents = results
		}, function(err){
			res.json({ message : err });
		}).then(function(events){
			res.json({ message: userEvents });
		});
	});


router.route('/events')

	// Currently req.body.data is the correct information but undefined is being saved to parse
    // create a bear (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {
    	//Invitees and Guests are arrays in Parse
    	var invitees = req.body.invitees;
    	var guests = [req.body.creator];
    	if (invitees.indexOf(',') > -1) {
    		invitees = invitees.split(',')
    	} else {
    		invitees = [req.body.invitees];
    	}

		meetup.save({
			date: req.body.date,
			time: req.body.time,
			name: req.body.name,
			invitees: invitees,
			guests: guests
		}, {
		  success: function(meetup) {
		    // Execute any logic that should take place after the object is saved.

		   	//To Do Not working properly
		   	// Create a new enrty in the meetup_data table for each person that is being invited and the creator
		   	invitees.forEach(function(person){
		   		console.log(person);
			    meetupData.save({
			    	user_id: person,
			    	meetup_id : meetup['id'],
			    	invited: false,
			    	attended: true
			    }, {
			    	success: function(meetupData) {
			    		// Nothing to do after adding to meetup_data
			    		res.json({message: meetup});
			    	},
			    	error: function(meetupData, error){
			    		res.json( {message: "There was an error " + error });
			    	}
			    });
			});

		    // Save the creator seperately
		    meetupData.save({
		    	user_id: guests[0],
		    	meetup_id : meetup['id'],
		    	invited: true,
		    	attended: true
		    }, {
		    	success: function(meetupData) {
		    		// Nothing to do after adding to meetup_data
		    		res.json({message: meetup});
		    	},
		    	error: function(meetupData, error){
		    		res.json( {message: "There was an error " + error });
		    	}
		    });
		  },
		  error: function(meetup, error) {
		    // Execute any logic that should take place if the save fails.
		    // error is a Parse.Error with an error code and message.
		    console.log(error);
		    res.json({message: "There was an error " + error});
		  }
		});
    })

    // Get all of the events
    // Working
    .get(function(req,res) {
    	var query = new Parse.Query(MeetupTable);

    	// Create the promise
    	var promise = new Promise(function(resolve, reject) {
    		var result = [];
	    	query.find({
	    		success: function(events) {
	    			for (var i = 0; i < events.length; ++i) {
	    				meet = events[i].get('name');
	    				result.push(meet);
	    			}
	    			resolve(result);
	    		},
	    		error: function(events, error) {
	    			resolve(error);
	    		}
	    	});
	    });

	    // Use the promise
	    promise.then(function(result) {
	    	res.json({ message : result });
	    }, function(err) {
	    	res.json({ message : err });
	    });
    });


// Fully Functional
router.route('/users')
	// Working
	.get(function(req, res) {
		var query = new Parse.Query(Parse.User);

		// Create a promise to avoid callback hell
		var promise = new Promise(function(resolve, reject) {
			// Store the results in an array.
			var result = [];
			query.find({
	  			success: function(users) {
	  				// Put the users into the array if successful
	    			for (var i = 0; i < users.length; ++i) {
	    				var user = users[i].get('username');
	    				result.push(user);
	    			}
	    			 resolve(result);
	  			},
	  			error: function(users, error){
	  				resolve(error);
	  			}
			});
		});

		// Use the promise to avoid callback hell
		promise.then(function(result) {
			res.json({message: result});
		}, function(err){
			res.json({message: err});
		});
	});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
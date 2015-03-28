// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Parse = require('parse').Parse;

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


router.route('/events')

    // create a bear (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {
    	var Meetup = Parse.Object.extend('meetup');
    	var meetup = new Meetup();

    	// Set the fields based on the request
    	meetup.set('date', req.body.date);
    	meetup.set('time', req.body.time);
    	meetup.set('name', req.body.name);
    	meetup.set('invitees', req.body.invitees);

    	console.log(req.body.date);
    	console.log(req.body.time);
    	console.log(req.body.name);
    	console.log(req.body.invitees);

		meetup.save(null, {
		  success: function(meetup) {
		    // Execute any logic that should take place after the object is saved.
		    res.json({message: "Created a new event"});
		  },
		  error: function(meetup, error) {
		    // Execute any logic that should take place if the save fails.
		    // error is a Parse.Error with an error code and message.
		    res.json({message: "Created a new event"});
		  }
		});
    });

router.route('/users')

	.get(function(req, res) {
		var query = new Parse.Query(Parse.User);
		query.find({
  			success: function(users) {
    			for (var i = 0; i < users.length; ++i) {
    				user = users[i].get('username');
      				users_list.push(user);
    			}
  			}
		});
		console.log(users_list);
		res.json({message: users_list});
	});



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
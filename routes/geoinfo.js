var defaultTopic = 'iphone6plus';

var availableTopics = ['#thanksgiving', 
					   '#HappyBirthdayTaylorSwift', 
					   '#iHeartJingleBall',
					   '#PeopleWhoMadeMy2014',
					   '#iphone6plus'];

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = require('url');
var qs = require('querystring');
var DB_url = 'mongodb://localhost:27017/TweetTrends';

var nodes = [];
var links = [];

var findDocuments = function(db, coll, io, callback) {
  	// Get the documents collection
	var collection = db.collection(coll);
	// Find some documents
  	collection.find({}).toArray(function(err, docs) {
	    assert.equal(err, null);
	    io.on('connection', function (socket) {
	    	socket.emit("geoDataSuccess", {geotags: docs});
	    	console.log("emit geoDataSuccess");		// for debug
	    	console.log("geodata: " + docs.length); // for debug
	    });
	    
	    callback(docs);
	});      
};

var connectDB = function(DB_url, collection, io) {
	MongoClient.connect(DB_url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to database");
		findDocuments(db, collection, io, function() {
			db.close();
		});
	});
};


exports.loadpage = function(io) {
	return function(req, res) {
		// console.log(url.parse(req.url));		// for debug
		var query = url.parse(req.url).query;
		var coll;
		if (query == null) {
			coll = defaultTopic;
			var doc = connectDB(DB_url, coll + '_geoinfo', io);
		} else {
			coll = qs.parse(query).coll;
			var doc = connectDB(DB_url, coll, io);
		}
		
		res.render('pages/geoinfo', {
			availableTopics: availableTopics,
			currentTopic: coll
		});
	}
};

exports.submit = function(req, res) {
	var collection = req.query.coll;
	console.log(collection);
};
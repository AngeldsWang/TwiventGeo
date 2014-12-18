var defaultTopic = 'iphone6plus';

var availableTopics = ['#Thanksgiving', 
					   '#Happy Birthday Taylor Swift', 
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
	    assert.equal(1, docs.length);
	    nodes = docs[0].nodes;
	    links = docs[0].links;

	    io.on('connection', function (socket) {
	    	socket.emit("searchDataSuccess", {nodes: nodes, links: links});
	    	console.log("emit searchDataSuccess");		// for debug
	    	console.log("nodes: " + nodes.length);
	    	console.log("links: " + links.length);
	    	// socket.on('currentUser', function (data) {
	    	//   	console.log(data);
	    	//   	socket.emit('currentUser info', {node: data.info});
	    	// });
	    });

	    // io.sockets.emit("searchDataSuccess", {nodes: nodes, links: links});
	    
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
		} else {
			coll = qs.parse(query).coll;
		}
		var doc = connectDB(DB_url, coll, io);
		// io.sockets.emit("searchDataSuccess", {nodes: doc.nodes, links: doc.links});
		// console.log("nodes: " + doc.nodes.length);
		// console.log("links: " + doc.links.length);
		res.render('pages/rtnetwork', {
			availableTopics: availableTopics,
			currentTopic: coll
		});
	}
};

exports.submit = function(req, res) {
	var collection = req.query.coll;
	console.log(collection);
};
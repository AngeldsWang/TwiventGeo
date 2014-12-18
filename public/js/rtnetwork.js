$(document).ready(
	function draw(){
		var socket = io.connect('http://localhost');

		socket.once('searchDataSuccess', function (data) {
			console.log(data.nodes.length);
			console.log(data.links.length);
			// $.extend(network, data);
			socket.emit('rtnetworkClientEvent', {info: "OK"});
			console.log('rtnetworkClinetEvent Emitted');

			var width = 770;
			var height = 500;

			var nodes = data.nodes;
			var links = data.links;

			// Variables keeping graph state
			var activeMovie = undefined;
			var currentOffset = { x : 0, y : 0 };
			var currentZoom = 1.0;

			// The D3.js scales
			var xScale = d3.scale.linear()
						   .domain([0, width])
						   .range([0, width]);
			var yScale = d3.scale.linear()
						   .domain([0, height])
						   .range([0, height]);
			var zoomScale = d3.scale.linear()
							  .domain([1,6])
							  .range([1,6])
							  .clamp(true);
			var node_size = d3.scale.linear()
						      .domain([5,10])	// we know score is in this domain
						      .range([7,27])
						      .clamp(true);

			d3.select("#spinner").remove();

			var svg = d3.select("#RTNetwork").append("svg")
									.attr("width",width)
									.attr("height",height)
									.attr("viewBox", "0 0 " + width + " " + height)
									.attr("preserveAspectRatio", "xMidYMid meet");;

			var force = d3.layout.force()
								.nodes(nodes)
								.links(links)
								.size([width,height])
								.linkDistance(70)
								.charge(-90)
								.gravity(0.4)
								.start();
								
			var svg_edges = svg.selectAll("line")
								.data(links)
								.enter()
								.append("line")
								.style("stroke","#ccc")
								.style("stroke-width",1);

			var color = d3.scale.category20();
								
			var svg_nodes = svg.selectAll("circle")
								.data(nodes)
								.enter()
								.append("circle")
								.attr("r", function(d) {return node_size(d.size);})
								.attr('pointer-events', 'all')
								.on("click", function(d) { showUserCard(d); } )
								.style("fill",function(d,i){
									return color(i);
								})
								.call(force.drag);
								
			force.on("tick", function(){

				 svg_edges.attr("x1",function(d){ return d.source.x; });
				 svg_edges.attr("y1",function(d){ return d.source.y; });
				 svg_edges.attr("x2",function(d){ return d.target.x; });
				 svg_edges.attr("y2",function(d){ return d.target.y; });
				 
				 svg_nodes.attr("cx",function(d){ return d.x; });
				 svg_nodes.attr("cy",function(d){ return d.y; });
			});


			function showUserCard(node) {
				socket.emit('currentUser', {info: node});
				console.log('currentUser data emitted');

				var userCardDiv = d3.select('#userCard');
				var card = '<div class="cardcontainer">\
								<header>\
									<div class="bio">\
						        		<img src="http://www.croop.cl/UI/twitter/images/up.jpg" alt="background" class="bg">\
										<div class="desc">\
											<h3>@' + node.name + '</h3>\
											<p>' + node.description + '</p>\
										</div>\
									</div>\
									<div class="avatarcontainer">\
										<img src="' + node.user_image_url + '" alt="avatar" class="avatar">\
										<div class="hover">\
												<div class="icon-twitter"></div>\
										</div>\
									</div>\
								</header>\
								<div class="content">\
									<div class="data">\
										<ul>\
											<li>\
												<span>Tweets</span>\
												' + node.tweets_count + '\
											</li>\
											<li>\
												<span>Followers</span>\
												' + node.followers_count + '\
											</li>\
											<li>\
												<span>Following</span>\
												' + node.friends_count + '\
											</li>\
										</ul>\
									</div>\
									<div class="follow"> <div class="icon-twitter"></div> Follow</div>\
									<div class="tweet">\
										<div class="bubble-container">\
										  <div class="bubble">\
										  	<div class="text">\
											    <h3>@' + node.name + '</h3><br/>\
											  ' + node.tweets[0] + '\
											</div>\
										    <div class="over-bubble">\
										      <div class="icon-mail-reply action"></div>\
										      <div class="icon-retweet action"></div>\
										      <div class="icon-star"></div>\
										    </div>\
										  </div>\
										  <div class="arrow"></div>\
										</div>\
									</div>\
								</div>\
							</div>';
				userCardDiv.html(card);
			}

			// socket.on('currentUser info', function(data) {
			// 	console.log(data);
			// 	var currentUser = data.node;
			// 	var allwords = currentUser.description + " ";
			// 	currentUser.tweets.forEach(function(tweet) {
			// 		allwords += (tweet + " ");
			// 	});

			// 	var cleanWords = allwords.replace(/[^\w\s]/gi, " ").replace(/\brt\b/gi, " ").split(" ");

			// 	d3.layout.cloud().size([320, 170])
			// 	      .words(cleanWords.map(function(d) {
			// 	        return {text: d, size: 10 + Math.random() * 90};
			// 	      }))
			// 	      .padding(5)
			// 	      .rotate(function() { return ~~(Math.random() * 2) * 90; })
			// 	      .font("Impact")
			// 	      .fontSize(function(d) { return d.size; })
			// 	      .on("end", drawWordCloud)
			// 	      .start();
			// 	  function drawWordCloud(words) {
			// 	    d3.select("#wordCloud").append("svg")
			// 	        .attr("width", 320)
			// 	        .attr("height", 170)
			// 	      .append("g")
			// 	        .attr("transform", "translate(150,150)")
			// 	      .selectAll("text")
			// 	        .data(words)
			// 	      .enter().append("text")
			// 	        .style("font-size", function(d) { return d.size + "px"; })
			// 	        .style("font-family", "Impact")
			// 	        .style("fill", function(d, i) { return color(i); })
			// 	        .attr("text-anchor", "middle")
			// 	        .attr("transform", function(d) {
			// 	          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
			// 	        })
			// 	        .text(function(d) { return d.text; });
			// 	  }
			// });
		});
	}
);

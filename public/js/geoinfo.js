$(document).ready(
	function geotagging() {
		var socket = io.connect('http://localhost');

		var map = L.map('marker');
		var heatmap = L.map('heat');
		socket.on('geoDataSuccess', function (data) {
			// console.log("geo num:" + data.geotags.length); 	// for debug

			var geotags = data.geotags;
			
			map.remove();
			map = L.map('marker');

			for (var i = 0; i < geotags.length; ++i) {
				var initLng = geotags[i].place.bounding_box.coordinates[0][0][0];
				var initLat = geotags[i].place.bounding_box.coordinates[0][0][1];
				// console.log("lat: " + initLat + " lng: " + initLng);
				if (initLat != 0 && initLng != 0) {
					map.setView([initLat, initLng], 2);
					break;
				}
			}

			L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
				maxZoom: 18,
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
					'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
					'Imagery © <a href="http://mapbox.com">Mapbox</a>',
				id: 'wzjmit.kfd7pld6'
			}).addTo(map);

			var LatLngs = [];

			for (var i = 0; i < geotags.length; ++i) {
				var Lng = geotags[i].place.bounding_box.coordinates[0][0][0];
				var Lat = geotags[i].place.bounding_box.coordinates[0][0][1];
				if (Lat != 0 && Lng != 0) {
					LatLngs.push([Lat, Lng]);
					var marker = L.marker([Lat, Lng]);
					marker.addTo(map).bindPopup("@" + geotags[i].username + "<br/>" + geotags[i].place.full_name + 
							"\t(lat: " + Lat + " lng: " + Lng + ")" + "<br/>" + geotags[i].text);
					marker.on('click', onClickMarker);
				}
			}

			function onClickMarker(e) {
				var latlng = e.latlng;
				heatmap.panTo(latlng);
			}

			// function add_marker(tweet) {
			// 	var lng = tweet.place.bounding_box.coordinates[0][0][0];
			// 	var lat = tweet.place.bounding_box.coordinates[0][0][1];
			// 	var marker = new L.marker([lat, lng]);
			// 	marker.addTo(map).bindPopup("@" + tweet.username + "\t" + tweet.place.full_name + "<br/>" + tweet.text);;
			// 	marker.on('click', onClick);
			// }

			// function onClick(e) {
			// 	var lat = this.getLatLng().lat;
			// 	var lng = this.getLatLng().lng;
			// 	socket.emit('position', {lat: lat, lng: lng});
			// }

			var popup = L.popup();

			function onMapClick(e) {
				popup
					.setLatLng(e.latlng)
					.setContent(e.latlng.toString())
					.openOn(map);
			}
			map.on('click', onMapClick);



			heatmap.remove();
			heatmap = L.map('heat');

			heatmap.setView([LatLngs[0][0], LatLngs[0][1]], 15);

			L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
				maxZoom: 18,
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
					'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
					'Imagery © <a href="http://mapbox.com">Mapbox</a>',
				id: 'wzjmit.kfd7pld6'
			}).addTo(heatmap);

			L.heatLayer(LatLngs).addTo(heatmap);
		});		
	}
);


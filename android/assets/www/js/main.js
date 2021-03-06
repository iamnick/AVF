$(document).ready(function() {
	// Navigation 
	$('#twitterLi').click(function() {
		window.location = 'twitterAPI.html';
	});
	$('#espnLi').click(function() {
		window.location = 'espnAPI.html';
	});
	$('#research1').click(function() {
		window.location = 'research1.html';
	});
    $('#research2').click(function() {
    	window.location = 'research2.html';
    });
    $('#research3').click(function() {
    	window.location = 'research3.html';
    });
    $('#geoLi').click(function(){
        window.location = 'geo.html';
    });
    $('#accelLi').click(function(){
    	window.location = 'accel.html';
    });
    $('#cameraLi').click(function(){
    	window.location = 'camera.html';
    });
    $('#htmlVideoLi').click(function(){
    	window.location = 'video.html';
    });
	$('.returnHome').click(function() {
		window.location = 'index.html';
	});
	
	/***************** 
		Twitter API
	 *****************/
	$('#twitterSearch').click(function() {
		// Get search terms and result type from header, then create URL to search with
		var q = $('#query').val();
		var searchURL = 'http://search.twitter.com/search.json?q=' + q + '&rpp=5&include_entities=true&result_type=mixed&callback=?';
	
		$.getJSON(searchURL, function(data) {
			console.log(data);
			var appendLocation = $('#searchResultsList');
			// Update header with search keywords
			var header = $('<h3>')
				.html('Search results for "<i>' + q + '</i>"')
				.appendTo(appendLocation)
			;
			// Cycle through results and add them to the page
			for (var i = 0, j = data.results.length; i < j; i++) {
				if (i%2 === 0) {
                	var bgClass = 'tEvenBg';
				} else {
                	var bgClass = 'tOddBg';
				}
				var newLi = $('<li>')
					.attr('class', bgClass)
					.appendTo(appendLocation)
				;
				var profileImg = $('<img>')
					.attr('src', data.results[i].profile_image_url)
					.css('class', 'tProfileImg')
					.appendTo(newLi)
				;
				var userRealName = $('<span>')
					.html(data.results[i].from_user_name)
					.attr('class', 'tRealName')
					.appendTo(newLi)
				;
				var userName = $('<span>')
					.html('<br />@' + data.results[i].from_user)
					.attr('class', 'tUserName')
					.appendTo(newLi)
				;
				var tweetSpan = $('<p>')
					.html(data.results[i].text)
					.appendTo(newLi)
				;
			}
			var searchTime = $('<span>')
					.html('Search completed in ' + data.completed_in + ' seconds')
					.attr('class', 'tSearchTime')
					.appendTo(appendLocation)
				;
		});
		// display
		$('#searchResults').css('display', 'block');
	});
	
	/**************
	    ESPN API   
	 **************/ 
	// Shows and populates team list when a league icon is tapped 
	$('#leagueSelect img').click(function() {
		var selectedLeague = $(this);
		// puts the league ID onto the 'get news' button so it can be used in the query url
		var leagueId = $(selectedLeague).attr('id');
		$('#espnButton').data('leagueId', leagueId);
		
		//enable select team list and get news button
		$('#teamList').removeAttr('disabled');
		$('#espnButton').removeAttr('disabled');
		
		var teamsURL = 'http://api.espn.com/v1/sports/' + leagueId + '/teams/:teamId?apikey=dbs57muuwwnphn5sbhb9w355';
		$.getJSON(teamsURL, function(data) {
			console.log(data);
			var appendLocation = $('#teamList');
			appendLocation.html('');
			var teams = data.sports[0].leagues[0].teams;
			for (var i = 0, j = teams.length; i < j; i++) {
				var newOption = $('<option>')
					.val(teams[i].id)
					.html(teams[i].location + ' ' + teams[i].name)
					.appendTo(appendLocation)
				;
				// puts the team name/id of the first team onto the button
				if (i === 0) {
					$('#espnButton')
						.data('teamId', 1)
						.data('teamName', teams[i].location + ' ' + teams[i].name)
					;
				}
			}	
		});
	});	
	
	// passes team name/id onto the 'get news' button to use in the api query when clicked
	$('#teamList').change(function() {
		var teamId = $(this).val();
		var teamName = $('#teamList option:selected').text();
		$('#espnButton')
			.data('teamId', teamId)
			.data('teamName', teamName)
		;
	});
	
	// Loads up to 10 headlines for each team
	$('#espnButton').click(function() {
		// pull variables off of the 'get news' button
		var teamId = $(this).data('teamId');
		var teamName = $(this).data('teamName');
		var leagueId = $(this).data('leagueId');
		
		var searchURL = 'http://api.espn.com/v1/sports/' + leagueId + '/teams/' + teamId + '/news?apikey=dbs57muuwwnphn5sbhb9w355';
		$.getJSON(searchURL, function(data) {
			console.log(data);
			var appendLocation = $('#teamNewsList');
			appendLocation.html('');
			var header = $('<h3>')
				.html('Top news stories for the ' + teamName)
				.appendTo(appendLocation)
			;
			for (var i = 0, j = data.headlines.length; i < j; i++) {
				// Check to see if the article is premium (we only want to show non-premium stories)
				if (data.headlines[i].premium === false) {
					var newLi = $('<li>') 
						//.data('linkURL', data.headlines[i].links.mobile.href)
						//.click(function() {
						//	window.location = $(this).data('linkURL');
						//})
						.appendTo(appendLocation)
					;
					var newsHeading = $('<h4>')
						.html(data.headlines[i].headline)
						.appendTo(newLi)
					;
					var newsDescrip = $('<p>')
						.html(data.headlines[i].description)
						.appendTo(newLi)
					;
				}
			}
		});
		// display settings
		$('#teamNews').css('display', 'block');
		$('#teamNewsHeader').html('Top News Stories for the ' + teamName);
	});
	
	/************************
	  Geo-Location & Compass
	 ************************/
    function geoSuccess(position) {
        // display location details above map
        $('#locHeader').html('Location Details');
        $('#latLi').html('Latitude: ' + position.coords.latitude.toFixed(4));
        $('#lngLi').html('Longitude: ' + position.coords.longitude.toFixed(4));
        $('#altLi').html('Altitude: ' + position.coords.altitude.toFixed(4));

        // create the google map & marker
        var loc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        // the Map method doesn't accept jquery objects, have to use getElementById
        var map = new google.maps.Map(document.getElementById('mapDiv'), {
            center: loc,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: loc,
            map: map
        });
        var placeVars = {
        	location: loc,
            radius: '1200',
            types: ['store','restaurant', 'food', 'park', 'airport', 'university', 'stadium', 'hospital', 'movie_theater', 'library', 'parking', 'shopping_mall', 'zoo', 'campground', 'amusement_park', 'aquarium']
        };
        var nearbyPlaces = new google.maps.places.PlacesService(map);
        nearbyPlaces.nearbySearch(placeVars, function(places, status){
        	if (status === google.maps.places.PlacesServiceStatus.OK) {
            	console.log(places);
                var placesList = $('#placesList').html('<li class="listHeader">Nearby Places</li>');
                var limit = 5;
                if (places.length < 5) {
                	limit = places.length;
                }
                for (var i =0; i < limit; i++) {
                	var newPlace = $('<li>')
                    	.html(places[i].name)
                    	.appendTo(placesList);
                }
            }
        });
    }
    
    function geoError() {
    	console.log('Error with Geo-Location');
    }
    
    function compassSuccess (heading) {
        var h = heading.magneticHeading;
        var directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        $('#compassLi').html('Facing: ' + directions[Math.floor((h%360)/45)]);
    }
    
    function compassError () {
    	console.log('Error with Compass');
    }
    
    $('#whereAmI').click(function() {
    	navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
		var watchId = navigator.compass.watchHeading(compassSuccess, compassError);
    });
	
    /***************
      Accelerometer
     ***************/
    function accelSuccess(accel) {
    	// get variables from object since we will be testing them alot
        var x = accel.x;
        var y = accel.y;
        var z = accel.z;
        
        // vertical tilts
        if ((9 > y) && (y > 4) && (9 > z) && (z > 4)) {
        	$('#vertTilt').html('Tilted Backwards');
        } else if ((0.5 > x ) && (x > -0.5) && (0.5 > z) && (z > -0.5) && (10.5 > y) && (y > 9.5)) {
        	$('#vertTilt').html('Device Straight Up');
        } else if ((0.5 > x) && (x > -0.5) && (0.5 > y) && (y > -0.5) && (10.5 > z) && (z > 9.5)) {
        	$('#vertTilt').html('Device Flat, Facing Upward');
        }
        
        // left/right tilts
        if (x > 1) {
        	$('#horiTilt').html('Tilted Left');
        } else if (x < -1) {
        	$('#horiTilt').html('Tilted Right');
        } else {
            $('#horiTilt').html('No Tilt');
        }
    }
    
    function accelError() {
    	console.log('Error with Accelerometer');
    }
    
    $('#accelButton').click(function() {
    	var accelOpts = { frequency: 1000 };
    	watchId = navigator.accelerometer.watchAcceleration(accelSuccess, accelError, accelOpts);
    });
    
	/********
      Camera
     ********/
    $('#cameraButton').click(function(){
        function cameraSuccess(img) {
        	var cameraDiv = $('#cameraDiv');
            var imgDiv = $('<div>').attr('class', 'imgDiv');
            
            // places image thumbnail on page
            var cameraImg = $('<img>')
            	.attr('src', 'data:image/jpeg;base64,' + img)
                .attr('class', 'imgThumb')
                .appendTo(imgDiv)
            ;
            
            // date details
            var currentDate = new Date();
            var dateString = (currentDate.getMonth()+1) + '/' + (currentDate.getDate()) + '/' + (currentDate.getFullYear());
            var imgDateSpan = $('<span>')
            	.html('<br />Taken on ' + dateString)
                .attr('class', 'imgInfo')
            	.appendTo(imgDiv);
            ;
            
            // location details
            navigator.geolocation.getCurrentPosition( function(position) {
            	var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            	geocoder.geocode({'latLng': latlng}, function(results, status) {
                	if (status === google.maps.GeocoderStatus.OK) {
                        for (var k in results) {
                        	if (results[k].types == 'postal_code') {
                            	var city = results[k].address_components[1].long_name.replace(/\w\S*/g, function(text){
                                		return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
                                    });
                            	var locationStr = city + ', ' + results[k].address_components[2].short_name + ', ' + results[k].address_components[3].long_name;
                                
                            	var imgLocSpan = $('<span>')
                                	.html('<br />' + locationStr)
                                 	.attr('class', 'imgInfo')
                                 	.appendTo(imgDiv)
                                ;
                            }
                        }
                    } else {
                    	console.log('Geocoder failed due to: ' + status);
                    }
                });
            }, function() {
            	console.log('Error with Geo-Location on Camera Page');
            });
            
            imgDiv.appendTo(cameraDiv);
        }
        
        function cameraError(msg) {
        	console.log('Error with Camera');
        	console.log(msg);
        }
        
        var cameraOpts = {
        	quality: 75,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 200,
            targetHeight: 200,
            destinationType: Camera.DestinationType.DATA_URL,
            saveToPhotoAlbum: false
        };
    
    	navigator.camera.getPicture(cameraSuccess, cameraError, cameraOpts);
            
    });
});
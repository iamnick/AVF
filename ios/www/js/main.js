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
	$('.returnHome').click(function() {
		window.location = 'index.html';
	});
	
	/***************** 
		Twitter API
	 *****************/
	$('#twitterSearch').click(function() {
		// Get search terms and result type from header, then create URL to search with
		q = $('#query').val();
		searchURL = 'http://search.twitter.com/search.json?q=' + q + '&rpp=5&include_entities=true&result_type=mixed&callback=?';
	
		$.getJSON(searchURL, function(data) {
			console.log(data);
			appendLocation = $('#searchResultsList');
			appendLocation.html('');
			// Update header with search keywords
			var header = $('<h3>')
				.html('Search results for "<i>' + q + '</i>"')
				.appendTo(appendLocation)
			;
			// Cycle through results and add them to the page
			for (var i = 0, j = data.results.length; i < j; i++) {
				if (i%2 === 0) {
					bgColor = '#CCFFFF';
				} else {
					bgColor = '#99DDFF';
				}
				var newLi = $('<li>')
					.css('background', bgColor)
					.appendTo(appendLocation)
				;
				var profileImg = $('<img>')
					.attr('src', data.results[i].profile_image_url)
					.css('float', 'left')
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
		// changes opacity of league icon to show it's been selected
		selectedLeague = $(this);
		$('#leagueSelect img').each(function() {
			$(this).css('opacity', '0.4');
		});
		$(selectedLeague).css('opacity', '1.0');
		
		//enable select team list and get news button
		$('#teamList').removeAttr('disabled');
		$('#espnButton').removeAttr('disabled');
		
		var teamsURL = 'http://api.espn.com/v1/sports/' + $(selectedLeague).attr('id') + '/teams/:teamId?apikey=dbs57muuwwnphn5sbhb9w355';
		$.getJSON(teamsURL, function(data) {
			console.log(data);
			appendLocation = $('#teamList');
			appendLocation.html('');
			teams = data.sports[0].leagues[0].teams;
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
		console.log($(this).data('teamId'));
		teamId = $(this).data('teamId');
		teamName = $(this).data('teamName');
		
		var searchURL = 'http://api.espn.com/v1/sports/football/nfl/teams/' + teamId + '/news?apikey=dbs57muuwwnphn5sbhb9w355';
		$.getJSON(searchURL, function(data) {
			console.log(data);
			appendLocation = $('#teamNews').html('');
			var header = $('<h3>')
				.html('Top news stories for the ' + teamName)
				.appendTo(appendLocation)
			;
			for (var i = 0, j = data.headlines.length; i < j; i++) {
				// Check to see if the article is premium (we only want to show non-premium stories)
				if (data.headlines[i].premium === false) {
					var newDiv = $('<div>')
						// .css('background', 
						.data('linkURL', data.headlines[i].links.mobile.href)
						.click(function() {
							window.location = $(this).data('linkURL');
						})
						.appendTo(teamNews)
					;
					var newsHeading = $('<h4>')
						.html(data.headlines[i].headline)
						.appendTo(newDiv)
					;
					var newsDescrip = $('<p>')
						.html(data.headlines[i].description)
						.appendTo(newDiv)
					;
				}
			}
		});
		// display settings
		$('#teamNews').css('display', 'block');
		$('#teamNewsHeader').html('Top News Stories for the ' + teamName);
	});
});
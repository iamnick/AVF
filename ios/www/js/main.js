$(document).ready(function() {
	// Navigation 
	$('#twitterDiv').click(function() {
		window.location = 'twitterAPI.html';
	});
	$('#espnDiv').click(function() {
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
	
		// Update header with search keywords
		$('h2:last').html('Search Results for "' + q + '"');
	
		$.getJSON(searchURL, function(data) {
			console.log(data);
			// Cycle through results and add them to the page
			appendLocation = $('#searchResults');
			for (var i = 0, j = data.results.length; i < j; i++) {
				if (i%2 === 0) {
					bgColor = '#c5c5c5';
				} else {
					bgColor = '#e5e5e5';
				}
				var newDiv = $('<div>')
					.css('background', bgColor)
					.css('border-radius', '10px')
					.css('padding', '5px 5px 5px 5px')
					.css('margin', '10px 0px 10px 0px')
					.appendTo(appendLocation)
				;
				
				// create div to hold profile pic, username, real name
				var headerDiv = $('<div>')
					.attr('class', 'iconAndText')
					.appendTo(newDiv)
				;
				var profileImg = $('<img>')
					.attr('src', data.results[i].profile_image_url)
					.css('float', 'left')
					.appendTo(headerDiv)
				;
				var userInfo = $('<span>')
					.html(data.results[i].from_user_name + '<br /><i>@' + data.results[i].from_user + '</i>')
					.appendTo(headerDiv)
				;
				var tweetSpan = $('<p>')
					.html(data.results[i].text)
					.appendTo(newDiv)
				;
			}
			var searchTime = $('<span>')
					.html('Search completed in ' + data.completed_in + ' seconds')
					.css('font-style', 'italic')
					.css('font-size', '12px')
					.appendTo(appendLocation)
				;
		});
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
		
		// display settings
		$('#teamNews').css('display', 'block');
		$('#teamNewsHeader').html('Top News Stories for the ' + teamName);
		
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
	});
});
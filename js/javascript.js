'use strict';
/* global $ twttr */

// First we get the user's input from the form
// This function gets called when onKeyUp() is triggered
function getUserInput() {
    // routeName is the name of the HSL route known by humans
    // for example, 23, 6T or 550
    let routeName = $('#routeQueryText').val();

    console.log('got input '+routeName);
    // If we don't empty the results list on every round,
    // it will just keep appending to the end
    $('#results').empty();

    // Get the routes gtfsId, which is how the HSL knows the route
    if (routeName != '') {
        getRoutes(routeName);
    }
}

// Now we send an API call to the HSL API with the input from the user
// To provider the user with suggestions as they type, we get routes
// that have the search term in their shortName
// For example, typing '551' will suggest 551 and 551N
function getRoutes(routeName) {
    console.log('getting routes...');

    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        console.log(xhr.response);
        // Call a helper function to parse the API response
        parseResponse(xhr.response);
    };
    // We request shortName (name known by humans) and gtfsId
    xhr.send(JSON.stringify({query: '{routes(name: "'+
    routeName+'") {shortName gtfsId}}'}));
}

// A helper function which will parse the API response
function parseResponse(response) {
    // Get only the essential part of the response
    let clean = response.data.routes;
    // Iterate through the essential part to get shortNames and gtfsIds
    clean.forEach(function(entry) {
        // console.log(entry.shortName);
        let shortName = entry.shortName;
        let gtfsId = entry.gtfsId;
        // Send the shortName and gtfsId to a function that appends
        // them to the search results
        appendSearchResults(shortName, gtfsId);
    });
}

// This function writes the suggestions to the dropdown search results thing
// We write the shortName as the text on the <li> element and the gtfsId as id
// This way we can send the gtfsId to the backend,since the backend uses gtfsIds
function appendSearchResults(shortName, gtfsId) {
    $('#results').append('<li id="'+gtfsId+
    '" onClick="searchResultClicked(this.id, '+shortName+')"><a href="#">'+
    shortName+'</a></li>');
}

/* $('#routeQueryText').keyup = function() {
    let searchTerm = $('#routeQueryText').val();
    console.log('key up');
    // console.log(searchTerm);
    getRoutes(searchTerm);
}; */

// When the user clicks on a search result, we get the gtfsId and the shortname
// The gtfsId is what we will send to the backend later, while the shortname
// is what we will display to the user, since they'd have no clue
// what the gtfsId actually is
// This function is called by onClick() of the <li> element in search results
function searchResultClicked(clickedId, clickedName) {
    console.log(clickedName);
    console.log(clickedId);

    // We need to empty the results element to make it disappear
    $('#results').empty();
    // $('#subscribeTweetButtonDiv').empty();
    // $('#unsubscribeTweetButtonDiv').empty();

    // Call for a function to create the twitter buttons (and instructions)
    createTweetButtons(clickedId, clickedName);
}

function createTweetButtons(HSLRouteId, HSLRouteName) {
    // $('#subscribeTweetButtonDiv').html('<p id="subscribe"></p>');
    $('#subscribeTweetButtonDiv').html('Subscribe to '+HSLRouteName+' ('+HSLRouteId+') ');
    // $('#unsubscribeTweetButtonDiv').html('<p id="unsubscribe"></p>');
    $('#unsubscribeTweetButtonDiv').html('<br>Unsubscribe from '+HSLRouteName+' ('+HSLRouteId+') ');
    twttr.widgets.createShareButton(
        '/',
        document.getElementById('subscribeTweetButtonDiv'), {
            text: '@mashbot001 subscribe ' + HSLRouteId,
            size: 'medium',
            dnt: true,
        }
    );
    twttr.widgets.createShareButton(
        '/',
        document.getElementById('unsubscribeTweetButtonDiv'), {
            text: '@mashbot001 unsubscribe ' +HSLRouteId,
            size: 'medium',
            dnt: true,
        }
    );
}

twttr.widgets.createShareButton(
    '/',
    document.getElementById('unsubscribeAllTweetButtonDiv'), {
        text: '@mashbot001 unsubscribe all',
        size: 'medium',
        dnt: true,
    }
);

/*
let xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open('POST', 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.onload = function() {
    console.log(xhr.response);
};
// xhr.send(JSON.stringify({query: '{stop(id:"HSL:1140447") { name } }'}));
xhr.send(JSON.stringify({query: '{routes(name: "23") {shortName}}'}));

*/

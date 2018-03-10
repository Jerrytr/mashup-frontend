'use strict';
/* global $ twttr */

function appendSearchResults(shortName, gtfsId) {
    $('#results').append('<li id="'+gtfsId+
    '" onClick="searchResultClicked(this.id)"><a href="#">'+
    shortName+'</a></li>');
}
function parseResponse(response) {
    let clean = response.data.routes;
    clean.forEach(function(entry) {
        console.log(entry.shortName);
        let shortName = entry.shortName;
        let gtfsId = entry.gtfsId;
        appendSearchResults(shortName, gtfsId);
    });
}

function getRoutes(routeName) {
    console.log('getting routes...');

    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        console.log(xhr.response);
        parseResponse(xhr.response);
    };
    xhr.send(JSON.stringify({query: '{routes(name: "'+
    routeName+'") {shortName gtfsId}}'}));
}

function getUserInput() {
    let routeName = $('#routeQueryText').val();
    console.log('got input '+routeName);
    $('#results').empty();
    if (routeName != '') {
        getRoutes(routeName);
    }
}

$('#routeQueryText').keyup = function() {
    let searchTerm = $('#routeQueryText').val();
    console.log('key up');
    console.log(searchTerm);
    getRoutes(searchTerm);
};

function searchResultClicked(clickedId) {
    console.log(clickedId);
    $('#results').empty();
    createTweetButton(clickedId);
}

function createTweetButton(HSLRouteId) {
    twttr.widgets.createShareButton(
        '/',
        document.getElementById('tweetButtonDiv'), {
            text: '@mashbot001 subscribe ' + HSLRouteId,
        }
    );
}

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

/* global $ */

function createButton(shortName, gtfsId) {
    $('#routeButtons').append('<button type="button" id="'+gtfsId+'" onClick="routeButtonClicked(this.id)">'+shortName+'</button>');
}

function parseResponse(response) {
    let clean = response.data.routes;
    clean.forEach(function(entry) {
        console.log(entry.shortName);
        let shortName = entry.shortName;
        let gtfsId = entry.gtfsId;
        createButton(shortName, gtfsId);
    });
    // console.log(clean);
    // clean = clean.sort();
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
    xhr.send(JSON.stringify({query: '{routes(name: "'+routeName+'") {shortName gtfsId}}'}));
}

function getUserInput() {
    let routeName = $('#routeQueryText').val();
    return routeName;
}

$('#sendQueryButton').click(function(event) {
    event.preventDefault();
    let routeName = getUserInput();
    console.log(routeName);
    getRoutes(routeName);
});

function routeButtonClicked(clickedId) {
    console.log(clickedId);
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

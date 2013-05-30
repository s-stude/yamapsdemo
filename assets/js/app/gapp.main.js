(function (window, document, $, ymaps, gapp, undefined) {

    function Main() {
        var
            mapOnPage,

            clientsArrayToVerify = [],
            clientsArrayCache = [],
            clientsClusterer,

            opponentsClusterer,
            opponentsArrayToVerify = [],
            opponentsArrayToCache = [],

            modifyClientsOnMap = function (clientPoint) {
                var existingItems = $.grep(clientsArrayToVerify, function (elem, index) {
                    return elem.properties.get('text') === clientPoint.properties.get('text');
                });

                if (existingItems.length === 0) {
                    // TODO: Exclude cache and find out how to search in clusterer
                    clientsArrayToVerify.push(clientPoint);
                    clientsArrayCache.push(clientPoint);
                    clientsClusterer.add(clientPoint);
                }
            },
            modifyOpponentsOnMap = function (opponentPoint) {
                var existingItems = $.grep(opponentsArrayToVerify, function (elem, index) {
                    return elem.properties.get('text') === opponentPoint.properties.get('text');
                });

                if (existingItems.length === 0) {
                    // TODO: Exclude cache and find out how to search in clusterer
                    opponentsArrayToVerify.push(opponentPoint);
                    opponentsArrayToCache.push(opponentPoint);
                    opponentsClusterer.add(opponentPoint);
                }
            },
            createMap = function (centerPosition) {
                var
                    refreshButton,
                    clientsButton,
                    opponentsButton,
                    buttonsToolBar = new ymaps.control.ToolBar();

                mapOnPage = new ymaps.Map("map", {
                    center:centerPosition,
                    zoom:14
                });

                mapOnPage.geoObjects.add(
                    new ymaps.Placemark(
                        centerPosition,
                        {
                            iconContent:"Y",
                            hintContent:"I'm here",
                            balloonContent:"My location"
                        }
                    )
                );

                mapOnPage.controls.add('smallZoomControl');


                // create clusterer
                clientsClusterer = new ymaps.Clusterer({
                    preset:"twirl#invertedDarkgreenClusterIcons"
                });

                opponentsClusterer = new ymaps.Clusterer({
                    preset:"twirl#invertedRedClusterIcons"
                });

                mapOnPage.geoObjects.add(clientsClusterer);
                mapOnPage.geoObjects.add(opponentsClusterer);

                // Create Clients button
                refreshButton = new ymaps.control.Button({
                    data:{
                        image:'assets/img/view_refresh.png',
                        title:'Refresh'
                    }
                }, {
                    selectOnClick:false
                });

                clientsButton = new ymaps.control.Button('Clients');
                clientsButton.events.add('select', function () {
                    var i;
                    for (i = 0; i < clientsArrayCache.length; i++) {
                        modifyClientsOnMap(clientsArrayCache[i]);
                    }
                });

                clientsButton.events.add('deselect', function () {
                    clientsClusterer.remove(clientsArrayToVerify);
                    clientsArrayToVerify = [];
                });

                clientsButton.select();

                opponentsButton = new ymaps.control.Button('Opponents');
                opponentsButton.events.add('select', function () {
                    var i;
                    for (i = 0; i < opponentsArrayToCache.length; i++) {
                        modifyOpponentsOnMap(opponentsArrayToCache[i]);
                    }
                });

                opponentsButton.events.add('deselect', function () {
                    opponentsClusterer.remove(opponentsArrayToVerify);
                    opponentsArrayToVerify = [];
                });

                opponentsButton.select();

                refreshButton.events.add('click', function () {
                    console.log('Refresh: begin');
                    var clientsInfoPromise = gapp.request.getClients();
                    var opponentsInfoPromise = gapp.request.getOpponents();

                    $.when(clientsInfoPromise).then(function (clients) {
                        addClientsToMap(clients);
                    }).fail(function (error) {
                            alert(error);
                        });

                    $.when(opponentsInfoPromise).then(function (opponents) {
                        addOpponentsToMap(opponents);
                    }).fail(function (error) {
                            alert(error);
                        });
                });

                buttonsToolBar.add(refreshButton);
                buttonsToolBar.add(clientsButton);
                buttonsToolBar.add(opponentsButton);
                mapOnPage.controls.add(buttonsToolBar);
            },
            createClientPoint = function (client) {
                console.log('Client geocode: begin');

                var geocodeAddress = ymaps.geocode(client.address, { results:1});

                geocodeAddress.then(
                    function (res) {
                        console.log('Client geocode: end');

                        var first = res.geoObjects.get(0),
                            coords = first.geometry.getCoordinates(); // TODO: save to storage;

                        first.properties.set('balloonContentHeader', client.client);
                        first.properties.set('balloonContentBody', client.manager);

                        first.options.set('preset', 'twirl#darkgreenDotIcon');

                        modifyClientsOnMap(first);
                    });
            },
            createOpponentPoint = function (opponent) {
                console.log('Opponent geocode: begin');

                var geocodeAddress = ymaps.geocode(opponent.address, {results:1});

                geocodeAddress.then(function (res) {
                    console.log('Opponent geocode: end');

                    var first = res.geoObjects.get(0),
                        coords = first.geometry.getCoordinates();

                    first.properties.set('balloonContentHeader', opponent.opponent);
                    first.properties.set('balloonContentBody', opponent.address);

                    first.options.set('preset', 'twirl#redDotIcon');

                    modifyOpponentsOnMap(first);
                });
            },
            addClientsToMap = function (clients) {
                console.log('Adding clients to map');

                var i, client;

                for (i = 0; i < clients.client_list.length; i++) {
                    client = clients.client_list[i];
                    createClientPoint(client);
                }
            },
            addOpponentsToMap = function (opponents) {
                console.log('Adding opponents to map');

                var i, opponent;

                for (i = 0; i < opponents.opponent_list.length; i++) {
                    opponent = opponents.opponent_list[i];
                    createOpponentPoint(opponent);
                }
            },

            initMap = function () {
                console.log('Map initialization: begin');

                var positionPromise = gapp.geolocator.getCurrentPosition();
                var clientsInfoPromise = gapp.request.getClients();
                var opponentsInfoPromise = gapp.request.getOpponents();

                $.when(positionPromise, clientsInfoPromise, opponentsInfoPromise)
                    .then(function (currentPosition, clients, opponents) {
                        createMap(currentPosition);
                        addClientsToMap(clients);
                        addOpponentsToMap(opponents);
                    })
                    .fail(function (error) {
                        alert(error.statusText);
                    });
            };

        return {
            onInit:initMap
        };
    }

    gapp.main = new Main();

})(window, document, jQuery, ymaps, gapp || {});


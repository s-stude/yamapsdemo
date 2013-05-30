(function (window, document, $, ymaps, gapp, undefined) {

    function Main() {
        var mapOnPage,
            clientsArrayToVerify = [],
            clientsArrayCache = [],
            clientsClusterer,
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

                mapOnPage.geoObjects.add(clientsClusterer);

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
                    for(i = 0; i < clientsArrayCache.length; i++){
                        modifyClientsOnMap(clientsArrayCache[i]);
                    }
                });

                clientsButton.events.add('deselect', function () {
                    clientsClusterer.remove(clientsArrayToVerify);
                    clientsArrayToVerify = [];
                });

                clientsButton.select();

                opponentsButton = new ymaps.control.Button('Opponents');

                refreshButton.events.add('click', function () {
                    var clientsInfoPromise = gapp.request.getClients();
                    $.when(clientsInfoPromise)
                        .then(function (clients) {
                            addClientsToMap(clients);
                        })
                        .fail(function (error) {
                            alert(error);
                        });
                });

                buttonsToolBar.add(refreshButton);
                buttonsToolBar.add(clientsButton);
                buttonsToolBar.add(opponentsButton);
                mapOnPage.controls.add(buttonsToolBar);
            },
            createClientPoint = function (client, clientsClusterer) {
                console.log('Geocoding - ' + client.client);

                var geocodeAddress = ymaps.geocode(client.address, { results:1});

                geocodeAddress.then(
                    function (res) {
                        console.log('Geocoded - ' + client.client);

                        var first = res.geoObjects.get(0),
                            coords = first.geometry.getCoordinates(); // TODO: save to storage;

                        gapp.appStorage.setValue(client.address, coords);

                        first.properties.set('balloonContentHeader', client.client);
                        first.properties.set('balloonContentBody', client.manager);

                        first.options.set('preset', 'twirl#greenDotIcon');

                        modifyClientsOnMap(first);
                    });
            },
            addClientsToMap = function (clients) {
                var i, client, clientsClusterer = new ymaps.Clusterer({
                    preset:"twirl#invertedDarkgreenClusterIcons"
                });


                for (i = 0; i < clients.client_list.length; i++) {
                    client = clients.client_list[i];

                    console.log('Iterating - ' + client.client);
                    createClientPoint(client, clientsClusterer);
                }
            },
            initMap = function () {

                var positionPromise = gapp.geolocator.getCurrentPosition();
                var clientsInfoPromise = gapp.request.getClients();

                $.when(positionPromise, clientsInfoPromise)
                    .then(function (currentPosition, clients) {
                        createMap(currentPosition);
                        addClientsToMap(clients);
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


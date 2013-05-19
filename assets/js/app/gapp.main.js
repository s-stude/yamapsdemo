(function (window, document, $, ymaps, gapp, undefined) {

    function Main() {
        var createMap = function (centerPosition) {
                var yaMap,
                    mapDeferred = $.Deferred();

                debugger;

                yaMap = new ymaps.Map("map", {
                    center:centerPosition,
                    zoom:14
                });

                yaMap.geoObjects.add(
                    new ymaps.Placemark(
                        centerPosition,
                        {
                            iconContent:"Я",
                            hintContent:"Вы тут",
                            balloonContent:"Ваше местоположение"
                        }
                    )
                );

                yaMap.controls.add('smallZoomControl');

                mapDeferred.resolve(yaMap);

                return mapDeferred.promise();
            },
            createPoint = function (client, yaMap) {
                console.log('Geocoding - ' + client.client);

                addressGeocoder = ymaps.geocode(client.address, { results:1});

                addressGeocoder.then(
                    function (res) {
                        console.log('Geocoded - ' + client.client);

                        var first = res.geoObjects.get(0),
                            coords = first.geometry.getCoordinates(); // TODO: save to storage;

                        first.properties.set('balloonContentHeader', client.client);
                        first.properties.set('balloonContentBody', client.manager);

                        first.options.set('preset', 'twirl#redDotIcon');

                        yaMap.geoObjects.add(first);
                    });
            },
            initMap = function () {

                var positionPromise = gapp.geolocator.getCurrentPosition();

                var createdMapPromise = positionPromise.then(function (currentCenter) {
                    return createMap(currentCenter);
                });

                var clientsInfoPromise = gapp.request.getClients();

                $.when(createdMapPromise, clientsInfoPromise)
                    .then(function (yaMap, clients) {
                        var i;

                        for (i = 0; i < clients.client_list.length; i++) {
                            var client = clients.client_list[i];

                            console.log('Iterating - ' + client.client);
                            createPoint(client, yaMap);
                        }
                    })
                    .fail(function (error) {
                        debugger;
                        alert(error);
                    });

                /*
                 *
                 * центр - асинк
                 * загрузить список адресов - асинк
                 * геокодирование - асинк
                 *
                 * */


            };


        return {
            onInit:initMap
        };
    }

    gapp.main = new Main();

})(window, document, jQuery, ymaps, gapp || {});


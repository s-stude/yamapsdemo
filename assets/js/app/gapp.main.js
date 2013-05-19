(function (window, document, $, ymaps, gapp, undefined) {

    function Main() {
        var createMap = function (centerPosition) {
                var mapOnPage;

                mapOnPage = new ymaps.Map("map", {
                    center:centerPosition,
                    zoom:14
                });

                mapOnPage.geoObjects.add(
                    new ymaps.Placemark(
                        centerPosition,
                        {
                            iconContent:"Я",
                            hintContent:"Вы тут",
                            balloonContent:"Ваше местоположение"
                        }
                    )
                );

                mapOnPage.controls.add('smallZoomControl');

                return mapOnPage;
            },
            createPoint = function (client, mapOnPage) {
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

                        mapOnPage.geoObjects.add(first);
                    });
            },
            initMap = function () {

                var positionPromise = gapp.geolocator.getCurrentPosition();
                var clientsInfoPromise = gapp.request.getClients();

                $.when(positionPromise, clientsInfoPromise)
                    .then(function (currentPosition, clients) {
                        var i,
                            mapOnPage = createMap(currentPosition);

                        for (i = 0; i < clients.client_list.length; i++) {
                            var client = clients.client_list[i];

                            console.log('Iterating - ' + client.client);
                            createPoint(client, mapOnPage);
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


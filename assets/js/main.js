(function (window, document, $, ymaps, gapp, undefined) {

    function Module() {
        var yaMap,
            onPositionDetected = function (currentPosition) {
                yaMap = new ymaps.Map("map", {
                    center:currentPosition,
                    zoom:14
                });

                yaMap.geoObjects.add(
                    new ymaps.Placemark(
                        currentPosition,
                        {
                            iconContent:"Я",
                            hintContent:"Вы тут",
                            balloonContent:"Ваше местоположение"
                        }
                    )
                );

                yaMap.controls.add('smallZoomControl');

                var myGeocoder = ymaps.geocode('Пуповкина 281', { results: 100});
                myGeocoder.then(
                    function (res) {
                        var coords = res.geoObjects.get(0).geometry.getCoordinates();

                        yaMap.geoObjects.add(res.geoObjects);
                    });
            },
            initMap = function(){
                gapp.geolocation.getCurrentPosition(onPositionDetected);
            };

        return {
            onInit:initMap
        };
    }

    gapp.main = new Module();

})(window, document, jQuery, ymaps, gapp || {});


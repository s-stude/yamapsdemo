(function (window, document, ymaps, gapp, undefined) {

    function Module(){
        var yaMap,
            isGeolocationApiSupported = (function () {
                return 'geolocation' in window.navigator;
            })(),

            onPositionSearchComplete,

            getCurrentPositionCallback = function (position) {
                onPositionSearchComplete([position.coords.latitude, position.coords.longitude]);
            },

            errorCallback = function(err){
                // nothing to handle yet. Falling back to YA Map API
                onPositionSearchComplete([ymaps.geolocation.latitude, ymaps.geolocation.longitude]);
            },

            getCurrentPosition = function (positionSearchCompleteCallback) {
                onPositionSearchComplete = positionSearchCompleteCallback;

                if (isGeolocationApiSupported) {
                    window.navigator.geolocation.getCurrentPosition(getCurrentPositionCallback, errorCallback);
                } else{
                    onPositionSearchComplete([ymaps.geolocation.latitude, ymaps.geolocation.longitude]);
                }
            };

        return {
            isGeolocationApiSupported:isGeolocationApiSupported,
            getCurrentPosition:getCurrentPosition
        };
    }

    gapp.geolocation = new Module();

})(window, document, ymaps, gapp || {});
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


/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 5/16/13
 * Time: 4:52 PM
 * To change this template use File | Settings | File Templates.
 */

/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 5/16/13
 * Time: 4:51 PM
 * To change this template use File | Settings | File Templates.
 */

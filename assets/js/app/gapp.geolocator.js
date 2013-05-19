(function (window, document, $, gapp, undefined) {

    function GeoLocator(){
        var d = $.Deferred(),
            isGeolocationApiSupported = (function () {
                return 'geolocation' in window.navigator;
            })(),

            getCurrentPositionCallback = function (position) {
                d.resolve([position.coords.latitude, position.coords.longitude]);
            },

            errorCallback = function(err){
                // nothing to handle yet. Falling back to YA Map API
                d.resolve([ymaps.geolocation.latitude, ymaps.geolocation.longitude]);
            },

            getCurrentPosition = function () {
                if (isGeolocationApiSupported) {
                    window.navigator.geolocation.getCurrentPosition(getCurrentPositionCallback, errorCallback);
                } else{
                    d.resolve([ymaps.geolocation.latitude, ymaps.geolocation.longitude]);
                }

                return d.promise();
            };

        return {
            isGeolocationApiSupported:isGeolocationApiSupported,
            getCurrentPosition:getCurrentPosition
        };
    }

    gapp.geolocator = new GeoLocator();

})(window, document, jQuery, gapp || {});
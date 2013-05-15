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
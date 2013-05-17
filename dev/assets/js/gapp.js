/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 5/17/13
 * Time: 7:44 PM
 * To change this template use File | Settings | File Templates.
 */
(function (window, document, $, gapp, undefined) {

    function Module() {

        var token,
            loginCallback = function (authResult) {
                $('.error-message').addClass('hidden');
                if(authResult.error){
                   switch(authResult.error.code){
                       case 401:
                           $('#unauth').removeClass('hidden');
                           break;
                       case 500:
                           $('#invalidreq').removeClass('hidden');
                           break;
                   }
                }

                token = authResult.access_token;
                gapp.router.indexPage();
            },
            login = function () {
                var $login = $('.input_login'),
                    $password = $('.input_password'),

                    loginVal = $login.val(),
                    passwordVal = $password.val(),

                    $loginContainer = $('.form-container-login'),
                    $passwordContainer = $('.form-container-password');

                $loginContainer.removeClass('form-container__error');
                $passwordContainer.removeClass('form-container__error');

                if (loginVal === '') {
                    $loginContainer.addClass('form-container__error');
                    return;
                }
                if (passwordVal === '') {
                    $passwordContainer.addClass('form-container__error');
                    return;
                }


                gapp.request.authenticate(loginVal, passwordVal, loginCallback);
            };

        return {
            login:login
        };
    }

    window.gapp.auth = new Module();


})(window, document, jQuery, gapp || {});
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

(function (window, document, $, gapp, undefined) {

    function Module() {

        var authenticate = function (login, pasword, authCallback) {

            var unAuthUserError = {
                error:{
                    code:401,
                    error_message:"User unauthorized"
                }
            };

            var incorrectParamsRequestError = {
                error:{
                    code:500,
                    error_message:"Does not has all required fields"
                }
            };

            var successResult = {
                access_token : 'alr9wUGYBf4783nJSByfb4'
            };

            setTimeout(authCallback(successResult), 2000);
        };

        return {
            authenticate:authenticate
        };
    }

    window.gapp.request = new Module();

})(window, document, jQuery, gapp || {});


/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 5/17/13
 * Time: 9:29 PM
 * To change this template use File | Settings | File Templates.
 */

(function (window, document, gapp, undefined) {

    function Module() {

        var loginPageUrl = '/login.html',
            indexPageUrl = '/index.html',
            loginPage = function () {
                document.location = loginPageUrl;
            },
            indexPage = function () {
                document.location = indexPageUrl;
            };

        return {
            loginPage:loginPage,
            indexPage:indexPage
        };

    }

    window.gapp.router = new Module();

})(window, document, gapp || {});
/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 5/16/13
 * Time: 4:51 PM
 * To change this template use File | Settings | File Templates.
 */

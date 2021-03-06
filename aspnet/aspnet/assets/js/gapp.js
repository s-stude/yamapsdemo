/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 5/17/13
 * Time: 10:39 PM
 * To change this template use File | Settings | File Templates.
 */

(function (window, gapp, undefined) {

    window.gapp.Client = function () {
        var manager,
            client,
            address;

        return {
            manager:manager,
            client:client,
            address:address
        };
    };

})(window, gapp || {});

/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 5/16/13
 * Time: 4:51 PM
 * To change this template use File | Settings | File Templates.
 */

(function(window, document, gapp, undefined){

    function AppStorage(){

        var getValue = function(key){
                localStorage.getItem(key);
            },
            setValue = function(key, value){
                localStorage.setItem(key, value);
            };

        return {
            getValue: getValue,
            setValue: setValue
        };

    }

    window.gapp.appStorage = new AppStorage();

})(window, document, gapp || {});
/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 5/17/13
 * Time: 7:44 PM
 * To change this template use File | Settings | File Templates.
 */
(function (window, document, $, gapp, undefined) {

    function Auth() {

        var token = function (tokenToSave) {
                if (tokenToSave) {
                    gapp.appStorage.setValue('access_token', tokenToSave);
                }

                return gapp.appStorage.getValue('access_token');
            },
            navigateIndexPageOrError = function (authResultPlain) {

                var authResult = authResultPlain; // TODO: For debug
//                var authResult = JSON.parse(authResultPlain);

                if (authResult.error) {
                    switch (authResult.error.code) {
                        case 401:
                            $('#unauth').removeClass('hidden');
                            break;
                        case 500:
                            $('#invalidreq').removeClass('hidden');
                            break;
                    }
                    return;
                }

                token(authResult.access_token);

                gapp.router.indexPage();
            },
            showLogin404Message = function(){
                $('#desthost404').removeClass('hidden');
            },
            showCustomLoginError = function(errorCode, errorText){
                $('#customMessage').text(errorCode + ' ' + errorText);
                $('#customMessage').removeClass('hidden');
            },
            handleLogin = function () {
                var $login = $('.input_login'),
                    $password = $('.input_password'),

                    loginVal = $login.val(),
                    passwordVal = $password.val(),

                    $loginContainer = $('.form-container-login'),
                    $passwordContainer = $('.form-container-password');

                $('.error-message').addClass('hidden');

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

                gapp.request.authenticate(loginVal, passwordVal)
                    .then(function (authResult) {
                        navigateIndexPageOrError(authResult);
                    })
                    .fail(function (error) {
                        if(error.status === 404){
                            showLogin404Message();
                        } else {
                            showCustomLoginError(error.status, error.statusText);
                        }
                    });
            };

        return {
            access_token:token,
            login:handleLogin
        };
    }

    window.gapp.auth = new Auth();


})(window, document, jQuery, gapp || {});
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
(function (window, document, $, ymaps, gapp, undefined) {

    function Main() {
        var
            createMap = function (centerPosition) {
                var
                    mapOnPage,
                    refreshButton,
                    buttonsToolBar = new ymaps.control.ToolBar();

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

                // Create Clients button
                refreshButton = new ymaps.control.Button({
                    data: {
                        image: 'assets/img/view_refresh.png',
                        title: 'Обновить точки на карте'
                    }
                },{
                    selectOnClick: false
                });

//                refreshButton.events.add('select', function () {
//                    clientsClusterer.add(friendsGeoObjects);
//                });
//                clientsButton.events.add('deselect', function () {
//                    clientsClusterer.remove(friendsGeoObjects);
//                });

                buttonsToolBar.add(refreshButton);
                mapOnPage.controls.add(buttonsToolBar);

                return mapOnPage;
            },
            createPoint = function (client, mapOnPage) {
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


/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 5/16/13
 * Time: 4:52 PM
 * To change this template use File | Settings | File Templates.
 */

(function (window, document, $, gapp, undefined) {

    function Request() {

        var loginUrl = '/dmsbclient/auth',
            clientsUrl = '/dmsbclient/clientinfo',
            authenticate = function (login, password, authCallback) {
                /*
                 *
                 * POST /dmsbclient/auth
                 *
                 * PARAMS:
                 * login
                 * password
                 *
                 * */

                var d = $.Deferred();

                var ajaxPost = $.ajax({
                    url:loginUrl,
                    data:JSON.stringify({login:login, password:password}),
                    type:'POST' // TODO: This should be POST
                }).done(function (result) {
                    debugger;
                    d.resolve(result);
                }).fail(function (error) {
                    debugger;
                    d.reject(error);
                });

                return d.promise();
            },
            getClients = function () {
                var d = $.Deferred();

                $.ajax({
                    url: clientsUrl,
                    data: { access_token : gapp.auth.access_token() },
                    type: "POST" // TODO: POST in PROD
                }).done(function(result){
                        d.resolve(result);
                    }).fail(function(error){
                        d.reject(error);
                    });

                return d.promise();
            };

        return {
            authenticate:authenticate,
            getClients:getClients
        };
    }

    window.gapp.request = new Request();

})(window, document, jQuery, gapp || {});


/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 5/17/13
 * Time: 9:29 PM
 * To change this template use File | Settings | File Templates.
 */

(function (window, document, gapp, undefined) {

    function Router() {

        var loginPageUrl = 'login.html',
            indexPageUrl = 'index.html',
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

    window.gapp.router = new Router();

})(window, document, gapp || {});
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
                return localStorage.getItem(key);
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


/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 5/16/13
 * Time: 4:52 PM
 * To change this template use File | Settings | File Templates.
 */

(function (window, document, $, gapp, undefined) {

    function Request() {

        var
            loginUrl = '/dmsbclient/auth',
            clientsUrl = '/dmsbclient/clientinfo',
            opponentsUrl = '/dmsbclient/opponentinfo',

            authenticate = function (login, password, authCallback) {
                var d = $.Deferred();

                var ajaxPost = $.ajax({
                    url:loginUrl,
                    data:{login:login, password:password},
                    type:'POST' // TODO: This should be POST
                }).done(function (result) {
                        d.resolve(result);
                    }).fail(function (error) {
                        d.reject(error);
                    });

                return d.promise();
            },

            getRequestedInfo = function (url) {
                var
                    access_token = gapp.auth.access_token(),
                    d = $.Deferred();

                var ajax = $.ajax({
                    url:url,
                    data:{ access_token:access_token },
                    type:"POST"
                });

                ajax.done(function (result) {
                    d.resolve(result);
                });

                ajax.fail(function (error) {
                    d.reject(error);
                });

                return d.promise();
            },
            getClients = function () {
                return getRequestedInfo(clientsUrl);
            },

            getOpponents = function () {
                return getRequestedInfo(opponentsUrl);
            };

        return {
            authenticate:authenticate,
            getClients:getClients,
            getOpponents:getOpponents
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
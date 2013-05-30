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


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
                var d = $.Deferred();

                var ajaxPost = $.ajax({
                    url:loginUrl,
                    data: {login:login, password:password},
                    type:'POST' // TODO: This should be POST
                }).done(function (result) {
                    d.resolve(result);
                }).fail(function (error) {
                    d.reject(error);
                });

                return d.promise();
            },
            getClients = function () {
                var d = $.Deferred();

                var access_token = gapp.auth.access_token();
                $.ajax({
                    url: clientsUrl,
                    data: { access_token : access_token },
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


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

            setTimeout(authCallback(unAuthUserError), 2000);
        };

        return {
            authenticate:authenticate
        };
    }

    window.gapp.request = new Module();

})(window, document, jQuery, gapp || {});


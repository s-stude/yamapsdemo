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
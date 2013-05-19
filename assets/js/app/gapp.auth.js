/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 5/17/13
 * Time: 7:44 PM
 * To change this template use File | Settings | File Templates.
 */
(function (window, document, $, gapp, undefined) {

    function Auth() {

        var token,
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

                token = authResult.access_token;

                gapp.router.indexPage();
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
                        debugger;
                        alert(error);
                    });
            };

        return {
            access_token : token,
            login:handleLogin
        };
    }

    window.gapp.auth = new Auth();


})(window, document, jQuery, gapp || {});
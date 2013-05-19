/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 5/17/13
 * Time: 9:29 PM
 * To change this template use File | Settings | File Templates.
 */

(function (window, document, gapp, undefined) {

    function Router() {

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

    window.gapp.router = new Router();

})(window, document, gapp || {});
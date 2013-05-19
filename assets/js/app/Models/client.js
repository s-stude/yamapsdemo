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

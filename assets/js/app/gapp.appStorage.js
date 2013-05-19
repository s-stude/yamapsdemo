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
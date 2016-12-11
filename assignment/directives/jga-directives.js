/**
 * Created by Ankit on 10/31/2016.
 */
(function () {
    angular
        .module("sortableDirectives", [])
        .directive("sortable", sortable);

    function sortable() {
        console.log("hello from sortable");
    }
})();
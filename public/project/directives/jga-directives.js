/**
 * Created by Ankit on 10/31/2016.
 */
(function () {
    angular
        .module("sortableDirectives", [])
        .directive("sortable", sortable);

    function sortable($http, WidgetService) {
        console.log("hello from sortable");
        var container = $(".sortable");
        container.sortable({
            axis: 'y'
            });

        var start = 100;
        var end = 1000;
        WidgetService
            .reorderWidget("5826ab2ac5af101544f6cbc1", start , end)
            .success(function (widget) {
                console.log("Success: " + widget);
            })
            .error(function (err) {
                console.log(err);
            });
        // now we need to overwrite the widgets in the server with the new order of the widgets which
        // is represented by container.
    }
})();
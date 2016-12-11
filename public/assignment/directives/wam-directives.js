(function () {
    angular
        .module("wamDirectives", [])
        .directive("wamSortable", wamSortable);

    function wamSortable() {

        function linker(scope, element, attributes) {
            var start = -1;
            var end = -1;
            $("wam-sortable")
                .sortable({
                    axis: 'y',
                    start: function (event, ui) {
                        start = $(ui.item).index()
                    },
                    stop: function (event, ui) {
                        end = $(ui.item).index()
                        scope.sortController.sort(start, end);
                    }
                });
        }
        return {
            scope       : {},
            link        : linker,
            controller  : sortController,
            controllerAs: 'sortController'
        }
    }

    function sortController($routeParams, WidgetService) {
        var vm = this;
        vm.sort = sort;
        var pageId = $routeParams["pid"];

        function sort(start, end) {
            WidgetService.reorderWidget(pageId, start, end)
        }
    }
})();
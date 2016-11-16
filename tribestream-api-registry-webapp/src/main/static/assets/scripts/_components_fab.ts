module _components_fab {

    angular
        .module('website-components-fab')
        .directive('tomiFab', tomiFab)
        .directive('tomiFabTrigger', tomiFabTrigger)
        .directive('tomiFabActions', tomiFabActions);

    function tomiFab()
    {
        return {
            restrict: 'E',
            templateUrl: require('../templates/component_fab.jade'),
            scope: true,
            link: link,
            controller: tomiFabController,
            controllerAs: 'tomiFab',
            bindToController: true,
            transclude: true,
            replace: true
        };

        function link(scope, element, attrs, ctrl)
        {
            attrs.$observe('fabDirection', function(newDirection)
            {
                ctrl.setFabDirection(newDirection);
            });
        }
    }

    function tomiFabController()
    {
        var tomiFab = this;

        tomiFab.setFabDirection = setFabDirection;

        function setFabDirection(_direction)
        {
            tomiFab.fabDirection = _direction;
        }
    }

    function tomiFabTrigger()
    {
        return {
            restrict: 'E',
            require: '^tomiFab',
            templateUrl: require('../templates/component_fab-trigger.html'),
            transclude: true,
            replace: true
        };
    }

    function tomiFabActions()
    {
        return {
            restrict: 'E',
            require: '^tomiFab',
            templateUrl: require('../templates/component_fab-actions.html'),
            link: link,
            transclude: true,
            replace: true
        };

        function link(scope, element, attrs, ctrl)
        {
            scope.parentCtrl = ctrl;
        }
    }
}
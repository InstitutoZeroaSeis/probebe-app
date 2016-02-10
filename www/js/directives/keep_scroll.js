angular.module('proBebe.directives').directive('keepScroll', [
  '$state', '$timeout', 'ScrollPositions', '$ionicScrollDelegate', function($state, $timeout, ScrollPositions, $ionicScrollDelegate) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$on('$stateChangeStart', function() {
          return ScrollPositions[$state.current.name] = $ionicScrollDelegate.getScrollPosition();
        });
        return $timeout(function() {
          var offset;
          offset = ScrollPositions[$state.current.name];
          console.log(offset)
          console.log(ScrollPositions['maintain_scroll'])
          if (offset != null && ScrollPositions['maintain_scroll']) {
            return $ionicScrollDelegate.scrollTo(offset.left, offset.top);
          }
        });
      }
    };
  }
]);

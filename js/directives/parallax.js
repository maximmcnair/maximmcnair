angular.module('maximmcnairApp')
.directive('scrollPosition', function($window) {
  return {
    scope: {
      scroll: '=scrollPosition'
    },
    link: function(scope, element, attrs) {
      var windowEl = angular.element($window)
      var parallax = function (topHeight, windowPosition, inertia){
        return topHeight - windowPosition / inertia;
      }
      var handler = function() {
        var scrollTop = windowEl.scrollTop()
        if(scrollTop < -1 && scrollTop > -10){
          // console.log( 'a', '1.000' + Math.abs(scrollTop) )
          element.find('img').css(
            'transform', 'scale(1.0' + Math.abs(scrollTop) + ')'
          )
        } else if (scrollTop < -9){
          // console.log( 'b', '1.00' + Math.abs(scrollTop) )
          element.find('img').css(
            'transform', 'scale(1.' + Math.abs(scrollTop) + ')'
          )
        } else {
          element.find('img').css(
            'transform', 'scale(1) translate3d(0, ' + parallax(0, scrollTop, 3) + 'px, 0)'
          )
        }
      }
      windowEl.on('scroll', scope.$apply.bind(scope, handler))
      handler()
    }
  }
})
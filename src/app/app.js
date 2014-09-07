angular.module( 'internetAlarm', [
  'templates-app',
  'templates-common',
  'internetAlarm.home',
  'internetAlarm.about',
  'internetAlarm.alarm',
  'ui.router',
  'ngStorage'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $rootScope, $scope, $localStorage, $interval, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Internet Alarm' ;
    }
  });


        /**
         * Time format settings and save into local storage
         */
        $rootScope.toggleTimeFormat = $localStorage.toggleTimeFormat;
        function updateTime() {
            $rootScope.now = new Date();
        }

        $rootScope.$watch('toggleTimeFormat', function() {
            if($rootScope.toggleTimeFormat) {
                $rootScope.timeFormat = 'HH:mm:ss';
                $rootScope.shortTimeFormat = 'HH:mm';
            }
            else {
                $rootScope.timeFormat = 'hh:mm:ss a';
                $rootScope.shortTimeFormat = 'hh:mm a';
            }
            $localStorage.toggleTimeFormat = $scope.toggleTimeFormat;

            updateTime();
        });

        $interval(updateTime, 1000);
})

;


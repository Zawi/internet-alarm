/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */

angular.module( 'internetAlarm.home', [
  'ui.router',
  'internetAlarm.alarm',
  'ngStorage'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
    $stateProvider.state( 'home', {
        url: '/home',
        views: {
            "main": {
                controller: 'HomeCtrl',
                templateUrl: 'home/home.tpl.html'
            }
        },
        data:{ pageTitle: 'Home' }
    });
})


.directive('timeRemaining', ['$interval','dateFilter','Alarm', function($interval, dateFilter, Alarm) {
    return function(scope, element, attrs) {
        var format = 'HH:mm',
            timeoutId;
        function updateTime() {
            if(typeof scope.alarm.getTimeRemaining() !== 'undefined') {
                element.text(dateFilter(scope.alarm.getTimeRemaining(), format));
            }
            else {
                element.text('');
            }
        }

        updateTime();
        // start the UI update process; save the timeoutId for canceling
        timeoutId = $interval(function() {
            updateTime(); // update DOM
        }, 60000);

        scope.$watch('alarm.enabled',function() {
            updateTime();
        });
//      function openWindow(url) {
//          scope.currentAlarmURL = url;
//      }
//
//        scope.alarms.forEach(function(element, index) {
//            var timeRemaining = element.getTimeRemaining();
//            if(typeof timeRemaining !== 'undefined' && timeRemaining.getTime() < 3600) {
//                openWindow(element.url);
//            }
//        });
    };
    }
])

/**
 * Controller for our route.
 */

.controller( 'HomeCtrl',
function HomeController($scope, $rootScope, $localStorage, TestAlarms, Alarm, $interval) {
    $scope.alarms = [];

    /**
     * Retrieve alarm array from local storage and store changes into it
     */
    $scope.alarms = $localStorage.alarms || TestAlarms;
    $scope.alarms.forEach(
        function(element,index) {
            var time = new Date(element.time);
            // $localStorage keeps an Object, but we need an Alarm
            $scope.alarms.splice(index,1,new Alarm(time.getHours(),time.getMinutes(),element.url, element.enabled));
        });

    $scope.$watch('alarms', function() {
        $localStorage.alarms = $scope.alarms;
    });

    $scope.$watch(
        function() {return angular.toJson($localStorage);},
        function() {$scope.alarms = $localStorage.alarms;}
    );


    /**
     * Alarm array operations
     */
    $scope.addAlarm = function () {
        $scope.alarms.push(
            new Alarm(
                typeof $scope.newAlarmHour === 'number' ? $scope.newAlarmHour : 0,
                typeof $scope.newAlarmMinute === 'number' ? $scope.newAlarmMinute : 0,
                $scope.newAlarmURL,
                true
            )
        );
        $scope.newAlarmHour = '';
        $scope.newAlarmMinute = '';
        $scope.newAlarmURL = '';
    };

    $scope.removeAlarm = function (alarm) {
        $scope.alarms.splice($scope.alarms.indexOf(alarm),1);
    };


    /**
     * Operations when ringing
     */
    function alarmsRinging () {
        $scope.alarms.forEach(function(element,index) {
            if(element.enabled && element.isRinging()) {
                window.open(element.url);
            }
        });
    }

    $interval(alarmsRinging, 60000);

//    Pop-up control test
//    var popUp = window.open('', 'pop-up check', 'width=1000, height=700, left=24, top=24, scrollbars, resizable');
//    if (popUp == null || typeof(popUp)=='undefined') {
//        alert('Please disable your pop-up blocker and click the "Open" link again.');
//    }
//    else {
//        popUp.close();
//    }

    /**
     * Alarm live edit
     */
    $scope.editingAlarms = [];
    $scope.toggleEditingAlarm = function(alarm) {
        var index = $scope.alarms.indexOf(alarm);
        if(typeof $scope.editingAlarms[index] === 'undefined') {
            $scope.editingAlarms[index] = true;
        }
        else {
            $scope.editingAlarms[index] = !$scope.editingAlarms[index];
        }

        if($scope.editingAlarms[index]) {
            alarm.copy = {
                hours: alarm.time.getHours(),
                minutes: alarm.time.getMinutes(),
                url: alarm.url
            };
        }
        else {
            alarm.copy = undefined;
        }

    };
    $scope.isEditingAlarm = function(alarm) {
        var index = $scope.alarms.indexOf(alarm);
        if(typeof $scope.editingAlarms[index] === 'undefined' ) {
            return false;
        }
        return $scope.editingAlarms[index];
    };

    $scope.updateAlarm = function(alarm) {
        var index = $scope.alarms.indexOf(alarm);
        $scope.alarms[index] =  new Alarm(
            typeof alarm.copy.hours === 'number' ? alarm.copy.hours : 0,
            typeof alarm.copy.minutes === 'number' ? alarm.copy.minutes : 0,
            alarm.copy.url,
            true
        );
        $scope.toggleEditingAlarm($scope.alarms[index]);
    };
})

;



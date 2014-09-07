/**
 * Created by Léo on 13/08/2014.
 */

angular.module('internetAlarm.alarm', [])
.factory(
    'Alarm', function() {

        var Alarm = function(hour,minute,url, enabled) {
            this.time = new Date(1970,0,1,hour,minute);
            this.url = url;
            this.enabled = enabled;
        };

        Alarm.prototype.getTimeRemaining = function() {
            if(this.enabled) {
                var now = new Date();
                var alarmTime;
                now.setTime((now.getTime() - now.getTimezoneOffset() * 60000) % 86400000);
                if(now.getTime() % 86400000 > this.time.getTime()){
                    alarmTime = new Date(this.time.getTime() + 86400000); // 24 * 60 * 60 * 1000
                }
                else {
                    alarmTime = new Date(this.time.getTime());
                }

                return new Date(alarmTime.getTime() - now.getTime());
            }
            else {
                return undefined;
            }
        };

        Alarm.prototype.toggleEnabled = function() {
            this.enabled = !this.enabled;
        };

        Alarm.prototype.isRinging = function() {
            var now = new Date();
            return (this.time.getHours() === now.getHours() && this.time.getMinutes() === now.getMinutes());
        };

        return Alarm;
    }
)
.service(
    'TestAlarms', function(Alarm) {
        var alarms = [
            new Alarm(6,0, 'https://www.youtube.com/watch?v=_3h_n2seS1g&list=UUXKr4vbqJkg4cXmdvaAEjYw',false),
            new Alarm(7,0, 'http://tunein.com/radio/The-Point-1047-s21387/',false)
        ];
        return alarms;
    }
);


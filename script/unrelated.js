// Unrelated script, by André Drougge - andre.drougge@gmail.com
// http://ms.miphe.com

Mi = {}

Mi.unrelated = function() {
    return {
        init: function() {
        	this.applyFormEvents()
        },

        applyFormEvents: function() {
			// Time format. Thanks StackOverflow!
			// http://stackoverflow.com/questions/6312993/javascript-seconds-to-time-with-format-hhmmss
			String.prototype.toHHMMSS = function () {
			    var sec_num = parseInt(this, 10); // don't forget the second parm
			    var hours   = Math.floor(sec_num / 3600);
			    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
			    var seconds = sec_num - (hours * 3600) - (minutes * 60);

			    if (hours   < 10) {hours   = "0"+hours;}
			    if (minutes < 10) {minutes = "0"+minutes;}
			    if (seconds < 10) {seconds = "0"+seconds;}
			    var time    = hours+':'+minutes+':'+seconds;
			    return time;
			}
        }
    }
}()


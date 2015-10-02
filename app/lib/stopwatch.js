//	Simple example of using private variables
//
//	To start the stopwatch:
//		obj.start();
//
//	To get the duration in milliseconds without pausing / resuming:
//		var	x = obj.time();
//
//	To pause the stopwatch:
//		var	x = obj.stop();	// Result is duration in milliseconds
//
//	To resume a paused stopwatch
//		var	x = obj.start();	// Result is duration in milliseconds
//
//	To reset a paused stopwatch
//		obj.stop();
//
var clsStopwatch = function () {
  // Private vars
  var startAt = 0;	// Time of last start / resume. (0 if not running)
  var lapTime = 0;	// Time on the clock when last stopped in milliseconds
  var lastActiveTime = 0;	// Time on the clock when last stopped in milliseconds

  var now = function () {
    return (new Date()).getTime();
  };

  // Public methods
  // Start or resume
  this.start = function () {
    startAt = startAt ? startAt : now();
    this.ping();
  };

  // Stop or pause
  this.stop = function () {
    // If running, update elapsed time otherwise keep it
    lapTime = startAt ? lapTime + now() - startAt : lapTime;
    startAt = 0; // Paused
  };

  // Reset
  this.reset = function () {
    lapTime = startAt = 0;
  };

  // Duration
  this.time = function () {
    return lapTime + (startAt ? now() - startAt : 0);
  };

  this.removeAfk = function (time) {
    if (startAt && now() - lastActiveTime > 120000) {
      lapTime = startAt ? lapTime + (time - startAt) + 120000 : lapTime;
      startAt = now();
    }
  };

  this.ping = function () {
    lastActiveTime = startAt ? now() : startAt;
  };

};


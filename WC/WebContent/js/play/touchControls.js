var screenPressed = false;
var startX = 0;
var clickStartTime = 0;




function bindCanvasTouchControls() {
	console.log("Binding Controls");
	$("#controls").bind("mousedown", function(e) {
		e.preventDefault();
		screenPressed = true;
		var audioElm = document.getElementById('audio');
		var currentTime = audioElm.currentTime;

		// audioElm.currentTime = currentTime - 1;

		audioElm.pause();
		var offset = $(this).offset();
		var clickX = e.clientX - offset.left;

		startX = clickX;
		clickStartTime = currentTime;
		updateLog("Touch Event");

	});

	$("#controls").bind("mouseup", function(e) {
		screenPressed = false;
		var audioElm = document.getElementById('audio');
		audioElm.play();
	});
	$("#controls").bind(
			"mousemove touchmove",
			function(e) {
				if (screenPressed) {
					var offset = $(this).offset();
					var clickX = e.clientX - offset.left;
					var distanceMoved = clickX - startX;
					startX = clickX;
					updateLog("Distance Moved=" + distanceMoved);
					var audioElm = document.getElementById('audio');
					audioElm.currentTime = audioElm.currentTime
							+ -((distanceMoved / 875) * 6);
				}
			});
}

function updateLog(text1) {
	console.log(text1);
	$('#logMessages').text(" " + text1);
}



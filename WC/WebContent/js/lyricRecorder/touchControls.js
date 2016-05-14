var screenPressed = false;
var startX = 0;
var veryStartX = 0;
var clickStartTime = 0;
var wasPaused = true;
var clickedWhilePausedX=0;

function bindCanvasTouchControls() {
	console.log("Binding Controls");
	$("#canvas1").bind("mousedown", function(e) {
		updateLog("Mouse Down");
		e.preventDefault();
		
		var offset = $(this).offset();
		var clickX = e.clientX - offset.left;
		var clickY = e.clientY - offset.top;
		if (clickY > -400) {
			if (document.getElementById('audio').paused) {
				clickedWhilePausedX=clickX;
				console.log(clickedWhilePausedX);
			}
		}
		else
		{
			screenPressed = true;
			var audioElm = document.getElementById('audio');
			var currentTime = audioElm.currentTime;
			wasPaused = audioElm.paused;
			audioElm.pause();
			
			startX = clickX;
			veryStartX = clickX;
			clickStartTime = currentTime;
		}
		
		
	});

	$("#canvas1").bind("click", function(e) {
		updateLog("Mouse Click");
	});

	$("#canvas1").bind("mouseup", function(e) {
		updateLog("Mouse Up");
		screenPressed = false;
		var audioElm = document.getElementById('audio');
		if (!wasPaused) {
			audioElm.play();
		}
	});
	$("#canvas1").bind(
			"mousemove touchmove",
			function(e) {
				updateLog("Mouse Move");
				if (screenPressed) {
					var offset = $(this).offset();
					var clickX = e.clientX - offset.left;
					var distanceMoved = clickX - startX;
					startX = clickX;
					var a = clickX - veryStartX
					var audioElm = document.getElementById('audio');
					audioElm.currentTime = audioElm.currentTime
							+ -((distanceMoved) / 200);
				}
			});
}

function updateLog(text1) {
	console.log(text1);
	$('#logMessages').text(" " + text1);
}

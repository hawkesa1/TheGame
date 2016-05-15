function bindCanvasTouchControls() {
	console.log("Binding Controls");
	$("#canvas1").bind("mousedown", function(e) {
		updateLog("Mouse Down");
		e.preventDefault();
		var offset = $(this).offset();
		var clickX = e.pageX - offset.left;
		var clickY = e.pageY - offset.top;
		if (clickY > 250) {
			if (document.getElementById('audio').paused) {
				clickedWhilePausedX = clickX;
			}
		} else {
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
	$("#canvas1").bind("dblclick", function(e) {
		updateLog("DoubleClick");
		console.log("Double Click");
		e.preventDefault();
		var offset = $(this).offset();
		var clickX = e.pageX - offset.left;
		var clickY = e.pageY - offset.top;
		if (clickY > 250) {
			if (document.getElementById('audio').paused) {
				doubleClickedWhilePausedX = clickX;
			}
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
		startOfWordMouseDownX=0;
		endOfWordMouseDownX=0;
	});
	$("#canvas1").bind(
			"mousemove touchmove",
			function(e) {
				updateLog("Mouse Move");
				var offset = $(this).offset();
				var clickX = e.clientX - offset.left;
				if (screenPressed) {

					var distanceMoved = clickX - startX;
					startX = clickX;

					var audioElm = document.getElementById('audio');
					audioElm.currentTime = audioElm.currentTime
							+ -((distanceMoved) / 200);

				}
				var clickY = e.pageY - offset.top;
				if (clickY > 250) {
					hoverWhilePausedX = clickX;
					
					if(startOfWordMouseDownX>0)
					{
						console.log(clickX-startOfWordMouseDownX);
						currentSelectedWord.startTime=currentSelectedWord.startTime + ((clickX-startOfWordMouseDownX)*5);
						startOfWordMouseDownX=clickX;
						changeCurrentSelectedWord();
					}
					else if(endOfWordMouseDownX>0)
					{
						console.log(clickX-endOfWordMouseDownX);
						currentSelectedWord.endTime=currentSelectedWord.endTime + ((clickX-endOfWordMouseDownX)*5);
						endOfWordMouseDownX=clickX;
						changeCurrentSelectedWord();
					}	
					
				} else {
					hoverWhilePausedX = 0;
					currentHoveredWordId = "";
				}
			});

	$("#canvas1").bind("mouseout", function(e) {
		updateLog("Mouse Out");
		hoverWhilePausedX = 0;
		currentHoveredWordId = "";
		startOfWordMouseDownX=0;
	});
}

function updateLog(text1) {
	// console.log(text1);
	// $('#logMessages').text(" " + text1);
}

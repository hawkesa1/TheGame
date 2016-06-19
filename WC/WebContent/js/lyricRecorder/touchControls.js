function bindCanvasTouchControls() {
	console.log("Binding Controls");
	$("#canvas1").bind("mousedown", function(e) {
		updateLog("Mouse Down");
		e.preventDefault();
		var offset = $(this).offset();
		var clickX = e.pageX - offset.left;
		var clickY = e.pageY - offset.top;
		if (clickY > 300) {
			if (document.getElementById('audio').paused) {
				clickedWhilePausedX = clickX;
			}
		} else if (clickY < 25 && clickX > 200) {
			trackingClicked = clickX;
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
		e.preventDefault();
		var offset = $(this).offset();
		var clickX = e.pageX - offset.left;
		var clickY = e.pageY - offset.top;
		if (clickY > 300) {
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
		startOfWordMouseDownX = 0;
		endOfWordMouseDownX = 0;
		middleOfWordMouseDownX = 0;
		trackingMouseDownX = 0
		trackingClicked = 0;
	});
	$("#canvas1")
			.bind(
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
						setCursor(clickX, clickY);
						if (trackingMouseDownX > 0) {
							var audioElm = document.getElementById('audio');
							audioElm.currentTime = ((clickX - 200) / (canvas1Width - 200))
									* audioElm.duration;
							trackingMouseDownX = clickX;
						} else if (clickY > 300) {
							hoverWhilePausedX = clickX;
							if (startOfWordMouseDownX > 0) {
								if (currentSelectedWord.startTime
										+ ((clickX - startOfWordMouseDownX) * 5) < (currentSelectedWord.endTime - 50)) {
									if (currentSelectedWordPreviousWord != null
											&& currentSelectedWord.startTime
													+ ((clickX - startOfWordMouseDownX) * 5) > (currentSelectedWordPreviousWord.endTime + 10)) {
										currentSelectedWord.startTime = currentSelectedWord.startTime
												+ ((clickX - startOfWordMouseDownX) * 5);
									} else if (currentSelectedWordPreviousWord == null
											&& currentSelectedWord.startTime
													+ ((clickX - startOfWordMouseDownX) * 5) > 0) {
										currentSelectedWord.startTime = currentSelectedWord.startTime
												+ ((clickX - startOfWordMouseDownX) * 5);
									}
								}
								startOfWordMouseDownX = clickX;
								changeCurrentSelectedWord();
							} else if (endOfWordMouseDownX > 0) {
								if (currentSelectedWord.endTime
										+ ((clickX - endOfWordMouseDownX) * 5) > (currentSelectedWord.startTime + 20)
										&& currentSelectedWord.endTime
												+ ((clickX - endOfWordMouseDownX) * 5) < currentSelectedWordNextWord.startTime - 10) {
									currentSelectedWord.endTime = currentSelectedWord.endTime
											+ ((clickX - endOfWordMouseDownX) * 5);
								}
								
								if(currentSelectedWord.id==lastAddedWordId)
								{
									highestEndTime=currentSelectedWord.endTime;
									console.log("Highest end time changed to: "+ highestEndTime);
								}	
								
								endOfWordMouseDownX = clickX;
								changeCurrentSelectedWord();
							} else if (middleOfWordMouseDownX > 0) {
								if (currentSelectedWordPreviousWord != null
										&& currentSelectedWord.startTime
												+ ((clickX - middleOfWordMouseDownX) * 5) > (currentSelectedWordPreviousWord.endTime + 10)
										&& currentSelectedWord.endTime
												+ ((clickX - middleOfWordMouseDownX) * 5) < currentSelectedWordNextWord.startTime - 10) {
									currentSelectedWord.endTime = currentSelectedWord.endTime
											+ ((clickX - middleOfWordMouseDownX) * 5);
									currentSelectedWord.startTime = currentSelectedWord.startTime
											+ ((clickX - middleOfWordMouseDownX) * 5);

								} else if (currentSelectedWordPreviousWord == null
										&& currentSelectedWord.startTime
												+ ((clickX - middleOfWordMouseDownX) * 5) > 0
										&& currentSelectedWord.endTime
												+ ((clickX - middleOfWordMouseDownX) * 5) < currentSelectedWordNextWord.startTime - 10) {
									currentSelectedWord.endTime = currentSelectedWord.endTime
											+ ((clickX - middleOfWordMouseDownX) * 5);
									currentSelectedWord.startTime = currentSelectedWord.startTime
											+ ((clickX - middleOfWordMouseDownX) * 5);

								}
								
								if(currentSelectedWord.id==lastAddedWordId)
								{
									highestEndTime=currentSelectedWord.endTime;
									console.log("Highest end time changed to: "+ highestEndTime);
								}	
								
								middleOfWordMouseDownX = clickX;
								changeCurrentSelectedWord();
							}
						} else {
							//hoverWhilePausedX = 0;
							currentHoveredWordId = "";
						}
					});

	$("#canvas1").bind("mouseout", function(e) {
		updateLog("Mouse Out");
		hoverWhilePausedX = 0;
		currentHoveredWordId = "";
		startOfWordMouseDownX = 0;
		trackingClicked = 0;
		trackingMouseDownX = 0;
	});
}


function setCursor(hoverX, hoverY) {
	if (hoverY > 0 && hoverY < 25) {
		$("#canvas1").css("cursor", "default");
	} else if (hoverY > 25 && hoverY < 300) {
		$("#canvas1").css("cursor", "pointer");
	} else if (hoverY > 300 && hoverY < 350) {
		if(isAWordHovered)
		{
			$("#canvas1").css("cursor", "move");
		}
		else if(isAWordEdgeHovered)
		{
			$("#canvas1").css("cursor", "e-resize");
		}
		else
		{
			$("#canvas1").css("cursor", "default");
		}	
	} else {
		$("#canvas1").css("cursor", "default");
	}
}

function updateLog(text1) {
	// console.log(text1);
	// $('#logMessages').text(" " + text1);
}

function loadWaveForm(wavFormFile) {
	$.ajax({
		type : 'GET',
		url : './resources/wavForm/' + wavFormFile + '.txt',
		data : null,
		success : function(text) {
			generateWaveForm(text);
		}
	});
	function generateWaveForm(text) {
		text = text.replace(/\\r\\n/g, '\n');
		var tempLines = text.split('\n');
		var wp = 0;
		var wavePoints = [];
		var startPoints = 100;
		var time, yHigh, yLow;
		for (var i = 0; i < startPoints; i++) {
			wavePoints[wp++] = new WavePoint(0, 0, 0);
		}
		for (var i = 0; i < tempLines.length; i++) {
			time = ((tempLines[i].split(',')[0]));
			yLow = ((tempLines[i].split(',')[1]));
			yHigh = ((tempLines[i].split(',')[2]));
			wavePoints[wp++] = new WavePoint(time, yLow, yHigh);
		}
		waveForm = new WaveForm(500, 1, X_MOVE, 150, 200, POINT_SPACING,
				wavePoints);
		animate();
	}
}

function loadLyricsData(wavFormFile) {
	$.ajax({
		type : 'GET',
		url : './resources/lyricData/' + wavFormFile + '.json',
		data : null,
		cache : false,
		success : function(text) {
			generateLyricData(text);
		}
	});
	function generateLyricData(text) {
		lineArray = text;
		$('#lyrics').html(generateLyrics(lineArray));
		addClickToLyrics();
	}
}

function calculateDrawTime() {
	return (windowWidth / POINT_SPACING) - (X_MOVE);
}

function WavePoint(time, yLow, yHigh) {
	this.time = time;
	this.yHigh = yHigh;
	this.yLow = yLow;
}

function Word(startTime, endTime, text) {
	this.startTime = startTime;
	this.endTime = endTime;
	this.text = text;
}

function WaveForm(drawTime, pointHeight, xShift, yShift, currentLine,
		pointSpacing, wavePoints) {
	this.drawTime = drawTime;
	this.pointHeight = pointHeight;
	this.xShift = xShift;
	this.yShift = yShift;
	this.currentLine = currentLine;
	this.pointSpacing = pointSpacing;
	this.wavePoints = wavePoints;
	this.pointX = 0;
	this.pointY = 0;
	this.currentYPoint = 0;
	this.first = true;
	this.wavePoint;
	this.startTime = 0;
}
var firstPass = true;
var aWord;
var tenths = 0;
// Receives the currentTimeof the audio file and the context of the canvas

WaveForm.prototype.draw = function(time, ctx) {
	if (time > stopAtTime) {
		var vid = document.getElementById("audio");
		// Because it misses and looks messy
		document.getElementById("audio").currentTime = stopAtTime / 1000;
		vid.pause();
		stopAtTime = 999999;
	}

	// The wav file has 1 entry per WAV_FILE_TIME_GAP (usually 10ms)
	this.startTime = Math.round((time) / WAV_FILE_TIME_GAP);

	ctx.moveTo(this.xShift, this.yShift + SHIFT_TO_FIX_LINE_THICKNESS);
	ctx.beginPath();
	this.first = true;

	// Draw Upper Line
	var point = 0;

	// We only draw part of the full audio, so we are only interested in the
	// time between start time and the upper limit
	for (var i = this.startTime; i < (this.startTime + (this.drawTime)); i++) {

		// to determine the x location of the point
		this.pointX = ((i - this.startTime) * this.pointSpacing) + this.xShift;
		point = 0;

		// to determine the y location of the point
		if (i < this.wavePoints.length) {
			point = this.wavePoints[i].yHigh;
		} else {
			point = 0;
		}
		this.pointY = (point * -(this.pointHeight)) + this.yShift;
		if (this.first) {
			this.first = false;
			drawArc(this.pointX, this.pointY, arcRadius);
		}
		ctx.lineTo(this.pointX, this.pointY + SHIFT_TO_FIX_LINE_THICKNESS);
		if (this.pointX == this.xShift + this.currentLine) {
			this.currentYPoint = this.pointY;
		}
	}
	ctx.stroke();
	drawArc(this.pointX, this.pointY, arcRadius);
	drawArc(this.xShift + this.currentLine, this.currentYPoint, arcRadius);

	// Draw Lower Line
	ctx.moveTo(this.xShift, this.yShift + SHIFT_TO_FIX_LINE_THICKNESS);
	ctx.beginPath();

	this.first = true;
	for (var i = this.startTime; i < (this.startTime + this.drawTime); i++) {
		this.pointX = ((i - this.startTime) * this.pointSpacing) + this.xShift;
		point = 0;
		if (i < this.wavePoints.length) {
			point = this.wavePoints[i].yLow;
		} else {
			point = 0;
		}
		this.pointY = (point * -(this.pointHeight)) + this.yShift;
		if (this.first) {
			this.first = false;
			drawArc(this.pointX, this.pointY, arcRadius);
		}
		ctx.lineTo(this.pointX, this.pointY + SHIFT_TO_FIX_LINE_THICKNESS);
		if (this.pointX == this.xShift + this.currentLine) {
			this.currentYPoint = this.pointY;
		}
	}
	ctx.stroke();
	drawArc(this.pointX, this.pointY, arcRadius);
	drawArc(this.xShift + this.currentLine, this.currentYPoint, arcRadius);

	var isAWordPlaying = false;

	for (var i = 0; i < onlyWordsArray.length; i++) {
		aWord = onlyWordsArray[i];
		// only interested in words that have a start time set
		if (aWord.startTime) {
			var startTime = aWord.startTime / 10;
			// only interested in words that are less than 3 seconds in the
			// future
			if (startTime < this.startTime + 300) {

				// the word currently being drawn
				var endTime = aWord.endTime / 10;
				if (!endTime && startTime < this.startTime) {
					endTime = this.startTime;
				}
				// only interested in words whose end time is less than a second
				// in the past
				if (startTime + (endTime - startTime) + 100 > this.startTime) {
					var wordX = (((startTime - this.startTime) + 100) * this.pointSpacing)
							+ this.xShift;
					var width = ((endTime - startTime)) * this.pointSpacing;
					ctx.rect(wordX, 250.5, width, 50);

					// Set the word currently being played
					if (startTime < this.startTime && endTime > this.startTime) {
						isAWordPlaying = true;
						if (currentPlayingWordId != aWord.id) {
							currentPlayingWordId = aWord.id;
							currentPlayingWord = aWord;
							changeCurrentPlayingWordId();
						}
					}

					// Allow a word to be selected if it is currently paused
					if (clickedWhilePausedX > 0) {
						if (clickedWhilePausedX > wordX
								&& clickedWhilePausedX < wordX + width) {
							console.log("You clicked: " + aWord.word);
							if (clickedWhilePausedX > wordX
									&& clickedWhilePausedX < wordX + 5) {
								console.log("You clicked the start of: "
										+ aWord.word);
								startOfWordMouseDownX = wordX;

							} else if (clickedWhilePausedX > (wordX + width - 5)
									&& clickedWhilePausedX < wordX + width) {
								console.log("You clicked the end of: "
										+ aWord.word);
								endOfWordMouseDownX = wordX + width;
							}

							clickedWhilePausedX = 0;
							currentSelectedWordId = aWord.id;
							currentSelectedWord = aWord;
							changeCurrentSelectedWord();

						}
					}
					if (hoverWhilePausedX > 0
							&& (hoverWhilePausedX > wordX && hoverWhilePausedX < wordX
									+ width)) {
						console.log("You Hovered: " + aWord.word);
						if (hoverWhilePausedX > 0
								&& (hoverWhilePausedX > wordX && hoverWhilePausedX < wordX + 5)) {
							console.log("You Hovered The Start Of: "
									+ aWord.word);
							hoverWhilePausedX = 0;
							currentHoveredWordId = aWord.id;
						}

						hoverWhilePausedX = 0;
						currentHoveredWordId = aWord.id;

					}

					if (doubleClickedWhilePausedX > 0
							&& (doubleClickedWhilePausedX > wordX && doubleClickedWhilePausedX < wordX
									+ width)) {
						console.log("You doubleClickedWhilePausedX: "
								+ aWord.word);
						doubleClickedWhilePausedX = 0;
						currentDoubleClickedWordId = aWord.id;
						playWord(aWord);
					}

					if (aWord.id == currentSelectedWordId) {

						if (aWord.id == currentPlayingWordId) {
							ctx.fillStyle = 'green';
						} else {
							ctx.fillStyle = 'blue';
						}
						ctx.fill();
						ctx.stroke();
						ctx.closePath();

						// Start
						ctx.beginPath();
						ctx.moveTo(wordX + 2, 250.5);

						ctx.lineTo(wordX + 2, 300);
						ctx.lineWidth = 5;
						ctx.strokeStyle = '#ff0000';
						ctx.stroke();
						// and End Lines
						ctx.beginPath();
						ctx.moveTo(wordX + width - 2, 250.5);

						ctx.lineTo(wordX + width - 2, 300);
						ctx.lineWidth = 5;
						ctx.strokeStyle = '#ff0000';
						ctx.stroke();

						ctx.lineWidth = 1;
						ctx.closePath
						ctx.beginPath();
						// set line color
						ctx.strokeStyle = 'black';

					} else if ((aWord.id == currentHoveredWordId)) {
						if (aWord.id == currentPlayingWordId) {
							ctx.fillStyle = 'green';
						} else {
							ctx.fillStyle = 'yellow';
						}
						ctx.fill();
						ctx.stroke();
						ctx.closePath();
						ctx.beginPath();
					} else {
						if (aWord.id == currentPlayingWordId) {
							ctx.fillStyle = 'green';
						} else {
							ctx.fillStyle = 'orange';
						}
						ctx.fill();
						ctx.stroke();
						ctx.closePath();
						ctx.beginPath();
					}

					ctx.fillStyle = 'black';
					ctx.fillText(aWord.word, wordX, 312)
				}
			}

		}

		if (!isAWordPlaying) {
			if (currentPlayingWord != null) {
				currentPlayingWordId = "";
				currentPlayingWord = null;
				changeCurrentPlayingWordId();
			}

		}
	}

	for (var i = this.startTime; i < (this.startTime + (this.drawTime)); i++) {
		if (firstPass) {
			console.log(i);
			firstPass = false;
		}
	}

	// Draw Numbers
	var point = 0;
	var bTime = 0;
	for (var i = this.startTime; i < (this.startTime + (this.drawTime)); i++) {
		this.pointX = ((i - this.startTime) * this.pointSpacing) + this.xShift;
		point = 0;
		if (i < this.wavePoints.length) {
			bTime = this.wavePoints[i].time;
			point = this.wavePoints[i].yHigh;
		} else {
			point = 0;
		}
		tenths++;

		if (i % 10 == 0 && tenths != 0 && tenths != 100) {
			ctx.fillText("|", this.pointX - 2, 260);
			ctx.fillText("|", this.pointX - 2, 45);

		}

		if (i % 100 == 0) {
			ctx.fillText(secondsToTime((i / 100) - 1), this.pointX - 2, 260);
			ctx.fillText(secondsToTime((i / 100) - 1), this.pointX - 2, 45);
			tenths = 0;
		}
	}

	// Draw vertical line
	ctx.beginPath();
	ctx
			.moveTo(this.xShift + this.currentLine,
					50 + SHIFT_TO_FIX_LINE_THICKNESS);
	ctx.lineTo(this.xShift + this.currentLine,
			450 + SHIFT_TO_FIX_LINE_THICKNESS);
	ctx.stroke();

	// Draw Horizontal Line
	ctx.beginPath();
	ctx.moveTo(this.xShift, this.yShift + SHIFT_TO_FIX_LINE_THICKNESS);
	ctx.lineTo(windowWidth - (X_MOVE), this.yShift
			+ SHIFT_TO_FIX_LINE_THICKNESS);
	ctx.stroke();

	// Draw Top Line
	ctx.beginPath();
	ctx.moveTo(this.xShift, this.yShift + 100 + SHIFT_TO_FIX_LINE_THICKNESS);
	ctx.lineTo(windowWidth - (X_MOVE), this.yShift + 100
			+ SHIFT_TO_FIX_LINE_THICKNESS);
	ctx.stroke();

	// Draw Bottom Line
	ctx.beginPath();
	ctx.moveTo(this.xShift, this.yShift - 100 + SHIFT_TO_FIX_LINE_THICKNESS);
	ctx.lineTo(windowWidth - (X_MOVE), this.yShift - 100
			+ SHIFT_TO_FIX_LINE_THICKNESS);
	ctx.stroke();

	// Draw Bottom Line
	ctx.beginPath();
	ctx.moveTo(this.xShift, 300 + SHIFT_TO_FIX_LINE_THICKNESS);
	ctx.lineTo(windowWidth - (X_MOVE), 300 + SHIFT_TO_FIX_LINE_THICKNESS);
	ctx.stroke();

	ctx.closePath();
	ctx.beginPath();

	ctx.globalAlpha = 0.2;
	ctx.fillStyle = 'gray';
	ctx.rect(0, 0, 200, 315);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.fillStyle = 'black';
	ctx.globalAlpha = 1;

	function drawArc(xPosition, yPosition, radius) {
		ctx.fillStyle = $('#circleColor').val();
		ctx.strokeStyle = $('#circleColor').val();
		ctx.beginPath();
		ctx.arc(xPosition, yPosition, radius, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.stroke();
		ctx.strokeStyle = $('#lineColor').val();
	}
};

function secondsToTime(seconds) {
	return seconds;
}

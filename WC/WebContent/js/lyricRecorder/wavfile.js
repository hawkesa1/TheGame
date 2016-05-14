var WAV_FILE_TIME_GAP = 10;
var DRAW_TIME_BY_PAGE_WIDTH = 0;
var POINT_SPACING = 2;
var X_MOVE = 0;
var arcRadius = 2;
var SHIFT_TO_FIX_LINE_THICKNESS = 0.5;

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

var words = [];
var word1 = new Word(40, 300, "Hello");
var word2 = new Word(400, 600, "How");
var word3 = new Word(600, 900, "Are");
var word4 = new Word(1000, 1100, "You");

words[0] = word1;
words[1] = word2;
words[2] = word3;
words[3] = word4;

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

// Receives the currentTimeof the audio file and the context of the canvas

WaveForm.prototype.draw = function(time, ctx) {
	if (time > stopAtTime) {
		var vid = document.getElementById("audio");
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

	for (var i = 0; i < onlyWordsArray.length; i++) {
		aWord = onlyWordsArray[i];
		//only interested in words that have a start time set
		if (aWord.startTime) {
			var startTime = aWord.startTime / 10;
			// only interested in words that are less than 4 seconds in the future
			if (startTime < this.startTime+400) {
				
				// the word currently being drawn
				var endTime = aWord.endTime / 10;
				if (!endTime && startTime < this.startTime) {
					endTime = this.startTime;
				}
				//only interested in words whose end time is less than a second in the past
				if (startTime + (endTime - startTime) + 100 > this.startTime) {
					var topLeft = (((startTime - this.startTime) + 100) * this.pointSpacing)
							+ this.xShift;
					var width = ((endTime - startTime)) * this.pointSpacing;
					ctx.rect(topLeft, 250.5, width, 50);
					ctx.fillStyle = 'yellow';
					ctx.fill();
					ctx.stroke();
					ctx.fillStyle = 'black';
					ctx.fillText(aWord.word, topLeft, 312)
				}
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
		if (i % 100 == 0) {
			ctx.fillText(secondsToTime((i / 100) - 1), this.pointX - 2, 260);
			ctx.fillText(secondsToTime((i / 100) - 1), this.pointX - 2, 45);
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

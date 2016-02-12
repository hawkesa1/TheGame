var WAV_FILE_TIME_GAP=10;

function loadWaveForm(wavFormFile) {
	$.ajax({
		type : 'GET',
		url : './resources/wavForm/' + wavFormFile + '.txt',
		data : null,
		success : function(text) {
			loadWords(text);
		}
	});
	function loadWords(text) {
		text = text.replace(/\\r\\n/g, '\n');
		var tempLines = text.split('\n');
		var wp = 0;
		var wavePoints = [];
		var startPoints = 0;
		var time, yHigh, yLow;
		for ( var i = 0; i < startPoints; i++) {
			wavePoints[wp++] = new WavePoint(0, 0, 0);
		}
		for ( var i = 0; i < tempLines.length; i++) {
			time = ((tempLines[i].split(',')[0]));
			yLow = ((tempLines[i].split(',')[1]));
			yHigh = ((tempLines[i].split(',')[2]));
			wavePoints[wp++] = new WavePoint(time, yLow, yHigh);
		}
		waveForm = new WaveForm(800, 1, 20, 200, 200, 2, wavePoints);
		animate();
	}
}

function WavePoint(time, yLow, yHigh) {
	this.time = time;
	this.yHigh = yHigh;
	this.yLow = yLow;
}

var arcRadius = 2;

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
	this.totalStartTime = 0;
}
WaveForm.prototype.draw = function(time, ctx) {
	this.startTime = Math.round((time - this.totalStartTime) / WAV_FILE_TIME_GAP);
	ctx.strokeStyle = $('#lineColor').val();
	ctx.moveTo(this.xShift, this.yShift);
	ctx.beginPath();
	this.first = true;
	var point = 0;

	// Draw Upper Line
	for ( var i = this.startTime; i < (this.startTime + (this.drawTime)); i++) {
		this.pointX = ((i - this.startTime) * this.pointSpacing) + this.xShift;
		point = 0;
		
		if(i<this.wavePoints.length)
		{
			point = this.wavePoints[i].yHigh;
		}
		else
		{
			point=0;
		}	
		this.pointY = (point * -(this.pointHeight)) + this.yShift;
		if (this.first) {
			this.first = false;
			drawArc(this.pointX, this.pointY, arcRadius);
		}
		ctx.lineTo(this.pointX, this.pointY);
		if (this.pointX == this.xShift + this.currentLine) {
			this.currentYPoint = this.pointY;
		}
	}
	ctx.stroke();
	drawArc(this.pointX, this.pointY, arcRadius);
	drawArc(this.xShift + this.currentLine, this.currentYPoint, arcRadius);

	// Draw Lower Line
	ctx.moveTo(this.xShift, this.yShift);
	ctx.beginPath();
	this.first = true;
	for ( var i = this.startTime; i < (this.startTime + this.drawTime); i++) {
		this.pointX = ((i - this.startTime) * this.pointSpacing) + this.xShift;
		point = 0;
		if(i<this.wavePoints.length)
		{
			point = this.wavePoints[i].yLow;
		}
		else
		{
			point=0;
		}	
		this.pointY = (point * -(this.pointHeight)) + this.yShift;
		if (this.first) {
			this.first = false;
			drawArc(this.pointX, this.pointY, arcRadius);
		}
		ctx.lineTo(this.pointX, this.pointY);
		if (this.pointX == this.xShift + this.currentLine) {
			this.currentYPoint = this.pointY;
		}
	}
	ctx.stroke();
	drawArc(this.pointX, this.pointY, arcRadius);
	drawArc(this.xShift + this.currentLine, this.currentYPoint, arcRadius);

	// Draw vertical line
	ctx.strokeStyle = $('#positionLineColor').val();
	ctx.beginPath();
	ctx.moveTo(this.xShift + this.currentLine, 100);
	ctx.lineTo(this.xShift + this.currentLine, 300);
	ctx.stroke();

	// Draw Horizontal Line
	ctx.strokeStyle = $('#positionLineColor').val();
	ctx.beginPath();
	ctx.moveTo(this.xShift, 200);
	ctx.lineTo(windowWidth-this.xShift, 200);
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

function fade() {
	// ctx.globalCompositeOperation = 'destination-out';
	// ctx.fillStyle = "rgba(0,0,0,0.01)";
	// context.fillRect(0, 0, windowWidth, windowHeight);
}

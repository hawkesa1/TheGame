var windowWidth = 0;
var waveForm;
var canvas1, context1;
var touchDiv;

$(document).ready(
		function($) {
			console.log("The Document is Ready!");
			windowWidth = $(document).width();
			windowHeight = $(document).height();
			canvas1 = document.createElement('canvas');
			canvas1.width = windowWidth;
			canvas1.height = 400;
			canvas1.id = "canvas1";
			context1 = canvas1.getContext('2d');
			document.body.appendChild(canvas1);
			context1.font = "bold 16px Arial";
			context1.strokeStyle = 'black';
			myVid = document.getElementById("audio");
			// myVid.playbackRate=0.5;
			bindCanvasTouchControls();
		});
var audioTime;
function animate() {
	requestAnimationFrame(animate);
	audioTime = $("#audio").prop("currentTime") * 1000;
	draw();
}

function draw() {
	drawCanvas1(audioTime);

}

function drawCanvas1(time) {
	context1.clearRect(0, 0, canvas1.width, canvas1.height);
	$('#canvas1').css("background-color",$('#backgroundColor').val());
	waveForm.draw(time, context1);
}

var mp3Location = "./resources/originalUpload/";

function loadTrack() {
	var selectedText = $('#loadTrack').find(":selected").text();
	var selectedValue = $('#loadTrack').find(":selected").val();
	console.log(selectedValue);

	var audio = document.getElementById('audio');
	var source = document.getElementById('audioSrc');
	source.src = mp3Location + selectedValue + ".mp3";

	loadWaveForm(selectedValue);
	audio.load(); // call this to just preload the audio without playing
	//audio.play(); // call this to play the song right away

}

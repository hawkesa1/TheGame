var windowWidth = 0;
var waveForm;
var canvas1, context1;
var touchDiv;
var mp3Location = "./resources/originalUpload/";
var audioTime;
var lineArray = new Array();

$(document).ready(function($) {
	console.log("Loaded Play Page1");
	windowWidth = $(document).width();
	windowHeight = $(document).height();
	canvas1 = document.createElement('canvas');
	canvas1.width = 850;
	canvas1.height = 301;
	canvas1.id = "canvas1";
	context1 = canvas1.getContext('2d');
	$('#canvasContainer').html(canvas1);
	//bindCanvasTouchControls();

	loadTrack();
});

/*
 * $(window).on('resize', function(){ var win = $(this);
 * canvas1.width=win.width(); windowWidth=win.width();
 * waveForm.drawTime=calculateDrawTime(); });
 * 
 * 
 */





$(function() {
    $("#lyricTextButton").click( function()
         {
    		var text=$('#lyricText').val();
    		console.log(text);
    		var lineArray=lyricsTextToObjects(text)
    		$('#lyrics').html(generateLyrics(lineArray));
    		$(function() {
    		    $(".word").click( function(event)
    		         {
    		    		wordClicked(event.target.id);
    		         }
    		    );
    		});
    		
         }
    );
});

function wordClicked(wordId)
{
	var lineIndex=wordId.split('_')[1];
	var wordIndex=wordId.split('_')[2];
	var aLineObject=lineArray[lineIndex];
	var aWordObject=aLineObject.words[wordIndex];
	
	
	console.log("M" + aWordObject.word);
}


function lyricsTextToObjects(lyricsText) {
	lyricsText = lyricsText.replace(/\\r\\n/g, '\n');
	var lines = lyricsText.split('\n');
	var aWordObject;
	var aLineObject;
	var wordsArray;
	
	var words;
	for ( var i = 0; i < lines.length; i++) {
		aLineObject = new LineObject();
		wordsArray = new Array();
		words = lines[i].split(' ');
		for ( var j = 0; j < words.length; j++) {
			aWordObject = new WordObject();
			aWordObject.word = words[j];
			wordsArray[j] = aWordObject;
		}
		aLineObject.words = wordsArray;
		lineArray[i] = aLineObject;
	}
	return lineArray;
}
function generateLyrics(lines) {
	var html = "";
	var words;
	var id;
	for ( var i = 0; i < lines.length; i++) {
		words = lines[i].words;
		html += "<div class='line'>";
		for ( var j = 0; j < words.length; j++) {
			id = "word_" + i + "_" + j;
			html += "<span class='word' id='" + id + "'>" + words[j].word
					+ "</span>" +" ";
		}
		html += "</div>";
	}
	return html;
}

function WordObject() {

}

function LineObject() {

}
function SongObject() {

}




function addTrack(trackId, trackName) {
	console.log("Add Track: " + trackId + " " + trackName);
	$('#loadTrack').append(
			$("<option></option>").attr("value", trackId).text(trackName));
}

function animate() {
	requestAnimationFrame(animate);
	audioTime = $("#audio").prop("currentTime") * 1000;
	draw(audioTime);
}

function draw(time) {
	context1.clearRect(0, 0, canvas1.width, canvas1.height);
	$('#canvas1').css("background-color", $('#backgroundColor').val());
	waveForm.draw(time, context1);
}

function loadTrack() {
	var selectedText = $('#loadTrack').find(":selected").text();
	var selectedValue = $('#loadTrack').find(":selected").val();
	console.log(selectedValue);
	var audio = document.getElementById('audio');
	var source = document.getElementById('audioSrc');
	source.src = mp3Location + selectedValue + ".mp3";
	loadWaveForm(selectedValue);
	audio.load();
}

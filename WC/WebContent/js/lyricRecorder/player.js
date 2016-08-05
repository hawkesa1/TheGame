var windowWidth = 0;
var waveForm;
var canvas1, context1;
var touchDiv;
var mp3Location = "./resources/convertedMp3/";
var audioTime;
var lineArray = new Array();
var onlyWordsArray = new Array();
var stopAtTime;
var currentSongId;
var currentSelectedWordId = "";
var currentSelectedWord;

var currentSelectedWordNextWord = null;
var currentSelectedWordPreviousWord = null;

var currentPlayingWordId = "";
var currentHoveredWordId = "";
var currentDoubleClickedWordId = "";
var currentPlayingWord;
var wordCurrentlyPlaying = true;

var startOfWordMouseDownX = 0;
var endOfWordMouseDownX = 0;
var middleOfWordMouseDownX = 0;
var trackingMouseDownX = 0;

var WAV_FILE_TIME_GAP = 10;
var DRAW_TIME_BY_PAGE_WIDTH = 0;
var POINT_SPACING = 2;
var X_MOVE = 0;
var arcRadius = 2;
var SHIFT_TO_FIX_LINE_THICKNESS = 0.5;

var screenPressed = false;
var startX = 0;
var veryStartX = 0;
var clickStartTime = 0;
var wasPaused = true;
var clickedWhilePausedX = 0;
var trackingClicked = 0;
var trackingSquareX = 0;

var hoverWhilePausedX = 0;
var doubleClickedWhilePausedX = 0;

var canvas1Height = 335;
var canvas1Width = 800;

var trackDuration = 0;

var currentLyricView = "";

var isAWordHovered = false;
var isAWordEdgeHovered = false;
var isAWordPlaying = false;
var previousPlayingWordId = "";

var nextWordToAddId = "";
var highestEndTime = 0;
var lastAddedWordId = "";

var theFillColour="";
var theLineColour="";
var availableTracks = new Array();



$(document).ready(function($) {
	setGlobalPageDimensions();
	loadUser("first");
	addCanvasToPage();
	bindCanvasTouchControls();
	
	
	loadUploader();
});

function setGlobalPageDimensions()
{
	windowWidth = $(document).width();
	windowHeight = $(document).height();
}

function addCanvasToPage() {
	canvas1 = document.createElement('canvas');
	canvas1.width = canvas1Width;
	canvas1.height = canvas1Height;
	canvas1.id = "canvas1";
	context1 = canvas1.getContext('2d');
	$('#canvasContainer').html(canvas1);
}

function lineArrayToJSON() {
	return $.toJSON(lineArray);
}


function addTrack(trackId, trackName) {
	console.log("Add Track: " + trackId + " " + trackName);
	$('#loadTrack').append(
			$("<option></option>").attr("value", trackId).text(trackName));
}

function changeCurrentPlayingWordId() {
	$('.word').removeClass("wordPlaying");
	if (currentPlayingWord) {
		$('#' + currentPlayingWordId).addClass("wordPlaying");
		$('#currentWord').html(currentPlayingWord.word);
		var container = $('#lyrics')
		var scrollTo = $('#' + currentPlayingWordId);
		container
		.scrollTop((scrollTo.offset().top - 8)
				- container.offset().top
				+ container.scrollTop());
	} else {
		$('#currentWord').html("");
	}
}

function changeCurrentSelectedWord() {
	var lineIndex = currentSelectedWordId.split('_')[1];
	var wordIndex = currentSelectedWordId.split('_')[2];
	var aLineObject = lineArray[lineIndex];
	var aWordObject = aLineObject.words[wordIndex];
	var currentSelectedWordPreviousWordLineIndex = 0;
	var currentSelectedWordPreviousWordWordIndex = 0;

	// get the previous word
	if (wordIndex == 0 && lineIndex == 0) {
		// current word is first word
		currentSelectedWordPreviousWord = null;
	} else {
		if (wordIndex > 0) {
			// current word is not the first word in a line
			currentSelectedWordPreviousWordLineIndex = lineIndex;
			currentSelectedWordPreviousWordWordIndex = wordIndex - 1;
			currentSelectedWordPreviousWord = lineArray[currentSelectedWordPreviousWordLineIndex].words[currentSelectedWordPreviousWordWordIndex];
		} else {
			// current word is the first word on the line
			currentSelectedWordPreviousWordLineIndex = lineIndex - 1;
			currentSelectedWordPreviousWordWordIndex = lineArray[currentSelectedWordPreviousWordLineIndex].words.length - 1;
			currentSelectedWordPreviousWord = lineArray[currentSelectedWordPreviousWordLineIndex].words[currentSelectedWordPreviousWordWordIndex];
		}
	}

	// get the next word
	// TO_DO

	if (currentSelectedWord.wordIndex === 0) {
		currentSelectedWordPreviousWord = null;
	} else {
		currentSelectedWordPreviousWord = onlyWordsArray[currentSelectedWord.wordIndex - 1];
	}
	if (currentSelectedWord.wordIndex > onlyWordsArray.length - 1) {
		var aNewWord = new Word();
		aNewWord.startTime = 500000;
		currentSelectedWordNextWord = aNewWord;
	} else {
		currentSelectedWordNextWord = onlyWordsArray[currentSelectedWord.wordIndex + 1]
		if (!currentSelectedWordNextWord.startTime) {
			var aNewWord = new Word();
			aNewWord.startTime = 500000;
			currentSelectedWordNextWord = aNewWord;
		}
	}

	// get the next word

	$('#wordInfoId').val(currentSelectedWordId);
	$('#wordInfoWord').val(
			aWordObject.word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""));
	$('#wordInfoStartTime').val(
			millisecondsToISOMinutesSecondsMilliseconds(aWordObject.startTime));
	$('#wordInfoEndTime').val(
			millisecondsToISOMinutesSecondsMilliseconds(aWordObject.endTime));
	$('.word').removeClass("wordSelected");
	$('#word_' + lineIndex + "_" + wordIndex).addClass("wordSelected");
}

function millisecondsToISOMinutesSecondsMilliseconds(milliseconds) {
	if (!milliseconds) {
		return "00:00.000";
	}
	var date = new Date(null);
	date.setMilliseconds(milliseconds);
	return date.toISOString().substr(14, 9);
}

function convertLyricTextToWords() {
	var text = $('#lyricText').val();
	lineArray = new Array();
	lineArray = lyricsTextToObjects(text)
	$('#lyrics').html(generateLyrics(lineArray));
	addClickToLyrics();
	currentLineIndex = 0;
	currentWordIndex = 0;
	var aLineObject = lineArray[currentLineIndex];
	var aWordObject = aLineObject.words[currentWordIndex];
	currentSelectedWordId = aWordObject.id;
	$('#wordInfoId').val(currentSelectedWordId);

	$('#wordInfoWord').val(
			aWordObject.word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""));
	$('#wordInfoStartTime').val(
			millisecondsToISOMinutesSecondsMilliseconds(aWordObject.startTime));
	$('#wordInfoEndTime').val(
			millisecondsToISOMinutesSecondsMilliseconds(aWordObject.endTime));
	$('.word').removeClass("wordSelected");
	$('#word_' + currentLineIndex + "_" + currentWordIndex).addClass(
			"wordSelected");
}

function lyricsTextToObjects(lyricsText) {
	lyricsText = lyricsText.replace(/\\r\\n/g, '\n');
	lyricsText = lyricsText.replace(/ +(?= )/g, ''); // remove double spaces

	var lines1 = lyricsText.split('\n');
	var lines = new Array();
	var q = 0;
	for (var i = 0; i < lines1.length; i++) {
		if (lines1[i].trim() != "") {
			lines[q] = lines1[i];
			q++;
		}
	}
	var aWordObject;
	var aLineObject;
	var wordsArray;
	var words;
	var k = 0;
	for (var i = 0; i < lines.length; i++) {
		aLineObject = new LineObject();
		wordsArray = new Array();
		words = lines[i].split(' ');
		for (var j = 0; j < words.length; j++) {
			aWordObject = new WordObject();
			aWordObject.word = words[j];
			wordsArray[j] = aWordObject;
			aWordObject.wordIndex = k;
			onlyWordsArray[k] = aWordObject;
			k++;
		}
		aLineObject.words = wordsArray;
		lineArray[i] = aLineObject;
	}
	return lineArray;
}

function playWord(aWordObject) {
	var vid = document.getElementById("audio");
	if (aWordObject.startTime && aWordObject.startTime >= 0) {
		vid.currentTime = aWordObject.startTime / 1000;
		vid.play();
		stopAtTime = aWordObject.endTime;
	}
}

function playLine(lineIndex) {
	var wordIndex = 0;
	var aLineObject = lineArray[lineIndex];
	var aWordObject = aLineObject.words[wordIndex];

	var vid = document.getElementById("audio");

	if (aWordObject.startTime && aWordObject.startTime >= 0) {
		vid.currentTime = aWordObject.startTime / 1000;
		vid.play();
		stopAtTime = aLineObject.words[aLineObject.words.length - 1].endTime;
	}
}

function playFromLine(lineIndex) {
	var wordIndex = 0;
	var aLineObject = lineArray[lineIndex];
	var aWordObject = aLineObject.words[wordIndex];

	var vid = document.getElementById("audio");

	if (aWordObject.startTime && aWordObject.startTime >= 0) {
		vid.currentTime = aWordObject.startTime / 1000;
		vid.play();
	}
}

function changeStart(timeInMs) {
	var wordId = $('#wordInfoId').val();
	var lineIndex = wordId.split('_')[1];
	var wordIndex = wordId.split('_')[2];

	var aLineObject = lineArray[currentLineIndex];
	var aWordObject = aLineObject.words[currentWordIndex];
	aWordObject.startTime = aWordObject.startTime + timeInMs;

	$('#wordInfoStartTime').val(
			millisecondsToISOMinutesSecondsMilliseconds(aWordObject.startTime));
	$('#wordInfoEndTime').val(
			millisecondsToISOMinutesSecondsMilliseconds(aWordObject.endTime));

}



function changeEnd(timeInMs) {
	var wordId = $('#wordInfoId').val();
	var lineIndex = wordId.split('_')[1];
	var wordIndex = wordId.split('_')[2];

	var aLineObject = lineArray[currentLineIndex];
	var aWordObject = aLineObject.words[currentWordIndex];
	aWordObject.endTime = aWordObject.endTime + timeInMs;

	$('#wordInfoStartTime').val(
			millisecondsToISOMinutesSecondsMilliseconds(aWordObject.startTime));
	$('#wordInfoEndTime').val(
			millisecondsToISOMinutesSecondsMilliseconds(aWordObject.endTime));

}

var currentLineIndex = 0;
var currentWordIndex = 0;

function findWordById(wordId) {
	var lineIndex = wordId.split('_')[1];
	var wordIndex = wordId.split('_')[2];
	currentLineIndex = lineIndex;
	currentWordIndex = wordIndex;
	var aLineObject = lineArray[lineIndex];
	return aLineObject.words[wordIndex];
}

function wordClicked(wordId) {

	var aWordObject = findWordById(wordId);
	currentSelectedWordId = aWordObject.id;
	$('#wordInfoId').val(currentSelectedWordId)

	$('#wordInfoWord').val(
			aWordObject.word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""));
	$('#wordInfoStartTime').val(
			millisecondsToISOMinutesSecondsMilliseconds(aWordObject.startTime));
	$('#wordInfoEndTime').val(
			millisecondsToISOMinutesSecondsMilliseconds(aWordObject.endTime));
	$('.word').removeClass("wordSelected");
	$('#' + wordId).addClass("wordSelected");

	var vid = document.getElementById("audio");

	if (!aWordObject.startTime <= 0) {
		vid.currentTime = aWordObject.startTime / 1000;
		vid.play();
		stopAtTime = aWordObject.endTime;
	}

}


function resetStuff()
{
	onlyWordsArray = new Array();
	words = new Array();
	lineArray=new Array();
}


function generateLyrics(lines) {
	resetStuff();
	lineArray = lines;
	var html = "";
	var words;
	var id;
	var k = 0;
	var nextWordToAddFound = false;

	nextWordToAddId = "";
	highestEndTime = 0;
	lastAddedWordId = "";

	for (var i = 0; i < lines.length; i++) {
		words = lines[i].words;
		html += "<div class='line'>";

		for (var j = 0; j < words.length; j++) {

			if (j === 0) {
				if (words[j].endTime) {
					html += "<input id='playLine_"
							+ i
							+ "' type=\"button\" class=\"playLineButton\" value=\"L\" onclick='playLine("
							+ i + ")'> </input>";
					html += "<input id='playFromLine_"
							+ i
							+ "' type=\"button\" class=\"playLineButton\" value=\"F\" onclick='playFromLine("
							+ i + ")'> </input>";
				} else {
					html += "<input id='playLine_"
							+ i
							+ "' type=\"button\" class=\"playLineButton disabledButton\" value=\"L\" onclick='playLine("
							+ i + ")'> </input>";
					html += "<input id='playFromLine_"
							+ i
							+ "' type=\"button\" class=\"playLineButton disabledButton\" value=\"F\" onclick='playFromLine("
							+ i + ")'> </input>";
				}
			}

			words[j].wordIndex = k;
			onlyWordsArray[k] = words[j];
			k++;
			id = "word_" + i + "_" + j;
			words[j].id = id;
			if (words[j].startTime && words[j].endTime) {
				html += "<span class='word wordHasTime' id='" + id + "'>"
						+ words[j].word + "</span>" + " ";
				highestEndTime = words[j].endTime;
				lastAddedWordId = id;

			} else {
				if (nextWordToAddFound) {
					html += "<span class='word' id='" + id + "'>"
							+ words[j].word + "</span>" + " ";

				} else {
					nextWordToAddFound = true;
					html += "<span class='word wordSelected nextWordToAdd' id='"
							+ id + "'>" + words[j].word + "</span>" + " ";
					console.log("Next Word to Add:" + words[j].word);

					// this sets the line id!!
					findWordById(id);
					nextWordToAddId = id;
					// nextWordToAdd=words[j].word;
					// console.log(nextWordToAdd);
					currentSelectedWordId = words[j].id;
				}

			}
		}
		html += "</div>";
	}
	return html;
}

function addTrack(trackId, trackName) {
	$('#loadTrack').append(
			$("<option></option>").attr("value", trackId).text(trackName));
}

var lastDrawTime = 0;
var lastDrawPrintTime = 1;
var frame = 0;

function animate() {
	requestAnimationFrame(animate);
	audioTime = $("#audio").prop("currentTime") * 1000;
	frame++;
	if (audioTime - lastDrawPrintTime > 1000) {
		lastDrawPrintTime = audioTime;
		$('#fps').html(frame + " fps");
		frame = 0;
	}
	lastDrawTime = audioTime;
	draw(audioTime);
}

function draw(time) {
	context1.clearRect(0, 0, canvas1.width, canvas1.height);
	$('#canvas1').css("background-color", $('#backgroundColor').val());
	waveForm.draw(time, context1);
}

function loadTrack() {
	var selectedValue = $('#loadTrack').find(":selected").val();
	loadATrack(selectedValue);
}

function WordObject() {

}
function LineObject() {

}
function SongObject() {

}
function CurrentlyDrawnWordObject() {

}
function TrackObject()
{

}


/*
 * $(window).on('resize', function() { var win = $(this); canvas1.width =
 * win.width(); windowWidth = win.width(); waveForm.drawTime =
 * calculateDrawTime(); });
 */

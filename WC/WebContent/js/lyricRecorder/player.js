var windowWidth = 0;
var waveForm;
var canvas1, context1;
var touchDiv;
var mp3Location = "./resources/originalUpload/";
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
var hoverWhilePausedX = 0;
var doubleClickedWhilePausedX = 0;

$(document).ready(function($) {
	console.log("Loaded Play Page1");
	windowWidth = $(document).width();
	windowHeight = $(document).height();
	canvas1 = document.createElement('canvas');
	canvas1.width = 800;
	canvas1.height = 315;
	canvas1.id = "canvas1";
	context1 = canvas1.getContext('2d');
	$('#canvasContainer').html(canvas1);
	bindCanvasTouchControls();

	// loadTrack();
	loadUser();
});

/*
 * $(window).on('resize', function(){ var win = $(this);
 * canvas1.width=win.width(); windowWidth=win.width();
 * waveForm.drawTime=calculateDrawTime(); });
 * 
 * 
 */

$(function() {
	$("#save").click(function() {
		saveLyrics(lineArrayToJSON(), "songId1");
	});
});

function lineArrayToJSON() {
	return $.toJSON(lineArray);
}

function loadCreateTab() {
	$('#currentTab').removeClass('visibleTab');
	$('#loadTab').removeClass('visibleTab');
	$('#currentTab').addClass('hiddenTab');
	$('#loadTab').addClass('hiddenTab');

	$('#newTab').removeClass('hiddenTab');
	$('#newTab').addClass('visibleTab');
	console.log("Yo")
}
function loadCurrentTab() {
	$('#newTab').removeClass('visibleTab');
	$('#loadTab').removeClass('visibleTab');
	$('#newTab').addClass('hiddenTab');
	$('#loadTab').addClass('hiddenTab');

	$('#currentTab').removeClass('hiddenTab');
	$('#currentTab').addClass('visibleTab');
	console.log("Yo")
}
function loadLoadTab() {
	$('#currentTab').removeClass('visibleTab');
	$('#newTab').removeClass('visibleTab');
	$('#currentTab').addClass('hiddenTab');
	$('#newTab').addClass('hiddenTab');

	$('#loadTab').removeClass('hiddenTab');
	$('#loadTab').addClass('visibleTab');
	console.log("Yo")
}



function changeCurrentPlayingWordId() {
	$('.word').removeClass("wordPlaying");
	if (currentPlayingWord) {
		$('#' + currentPlayingWordId).addClass("wordPlaying");
		$('#currentWord').html(currentPlayingWord.word);

		var container = $('#lyrics')
		var scrollTo = $('#' + currentPlayingWordId);

		container.scrollTop(scrollTo.offset().top - container.offset().top
				+ container.scrollTop() - ((container.height() / 2) - 15));
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

$(function() {
	$("#lyricTextButton")
			.click(
					function() {
						var text = $('#lyricText').val();
						console.log(text);
						var lineArray = lyricsTextToObjects(text)
						$('#lyrics').html(generateLyrics(lineArray));
						addClickToLyrics();
						currentLineIndex = 0;
						currentWordIndex = 0;
						var aLineObject = lineArray[currentLineIndex];
						var aWordObject = aLineObject.words[currentWordIndex];

						currentSelectedWordId = aWordObject.id;
						$('#wordInfoId').val(currentSelectedWordId);

						$('#wordInfoWord').val(
								aWordObject.word.replace(
										/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""));
						$('#wordInfoStartTime')
								.val(
										millisecondsToISOMinutesSecondsMilliseconds(aWordObject.startTime));
						$('#wordInfoEndTime')
								.val(
										millisecondsToISOMinutesSecondsMilliseconds(aWordObject.endTime));
						$('.word').removeClass("wordSelected");
						$('#word_' + currentLineIndex + "_" + currentWordIndex)
								.addClass("wordSelected");

					});
});

function lyricsTextToObjects(lyricsText) {
	lyricsText = lyricsText.replace(/\\r\\n/g, '\n');
	var lines = lyricsText.split('\n');
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

function addClickToLyrics() {
	$(function() {
		$(".word").click(function(event) {
			wordClicked(event.target.id);
		});
	});
}

$(function() {
	$("#wordInfoPlay").click(function() {
		var wordId = $('#wordInfoId').val();
		var lineIndex = wordId.split('_')[1];
		var wordIndex = wordId.split('_')[2];
		var aLineObject = lineArray[lineIndex];
		var aWordObject = aLineObject.words[wordIndex];
		playWord(aWordObject);
	});
});

function playWord(aWordObject) {
	var vid = document.getElementById("audio");
	if (aWordObject.startTime && aWordObject.startTime >= 0) {
		vid.currentTime = aWordObject.startTime / 1000;
		vid.play();
		stopAtTime = aWordObject.endTime;
	}
}

$(function() {
	$("#wordInfoPlayLine")
			.click(
					function() {
						var wordId = $('#wordInfoId').val();
						var lineIndex = wordId.split('_')[1];
						var wordIndex = 0;
						var aLineObject = lineArray[lineIndex];
						var aWordObject = aLineObject.words[wordIndex];

						var vid = document.getElementById("audio");

						if (aWordObject.startTime && aWordObject.startTime >= 0) {
							vid.currentTime = aWordObject.startTime / 1000;
							vid.play();
							stopAtTime = aLineObject.words[aLineObject.words.length - 1].endTime;
						}
					});
});

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

function changePlayBackRate(playBackRate) {
	var vid = document.getElementById("audio");
	vid.playbackRate = playBackRate;

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

$(function() {
	$("#wordInfoClearAll")
			.click(
					function() {
						for (var i = 0; i < onlyWordsArray.length; i++) {
							onlyWordsArray[i].startTime = null;
							onlyWordsArray[i].endTime = null;
							currentLineIndex = 0;
							currentWordIndex = 0;

							$('#wordInfoStartTime')
									.val(
											millisecondsToISOMinutesSecondsMilliseconds(onlyWordsArray[i].startTime));
							$('#wordInfoEndTime')
									.val(
											millisecondsToISOMinutesSecondsMilliseconds(onlyWordsArray[i].endTime));
						}

					});
});

$(function() {
	$("#wordInfoClearThisWord")
			.click(
					function() {
						var wordId = $('#wordInfoId').val();
						var lineIndex = wordId.split('_')[1];
						var wordIndex = wordId.split('_')[2];
						var aLineObject = lineArray[currentLineIndex];
						var aWordObject = aLineObject.words[currentWordIndex];
						aWordObject.startTime = null;
						aWordObject.endTime = null;
						$('#wordInfoStartTime')
								.val(
										millisecondsToISOMinutesSecondsMilliseconds(aWordObject.startTime));
						$('#wordInfoEndTime')
								.val(
										millisecondsToISOMinutesSecondsMilliseconds(aWordObject.endTime));

					});
});

var currentLineIndex = 0;
var currentWordIndex = 0;

$(function() {
	$("#addCurrentWord")
			.mousedown(
					function() {
						var aLineObject = lineArray[currentLineIndex];
						var aWordObject = aLineObject.words[currentWordIndex];
						aWordObject.startTime = $("#audio").prop("currentTime") * 1000;
						if (currentWordIndex == 0) {
							aLineObject.startTime = $("#audio").prop(
									"currentTime" * 1000);
						}

						currentSelectedWordId = aWordObject.id;
						$('#wordInfoId').val(currentSelectedWordId)

						$('#wordInfoWord').val(
								aWordObject.word.replace(
										/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""));
						$('#wordInfoStartTime')
								.val(
										millisecondsToISOMinutesSecondsMilliseconds(aWordObject.startTime));
						$('#wordInfoEndTime').val("");
						$('.word').removeClass("wordSelected");
						$('#word_' + currentLineIndex + "_" + currentWordIndex)
								.addClass("wordSelected");
					});
});
$(function() {
	$("#addCurrentWord")
			.mouseup(
					function() {
						var aLineObject = lineArray[currentLineIndex];
						var aWordObject = aLineObject.words[currentWordIndex];
						aWordObject.endTime = $("#audio").prop("currentTime") * 1000;
						$('#wordInfoEndTime')
								.val(
										millisecondsToISOMinutesSecondsMilliseconds(aWordObject.endTime));
						currentWordIndex++;
						if (currentWordIndex >= aLineObject.words.length) {
							currentWordIndex = 0;
							aLineObject.endTime = $("#audio").prop(
									"currentTime") * 1000;
							currentLineIndex++;
						}
						aLineObject = lineArray[currentLineIndex];
						aWordObject = aLineObject.words[currentWordIndex];

					});
});

function wordClicked(wordId) {
	var lineIndex = wordId.split('_')[1];
	var wordIndex = wordId.split('_')[2];
	currentLineIndex = lineIndex;
	currentWordIndex = wordIndex;
	var aLineObject = lineArray[lineIndex];
	var aWordObject = aLineObject.words[wordIndex];

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

function generateLyrics(lines) {
	var html = "";
	var words;
	var id;
	var k = 0;
	for (var i = 0; i < lines.length; i++) {
		words = lines[i].words;
		html += "<div class='line'>";
		html += "<input type=\"button\" class=\"playLineButton\" value=\"L\" onclick='playLine("
				+ i + ")'> </input>";

		for (var j = 0; j < words.length; j++) {
			words[j].wordIndex = k;
			onlyWordsArray[k] = words[j];
			k++;
			id = "word_" + i + "_" + j;
			words[j].id = id;
			html += "<span class='word' id='" + id + "'>" + words[j].word
					+ "</span>" + " ";
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

function CurrentlyDrawnWordObject() {

}

function addTrack(trackId, trackName) {
	console.log("Add Track: " + trackId + " " + trackName);
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
	var selectedText = $('#loadTrack').find(":selected").text();
	var selectedValue = $('#loadTrack').find(":selected").val();
	console.log(selectedValue);
	var audio = document.getElementById('audio');
	var source = document.getElementById('audioSrc');
	source.src = mp3Location + selectedValue + ".mp3";
	loadWaveForm(selectedValue);
	loadLyricsData(selectedValue);
	currentSongId = selectedValue;
	audio.load();
}

function saveLyrics(JSONFormattedLyricData, songId) {
	$.ajax({
		type : 'POST',
		url : './LyricUploadServlet',
		data : {
			"JSONFormattedLyricData" : JSONFormattedLyricData,
			"songId" : currentSongId
		},
		success : function(text) {
			successfullySavedLyrics(text);
		},
		error : function(xhr) {
			alert("An error occured: " + xhr.status + " " + xhr.statusText);
		}
	});
	function successfullySavedLyrics(text) {
		console.log("Woohoo:" + text);
	}
}

function loadUser(JSONFormattedLyricData, songId) {
	$.ajax({
		type : 'GET',
		url : './GetAvailableTracks',
		data : {
			"userId" : "hawkesa",
		},
		success : function(text) {
			console.log(text);
			for (var i = 0; i < text.mp3MetaDatas.length; i++) {
				addTrack(text.mp3MetaDatas[i].uniqueId,
						text.mp3MetaDatas[i].title)
			}

		},
		error : function(xhr) {
			alert("An error occured: " + xhr.status + " " + xhr.statusText);
		}
	});
}

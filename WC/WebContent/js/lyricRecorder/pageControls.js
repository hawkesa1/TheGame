$(function() {
	$("#save").click(function() {
		saveLyrics(lineArrayToJSON(), "songId1");
	});
});

$(function() {
	$("#loadButton").click(function() {
		loadTrack();
		loadCurrentTab();
	});
});

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

$(function() {
	$("#lyricTextButton").click(function() {
		convertLyricTextToWords();
	});
});

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
$(function() {
	$("#playPauseButton").click(function(e) {
		e.preventDefault();
		var vid = document.getElementById("audio");
		if (vid.paused) {
			vid.play();
			$('#playPauseButton').text("Pause");
		} else {
			vid.pause();
			$('#playPauseButton').text("Play");
		}
	});
});

$(function() {
	$("#playSlowButton").click(function(e) {
		e.preventDefault();
		var vid = document.getElementById("audio");
		vid.playbackRate = 0.5;
	});
});
$(function() {
	$("#playFastButton").click(function(e) {
		e.preventDefault();
		var vid = document.getElementById("audio");
		vid.playbackRate = 2;
	});
});
$(function() {
	$("#skipBack5Button").click(function(e) {
		e.preventDefault();
		var vid = document.getElementById("audio");
		vid.currentTime = vid.currentTime - 5;
	});
});
$(function() {
	$("#skipForward5Button").click(function(e) {
		e.preventDefault();
		var vid = document.getElementById("audio");
		vid.currentTime = vid.currentTime + 5;
	});
});










function playPause() {
	var vid = document.getElementById("audio");
	if (vid.paused) {
		vid.play();
		$('#playPause').val("Pause");
	} else {
		vid.pause();
		$('#playPause').val("Play");
	}
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

var currentlyAddingWord = false;

$(function() {
	$("#addCurrentWord")
			.mousedown(
					function() {

						if (($("#audio").prop("currentTime") * 1000) > highestEndTime) {
							currentlyAddingWord = true;
							findWordById(nextWordToAddId);
							var aLineObject = lineArray[currentLineIndex];
							var aWordObject = aLineObject.words[currentWordIndex];
							aWordObject.startTime = $("#audio").prop(
									"currentTime") * 1000;
							if (currentWordIndex == 0) {
								aLineObject.startTime = $("#audio").prop(
										"currentTime" * 1000);
							}

							currentSelectedWordId = aWordObject.id;
							$('#wordInfoId').val(currentSelectedWordId)

							$('#wordInfoWord')
									.val(
											aWordObject.word
													.replace(
															/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
															""));
							$('#wordInfoStartTime')
									.val(
											millisecondsToISOMinutesSecondsMilliseconds(aWordObject.startTime));
							$('#wordInfoEndTime').val("");

							$('.word').removeClass("wordSelected");
							$(
									'#word_' + currentLineIndex + "_"
											+ currentWordIndex).addClass(
									"wordSelected");

							$('.word').removeClass("nextWordToAdd");
							$('.word').removeClass("wordBeingAdded");
							$('#' + aWordObject.id).addClass("wordBeingAdded");

							console.log("Adding: " + aWordObject.id);

						} else {
							console.log("You can't add words out of order!!!");
						}

					});
});
$(function() {
	$("#addCurrentWord")
			.mouseup(
					function() {
						var aLineObject = lineArray[currentLineIndex];
						var aWordObject = aLineObject.words[currentWordIndex];

						if (currentlyAddingWord) {
							currentlyAddingWord = false;
							aWordObject.endTime = $("#audio").prop(
									"currentTime") * 1000;
							$('#wordInfoEndTime')
									.val(
											millisecondsToISOMinutesSecondsMilliseconds(aWordObject.endTime));

							$(
									'#word_' + currentLineIndex + "_"
											+ currentWordIndex).addClass(
									"wordHasTime");

							lastAddedWordId = aWordObject.id;
							highestEndTime = aWordObject.endTime;

							currentWordIndex++;
							if (currentWordIndex >= aLineObject.words.length) {
								currentWordIndex = 0;
								aLineObject.endTime = $("#audio").prop(
										"currentTime") * 1000;
								currentLineIndex++;

								var container = $('#lyrics')
								var scrollTo = $('#' + currentSelectedWordId);
								container
										.scrollTop((scrollTo.offset().top + 30)
												- container.offset().top
												+ container.scrollTop());
							}
							aLineObject = lineArray[currentLineIndex];
							aWordObject = aLineObject.words[currentWordIndex];
							nextWordToAddId = aWordObject.id;

							$('#playLine_' + currentLineIndex).removeClass(
									'disabledButton');
							$('#playFromLine_' + currentLineIndex).removeClass(
									'disabledButton');

							$('.word').removeClass("nextWordToAdd");
							$(
									'#word_' + currentLineIndex + "_"
											+ currentWordIndex).addClass(
									"nextWordToAdd");
						} else {
							console
									.log("You can't add an end time without a start time");
						}
					});
});

$(function() {
	$("#removePreviousWord").mouseup(
			function() {
				var word = findWordById(lastAddedWordId);
				delete word.startTime;
				delete word.endTime;
				$('#lyrics').html(generateLyrics(lineArray));
				addClickToLyrics();

				var container = $('#lyrics')
				var scrollTo = $('#' + nextWordToAddId);
				container.scrollTop((scrollTo.offset().top)
						- container.offset().top + container.scrollTop());

			});
});



function enableLyricTextView() {

	if (currentLyricView === "TEXT_VIEW") {
	} else if (currentLyricView === "SCRIPT_VIEW") {
		generateLyrics($.parseJSON($('#lyricScript').val()));
	} else if (currentLyricView === "WORD_VIEW") {

	}

	if (confirm('You  will lose any entered timings if you return to text view.  Are you sure?')) {
		$('#lyricText').show();
		$('#lyrics').hide();
		$('#lyricScript').hide();
		var html = "";
		for (var i = 0; i < lineArray.length; i++) {
			words = lineArray[i].words;
			for (var j = 0; j < words.length; j++) {
				if (j != 0) {
					html += " ";
				}
				html += words[j].word;
			}
			html += "\n";
			$('#lyricText').html(html);
		}
		lineArray.length = 0;
		onlyWordsArray.length = 0;
	}
	currentLyricView = "TEXT_VIEW";
}

function enableLyricScriptView() {

	if (currentLyricView === "SCRIPT_VIEW") {
	} else if (currentLyricView === "TEXT_VIEW") {
		$('#lyricText').hide();
		$('#lyricScript').hide();
		$('#lyrics').show();
		convertLyricTextToWords();
	} else if (currentLyricView === "WORD_VIEW") {

	}

	$('#lyricScript').show();
	$('#lyricText').hide();
	$('#lyrics').hide();
	var html = lineArrayToJSON();
	$('#lyricScript').html(html);
	currentLyricView = "SCRIPT_VIEW";
}

function enableLyricWordView() {
	if (currentLyricView === "WORD_VIEW") {
	} else if (currentLyricView === "TEXT_VIEW") {
		$('#lyricText').hide();
		$('#lyricScript').hide();
		$('#lyrics').show();
		convertLyricTextToWords();
	} else if (currentLyricView === "SCRIPT_VIEW") {
		$('#lyrics').html(generateLyrics($.parseJSON($('#lyricScript').val())));
		$('#lyricText').hide();
		$('#lyricScript').hide();
		$('#lyrics').show();
		addClickToLyrics();
	}
	currentLyricView = "WORD_VIEW";
}

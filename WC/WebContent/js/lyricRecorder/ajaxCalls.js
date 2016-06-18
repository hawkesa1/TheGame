function loadATrack(selectedValue) {
	var audio = document.getElementById('audio');
	var source = document.getElementById('audioSrc');
	source.src = mp3Location + selectedValue + ".mp3";
	
	loadWaveForm(selectedValue);
	loadLyricsData(selectedValue);
	currentSongId = selectedValue;
	audio.load();
	audio.addEventListener('loadedmetadata', function() {
		trackDuration = document.getElementById('audio').duration * 100;
	});

	$('#lyricText').hide();
	$('#lyricScript').hide();
	$('#lyrics').show();
	currentLyricView = "WORD_VIEW";

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
		waveForm = new WaveForm(500, 1, X_MOVE, 200, 200, POINT_SPACING,
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
		},
		error : function(xhr) {
			//alert("An error occured: " + xhr.status + " " + xhr.statusText);
			generateLyricData("");
		}
	});
	function generateLyricData(text) {
		lineArray = text;
		$('#lyrics').html(generateLyrics(lineArray));
		addClickToLyrics();
	}
}


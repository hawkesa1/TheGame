
function loadATrack(selectedValue) {
	var audio = document.getElementById('audio');
	var source = document.getElementById('audioSrc');
	source.src = mp3Location + selectedValue + ".MP3";
	loadWaveForm(selectedValue);
	loadLyricsData(selectedValue);
	currentSongId = selectedValue;
	audio.load();
	audio.addEventListener('loadedmetadata', function() {
		trackDuration = document.getElementById('audio').duration * 100;
	});
	for (var i = 0; i < availableTracks.length; i++) {
		if (availableTracks[i].uniqueId == selectedValue) {
			$('#trackTitle').html(availableTracks[i].title);
			$('#trackArtist').html(availableTracks[i].artist);
			$('#trackAlbum').html(availableTracks[i].album);
		}
	}
	$("#loadTrack").val(selectedValue);
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
	function successfullySavedLyrics(mp3MetaData1) {
		var mp3MetaData=JSON.parse(mp3MetaData1);
		var text=mp3MetaData.title ? mp3MetaData.title : mp3MetaData.uniqueId;
		$('#downloadableLink').html("<a href='"+downloadableMp3Location + mp3MetaData.uniqueId+".MP3' download='"+text+".MP3'>"+text+".MP3</a>");
	}
}

var anAvailableTrack;

function loadUser(trackToLoadOnCompletion) {
	$.ajax({
		type : 'GET',
		url : './GetAvailableTracks',
		data : {
			"userId" : "hawkesa",
		},
		success : function(text) {
			availableTracks = new Array();
			for (var i = 0; i < text.mp3MetaDatas.length; i++) {
				anAvailableTrack = new TrackObject();
				anAvailableTrack.title = text.mp3MetaDatas[i].title;
				anAvailableTrack.album = text.mp3MetaDatas[i].album;
				anAvailableTrack.artist = text.mp3MetaDatas[i].artist;
				anAvailableTrack.uniqueId = text.mp3MetaDatas[i].uniqueId;
				availableTracks[i] = anAvailableTrack;
				addTrack(text.mp3MetaDatas[i].uniqueId,
						text.mp3MetaDatas[i].title)
			}
			if (trackToLoadOnCompletion === 'first') {
				loadATrack(text.mp3MetaDatas[0].uniqueId);
			} else if (trackToLoadOnCompletion === 'last') {
				loadATrack(text.mp3MetaDatas[text.mp3MetaDatas.length-1].uniqueId);
			} else {
				// do nothing
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
		url : './resources/wavForm/' + wavFormFile + '.TXT',
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
		waveForm = new WaveForm(500, 1, X_MOVE, 140, 200, POINT_SPACING,
				wavePoints);
		animate();
	}
}

function loadLyricsData(wavFormFile) {
	$.ajax({
		type : 'GET',
		url : './resources/mp3MetaData/' + wavFormFile + '.json',
		data : null,
		cache : false,
		success : function(text) {
			generateLyricData(text);
		},
		error : function(xhr) {
			// alert("An error occured: " + xhr.status + " " + xhr.statusText);
			generateLyricData("");
		}
	});
	function generateLyricData(text) {
		
		console.log("alex")
		console.log(text);
		
		
		if (text.lyricRecorderSynchronisedLyrics !="")
		{
			console.log("loading synchronised lyrics");
			resetStuff();
			lineArray=JSON.parse(text.lyricRecorderSynchronisedLyrics);
			$('#lyrics').html(generateLyrics(lineArray));
			addClickToLyrics();
		}	else if(text.unsynchronisedLyrics !="")
		{
			console.log ("loading unsycnhronised lyrics");
			resetStuff();
			enableLyricTextView(text.unsynchronisedLyrics);
			
		}
		else
		{
			console.log ("No lyrics found");
			resetStuff();
			enableLyricTextView("Please enter some lyrics here ...")
		}	
		
		
		
	}
}

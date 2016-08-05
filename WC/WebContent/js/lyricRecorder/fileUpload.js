function loadUploader() {

	console.log("Loading Uploader");

	var holder = document.getElementById('holder');
	var tests = {
		filereader : typeof FileReader != 'undefined',
		dnd : 'draggable' in document.createElement('span'),
		formdata : !!window.FormData,
		progress : "upload" in new XMLHttpRequest
	};
	var support = {
		filereader : document.getElementById('filereader'),
		formdata : document.getElementById('formdata'),
		progress : document.getElementById('progress')
	}
	var acceptedTypes = {
		'image/png' : true,
		'image/jpeg' : true,
		'image/gif' : true
	}
	var progress = document.getElementById('uploadprogress'), fileupload = document
			.getElementById('upload');

	"filereader formdata progress".split(' ').forEach(function(api) {
		if (tests[api] === false) {
			support[api].className = 'fail';
		} else {
			// FFS. I could have done el.hidden = true,
			// but IE doesn't support
			// hidden, so I tried to create a polyfill
			// that would extend the
			// Element.prototype, but then IE10 doesn't
			// even give me access
			// to the Element object. Brilliant.
			// support[api].className = 'hidden';
		}
	});

	function setMessage(file) {
		console.log(file.type);
		// acceptedTypes[file.type]

	}
	function readfiles(files) {

		var formData = tests.formdata ? new FormData() : null;
		var doAnUpload = false;

		var file;
		for (var i = 0; i < files.length; i++) {
			file = files[i]
			if (i == 0) { // only allow 1 file at a time
				if (tests.formdata) {
					if (file.type.split("/")[0] === "audio") {

						if (file.size < (15 * 1024 * 1024)) {
							formData.append('file', file);
							doAnUpload = true;

							holder.innerHTML = '<p>Step 1/3 - Uploading '
									+ file.name
									+ ' ('
									+ (file.size ? (file.size / 1024 | 0)
											+ ' Kb)' : '') + '</p>';
						} else {
							holder.innerHTML = '<p> The maximum file size is 15 Mb.  This file is: '
									+ parseFloat((file.size / 1024 / 1024))
											.toFixed(2) + ' Mb</p>';
							holder.className = 'error'
						}
					} else {
						holder.innerHTML = '<p> This is not an audio file: '
								+ file.type + '</p>';
						holder.className = 'error'
					}

				}

			}

		}

		// now post a new XHR request
		if (tests.formdata && doAnUpload) {
			var xhr = new XMLHttpRequest();
			xhr.open('POST', './FileUploadServlet');
			xhr.onload = function(progressEvent) {
				// progress.value = progress.innerHTML = 100;
				holder.innerHTML += '<p>Step 3/3 Downloading file and preparing interface</p>';

				var json = JSON.parse(progressEvent.target.response);
				console.log(json);
				console.log(json.uniqueId);
				addTrack(json.uniqueId, json.title)

				
				//Only do this when runnign in eclipse!!!!
				holder.innerHTML += '<p>Waiting for eclipse to refresh ...</p>';
				setTimeout(function() {
					loadATrack(json.uniqueId);
					$('#trackTitle').html(json.title);
					$('#trackArtist').html(json.artist);
					$('#trackAlbum').html(json.album);
					holder.innerHTML += '<p>Processing Complete ...</p>';
				}, 5000);

				

				// $('#lyricText').html("helloAlex"+json.unsynchronisedLyrics);

				
			};

			if (tests.progress) {
				xhr.upload.onprogress = function(event) {
					if (event.lengthComputable) {
						var complete = (event.loaded / event.total * 100 | 0);
						progress.value = progress.innerHTML = complete;
						console.log(complete);
						if (complete == 100) {
							holder.innerHTML += '<p>Step 2/3 - Generating Waveform and coonverting file.  This process usually takes around 10 seconds, but may take longer depending on current server load.</p>';
						}
					}
				}
			}
			formData.append('userId', 'hawkesa');
			xhr.send(formData);
		}
	}

	if (tests.dnd) {
		holder.ondragover = function() {
			this.className = 'hover';
			return false;
		};
		holder.ondragend = function() {
			this.className = '';
			return false;
		};
		holder.ondragleave = function() {
			this.className = '';
			return false;
		};
		holder.ondrop = function(e) {
			this.className = '';
			e.preventDefault();
			readfiles(e.dataTransfer.files);
		}
	} else {
		fileupload.className = 'hidden';
		fileupload.querySelector('input').onchange = function() {
			readfiles(this.files);
		};
	}

}

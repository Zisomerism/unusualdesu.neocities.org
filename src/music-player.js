
var YOUTUBE_PLAYLIST_ID = "PLWtSSJ2a28vU";

var PLAYLIST = [
	{ id: "Bkl-QFC7_uw", artist: "s777n", title: "remains of a corrupted file" },
	{ id: "kXbeLiZY6jc", artist: "68+1", title: "your eyes" },
	{ id: "mA0j_xF29kQ", artist: "maple", title: "Fuzzyhead (feat. acounta, Girls Rituals)" },
	{ id: "_b4wNdBtWuk", artist: "maple", title: "WAHOO!!" },
	{ id: "-M_PZLNeOao", artist: "maple", title: "Having Fun And Playing" },
	{ id: "zT3FA8-mDbM", artist: "maple", title: "fr<3nd" },
	{ id: "SoV15-kKIPU", artist: "Sadness", title: "Untitled IV" },
	{ id: "YOVFLmIZoyc", artist: "Born An Abomination", title: "Awakening in The Morgue" },
	{ id: "oIMv1PFXyVs", artist: "Girls Rituals", title: "Pragmatism" },
	{ id: "uQijFLNjk1w", artist: "Zaphyre", title: "ghost" },
	{ id: "NwgheEwsVEM", artist: "CB1", title: "Hey!listen" },
	{ id: "FQOJSJHAowA", artist: "llwll", title: "Sadness - daydreaming (llwll Remix)" }
];

var currentIndex = 0;
var isPlaying = false;
var player = null;
var playerCreated = false;
var playerReady = false;
var apiLoading = false;
var progressFrameId = null;
var ui = {};

function formatTime(seconds) {
	if (seconds == null || isNaN(seconds) || seconds < 0) {
		return "--:--";
	}
	var m = Math.floor(seconds / 60);
	var s = Math.floor(seconds % 60);
	return m + ":" + (s < 10 ? "0" : "") + s;
}

function getTrack(index) {
	if (index >= 0 && index < PLAYLIST.length) {
		return PLAYLIST[index];
	}
	return { artist: "—", title: "Track " + (index + 1) };
}

function trackLabel(track) {
	return track.artist + " - " + track.title;
}

function ensurePlayerMount() {
	if (document.getElementById("mocp-yt-player")) {
		return;
	}
	var wrap = document.createElement("div");
	wrap.className = "mocp-audio";
	wrap.setAttribute("aria-hidden", "true");
	var mount = document.createElement("div");
	mount.id = "mocp-yt-player";
	wrap.appendChild(mount);
	document.body.appendChild(wrap);
}

function loadYouTubeAPI() {
	if (playerCreated) {
		return;
	}
	ensurePlayerMount();
	if (window.YT && window.YT.Player) {
		playlistController();
		return;
	}
	if (apiLoading) {
		return;
	}
	apiLoading = true;
	var tag = document.createElement("script");
	tag.src = "https://www.youtube.com/iframe_api";
	document.head.appendChild(tag);
	window.onYouTubeIframeAPIReady = playlistController;
}

function playlistController() {
	if (playerCreated) {
		return;
	}
	playerCreated = true;
	try {
		player = new YT.Player("mocp-yt-player", {
			height: "360",
			width: "640",
			playerVars: {
				modestbranding: 1,
				enablejsapi: 1,
				list: YOUTUBE_PLAYLIST_ID,
				listType: "playlist"
			},
			events: {
				onReady: onPlayerReady,
				onStateChange: onPlayerStateChange
			}
		});
	} catch (error) {
		playerCreated = false;
		setStatus("player failed to load");
	}
}

function wireControls() {
	if (!player || ui.controlsWired) {
		return;
	}
	ui.controlsWired = true;

	var i;
	for (i = 0; i < ui.playlistRows.length; i++) {
		(function(idx) {
			ui.playlistRows[idx].addEventListener("click", function() {
				currentIndex = idx;
				updatePlaylistHighlight();
				updatePlayingPanel();
				player.playVideoAt(idx);
			});
		})(i);
	}

	ui.playBtn.addEventListener("click", function() {
		player.playVideo();
	});
	ui.pauseBtn.addEventListener("click", function() {
		player.pauseVideo();
	});
	ui.prevBtn.addEventListener("click", function() {
		player.previousVideo();
	});
	ui.nextBtn.addEventListener("click", function() {
		player.nextVideo();
	});
	ui.progressTrack.addEventListener("click", function(e) {
		var rect = ui.progressTrack.getBoundingClientRect();
		if (rect.width <= 0 || typeof player.getDuration !== "function") {
			return;
		}
		var duration = player.getDuration();
		if (!duration || duration <= 0) {
			return;
		}
		var ratio = (e.clientX - rect.left) / rect.width;
		ratio = Math.max(0, Math.min(1, ratio));
		player.seekTo(ratio * duration);
		updateProgressUI();
	});
}

function onPlayerReady() {
	playerReady = true;
	wireControls();
	updatePlayingPanel();
}

function onPlayerStateChange(event) {
	if (event.data === YT.PlayerState.PLAYING) {
		isPlaying = true;
		var idx = player.getPlaylistIndex();
		if (idx >= 0) {
			currentIndex = idx;
		}
		updatePlaylistHighlight();
		updatePlayingPanel();
		startProgressLoop();
	} else if (event.data === YT.PlayerState.PAUSED) {
		isPlaying = false;
		stopProgressLoop();
		updateProgressUI();
		updatePlayingPanel();
	} else {
		isPlaying = false;
		stopProgressLoop();
		updatePlayingPanel();
	}
}

function stopProgressLoop() {
	if (progressFrameId) {
		cancelAnimationFrame(progressFrameId);
		progressFrameId = null;
	}
}

function startProgressLoop() {
	stopProgressLoop();
	function tick() {
		if (!isPlaying || !player) {
			return;
		}
		updateProgressUI();
		progressFrameId = requestAnimationFrame(tick);
	}
	progressFrameId = requestAnimationFrame(tick);
}

function updateProgressUI() {
	if (!playerReady || typeof player.getCurrentTime !== "function") {
		return;
	}
	var current = player.getCurrentTime();
	var duration = player.getDuration();
	ui.elapsed.textContent = formatTime(current);
	ui.remaining.textContent = formatTime(duration > 0 ? Math.max(0, duration - current) : null);
	if (duration > 0) {
		ui.progressFill.style.width = Math.min(100, (current / duration) * 100) + "%";
	}
	if (currentIndex >= 0 && currentIndex < ui.playlistRows.length && duration > 0) {
		var meta = ui.playlistRows[currentIndex].querySelector(".mocp-col-meta");
		if (meta) {
			meta.textContent = "[" + formatTime(duration) + "][YT]";
		}
	}
}

function setStatus(message) {
	ui.statusLine.textContent = message ? "> " + message : "";
}

function updatePlaylistHighlight() {
	var i;
	for (i = 0; i < ui.playlistRows.length; i++) {
		ui.playlistRows[i].classList.toggle("mocp-active", i === currentIndex);
	}
}

function updatePlayingPanel() {
	ui.nowPlaying.textContent = "> " + trackLabel(getTrack(currentIndex));
	if (ui.playingTitle) {
		ui.playingTitle.textContent = isPlaying ? "Playing..." : "Paused";
	}
}

function pause() {
	if (playerReady) {
		player.pauseVideo();
	}
	isPlaying = false;
	stopProgressLoop();
	updatePlayingPanel();
}

function onWindowOpen() {
	loadYouTubeAPI();
	updatePlaylistHighlight();
	updatePlayingPanel();
}

function onWindowClose() {
	pause();
}

function createPlaylistRow(track, index) {
	var row = document.createElement("button");
	row.type = "button";
	row.className = "mocp-playlist-row";

	var indexEl = document.createElement("span");
	indexEl.className = "mocp-col-index";
	indexEl.textContent = String(index + 1);

	var titleEl = document.createElement("span");
	titleEl.className = "mocp-col-title";
	titleEl.textContent = trackLabel(track);

	var metaEl = document.createElement("span");
	metaEl.className = "mocp-col-meta";
	metaEl.textContent = "[--:--][YT]";

	row.appendChild(indexEl);
	row.appendChild(titleEl);
	row.appendChild(metaEl);
	return row;
}

function init(containerEl) {
	var root = document.createElement("div");
	root.className = "mocp-player";

	var playlistBox = document.createElement("div");
	playlistBox.className = "mocp-box mocp-playlist";
	var playlistTitle = document.createElement("div");
	playlistTitle.className = "mocp-box-title";
	playlistTitle.textContent = "Playlist";
	var playlistScroll = document.createElement("div");
	playlistScroll.className = "mocp-playlist-scroll";
	ui.playlistRows = [];

	var i;
	for (i = 0; i < PLAYLIST.length; i++) {
		var row = createPlaylistRow(PLAYLIST[i], i);
		ui.playlistRows.push(row);
		playlistScroll.appendChild(row);
	}

	playlistBox.appendChild(playlistTitle);
	playlistBox.appendChild(playlistScroll);

	var playingBox = document.createElement("div");
	playingBox.className = "mocp-box mocp-playing";
	var playingTitle = document.createElement("div");
	playingTitle.className = "mocp-box-title";
	playingTitle.textContent = "Paused";
	ui.playingTitle = playingTitle;

	ui.nowPlaying = document.createElement("div");
	ui.nowPlaying.className = "mocp-now-playing";

	ui.statusLine = document.createElement("div");
	ui.statusLine.className = "mocp-status-line";

	ui.timeRow = document.createElement("div");
	ui.timeRow.className = "mocp-time-row";
	ui.elapsed = document.createElement("span");
	ui.elapsed.className = "mocp-elapsed";
	ui.elapsed.textContent = "0:00";
	ui.remaining = document.createElement("span");
	ui.remaining.className = "mocp-remaining";
	ui.remaining.textContent = "--:--";
	ui.timeRow.appendChild(ui.elapsed);
	ui.timeRow.appendChild(ui.remaining);

	ui.progressTrack = document.createElement("div");
	ui.progressTrack.className = "mocp-progress-track";
	ui.progressTrack.setAttribute("role", "slider");
	ui.progressTrack.setAttribute("aria-label", "Playback progress");
	ui.progressFill = document.createElement("div");
	ui.progressFill.className = "mocp-progress-fill";
	ui.progressTrack.appendChild(ui.progressFill);

	var controls = document.createElement("div");
	controls.className = "mocp-controls";

	ui.playBtn = document.createElement("button");
	ui.playBtn.type = "button";
	ui.playBtn.textContent = "Play";

	ui.pauseBtn = document.createElement("button");
	ui.pauseBtn.type = "button";
	ui.pauseBtn.textContent = "Pause";

	ui.prevBtn = document.createElement("button");
	ui.prevBtn.type = "button";
	ui.prevBtn.textContent = "Prev";

	ui.nextBtn = document.createElement("button");
	ui.nextBtn.type = "button";
	ui.nextBtn.textContent = "Next";

	controls.appendChild(ui.prevBtn);
	controls.appendChild(ui.playBtn);
	controls.appendChild(ui.pauseBtn);
	controls.appendChild(ui.nextBtn);

	playingBox.appendChild(playingTitle);
	playingBox.appendChild(ui.nowPlaying);
	playingBox.appendChild(ui.statusLine);
	playingBox.appendChild(ui.timeRow);
	playingBox.appendChild(ui.progressTrack);
	playingBox.appendChild(controls);

	root.appendChild(playlistBox);
	root.appendChild(playingBox);
	containerEl.appendChild(root);

	ensurePlayerMount();
	updatePlaylistHighlight();
	updatePlayingPanel();

	var win = containerEl.closest(".window");
	if (win) {
		var closeBtn = win.querySelector(".window-widget.close");
		if (closeBtn) {
			closeBtn.addEventListener("click", onWindowClose);
		}
	}
}

window.MusicPlayer = {
	init: init,
	onWindowOpen: onWindowOpen,
	onWindowClose: onWindowClose
};

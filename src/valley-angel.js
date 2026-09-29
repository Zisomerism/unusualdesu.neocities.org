(function() {
	if (!window.SiteTheme || !window.MusicPlayer) {
		return;
	}

	// https://browser.pony.house/
	var PONY_BASE = "https://browser.pony.house/";
	var PONY_CFG = {
		baseurl: PONY_BASE,
		allowDoubleClickControl: false,
		fadeDuration: 500,
		volume: 1,
		fps: 25,
		speed: 8,
		audioEnabled: false,
		showFps: false,
		showLoadProgress: true,
		speakProbability: 0.5,
		spawn: { angel: 32 },
		autostart: true
	};

	var angelEl = null;
	var ponyLoading = false;
	var dismissed = false;

	function musicWindowOpen() {
		var win = document.getElementById("window5");
		if (!win || !win.classList.contains("is-visible")) {
			return false;
		}
		return win.style.display === "initial" ||
			(win.style.display !== "none" && window.getComputedStyle(win).display !== "none");
	}

	function shouldShow() {
		return SiteTheme.getTheme() === "valley" &&
			musicWindowOpen() &&
			MusicPlayer.isPlaying() &&
			!dismissed;
	}

	function ensureAngel() {
		var win = document.getElementById("window5");
		if (!win) {
			return;
		}
		if (!angelEl) {
			angelEl = document.createElement("button");
			angelEl.type = "button";
			angelEl.className = "valley-angel";
			angelEl.setAttribute("aria-label", "Summon angels");
			var img = document.createElement("img");
			img.src = "angel_stand.gif";
			img.alt = "";
			img.width = 32;
			img.height = 32;
			img.decoding = "async";
			angelEl.appendChild(img);
			angelEl.addEventListener("click", onAngelClick);
			win.appendChild(angelEl);
		}
		angelEl.hidden = !shouldShow();
	}

	function loadScript(src, id) {
		return new Promise(function(resolve, reject) {
			if (id && document.getElementById(id)) {
				resolve();
				return;
			}
			var tag = document.createElement("script");
			tag.src = src;
			if (id) {
				tag.id = id;
			}
			tag.onload = function() {
				resolve();
			};
			tag.onerror = function() {
				reject(new Error("script failed: " + src));
			};
			document.head.appendChild(tag);
		});
	}

	function startBrowserPonies() {
		if (!window.BrowserPonies || !window.BrowserPoniesBaseConfig) {
			return;
		}
		BrowserPonies.setBaseUrl(PONY_CFG.baseurl);
		BrowserPonies.loadConfig(BrowserPoniesBaseConfig);
		BrowserPonies.loadConfig(PONY_CFG);
	}

	function onAngelClick() {
		if (ponyLoading) {
			return;
		}
		dismissed = true;
		if (angelEl) {
			angelEl.hidden = true;
		}
		ponyLoading = true;
		loadScript(PONY_BASE + "js/ponybase.js")
			.then(function() {
				return loadScript(PONY_BASE + "js/browserponies.js", "browser-ponies-script");
			})
			.then(startBrowserPonies)
			.catch(function() {
				console.warn("valley-angel: Browser Ponies failed to load");
			})
			.then(function() {
				ponyLoading = false;
			});
	}

	function refresh() {
		ensureAngel();
	}

	MusicPlayer.onPlaybackChange(refresh);

	new MutationObserver(refresh).observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["data-theme"]
	});

	var musicWin = document.getElementById("window5");
	if (musicWin) {
		new MutationObserver(refresh).observe(musicWin, {
			attributes: true,
			attributeFilter: ["class", "style"]
		});
	}

	refresh();
})();

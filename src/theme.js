(function() {
	var THEMES = ["amber", "green", "pink", "valley", "white"];
	var DEFAULT = "valley";

	function isValid(name) {
		return THEMES.indexOf(name) !== -1;
	}

	function applyTheme(name) {
		document.documentElement.setAttribute("data-theme", isValid(name) ? name : DEFAULT);
	}

	function setTheme(name) {
		if (!isValid(name)) {
			return false;
		}
		applyTheme(name);
		try {
			localStorage.setItem("site-theme", name);
		} catch (e) {}
		return true;
	}

	function getTheme() {
		return document.documentElement.getAttribute("data-theme") || DEFAULT;
	}

	if (!document.documentElement.getAttribute("data-theme")) {
		var saved = null;
		try {
			saved = localStorage.getItem("site-theme");
		} catch (e) {}
		applyTheme(saved);
	} else if (!isValid(getTheme())) {
		applyTheme(DEFAULT);
	}

	window.SiteTheme = {
		setTheme: setTheme,
		getTheme: getTheme,
		themes: THEMES
	};
})();

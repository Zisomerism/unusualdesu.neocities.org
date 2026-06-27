
var NAV_ITEMS = [
	{ id: "terminal", label: "Terminal", windowId: 1, icon: "icons/terminal.svg" },
	{ id: "contact", label: "Contact", windowId: 3, icon: "icons/contact.svg" },
	{ id: "about", label: "About", windowId: 4, icon: "icons/about.svg" }
];

var WINDOW_DEFS = [
	{
		id: 1,
		title: "Terminal",
		className: "window fade window-console",
		visible: false,
		style: "top: 120px; left: 80px;",
		contentClass: "console-pane"
	},
	{
		id: 2,
		title: "Programs",
		className: "window fade window-nav",
		visible: true,
		style: "top: 60px; left: 520px;",
		contentClass: "nav-pane"
	},
	{
		id: 3,
		title: "About",
		className: "window fade window-content",
		visible: false,
		style: "top: 100px; left: 200px;",
		contentClass: "content-pane",
		contentHTML: getAboutContent()
	},
	{
		id: 4,
		title: "Contact",
		className: "window fade window-content",
		visible: false,
		style: "top: 140px; left: 280px;",
		contentClass: "content-pane",
		contentHTML: getContactContent()
	}
];

function getAboutContent() {
	return [
		"<p class='logprimary'>I'm desu! I'm a hobbyist programmer and game developer of over 14 years!</p>",
		"<p class='logprimary'>I am genuinely passionate about making things people enjoy and helping others do the same.</p>",
		"<p class='logprimary'>If you want to support me, you can do that below.</p>",
		"<p class='logprimary'>For anything else check the contact section and don't be afraid to reach out!</p>",
		"<p class='logprimary'><a href='https://buymeacoffee.com/unusualdesu'><b>Buy me a coffee</b>https://buymeacoffee.com/unusualdesu</a></p>",
		"<p class='logprimary'>This site was last updated on: WORKFLOW_DATE_PLACEHOLDER</p>"
	].join("");
}

function getContactContent() {
	return [
		"<p class='logprimary'>Some places you can find me:</p>",
		"<p class='logprimary'><a href='https://github.com/Zisomerism'><b>My Github</b>https://github.com/Zisomerism</a></p>",
		"<p class='logprimary'><a href='https://steamcommunity.com/id/IHateLua'><b>My Steam</b>https://steamcommunity.com/id/IHateLua</a></p>",
		"<p class='logprimary'><a href='mailto:unusualdesu@protonmail.com'><b>Email Me?</b>unusualdesu@protonmail.com</a><br></p>",
		"<p class='logprimary'>If you want to commission me or ask questions, add me on discord: <b>unusualdesu</b></p>"
	].join("");
}

function createPhosphorHeader(title) {
	var header = document.createElement("div");
	header.className = "phosphor-header";

	var iconify = document.createElement("span");
	iconify.className = "window-widget iconify";
	iconify.setAttribute("aria-hidden", "true");

	var titleEl = document.createElement("p");
	titleEl.className = "windowTitle";
	titleEl.textContent = title;

	var closeBtn = document.createElement("span");
	closeBtn.className = "window-widget close";
	closeBtn.setAttribute("role", "button");
	closeBtn.setAttribute("aria-label", "Close");
	closeBtn.setAttribute("tabindex", "0");

	header.appendChild(iconify);
	header.appendChild(titleEl);
	header.appendChild(closeBtn);
	return header;
}

function createNavGrid() {
	var grid = document.createElement("div");
	grid.className = "nav-grid";

	for (var i = 0; i < NAV_ITEMS.length; i++) {
		(function(item) {
			var tile = document.createElement("button");
			tile.type = "button";
			tile.className = "nav-tile";
			tile.setAttribute("data-window-id", item.windowId);

			var img = document.createElement("img");
			img.src = item.icon;
			img.alt = "";
			img.className = "nav-icon";
			img.width = 48;
			img.height = 48;

			var label = document.createElement("span");
			label.className = "nav-label";
			label.textContent = item.label;

			tile.appendChild(img);
			tile.appendChild(label);
			tile.addEventListener("click", function() {
				openWindow(item.id);
			});
			grid.appendChild(tile);
		})(NAV_ITEMS[i]);
	}

	return grid;
}

function buildDesktop() {
	var group = document.createElement("div");
	group.className = "windowGroup";

	for (var i = 0; i < WINDOW_DEFS.length; i++) {
		var def = WINDOW_DEFS[i];
		var win = document.createElement("div");
		win.id = "window" + def.id;
		win.className = def.className;
		win.style.cssText = "position: absolute; " + def.style;
		if (def.visible) {
			win.style.display = "initial";
			win.style.opacity = "0.9";
			win.classList.add("is-visible");
		}

		win.appendChild(createPhosphorHeader(def.title));

		var main = document.createElement("div");
		main.className = "mainWindow " + def.contentClass;

		if (def.id === 2) {
			main.appendChild(createNavGrid());
		} else if (def.contentHTML) {
			main.innerHTML = def.contentHTML;
		}

		win.appendChild(main);
		group.appendChild(win);

		var btn = document.createElement("button");
		btn.id = "button" + def.id;
		btn.hidden = true;
		document.body.appendChild(btn);
	}

	document.body.appendChild(group);
}

function openWindow(idOrWindowId) {
	var windowId = idOrWindowId;
	if (typeof idOrWindowId === "string") {
		for (var i = 0; i < NAV_ITEMS.length; i++) {
			if (NAV_ITEMS[i].id === idOrWindowId) {
				windowId = NAV_ITEMS[i].windowId;
				break;
			}
		}
	}
	var el = document.getElementById("window" + windowId);
	if (!el) return;
	var isVisible = el.style.display === "initial" ||
		(el.style.display !== "none" && window.getComputedStyle(el).display !== "none");
	if (isVisible) {
		window.WindowEngine.activeWindow(el);
	} else {
		window.WindowEngine.fadeIn(el);
	}
	el.classList.add("is-visible");
	if (windowId === 1 && window.con) {
		window.con.input.focus();
	}
}

buildDesktop();

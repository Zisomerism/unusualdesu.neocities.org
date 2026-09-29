
var console_pane = document.querySelector("#window4 .console-pane");

var con = new SimpleConsole({
	handleCommand: handle_command,
	placeholder: "",
	autofocus: true,
	storageID: "console"
});
console_pane.appendChild(con.element);
window.con = con;

var evalResultSkip = {};

function formatEvalValue(value, isResult) {
	if (value === undefined) {
		return isResult ? evalResultSkip : "undefined";
	}
	if (value === null) {
		return "null";
	}
	if (typeof value === "object") {
		try {
			return JSON.stringify(value, null, 2);
		} catch (e) {
			return String(value);
		}
	}
	return String(value);
}

function logEvalText(text) {
	if (text === "") {
		return;
	}
	var line = document.createElement("div");
	line.className = "logprimary";
	line.textContent = text;
	con.log(line);
}

function runEval(command) {
	if (/^\s*$/.test(command)) {
		return;
	}
	var lines = [];
	var origLog = console.log;
	var origWarn = console.warn;
	var origError = console.error;

	function tee(orig) {
		return function() {
			var parts = [];
			for (var i = 0; i < arguments.length; i++) {
				parts.push(formatEvalValue(arguments[i], false));
			}
			lines.push(parts.join(" "));
			orig.apply(console, arguments);
		};
	}

	console.log = tee(origLog);
	console.warn = tee(origWarn);
	console.error = tee(origError);

	try {
		var result = eval(command);
		for (var j = 0; j < lines.length; j++) {
			logEvalText(lines[j]);
		}
		var formatted = formatEvalValue(result, true);
		if (formatted !== evalResultSkip) {
			logEvalText(formatted);
		}
	} catch (error) {
		con.error(error instanceof Error ? error.message : String(error));
	} finally {
		console.log = origLog;
		console.warn = origWarn;
		console.error = origError;
	}
}

var BREAK_PAGE_ONELINER =
	'document.querySelectorAll(".window").forEach(function(w){ w.style.transform = "rotate(" + (Math.random() * 60 - 30).toFixed(1) + "deg)"; }); ' +
	'(function walk(node){ if (node.nodeName === "SCRIPT" || node.nodeName === "STYLE") return; if (node.nodeType === 3) node.textContent = "oops!"; else for (var i = 0; i < node.childNodes.length; i++) walk(node.childNodes[i]); })(document.body);';

function fillTerminalBreakPrank() {
	con.input.value = BREAK_PAGE_ONELINER;
	con.input.focus();
}

window.fillTerminalBreakPrank = fillTerminalBreakPrank;

function displayCommands(){
	con.logHTML("<div class='logprimary'>Welcome! This is a simple javascript console</div>");
	con.logHTML("<div class='logprimary'><a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference' target='_blank' rel='noopener noreferrer'><b>JS REF</b> man javascript(7) — developer.mozilla.org/en-US/docs/Web/JavaScript/Reference</a></div><br>");
	con.logHTML("<div class='logprimary'>You can also use the theme command to change the theme of the site from this terminal by typing 'theme' and then the name of the theme you want to change to.</div>");
	con.logHTML("<div class='logprimary'><a href='#' title='funny one liner' onclick='fillTerminalBreakPrank(); return false;'>\uD83D\uDD28</a></div>");
}

displayCommands();

function displayAbout() {
	openWindow("about");
	con.logHTML("<div class='logprimary'>Opening about page...</div>");
}

function displayLinks() {
	openWindow("contact");
	con.logHTML("<div class='logprimary'>Opening contact page...</div>");
}

function handle_command(command){
	if(command.match(/^<3$/i)){
		con.logHTML("<div class='logprimary'>❤</div>");
	}else if(command.match(/^theme$/i)){
		var theme_list = window.SiteTheme ? window.SiteTheme.themes.join(", ") : "amber";
		con.logHTML("<div class='logprimary'>Usage: theme &lt;name&gt; ("+theme_list+")</div>");
	}else if(command.match(/^theme\s+(\w+)$/i)){
		var theme_name = command.match(/^theme\s+(\w+)$/i)[1].toLowerCase();
		if(window.SiteTheme && window.SiteTheme.setTheme(theme_name)){
			con.logHTML("<div class='logprimary'>Theme set to "+theme_name+".</div>");
		}else{
			con.logHTML("<div class='logprimary'>Unknown theme: "+theme_name+"</div>");
		}
	}else if(command.match(/^Help$/i)){
		displayCommands()
	}else if(command.match(/^(About|Info)$/i)){
		displayAbout()
	}else if(command.match(/^(Links|Contact|Socials|Email|Steam|Discord|Github|Stoat)$/i)){ 
		displayLinks()
	}else if(command.match(/^(Hi|Hello|Oi|Greetings|Hey|Heya|Hewwo)$/i)){
		con.logHTML("<div class='logprimary'>Hi, I hope you're doing well :)</div>");
	}else if(command.match(/^Nut$/i)){
		con.logHTML("<div class='logprimary'>Nut</div>");
	}else if(command.match(/^Desu$/i)){
		con.logHTML("<div class='logprimary'>Desu</div>");
	}else if(command.match(/^(:3|x3)$/i)){
		con.logHTML("<div class='logprimary'>:3</div>");
	}else if(command.match(/^Glomp$/i)){
		con.logHTML("<div class='logprimary'>*Glomps u*</div>");
	}else if(command.match(/^xD$/i)){
		con.logHTML("<div class='logprimary'>x3</div>");
	}else if(command.match(/^uwu$/i)){
		con.logHTML("<div class='logprimary'>owo</div>");
	}else if(command.match(/^owo$/i)){
		con.logHTML("<div class='logprimary'>uwu</div>");
	}else{
		runEval(command);
	}
};

window.WindowEngine.activeWindow(document.getElementById("window2"));

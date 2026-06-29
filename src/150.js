
var console_pane = document.querySelector("#window4 .console-pane");

var con = new SimpleConsole({
	handleCommand: handle_command,
	placeholder: "",
	autofocus: true,
	storageID: "console"
});
console_pane.appendChild(con.element);
window.con = con;

function displayCommands(){
	con.logHTML("<div class='logprimary'>Welcome! This is a simple javascript console. You can run javascript locally to break the site if you want.</div>");
	con.logHTML("<div class='logprimary'><a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference' target='_blank' rel='noopener noreferrer'><b>JS REF</b>man javascript(7) — developer.mozilla.org/en-US/docs/Web/JavaScript/Reference</a></div><br>");
	con.logHTML("<div class='logprimary'>You can also use the theme command to change the theme of the site from this terminal by typing 'theme' and then the name of the theme you want to change to.</div>");
}

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
		try{
			con.logHTML("<div class='logprimary'>"+eval(command)+"</div>");
		}catch(error){
			con.logHTML("<div class='logprimary'>"+error+"</div>");
		}
	}
};

window.WindowEngine.activeWindow(document.getElementById("window2"));

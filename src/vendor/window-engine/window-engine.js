/* Window Engine - MIT License - Copyright (c) 2019 Gauthier Staehler */
/* Patched: activeWindow fix, no viewport override, exported API, close widget support */

const lastWindow = document.getElementsByClassName("windowGroup")[0].lastElementChild.id.substring(6);
const active = document.getElementsByClassName("window");

for (let i = 1; i <= lastWindow; i++) {
    createWindow(i);
}

function createWindow(id) {
    let windowID = document.getElementById("window" + id);
    let headerID = windowID.firstElementChild;
    headerID.id = "window" + id + "header";

    let closeBtn = headerID.querySelector(".window-widget.close");
    if (!closeBtn) {
        closeBtn = document.createElement("b");
        closeBtn.className = "window-widget close";
        closeBtn.innerHTML = "";
        headerID.appendChild(closeBtn);
    }
    closeBtn.id = "closeButton" + id;

    closeBtn.onclick = function () {
        fadeOut(windowID);
    };
    document.getElementById("button" + id).onclick = function () {
        if (windowID.style.display === "initial") {
            activeWindow(windowID);
        } else {
            windowID.style.position = "absolute";
            fadeIn(windowID);
        }
    };
    dragElement(windowID);
}

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if ("ontouchstart" in document.documentElement) {
        var pos1touch = 0,
            pos2touch = 0,
            pos3touch = 0,
            pos4touch = 0;
    }
    if (document.getElementById(elmnt.id + "header")) {
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        document.getElementById(elmnt.id + "header").ontouchstart = dragMouseDown;
    }

    function dragMouseDown(e) {
        if (window.matchMedia("(max-width: 768px)").matches) {
            return;
        }
        if (e.target.closest(".window-widget.close")) {
            return;
        }
        if (!("ontouchstart" in document.documentElement)) {
            e.preventDefault();
        }
        pos3 = e.clientX;
        pos4 = e.clientY;
        if ("ontouchstart" in document.documentElement) {
            try {
                pos3touch = e.touches[0].clientX;
                pos4touch = e.touches[0].clientY;
            } catch(error) {}
        }
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        document.ontouchend = closeDragElement;
        document.ontouchmove = elementDrag;
        activeWindow(document.getElementById(elmnt.id));
    }

    function elementDrag(e) {
        e.preventDefault();
        if ("ontouchstart" in document.documentElement) {
            pos1touch = pos3touch - e.touches[0].clientX;
            pos2touch = pos4touch - e.touches[0].clientY;
            pos3touch = e.touches[0].clientX;
            pos4touch = e.touches[0].clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2touch) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1touch) + "px";
        } else {
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.ontouchmove = null;
    }
}

function fadeIn(elmnt) {
    elmnt.classList.add("is-visible");
    elmnt.style.opacity = 0;
    elmnt.style.display = "initial";
    if (elmnt.classList.contains("fade")) {
        var opacity = 0;
        var timer = setInterval(function () {
            opacity += 30 / 70;
            if (opacity >= 1) {
                clearInterval(timer);
                opacity = 0.9;
            }
            elmnt.style.opacity = opacity;
            activeWindow(elmnt);
        }, 50);
    } else {
        elmnt.style.opacity = "0.9";
        activeWindow(elmnt);
    }
}

function fadeOut(elmnt) {
    if (elmnt.classList.contains("fade")) {
        var opacity = 1;
        var timer = setInterval(function () {
            opacity -= 30 / 70;
            if (opacity <= 0) {
                clearInterval(timer);
                opacity = 0;
                elmnt.style.display = "none";
                elmnt.classList.remove("is-visible");
            }
            elmnt.style.opacity = opacity;
        }, 50);
    } else {
        elmnt.style.display = "none";
        elmnt.classList.remove("is-visible");
    }
}

function activeWindow(elmnt) {
    for (let i = active.length - 1; i > -1; i--) {
        active[i].classList.remove("windowActive");
    }
    elmnt.classList.add("windowActive");
}

window.WindowEngine = { fadeIn: fadeIn, fadeOut: fadeOut, activeWindow: activeWindow, createWindow: createWindow };

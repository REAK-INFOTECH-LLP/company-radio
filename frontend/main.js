let player = document.getElementById("radio");
let playpause = document.getElementById("playpause");
let endTime = document.getElementById("endTime");
let currentTime = document.getElementById("currentTime");
// Make it autoplay
//player.play();

function loading(){
    let elem = document.getElementById("loadAnimation");
    let animationFrame = ["-","\\","|","/"];
    let count = 0;
    let timer = setInterval(function(){
        count++;
        elem.innerHTML = animationFrame[(count % 4)];
    },250);
    return timer;
}

var loadTimer = loading();

function progressBar(){
    progress = document.getElementById("progress");
    let text = "<span class=\"bracket\">[</span> ";
    let percentage = (player.currentTime / player.duration) * 50;
    for (let i=0; i<50; i++){
        if (i<percentage){
            text += "&blk34;";
        } else {
            text += "&blk14;";
        }
    }
    text += " <span class=\"bracket\">]</span>";
    progress.innerHTML = text;
}


function volumeBar(){
    progress = document.getElementById("volumeBlock");
    let text = "<span class=\"bracket\">[</span> ";
    for (let i=0; i<10; i++){
        if (i<(player.volume * 10)){
            text += "&block; ";
        } else {
            text += "<span class=\"hide\">&block; </span>";
        }
    }
    text += " <span class=\"bracket\">]</span>";
    progress.innerHTML = text;
}

function showEndTime(){
    endTime.innerHTML = new Date(player.duration * 1000).toISOString().substr(14, 5);
}

function showCurrentTime(){
    let elapsedTime = new Date(player.currentTime * 1000).toISOString().substr(14, 5);
    currentTime.innerHTML = elapsedTime;
}

player.onpause = function() {
    playpause.innerHTML = " [ <i class=\"fa fa-pause\"></i> ] ";
};

player.onplay = function() {
    playpause.innerHTML = " [ <i class=\"fa fa-play\"></i> ] ";
};

player.onvolumechange = function() {
    volumeBar();
}

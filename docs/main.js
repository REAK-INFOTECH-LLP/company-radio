let player = document.getElementById("radio");
let playpause = document.getElementById("playpause");
let endTime = document.getElementById("endTime");
let currentTime = document.getElementById("currentTime");
let progressTimer = null;
const SOCKET_SERVER = "ws://95.217.122.86:9999/";
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
    let percentage = (player.currentTime / player.duration) * 40;
    for (let i=0; i<40; i++){
        if (i<percentage){
            text += "&blk34;";
        } else {
            text += "&blk14;";
        }
    }
    text += " <span class=\"bracket\">]</span>";
    progress.innerHTML = text;
    showCurrentTime();
    showEndTime();
}


function volumeBar(){
    progress = document.getElementById("volumeBlock");
    let text = " [ ";
    for (let i=0; i<10; i++){
        if (i<(player.volume * 10)){
            text += "&block; ";
        } else {
            text += "<span class=\"hide\">&block; </span>";
        }
    }
    text += " ] ";
    progress.innerHTML = text;
}

function showEndTime(){
    try {
        endTime.innerHTML = new Date(player.duration * 1000).toISOString().substr(14, 5);
    } catch {
        console.log("Music not buffered");
    }
}

function showCurrentTime(){
    let elapsedTime = new Date(player.currentTime * 1000).toISOString().substr(14, 5);
    currentTime.innerHTML = elapsedTime;
}


function setSongInformation(data){
    if (localStorage.getItem("volume") === null){
        player.volume = 0.5;
    } else {
        player.volume = localStorage.getItem("volume");
    }
    volumeBar();
    document.getElementById("songcover").src = data[2];
    document.getElementById("songname").innerHTML = data[0];
    document.getElementById("requestUser").innerHTML = data[5];
    document.getElementById("connectedClients").innerHTML = data[7];
}

player.onpause = function() {
    playpause.innerHTML = " [ <i class=\"fa fa-play\"></i> ] ";
    clearInterval(progressTimer);
};

player.onplay = function() {
    playpause.innerHTML = " [ <i class=\"fa fa-pause\"></i> ] ";
    progressTimer = setInterval(() => {progressBar()},500);
    showEndTime();
};

player.onvolumechange = function() {
    localStorage.setItem("volume", player.volume);
    volumeBar();
}

player.onended = function() {
    setTimeout(() => {playback()},2000);
}


document.addEventListener('keyup', (e) => {
    if (e.code === "ArrowUp" || e.code === "ArrowRight"){
       player.volume += 0.1;
    }
    if (e.code === "ArrowDown" || e.code === "ArrowLeft"){
       player.volume -= 0.1;
    }
    if (e.code === "Space"){
       if(player.paused){
           playback();
       } else {
           player.pause()
       }
    }
});


var socket = io.connect(SOCKET_SERVER, { transports: ['websocket'] });

socket.on('connect', () => {
    document.getElementById("init").style.display = "none";
    document.getElementById("playerarea").style.visibility = "visible";
    playback();
});

socket.on("clientUpdate", (response) => {
    console.log(response);
    response = response.text;
    document.getElementById("connectedClients").innerHTML = response;
});

function playback(){
    try{
        socket.emit('playback', { text: 'fetch' }, function(response) {
            response = response.text;
            response = JSON.parse(response)
            setSongInformation(response);
            let player = document.getElementById("radio");
            player.src = response[1];
            player.currentTime = (Date.now() / 1000) - response[6];
            player.play();
        });
    } catch {
        setTimeout(() => {location.reload()},2000);
    }
}

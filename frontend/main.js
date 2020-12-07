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

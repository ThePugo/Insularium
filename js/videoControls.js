// Script para las funcionalidades relacionadas con los videos
document.addEventListener("DOMContentLoaded", function(){

    // Obtener elementos a través del id
    var videoCine = document.getElementById("video-cines");
    var speedOptions = document.querySelector(".speed-options");
    var progressBar = document.querySelector(".progress-bar");
    var currentTime = document.querySelector(".current-time");
    var endTime = document.querySelector(".end-time");

    videoCine.addEventListener('loadedmetadata', function() {
        // Obtener la duración del video en segundos
        var duration = videoCine.duration;
        // Convertir la duración a minutos y segundos
        var videoCineMin = Math.floor(duration / 60);
        var videoCineSec = Math.floor(duration % 60);
        console.log("duracion del video: "+ videoCineMin+" min, "+videoCineSec+" segundos");

        endTime.innerHTML = returnCurrentTime(videoCineMin, videoCineSec);
        currentTime.innerHTML = returnCurrentTime(0,0);

        selectVideoSpeed(videoCine, speedOptions);
        updateProgressBar(videoCine, progressBar);
        updateCurrentTime(videoCine, currentTime);
    });

    videoCine.currentTime = 0;
})

function updateProgressBar(vid, bar){
    vid.addEventListener("timeupdate", function(e){
        bar.style.width = `${(e.target.currentTime / vid.duration) * 100}%`;
    })
}

function updateCurrentTime(vid, timer){
    vid.addEventListener("timeupdate", function(e) {
        curMin = Math.floor(e.target.currentTime / 60);
        curSec = Math.floor(e.target.currentTime - (curMin * 60));
        timer.innerHTML = returnCurrentTime(curMin, curSec);
    })
}

function selectVideoSpeed(vid, opt){
    console.log("SELECCION DE VELOCIDAD DE VIDEO");
    opt.addEventListener("click", function(e){
        vid.playbackRate = e.target.textContent;
    })
}

function returnCurrentTime(min, sec){
    if(min < 10  && sec >= 10){
        return "0"+min + ":" + sec;
    }
    else if(min < 10 && sec < 10){
        return "0"+min + ":" + "0" + sec;
    }
    else{
        return min + ":" + sec;
    }
}

function playVideo(){
    var x = document.getElementById("video-cines");
    var z = document.querySelector(".play-btn i");
    changePlayPauseBtn(z, x);
    
}

function changePlayPauseBtn(btn, vid){
    if(btn.classList.contains("fa-play")){
        vid.play();
        btn.classList.replace("fa-play", "fa-pause");
    } else {
        vid.pause();
        btn.classList.replace("fa-pause", "fa-play");
    }
}

function forwardVideo() {
    var x = document.getElementById("video-cines");
    x.currentTime += 5;
}

function backwardVideo() {
    var x = document.getElementById("video-cines");
    x.currentTime -= 5;
    
}

function fullscreen() {
    var x = document.getElementById("video-cines");
    x.requestFullscreen();
}

function clickPartVideo(vid, bar){
    bar.addEventListener("click", function(e) {
        var timelineWidth = vid.clientWidth;
        vid.currentTime = (e.offsetX / timelineWidth) * vid.duration;
    });
}
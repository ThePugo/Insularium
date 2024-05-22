// Script para las funcionalidades relacionadas con los videos
document.addEventListener("DOMContentLoaded", function(){

    // Obtener elementos a través del id
    var videoCine = document.getElementById("video-cines");
    var speedOptions = document.querySelector(".speed-options");
    var progressBar = document.querySelector(".progress-bar");
    var currentTime = document.querySelector(".current-time");
    var endTime = document.querySelector(".end-time");
    
    setupVolumeControl(),

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

function setupVolumeControl() {
    var audio = document.getElementById("video-cines")
    var volumeSlider = document.getElementById("volume-slider")
    var volumeIcon = document.getElementById("volume-icon");
    audio.volume = .5;
    volumeSlider.value = .5;

    updateVolumeIcon(audio.volume, volumeIcon);
    updateBarVolume(audio.volume, volumeSlider);

    volumeSlider.addEventListener("input", function() {
        const volume = volumeSlider.value;
        audio.volume = volume;
        updateVolumeIcon(volume, volumeIcon);
        updateBarVolume(volume, volumeSlider);
    });

    volumeIcon.addEventListener("click", function() {
        volumeSlider.value = 0;
        audio.volume = 0;
        updateVolumeIcon(0, volumeIcon);
        updateBarVolume(0, volumeSlider);
    });
}

function updateVolumeIcon(volume, volumeIcon) {
    volumeIcon.className = volume <= 0.05 ? "fas fa-volume-mute" : volume > 0.05 && volume <= 0.5 ? "fas fa-volume-down" : "fas fa-volume-up";
}

function updateBarVolume(volume, volumeSlider) {
    volumeSlider.style.background = `linear-gradient(to right, red 0%, red ${volume * 100}%, #ddd ${volume * 100}%, #ddd 100%)`;
}

// function updateVolumeIcon(volume, volumeIcon) {
//     volumeIcon.className = volume <= .05 ? "fas fa-volume-mute" : volume > .05 && volume <= .5 ? "fas fa-volume-down" : "fas fa-volume-up"
// }

// function updateBarVolume(volume, volumeSlider) {
//     const color = 0 == volume ? "#aaa" : `rgb(${255 * (1 - volume)}, ${255 * volume}, 0)`;
//     volumeSlider.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${100 * volume}%, #fff ${100 * volume}%, #fff 100%)`
// }
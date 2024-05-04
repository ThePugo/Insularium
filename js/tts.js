document.addEventListener('DOMContentLoaded', function () {
    function getSpanishVoice(voices) {
        return voices.find(voice => voice.lang.startsWith('es'));
    }

    var ttsTrigger = document.getElementById('tts-trigger');
    if (ttsTrigger) {
        ttsTrigger.addEventListener('click', function () {
           if (!speechSynthesis.speaking){
                const descriptionText = document.getElementById('film-description').textContent;
                if (descriptionText !== "") {
                    const utterThis = new SpeechSynthesisUtterance(descriptionText);

                    const voices = speechSynthesis.getVoices();
                    utterThis.voice = getSpanishVoice(voices);

                    utterThis.pitch = 1.0;
                    utterThis.rate = 1.0;

                    utterThis.onerror = function (event) {
                        console.error("Error en la síntesis de voz");
                    };

                    utterThis.onend = function (event) {
                        ttsTrigger.src = "images/tts.png";
                    };

                    speechSynthesis.speak(utterThis);
                    ttsTrigger.src = "images/stop.png";
                } else {
                    console.log("No hay descripción disponible para leer.");
                }
            }
            else {
                ttsTrigger.src = "images/tts.png";
                speechSynthesis.cancel();
            }
        });
    } else {
        console.log('El elemento tts-trigger no fue encontrado.');
    }
});

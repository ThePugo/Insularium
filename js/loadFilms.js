var allMovies = [];
var moviesLoaded = loadAllMovies();


async function loadAllMovies() {
    try {
        const response = await fetch('cines_cartelera.json');
        const data = await response.json();
        parseJSON(data);
        data.subEvent.forEach(event => {
            if (event.workPerformed) {
                allMovies.push({
                    title: event.workPerformed.name || 'Título no disponible',
                    duration: event.workPerformed.duration ? event.workPerformed.duration.replace('T0M', '').replace('S', ' min') : 'Duración no disponible',
                    genre: event.workPerformed.genre || 'Género no disponible',
                    director: event.workPerformed.director ? event.workPerformed.director.name : 'Director no disponible',
                    stars: event.workPerformed.actor ? event.workPerformed.actor.map(actor => actor.name).join(', ') : 'Actores no disponibles',
                    image: event.workPerformed.image || 'images/default-image.jpg',
                    trailerUrl: event.workPerformed.trailer ? event.workPerformed.trailer.contentUrl : '#',
                    readMore: event.workPerformed.sameAs ? event.workPerformed.sameAs : '#'
                });
            }
        });
    } catch (error) {
        console.error('Failed to load movies:', error);
    }
}

function parseJSON(data) {
    let jsonLDs = [];
    let processedSubEvents = new Set(); // Conjunto para almacenar identificadores de subEventos ya procesados

    data.subEvent.forEach(event => {
        event.subEvent.forEach(subEvent => {
            // Usamos un identificador único para cada subEvento, como 'id' o similar
            if (!processedSubEvents.has(subEvent.id)) {
                jsonLDs.push(generateJsonLD(subEvent, event.workPerformed));
                processedSubEvents.add(subEvent.id); // Marcar como procesado
            }
        });
    });

    const jsonLDWrapper = {
        "@context": "https://schema.org",
        "@graph": jsonLDs
    };

    document.getElementById('WebSemantica_cines').innerHTML = JSON.stringify(jsonLDWrapper);
}



function generateJsonLD(subEvent, workPerformed) {
    // Genera el marcado JSON-LD para un sub-evento específico, incluyendo información de la película.
    return {
        "@context": "https://schema.org",
        "@type": "ScreeningEvent",
        "name": subEvent.name,
        "startDate": subEvent.doorTime ? subEvent.doorTime[0] : undefined,
        "endDate": subEvent.doorTime ? subEvent.doorTime[subEvent.doorTime.length - 1] : undefined,
        "location": {
            "@type": "MovieTheater",
            "name": subEvent.location.name,
            "photo": subEvent.location.photo,
            "sameAs": subEvent.location.sameAs,
            "screenCount": subEvent.location.screenCount,
            "address": subEvent.location.location[0].address,
            "geo": subEvent.location.location[1].geo
        },
        "workPerformed": {
            "@type": "Movie",
            "name": workPerformed.name,
            "image": workPerformed.image,
            "duration": workPerformed.duration.replace('T0M', '').replace('S', ' min'),
            "description": workPerformed.description,
            "genre": workPerformed.genre,
            "inLanguage": workPerformed.inLanguage,
            "director": {
                "@type": "Person",
                "name": workPerformed.director.name
            },
            "actor": workPerformed.actor.map(actor => ({
                "@type": "Person",
                "name": actor.name
            })),
            "aggregateRating": workPerformed.aggregateRating.map(rating => ({
                "@type": "AggregateRating",
                "ratingValue": rating.ratingValue,
                "image": rating.image,
                "sameAs": rating.sameAs
            })),
            "trailer": {
                "@type": "VideoObject",
                "contentUrl": workPerformed.trailer.contentUrl
            }
        }
    };
}
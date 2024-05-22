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
        // Esta función extrae eventos de 'subEvent' y genera marcado JSON-LD para cada uno.
        let jsonLDs = [];
        data.subEvent.forEach(event => {
            let jsonLD = generateJsonLD(event);
            jsonLDs.push(jsonLD);
        });
    document.getElementById('WebSemantica_cines').innerHTML = JSON.stringify(jsonLDs);
}


function generateJsonLD(event) {
    // Esta función crea un marcado JSON-LD para un evento de proyección de película específico.
    // Adaptado para manejar el anidamiento adicional en subEvent.
    return event.subEvent.map(subEvent => ({
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
            "address": {
                "@type": "PostalAddress",
                "streetAddress": subEvent.location.location[0].address.streetAddress,
                "addressLocality": subEvent.location.location[0].address.addressLocality,
                "postalCode": subEvent.location.location[0].address.postalCode,
                "addressRegion": subEvent.location.location[0].address.addressRegion,
                "addressCountry": "ES"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": subEvent.location.location[1].geo.latitude,
                "longitude": subEvent.location.location[1].geo.longitude
            }
        },
        "workPerformed": {
            "@type": "Movie",
            "name": event.workPerformed.name,
            "image": event.workPerformed.image,
            "duration": event.workPerformed.duration.replace('T0M', '').replace('S', ' min'),
            "description": event.workPerformed.description,
            "genre": event.workPerformed.genre,
            "inLanguage": event.workPerformed.inLanguage,
            "director": {
                "@type": "Person",
                "name": event.workPerformed.director.name
            },
            "actor": event.workPerformed.actor.map(actor => ({
                "@type": "Person",
                "name": actor.name
            })),
            "aggregateRating": event.workPerformed.aggregateRating.map(rating => ({
                "@type": "AggregateRating",
                "ratingValue": rating.ratingValue,
                "image": rating.image,
                "sameAs": rating.sameAs
            })),
            "trailer": {
                "@type": "VideoObject",
                "contentUrl": event.workPerformed.trailer.contentUrl
            }
        }
    }));
}

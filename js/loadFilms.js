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
    let uniqueCinemas = new Set();  // Conjunto para almacenar cines únicos
    let uniqueMovies = new Set();   // Conjunto para almacenar películas únicas
    let cinemaJsonLDs = [];         // Lista para JSON-LD de cines
    let movieJsonLDs = [];          // Lista para JSON-LD de películas

    data.subEvent.forEach(event => {
        // Procesar las películas únicas
        if (!uniqueMovies.has(event.workPerformed.name)) {
            movieJsonLDs.push(generateJsonLD(event.workPerformed));
            uniqueMovies.add(event.workPerformed.name);
        }

        event.subEvent.forEach(subEvent => {
            // Procesar los cines únicos
            if (!uniqueCinemas.has(subEvent.location.name)) {
                cinemaJsonLDs.push(generateCinemaJsonLD(subEvent.location));
                uniqueCinemas.add(subEvent.location.name);
            }
        });
    });

    // Combinar todos los JSON-LD en un solo objeto para la salida
    const jsonLDWrapper = {
        "@context": "https://schema.org",
        "@type": "EventSeries",
        "@graph": [...cinemaJsonLDs, ...movieJsonLDs]
    };

    document.getElementById('WebSemantica_cines').innerHTML = JSON.stringify(jsonLDWrapper);
}

function generateJsonLD(movie) {
    // Genera el marcado JSON-LD para una película específica
    return {
        "@type": "Movie",
        "name": movie.name,
        "sameAs": movie.sameAs,
        "duration": movie.duration.replace('T0M', '').replace('S', ' min'),
        "image": movie.image,
        "description": movie.description,
        "director": movie.director ? {
            "@type": "Person",
            "name": movie.director.name
        } : undefined,
        "genre": movie.genre,
        "inLanguage": movie.inLanguage
    };
}

function generateCinemaJsonLD(location) {
    // Genera el marcado JSON-LD para un cine específico
    return {
        "@type": "MovieTheater",
        "name": location.name,
        "photo": location.photo,
        "sameAs": location.sameAs,
        "screenCount": location.screenCount,
        "address": location.location[0].address,
        "geo": location.location[1].geo
    };
}
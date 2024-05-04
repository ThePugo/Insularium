var allMovies = [];
var moviesLoaded = loadAllMovies();


async function loadAllMovies() {
    try {
        const response = await fetch('cines_cartelera.json');
        const data = await response.json();
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


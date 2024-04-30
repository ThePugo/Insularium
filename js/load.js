let allMovies = [];

document.addEventListener('DOMContentLoaded', async function () {
    allMovies = await loadAllMovies();
    load3RandomMovies();
    loadDestacadas();
});

async function loadAllMovies() {
    const response = await fetch('cines_cartelera.json');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();

    //procesar los datos para obtener todas las películas
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
    return allMovies;
}

async function load3RandomMovies() {
    try {
        let three = allMovies.sort(() => Math.random() - 0.5).slice(0, 3);

        const carouselInner = document.querySelector('.carousel-inner');
        carouselInner.innerHTML = '';

        three.forEach((movie, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            carouselItem.innerHTML = `
          <div class="container">
          <div class="container">
          <div class="row">
            <div class="col-md-6 ">
              <div class="detail-box">
                <h1>${movie.title}</h1>
                <h4>${movie.duration}</h4>
                <a href="films.html#${movie.genre}" class="tag-movie-hero">${movie.genre}</a>
                <h2>Director: ${movie.director}</h2>
                <h3>Stars: ${movie.stars}</h3>
                <div class="btn-box">
                    <a href="${movie.trailerUrl}" class="button" target="_blank">Ver trailer</a>
                    <a href="${movie.readMore}" class="button" target="_blank">Leer más</a>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="img-box">
              <img src="${movie.image}" alt="${movie.title}">
              </div>
            </div>
          </div>
        </div>
        `;
            carouselInner.appendChild(carouselItem);
        });

    } catch (error) {
        console.error('Error loading movies:', error);
    }
}


async function loadDestacadas() {
    try {
        const comedyMovies = allMovies.filter(movie => movie.genre === 'Comedia');
        console.log(allMovies.length);
        const dramaMovies = allMovies.filter(movie => movie.genre === 'Drama');

        const randomComedyMovies = getRandomMovies(comedyMovies, 5);
        const randomDramaMovies = getRandomMovies(dramaMovies, 5);

        //actualizar las imágenes en la sección de comedia
        updateFilmSection(randomComedyMovies, 'Comedia');

        //actualizar las imágenes en la sección de drama
        updateFilmSection(randomDramaMovies, 'Drama');

    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

// Función para obtener películas aleatorias
function getRandomMovies(movies, count) {
    let shuffled = movies.sort(() => Math.random() - 0.5).slice(0, count);
    return shuffled;
}

function updateFilmSection(movies, category) {
    const filmSection = document.querySelector(`#${category} .films-slider .row`);
    filmSection.innerHTML = '';

    movies.forEach(movie => {
        const col = document.createElement('div');
        col.classList.add('col-md-2');

        const filmSlider = document.createElement('div');
        filmSlider.classList.add('filmSlider');

        const img = document.createElement('img');
        img.src = movie.image;
        img.alt = movie.title;

        filmSlider.appendChild(img);
        col.appendChild(filmSlider);
        filmSection.appendChild(col);
    });
}

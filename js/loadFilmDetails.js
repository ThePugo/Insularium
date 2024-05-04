document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const filmName = params.get('film');

    fetch('cines_cartelera.json')
        .then(response => response.json())
        .then(data => {
            const film = findFilm(data, filmName);
            if (film) {
                displayFilmDetails(film, data, filmName);
            } else {
                console.error('Film not found');
            }
        })
        .catch(error => console.error('Error loading film data:', error));
});

function findFilm(data, filmName) {
    for (const event of data.subEvent) {
        if (event.workPerformed && event.workPerformed.name === filmName) {
            return event.workPerformed;
        }
    }
    return null;
}

function displayFilmDetails(film, data, filmName) {
    document.getElementById('film-name').innerText = film.name;
    document.getElementById('film-duration').innerText = film.duration.replace('T0M', '').replace('S', ' minutos');
    document.getElementById('film-genre').innerText = film.genre;
    document.getElementById('film-director').innerText = film.director.name;
    document.getElementById('film-actors').innerText = film.actor.map(a => a.name).join(', ');
    document.getElementById('film-description').innerText = film.description;
    document.getElementById('film-image').src = film.image;
    document.getElementById('trailer').href = film.trailer.contentUrl;

    // Display ratings
    film.aggregateRating.forEach(rating => {
        let ratingElement = document.createElement('div');
        ratingElement.className = "rating";  // Usa la clase 'rating' para aplicar el estilo
        ratingElement.innerHTML = `<a href="${rating.sameAs}" target="_blank"><img src="${rating.image}" alt="Rating image"></a><span>${rating.ratingValue}</span>`;
        document.getElementById('film-ratings').appendChild(ratingElement);
    });



    let cinemasHtml = `<div class="container"><div class="row">`;

    data.subEvent.forEach(event => {
        event.subEvent.forEach(subEvent => {
            if (event.workPerformed.name === filmName) {
                // Añade cada cine dentro de una columna de la misma fila
                cinemasHtml += `
                <div class="col-md-6">
                    <div class="cinema-cinemas">
                        <a href="cinemadetails.html?cine=${subEvent.location.name}" class="cinema-cinemas-link">
                            <img src="${subEvent.location.photo}" alt="${subEvent.location.name}" class="cinema-cinemas-img">
                        </a>
                        <div><strong>${subEvent.location.name}</strong></div>
                    </div>
                </div>
            `;
            }
        });
    });

    // Cierra los tags de row y container al final
    cinemasHtml += `</div></div>`;

    // Asumiendo que tienes un elemento para insertar el HTML, por ejemplo, un div con id 'cinemas-container'
    document.getElementById('film-cinemas').innerHTML = cinemasHtml;
}

document.addEventListener('DOMContentLoaded', async function () {
    moviesLoaded.then(() => {
        // Ahora aquí puedes estar seguro de que allMovies está completamente cargado
        loadFilms(); // Usa la función para cargar las películas en la interfaz
        if (window.location.hash) {
            const id = window.location.hash; // Obtiene el hash, que incluye el '#'
            const section = document.querySelector(id);
            if (section) {
                section.scrollIntoView(); // Desplaza la vista hasta la sección deseada
            }
        }

        const selectCategoryElement = document.getElementById('categoria');
        const selectCinemaElement = document.getElementById('cine');
        const allFilms = document.querySelectorAll('.cards1');

        selectCategoryElement.addEventListener('change', function () {
            var selectedValue = this.value;
            if (selectedValue === "Acción") {
                selectedValue = "Accion";
            }
            console.log("Categoria seleccionada: "+selectedValue);

            allFilms.forEach(film => {
                if (film.querySelector(`#${selectedValue}`)) {
                    film.style.display = 'block';
                } else {
                    film.style.display = 'none';
                }
            });

            if (selectedValue === 'nocategoria') {
                allFilms.forEach(film => {
                    film.style.display = 'block';
                });
            }
        });
    });
});

function loadFilms() {
    const containers = {
        comedia: document.querySelector('#Comedia .films-slider .row'),
        terror: document.querySelector('#Terror .films-slider .row'),
        thriller: document.querySelector('#Thriller .films-slider .row'),
        drama: document.querySelector('#Drama .films-slider .row'),
        acción: document.querySelector('#Accion .films-slider .row'),
        romance: document.querySelector('#Romance .films-slider .row'),
        animación: document.querySelector('#Animación .films-slider .row'),
        "ciencia ficción": document.querySelector('#Ciencia-Ficcion .films-slider .row'),
        aventuras: document.querySelector('#Aventuras .films-slider .row'),
        documental: document.querySelector('#Documental .films-slider .row'),
        musical: document.querySelector('#Musical .films-slider .row'),
    };

    const genres = {
        genres: ['comedia', 'terror', 'thriller', 'drama', 'acción', 'romance', 'animación', 'ciencia ficción',
            'aventuras', 'documental', 'musical']
    };

    const addedFilms = {
        comedia: new Set(),
        terror: new Set(),
        thriller: new Set(),
        drama: new Set(),
        acción: new Set(),
        romance: new Set(),
        animación: new Set(),
        "ciencia ficción": new Set(),
        aventuras: new Set(),
        documental: new Set(),
        musical: new Set()
    };

    allMovies.forEach(movie => {

        const genre = movie.genre.toLowerCase();

        //verificar si la peli ya ha sido añadido

        if (!addedFilms[genre].has(movie.title)) {
            addedFilms[genre].add(movie.title);

            const filmDiv = document.createElement('div');
            filmDiv.className = 'col-md-2';
            filmDiv.innerHTML = `<div class="cinema-movie">
            <a href="filmdetails.html?film=${movie.title}"><img src="images/circle-info.png" class="info-icon" alt="Info"><img class="filmimage" src="${movie.image}" alt="${movie.title}"></a>
            <div><strong>${movie.title}</strong></div>
            </div>`;

            //console.log("Going to append "+movie+" in container of genre "+genre);
            containers[genre].appendChild(filmDiv);
        }
    });
}
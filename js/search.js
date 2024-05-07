document.addEventListener('DOMContentLoaded', async function () {
    const searchBar = document.querySelector('.search-bar-container input');
    const searchButton = document.querySelector('.search-bar-container button');
    moviesLoaded.then(() => {
        searchBar.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
        searchButton.addEventListener('click', performSearch);
        initializeTypeahead();
    });
    function performSearch() {
        const searchTerm = searchBar.value.toLowerCase().trim(); // Obtener el nombre de la peli
        const filteredMovies = allMovies.filter(movie => movie.title.toLowerCase().includes(searchTerm)); // Filtrar las películas basadas en el nombre
        // Se carga en el HTML destino las películas encontradas (si no hay se mostrará un mensaje).
        loadFilmsHTML(createFilmsHTML(filteredMovies));
    }
});

//PARA CREAR LA LISTA DE PELIS DESEADA CLASIFICADAS POR GÉNERO EN FORMATO DE CARTELES HTML
//A PARTIR DE LAS PELÍCULAS FILTRADAS
function createFilmsHTML(filteredMovies) {

    let filmsHTML = ''; // Donde se guardará el HTML resultante

    //En caso de que no se hayan encontrado pelis se muestra
    if (filteredMovies.length === 0) {
        filmsHTML = '<h2 style="color: red;">No se han encontrado resultados</h2>'
        return filmsHTML;
    }

    // Objeto para almacenar las películas clasificadas por género
    let films = {};

    // Clasificar las películas por género
    filteredMovies.forEach(movie => {
        if (!films[movie.genre]) {
            films[movie.genre] = [];
        }
        films[movie.genre].push(movie);
    });

    // Iterar sobre cada género y generar el HTML correspondiente
    for (let genre in films) {
        filmsHTML += `
            <br> <br>
            <div class="cards1">
                <div class="container container-hero-phone">
                    <div class="card-slider-title-container related hero-fristone-tablet">
                        <div class="title-card-slider">
                            <h2>${genre}</h2>
                        </div>
                        <div class="films-slider">
                            <div class="row text-center">
        `;

        // Añadir cada una de las películas de este género
        films[genre].forEach(movie => {
            filmsHTML += `<div class="cinema-movie">
            <a href="filmdetails.html?film=${movie.title}"><img src="images/circle-info.svg" class="info-icon" alt="Info"><img class="filmimage" src="${movie.image}" alt="${movie.title}"></a>
            <div><strong>${movie.title}</strong></div>
            </div>`;
        });

        filmsHTML += `
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    return filmsHTML;
}

// Función para cargar el HTML generado en el almacenamiento local y redirigir a "pelisBuscadas.html"
function loadFilmsHTML(filmsHTML) {
    // Almacenar el HTML generado en el almacenamiento local
    localStorage.setItem('filmsHTML', filmsHTML);
    // Redirigir a la página "pelisBuscadas.html"
    window.location.href = 'pelisBuscadas.html';
}

function initializeTypeahead() {
    //obtiene los valores
    var moviesNames = allMovies.map(movie => movie.title);
    //inicializa la caja de búsqueda con Typeahead
    $(".typeahead").each(function () {
        var $input = $(this);
        var sourceData;

        if ($input.attr('placeholder').includes('Introduce el título de la película')) {
            sourceData = moviesNames;
        }

        $input.typeahead({
            source: sourceData,
            autoSelect: true,
        });

        $input.change(function () {
            var current = $input.typeahead("getActive");
            matches = [];

            if (current) {
                if (current.name == $input.val()) {
                    matches.push(current.name);
                }
            }
        });
    });
}
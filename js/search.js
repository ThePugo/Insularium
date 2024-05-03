let allMovies = [];

document.addEventListener('DOMContentLoaded', async function () {

    //-----------------PARA BUSCAR PELÍCULAS CON EL BUSCADOR-----------------
    //SE GUARDAN TODAS LAS PELIS
    allMovies = await loadAllMovies();

    const searchBar = document.querySelector('.search-bar-container input');
    const searchButton = document.querySelector('.search-bar-container button');
    
    // Añadir event listener para la tecla "Enter"
    searchBar.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            performSearch(); // Ejecutar la función de búsqueda
        }
    });
    // Añadir event listener a el botón de la lupa
    searchButton.addEventListener('click', performSearch); 
    function performSearch() {
        const searchTerm = searchBar.value.toLowerCase().trim(); // Obtener el nombre de la peli
        const filteredMovies = allMovies.filter(movie => movie.title.toLowerCase().includes(searchTerm)); // Filtrar las películas basadas en el nombre
    
        // Si se encuentra al menos una película, redirigir al usuario a la página filmdetails.html
        if (filteredMovies.length > 0) {
            window.location.href = 'filmdetails.html';
        } else {
            console.log('No se encontraron películas.');
        }
    }
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
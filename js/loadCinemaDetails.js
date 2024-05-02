document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const cineName = params.get('cine');

    fetch('cines_cartelera.json')
    .then(response => response.json())
    .then(data => {
        const cine = findCine(data, cineName);
        displayCineDetails(data, cine, cineName);
    })
    .catch(error => console.error('Error loading cinema data:', error));
});

function findCine(data, cineName) {
    for (const event of data.subEvent) {
        for (const subEvent of event.subEvent) {
            if (subEvent.location.name === cineName) {
                return subEvent;
            }
        }
    }
    return null;
}

function displayCineDetails(data, cine, cineName) {
    if (!cine) {
        console.log('Cine not found');
        return;
    }
    document.getElementById('cinema-name').innerText = cine.location.name;
    document.getElementById('cinema-screens').innerText = cine.location.screenCount !== null ? cine.location.screenCount + " pantallas" : "No se especifica";
    document.getElementById('cinema-address').innerText = cine.location.location[0].address.streetAddress;

    if (cine.location.location[1].geo) {
        placeMarker(cine.location.location[1].geo.latitude, cine.location.location[1].geo.longitude, cine.location.name);
    }

    let moviesList = '';
    let found = false;
    data.subEvent.forEach(event => {
        event.subEvent.forEach(subEvent => {
            if (subEvent.location.name === cineName) {
                found = true;
                const times = subEvent.doorTime.map(time => new Date(time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })).join(', ');
                moviesList += `<div class="cinema-movie">
                <a href="filmdetails.html?${event.workPerformed.name}"><img src="images/circle-info.png" class="info-icon" alt="Info"><img class="filmimage" src="${event.workPerformed.image}" alt="${event.workPerformed.name}"></a>
                <div><strong>${event.workPerformed.name}</strong></div>
                <div class="cinema-movie-time">${times}</div>
                </div>`;
            }
        });
    });

    if (!found) {
        console.log('Cine not found');
        return;
    }

    // Actualiza los detalles del cine si se encontró
    document.getElementById('cinema-movies').innerHTML = moviesList
}
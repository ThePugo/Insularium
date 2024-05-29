var theaterMarkersDisplayed = false;  // Estado de los marcadores
var theaterMarkers = [];  // Array para almacenar marcadores de los teatros

var feriaMarkersDisplayed = false;
var feriaMarkers = [];

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const cineName = params.get('cine');
    const distanceSlider = document.getElementById('distanceRange');
    const distanceValueLabel = document.getElementById('distanceValue');
    const toggleTheatersButton = document.getElementById('toggle-theaters');
    const toggleFeriasButton = document.getElementById('toggle-feria');
    let theaterData, feriaData, cine;

    Promise.all([
        fetch('cines_cartelera.json'),
        fetch('https://www.descobreixteatre.com/assets/json/Teatre.json'),
        fetch('https://www.firabalear.com/assets/json/fires.json')
    ]).then(responses => Promise.all(responses.map(res => res.json())))
        .then(([cineData, theaterDataResponse, feriaDataResponse]) => {
            theaterData = theaterDataResponse;
            feriaData = feriaDataResponse;
            cine = findCine(cineData, cineName);
            displayCineDetails(cineData, cine, cineName);
        })
        .catch(error => console.error('Error loading data:', error));

    distanceSlider.addEventListener('input', function () {
        distanceValueLabel.textContent = distanceSlider.value;
        // Solo actualiza los marcadores si los botones han sido activados
        if (theaterMarkersDisplayed) {
            displayNearbyTheaters(theaterData, cine, distanceSlider.value);
        }
        if (feriaMarkersDisplayed) {
            displayNearbyFerias(feriaData, cine, distanceSlider.value);
        }
    });

    // Evento para el botón de teatros
    toggleTheatersButton.addEventListener('click', function () {
        theaterMarkersDisplayed = !theaterMarkersDisplayed; // Cambia el estado
        if (theaterMarkersDisplayed) {
            displayNearbyTheaters(theaterData, cine, distanceSlider.value); // Muestra los teatros
            toggleTheatersButton.textContent = "Ocultar Teatros Cercanos";
        } else {
            clearTheaterMarkers(); // Oculta los teatros
            toggleTheatersButton.textContent = "Mostrar Teatros Cercanos";
        }
    });

    // Evento para el botón de ferias
    toggleFeriasButton.addEventListener('click', function () {
        feriaMarkersDisplayed = !feriaMarkersDisplayed; // Cambia el estado
        if (feriaMarkersDisplayed) {
            displayNearbyFerias(feriaData, cine, distanceSlider.value); // Muestra las ferias
            toggleFeriasButton.textContent = "Ocultar Ferias Cercanas";
        } else {
            clearFeriasMarkers(); // Oculta las ferias
            toggleFeriasButton.textContent = "Mostrar Ferias Cercanas";
        }
    });
});
function updateMarkers(cine, theaterData, feriaData, distance) {
    clearTheaterMarkers();  // Limpia los marcadores existentes
    clearFeriasMarkers();   // Limpia los marcadores existentes

    displayNearbyTheaters(theaterData, cine, distance);
    displayNearbyFerias(feriaData, cine, distance);
}

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
    var link = document.getElementById('cinema-link');
    link.href = cine.location.sameAs;

    if (cine.location.location[1].geo) {
        placeMarker(cine.location.location[1].geo.latitude, cine.location.location[1].geo.longitude, cine.location.name, cine.location.sameAs);
    }

    let moviesList = '';
    let found = false;
    data.subEvent.forEach(event => {
        event.subEvent.forEach(subEvent => {
            if (subEvent.location.name === cineName) {
                found = true;
                const times = subEvent.doorTime.map(time => new Date(time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })).join(', ');
                moviesList += `<div class="cinema-movie">
                <a href="filmdetails.html?film=${event.workPerformed.name}"><img src="images/circle-info.svg" class="info-icon" alt="Info"><img class="filmimage" src="${event.workPerformed.image}" alt="${event.workPerformed.name}"></a>
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

function displayNearbyTheaters(theaterData, cine, distance) {
    if (!theaterMarkersDisplayed) return;  // Si los marcadores de teatros no deben mostrarse, salir de la función.

    clearTheaterMarkers();  // Limpia los marcadores existentes
    const bounds = new google.maps.LatLngBounds();
    const cineLatLng = new google.maps.LatLng(cine.location.location[1].geo.latitude, cine.location.location[1].geo.longitude);
    bounds.extend(cineLatLng);

    const nearbyTheaters = theaterData.itemListElement.filter(theater => {
        return isNearby(cine.location.location[1].geo.latitude, cine.location.location[1].geo.longitude, theater.geo.latitude, theater.geo.longitude, distance);
    });

    if (nearbyTheaters.length > 0) {
        nearbyTheaters.forEach(theater => {
            const theaterLatLng = new google.maps.LatLng(theater.geo.latitude, theater.geo.longitude);
            const marker = placeTheaterMarker(theater.geo.latitude, theater.geo.longitude, theater.name, theater.description, theater.url);
            if (marker) {
                bounds.extend(theaterLatLng);
                theaterMarkers.push(marker);
            }
        });
        map.fitBounds(bounds);
    }
}

function displayNearbyFerias(feriaData, cine, distance) {
    if (!feriaMarkersDisplayed) return;  // Si los marcadores de ferias no deben mostrarse, salir de la función.

    clearFeriasMarkers();  // Limpia los marcadores existentes
    const bounds = new google.maps.LatLngBounds();
    const cineLatLng = new google.maps.LatLng(cine.location.location[1].geo.latitude, cine.location.location[1].geo.longitude);
    bounds.extend(cineLatLng);

    const nearbyFerias = feriaData.filter(feria => {
        return isNearby(cine.location.location[1].geo.latitude, cine.location.location[1].geo.longitude, feria.location.geo.latitude, feria.location.geo.longitude, distance);
    });

    if (nearbyFerias.length > 0) {
        nearbyFerias.forEach(feria => {
            const feriaLatLng = new google.maps.LatLng(feria.location.geo.latitude, feria.location.geo.longitude);
            const marker = placeFeriaMarker(feria.location.geo.latitude, feria.location.geo.longitude, feria.name, feria.description, feria.startDate, feria.endDate);
            if (marker) {
                bounds.extend(feriaLatLng);
                feriaMarkers.push(marker);
            }
        });
        map.fitBounds(bounds);
    }
}


function clearFeriasMarkers() {
    feriaMarkers.forEach(marker => marker.setMap(null));
    feriaMarkers = [];
}

function placeFeriaMarker(lat, lng, name, description, startDate, endDate) {
    const position = new google.maps.LatLng(lat, lng);
    const blueIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#0000FF',
        fillOpacity: 0.8,
        strokeWeight: 2,
        strokeColor: '#000000'
    };

    const marker = new google.maps.Marker({
        position: position,
        map: map,
        icon: blueIcon,
        title: name
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong style="color: black;">${name}</strong><p style="color: black;">${description}</p><p style="color: black;">Fecha de Inicio: ${startDate}</p><p style="color: black;">Fecha de Fin: ${endDate}</p></div>`
    });

    marker.addListener('click', () => infoWindow.open(map, marker));
    return marker;
}

function clearTheaterMarkers() {
    if (theaterMarkers && theaterMarkers.length > 0) {
        theaterMarkers.forEach(marker => {
            marker.setMap(null);
        });
        theaterMarkers = [];
    }
}

function placeTheaterMarker(lat, lng, name, description, url) {
    const position = new google.maps.LatLng(lat, lng);
    const greenIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#00FF00',
        fillOpacity: 0.8,
        strokeWeight: 2,
        strokeColor: '#000000'
    };

    const marker = new google.maps.Marker({
        position: position,
        map: map,
        icon: greenIcon,
        title: name
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong style="color: black;">${name}</strong><p style="color: black;">${description}</p><a href="${url}" target="_blank">Más detalles</a></div>`
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });

    return marker;
}

function isNearby(lat1, long1, lat2, long2, km) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(long2 - long1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance <= km;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

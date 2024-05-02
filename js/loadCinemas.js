document.addEventListener('DOMContentLoaded', async function () {
    fetch('cines_cartelera.json')
        .then(response => response.json())
        .then(data => {
            loadCinemas(data);
        })
        .catch(error => console.error('Error loading the data: ', error));
    const selectElement = document.getElementById('isla');
    const allIslands = document.querySelectorAll('.cards1');

    selectElement.addEventListener('change', function () {
        const selectedValue = this.value;

        allIslands.forEach(island => {
            if (island.querySelector(`#${selectedValue}`)) {
                island.style.display = 'block';
            } else {
                island.style.display = 'none';
            }
        });

        if (selectedValue === 'nocategoria') {
            allIslands.forEach(island => {
                island.style.display = 'block';
            });
        }
    });
});

function loadCinemas(data) {
    const containers = {
        mallorca: document.querySelector('#mallorca .cine-slider .row'),
        menorca: document.querySelector('#menorca .cine-slider .row'),
        ibiza: document.querySelector('#ibiza .cine-slider .row')
    };

    const localities = {
        mallorca: ['mallorca', 'palma', 'inca'],
        menorca: ['menorca', 'mahón', 'maó', 'ciutadella'],
        ibiza: ['ibiza', 'eivissa', 'sant antoni de portmany']
    };

    const addedCinemas = {
        mallorca: new Set(),
        menorca: new Set(),
        ibiza: new Set()
    };

    data.subEvent.forEach(event => {
        event.subEvent.forEach(screeningEvent => {
            const locality = screeningEvent.location.location[0].address.addressLocality.toLowerCase();
            let island = null;

            //determinar la isla comprobando si alguna localidad coincide con las listas definidas
            for (const key in localities) {
                if (localities[key].some(loc => locality.includes(loc))) {
                    island = key;
                    break;
                }
            }

            //verificar si el cine ya ha sido añadido para evitar duplicados
            if (island && !addedCinemas[island].has(screeningEvent.location.name)) {
                addedCinemas[island].add(screeningEvent.location.name);

                const cinemaDiv = document.createElement('div');
                cinemaDiv.className = 'col-md-5';
                cinemaDiv.innerHTML = `
                <a href="cinemadetails.html?cine=${screeningEvent.location.name}" class="cineSlider" id="cinepanel">
                    <img src="${screeningEvent.location.photo}" alt="${screeningEvent.location.name}">
                    <p class="nomcine">${screeningEvent.location.name}</p>
                </a>
                `;

                containers[island].appendChild(cinemaDiv);
            }
        });
    });
}
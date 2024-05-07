const year = new Date().getFullYear();

document.getElementById('displayYear').textContent = year;

function show(member) {
    const contenedorInfo = document.getElementById("info");
    const infoTexto = document.getElementById("info_container");
    if (contenedorInfo.style.display = 'hidden') {
        contenedorInfo.style.display = 'block';
    }
    if (member === 'sasha') {
        var infoHTML = `
        <div class="info_box">
            <img src="images/info_pers.svg">
            <h3>Información Personal</h3>
            <p>Estudiante de 4º de ingeniería informática interesado en la inteligencia artificial y el proceso de desarollo de algoritmos procedurales. Experiencia en desarrollo software, incluyendo web y especialmente aplicaciones en 3D.</p>
        </div>
        <div class="info_box">
            <img src="images/info_tfg.svg">
            <h3>Trabajo de Fin de Grado (TFG)</h3>
            <p>Actualmente trabajando en el desarrollo de un videojuego en 3D desarrollado con Unity para el estudio de los algoritmos procedurales de laberintos utilizados usualmente en videojuegos</p>
        </div>
        <div class="info_box">
            <img src="images/info_apt.svg">
            <h3>Aptitudes Informáticas</h3>
            <p>HTML, CSS3, JavaScript, Python, SQL, Java, C#, Blender, OpenGL</p>
        </div>
    `;
        infoTexto.innerHTML = infoHTML;
    }
    else if (member === 'enrique') {
        var infoHTML = `
        <div class="info_box">
            <img src="images/info_pers.svg">
            <h3>Información Personal</h3>
            <p>Estudiante de 4º de ingeniería informática interesado en el desarrollo de web-apps y en las bases de datos. Experiencia en el desarrollo de software, mayoritariamente en back-end, y en gestió básica de bases de datos. </p>
        </div>
        <div class="info_box">
            <img src="images/info_tfg.svg">
            <h3>Trabajo de Fin de Grado (TFG)</h3>
            <p>Actualmente trabajando en una investigación sobre las posibles aplicaciones de la inteligencia artificial en el entorno de las Islas Baleares.</p>
        </div>
        <div class="info_box">
            <img src="images/info_apt.svg">
            <h3>Aptitudes Informáticas</h3>
            <p>HTML, CSS3, JavaScript, Python, SQL, Java, C</p>
        </div>
    `;
        infoTexto.innerHTML = infoHTML;
    }
    else if (member === 'mario') {
        var infoHTML = `
        <div class="info_box">
            <img src="images/info_pers.svg">
            <h3>Información Personal</h3>
            <p>Estudiante de 4º de ingeniería informática interesado en el proceso de diseño y desarrollo de apps Android y en las Information Technologies (IT). Experiencia en el desarrollo de software, tanto aplicaciones web (fullstack) como de escritorio.</p>
        </div>
        <div class="info_box">
            <img src="images/info_tfg.svg">
            <h3>Trabajo de Fin de Grado (TFG)</h3>
            <p>Actualmente trabajando en el desarrollo de una app para android que usa Inteligencia Artificial para rehabilitar pacientes con problemas cervicales mediante videojuegos en 2D.</p>
        </div>
        <div class="info_box">
            <img src="images/info_apt.svg">
            <h3>Aptitudes Informáticas</h3>
            <p>HTML, CSS3, JavaScript, Python, SQL, Java, C</p>
        </div>
    `;
        infoTexto.innerHTML = infoHTML;
    }
    contenedorInfo.scrollIntoView({ behavior: "smooth" });
}

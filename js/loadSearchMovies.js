document.addEventListener('DOMContentLoaded', function () {
    // Obtener el HTML generado del almacenamiento local
    const filmsHTML = localStorage.getItem('filmsHTML');

    // Verificar si se encontró HTML en el almacenamiento local
    if (filmsHTML) {
        // Crear un elemento div para contener el HTML generado
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = filmsHTML;

        // Seleccionar la sección donde se debe insertar el HTML generado
        const choiceSection = document.querySelector('.choice_section');

        // Insertar el HTML generado dentro de la sección
        choiceSection.appendChild(tempDiv);
    }
});

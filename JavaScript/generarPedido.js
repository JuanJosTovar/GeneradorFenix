let juguetesData = {}; // Variable para los datos JSON cargados

// Función para buscar coincidencias y resaltar celdas basadas en la referencia ingresada
function highlightAndFindReference() {
    const searchValue = document.getElementById('search').value.trim().toLowerCase(); // Obtener referencia del input
    const allCells = document.querySelectorAll('.cell, .cell2, .cell3, .cell4'); // Todas las celdas del HTML

    if (!juguetesData.juguetes) return; // Salir si los datos no están cargados

    // Encontrar el juguete correspondiente a la referencia ingresada
    const foundItem = juguetesData.juguetes.find(juguete => 
        juguete.referencia.toLowerCase() === searchValue
    );

    if (foundItem) {

        const canastaIds = foundItem.canastas.map(canasta => canasta.id);

        allCells.forEach(cell => {
            const cellId = cell.id;

            if (canastaIds.includes(cellId)) {
                cell.classList.add('selected');
            } if(canastaIds.includes(cellId)){
                cell.onclick = function(){
                    this.classList.toggle('selected'); 
                }
            }else {
                cell.classList.remove('selected');
            } 
        });

        console.log(`Referencia encontrada: ${foundItem.referencia}`);
        console.log(`Canastas asociadas: ${canastaIds.join(', ')}`);
    } else {
        // Si no se encuentra el producto, quitar resaltado
        allCells.forEach(cell => cell.classList.remove('selected'));
        console.log('Referencia no encontrada.');
    }
}

// Cargar datos del archivo JSON (usando fetch)
function loadJuguetesData() {
    fetch('../data.json') // Ruta al archivo JSON
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar JSON: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            juguetesData = data; // Almacenar datos cargados
            console.log('Datos cargados:', juguetesData);
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
        });
}

// Inicializar funciones al cargar la página
window.onload = function () {
    loadJuguetesData(); // Cargar datos del JSON
};

// Evento para ejecutar la búsqueda mientras se escribe
document.getElementById('search').addEventListener('input', highlightAndFindReference);
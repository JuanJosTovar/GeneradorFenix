let juguetesData = {}; // Variable para los datos JSON cargados
let selectedCells = new Set();

// Función para buscar coincidencias y resaltar celdas basadas en la referencia ingresada
function highlightAndFindReference() {
    const searchValue = document.getElementById('search').value.trim().toLowerCase(); // Obtener referencia del input
    const allCells = document.querySelectorAll('.cell, .cell2, .cell3, .cell4'); // Todas las celdas del HTML

    if (!juguetesData.juguetes) return; // Salir si los datos no están cargados

    // Encontrar el juguete correspondiente a la referencia ingresada
    const foundItem = juguetesData.juguetes.find(juguete => 
        juguete.referencia.toLowerCase() === searchValue);

        allCells.forEach(cell => {
            cell.classList.remove('selected'); // Quitar clase de seleccionado
            cell.classList.remove('deselected'); // Quitar clase de deseleccionado
            cell.onmouseover = null; // Limpiar eventos de mouseover
            cell.onmouseout = null; // Limpiar eventos de mouseout
        });
        selectedCells.clear();
    if (foundItem) {
        const canastaIds = foundItem.canastas.map(canasta => canasta.id);

            canastaIds.forEach(id => {
                const cell = document.getElementById(id);
                if (cell) {
                    cell.classList.add('selected'); // Seleccionar automáticamente
                    selectedCells.add(id); // Agregar al conjunto de celdas seleccionadas
                    cell.onmouseover = function(event) {
                        const detalles = getDetalles(foundItem.canastas.find(c => c.id === id));
                        showInfoBox(event, detalles); // Mostrar detalles
                    };
                    cell.onmouseout = function() {
                        hideInfoBox(); // Ocultar info
                    };
                    cell.onclick = function() {
                        toggleSelection(cell); // Alternar selección
                    };
                }
            });

    } else {
        // Si no se encuentra el producto, quitar resaltado
        allCells.forEach(cell => cell.classList.remove('selected'));
    }
}
// Alternar selección de la celda
function toggleSelection(cell) {
    const cellId = cell.id;

    if (selectedCells.has(cellId)) {
        selectedCells.delete(cellId);
        cell.classList.remove('selected');
        cell.classList.add('deselected'); // Quitar clase de seleccionado  
    } else {
        selectedCells.add(cellId);
        cell.classList.add('selected');
        cell.classList.remove('deselected'); // Agregar clase de seleccionado
    }
}

function getDetalles(canasta) {
    return canasta.detalles.map(detalle => {
        return `Cantidad: ${detalle.cantidad}
        ${detalle.color ? ', Color: ' + detalle.color : ' ' }`;
    }).join(' ');
}
  // Mostrar el cuadro de información
  function showInfoBox(event, detalles) {
    const infoBox = document.getElementById('infoBox');
    infoBox.textContent = detalles; // Establecer el texto de información
    infoBox.style.display = 'block'; // Mostrar el cuadro de información
    infoBox.style.left = event.pageX + 'px'; // Posicionar el cuadro
    infoBox.style.top = event.pageY + 'px';
}
function hideInfoBox() {
    const infoBox = document.getElementById('infoBox');
    infoBox.style.display = 'none'; // Ocultar el cuadro de información
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
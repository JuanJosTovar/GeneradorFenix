let juguetesData = {}; // Variable para los datos JSON cargados
let selectedCells = new Set();

// Función para buscar coincidencias y resaltar celdas basadas en la referencia ingresada
function highlightAndFindReference() {
    const searchValue = document.getElementById('search').value.trim().toLowerCase();
    const allCells = document.querySelectorAll('.cell, .cell2, .cell3, .cell4');

    if (!juguetesData.canastas) return;

    // Convertir el objeto de canastas en un array para filtrarlo
    const foundCanastas = Object.values(juguetesData.canastas).filter(canasta =>
        canasta.referencias.some(ref => ref.referencia.toLowerCase() === searchValue)
    );

    // Limpiar selección anterior
    allCells.forEach(cell => {
        cell.classList.remove('selected', 'deselected');
        cell.onmouseover = null;
        cell.onmouseout = null;
    });
    selectedCells.clear();

    if (foundCanastas.length > 0) {
        foundCanastas.forEach(canasta => {
            const cell = document.getElementById(canasta.id);
            if (cell) {
                cell.classList.add('selected');
                selectedCells.add(canasta.id);
                
                cell.onmouseover = function(event) {
                    const detalles = getDetalles(canasta, searchValue);
                    showInfoBox(event, detalles);
                };
                cell.onmouseout = function() {
                    hideInfoBox();
                };
                cell.onclick = function() {
                    toggleSelection(cell);
                };
            }
        });
    }
}

// Alternar selección de la celda
function toggleSelection(cell) {
    const cellId = cell.id;

    if (selectedCells.has(cellId)) {
        selectedCells.delete(cellId);
        cell.classList.remove('selected');
        cell.classList.add('deselected');
    } else {
        selectedCells.add(cellId);
        cell.classList.add('selected');
        cell.classList.remove('deselected');
    }
}

// Obtener detalles de la referencia
function getDetalles(canasta, referencia) {
    return canasta.referencias
        .filter(ref => ref.referencia.toLowerCase() === referencia)
        .map(ref => `Cantidad: ${ref.cantidad}${ref.color ? ', Color: ' + ref.color : ''}`)
        .join(' | ');
}

// Mostrar el cuadro de información
function showInfoBox(event, detalles) {
    const infoBox = document.getElementById('infoBox');
    infoBox.textContent = detalles;
    infoBox.style.display = 'block';
    infoBox.style.left = event.pageX + 'px';
    infoBox.style.top = event.pageY + 'px';
}

// Ocultar el cuadro de información
function hideInfoBox() {
    document.getElementById('infoBox').style.display = 'none';
}

// Cargar datos del archivo JSON
function loadJuguetesData() {
    fetch('../listado.json')
        .then(response => {
            if (!response.ok) throw new Error(`Error al cargar JSON: ${response.status}`);
            return response.json();
        })
        .then(data => {
            juguetesData = data;
            console.log('Datos cargados:', juguetesData);
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// Inicializar funciones al cargar la página
window.onload = function () {
    loadJuguetesData();
};

// Evento para ejecutar la búsqueda mientras se escribe
document.getElementById('search').addEventListener('input', highlightAndFindReference);
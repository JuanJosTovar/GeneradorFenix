let juguetesData = {}; // Variable para los datos JSON cargados
let selectedCells = new Set();

// Función para buscar coincidencias y resaltar celdas basadas en la referencia ingresada
function highlightAndFindReference() {
    const searchValue = document.getElementById('search').value.trim().toLowerCase(); // Obtener referencia del input
    const allCells = document.querySelectorAll('.cell, .cell2, .cell3, .cell4'); // Todas las celdas del HTML

    if (!juguetesData.canastas) return; // Salir si los datos no están cargados

    // Filtrar canastas que contienen la referencia ingresada
  // Separar las referencias ingresadas por comas y eliminar espacios
  const references = searchValue.split(',').map(ref => ref.trim()).filter(ref => ref.length > 0);

    // Limpiar selección anterior solo si hay un valor en la búsqueda
    if (searchValue.length > 0) {
        allCells.forEach(cell => {
            cell.classList.remove('selected', 'deselected');
            cell.onmouseover = null;
            cell.onmouseout = null;
        });
        selectedCells.clear();
    }
    const foundCanastas = juguetesData.canastas.filter(canasta =>
        canasta.referencias.some(ref => references.includes(ref.referencia.toLowerCase()))
    );


    if (foundCanastas.length > 0) {
        foundCanastas.forEach(canasta => {
            const cell = document.getElementById(canasta.id);
            if (cell) {
                cell.classList.add('selected'); // Seleccionar automáticamente
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

    // Actualizar el listado de canastas seleccionadas
    updateSelectedBasketList();
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
    updateSelectedBasketList(); // Actualizar el listado de canastas seleccionadas
}

function getDetalles(canasta, references) {
    return canasta.referencias
        .filter(ref => references.includes(ref.referencia.toLowerCase()))
        .map(ref => `Referencia: ${ref.referencia}\n Color: ${ref.color || 'N/A'}\nCantidad: ${ref.cantidad}`) // Salto de línea entre cantidad y color
}

// Mostrar el cuadro de información
function showInfoBox(event, detalles) {
    const infoBox = document.getElementById('infoBox');
    infoBox.textContent = detalles;
    infoBox.style.display = 'block';
    infoBox.style.left = event.pageX + 'px';
    infoBox.style.top = event.pageY + 'px';
}

function hideInfoBox() {
    document.getElementById('infoBox').style.display = 'none';
}

// Actualizar el listado de canastas seleccionadas
function updateSelectedBasketList() {
    const selectedBasketList = document.getElementById('selectedBasketList');
    selectedBasketList.innerHTML = ''; // Limpiar la lista existente

    selectedCells.forEach(cellId => {
        const canasta = juguetesData.canastas.find(c => c.id === cellId);
        if (canasta) {
            canasta.referencias.forEach(ref => {
                const listItem = document.createElement('li');
                listItem.textContent = `ID: ${canasta.id}. Referencia: ${ref.referencia}\nColor: ${ref.color || 'N/A'}\nCantidad: ${ref.cantidad}`;
                selectedBasketList.appendChild(listItem);
            });
        }
    });
}

// Función para exportar datos a Excel
function exportToExcel() {
    const selectedData = [];

    selectedCells.forEach(cellId => {
        const canasta = juguetesData.canastas.find(c => c.id === cellId);
        if (canasta) {
            canasta.referencias.forEach(ref => {
                selectedData.push({
                    ID: canasta.id,
                    Referencia: ref.referencia,
                    Cantidad: ref.cantidad,
                    Color: ref.color || 'N/A'
                });
            });
        }
    });

    if (selectedData.length === 0) {
        alert("No hay datos seleccionados para exportar."); // Mensaje de alerta si no hay datos
        return;
    }

    const ws = XLSX.utils.json_to_sheet(selectedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Canastas Seleccionadas");
    XLSX.writeFile(wb, "canastas_seleccionadas.xlsx");
}

// Cargar datos del archivo JSON
function loadJuguetesData() {
    fetch('../data.json')
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

function toggleFloatingDiv() {
    const floatingDiv = document.getElementById('floatingDiv');
    floatingDiv.classList.toggle('View-div');
}

// Inicializar funciones al cargar la página
window.onload = function () {
    loadJuguetesData();
    document.getElementById('exportButton').onclick = exportToExcel;
    // Evento para ejecutar la búsqueda mientras se escribe
    document.getElementById('search').addEventListener('input', highlightAndFindReference);
    document.getElementById('toggleFloatingDiv').onclick = toggleFloatingDiv; // Asignar evento al botón de mostrar/ocultar
};


let juguetesData = {}; // Aquí se almacenará el JSON transformado (propiedad "canastas" será un arreglo)
let selectedCells = new Set();
let referenceDetails = new Map(); // Mapa para almacenar los detalles de las referencias

document.getElementById('toggleTheme').onclick = function () {
    const body = document.body;
    body.classList.toggle('dark-mode'); // Alternar la clase 'dark-mode'

    // Cambiar el texto del botón según el modo actual
    if (body.classList.contains('dark-mode')) {
        this.textContent = '𖤓';
    } else {
        this.textContent = '⏾';
    }
};

// Función para buscar coincidencias y resaltar celdas basadas en la referencia ingresada
function highlightAndFindReference() {
    const searchValue = document.getElementById('search').value.trim().toLowerCase();
    
    // Limpiar selección anterior
    const allCells = document.querySelectorAll('.cell4, .cell3, .cell2, .cell');
    allCells.forEach(cell => {
        cell.classList.remove('selected', 'deselected', 'highlight');
        cell.onmouseover = null;
        cell.onmouseout = null;
    });
    selectedCells.clear();

    if (!juguetesData || !juguetesData.canastas) return;

    const references = searchValue.split(',').map(ref => ref.trim()).filter(ref => ref.length > 0);

    // Crear un objeto para almacenar las canastas encontradas por prioridad
    const foundCanastas = {
        cell4: [],
        cell3: [],
        cell2: [],
        cell: []
    };

    // Iterar sobre el arreglo de canastas y clasificar las coincidencias
    juguetesData.canastas.forEach(canasta => {
        references.forEach(ref => {
            const hasMatch = canasta.referencias.some(reference => reference.ref.toLowerCase() === ref);
            if (hasMatch) {
                // Obtener el elemento del DOM correspondiente a la canasta
                const cell = document.getElementById(canasta.ubicacion);
                if (cell) {
                    // Clasificar según la clase del elemento
                    if (cell.classList.contains('cell4')) foundCanastas.cell4.push(canasta);
                    else if (cell.classList.contains('cell3')) foundCanastas.cell3.push(canasta);
                    else if (cell.classList.contains('cell2')) foundCanastas.cell2.push(canasta);
                    else if (cell.classList.contains('cell')) foundCanastas.cell.push(canasta);
                }
            }
        });
    });

    // Resaltar canastas según la prioridad
    const priorityOrder = ['cell4', 'cell3', 'cell2', 'cell'];
    references.forEach(ref => {
        let found = false; // Para verificar si ya se encontró la referencia en una clase de mayor prioridad
        priorityOrder.forEach(className => {
            const canastaFound = foundCanastas[className].find(canasta => 
                canasta.referencias.some(reference => reference.ref.toLowerCase() === ref)
            );
            if (canastaFound && !found) {
                const cell = document.getElementById(canastaFound.ubicacion);
                if (cell) {
                    cell.classList.add('selected');
                    selectedCells.add(canastaFound.ubicacion);
                    found = true; // Marcar que ya se encontró la referencia en una clase de mayor prioridad

                    // Configurar eventos de mouse
                    cell.onmouseover = function(event) {
                        const detalles = getDetalles(canastaFound, references);
                        showInfoBox(event, detalles);
                    };
                    cell.onmouseout = function() {
                        hideInfoBox();
                    };
                    cell.onclick = function() {
                        toggleSelection(cell);
                    };
                }
            }
        });
    });

    // Recorremos nuevamente todas las canastas para asegurarnos de marcar todas las coincidencias
    juguetesData.canastas.forEach(canasta => {
        const hasMatch = canasta.referencias.some(ref => references.includes(ref.ref.toLowerCase()));
        canasta.referencias.forEach(ref => {
            console.log(`🔎 Referencia: ${ref.ref} | Color: ${ref.color} | Cantidad: ${ref.cantidad}`);
        });
        if (hasMatch) {
            const cell = document.getElementById(canasta.ubicacion);
            if (cell) {
                cell.classList.add('selected');
                selectedCells.add(canasta.ubicacion);

                cell.onmouseover = event => showInfoBox(event, getDetalles(canasta, references));
                cell.onmouseout = hideInfoBox;
                cell.onclick = () => toggleSelection(cell);
            }
        }
    });

    updateSelectedBasketList();
}

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
    updateSelectedBasketList();
}

function getDetalles(canasta, references) {
    return canasta.referencias
        .filter(ref => references.includes(ref.ref.toLowerCase()))
        .map(ref => `Codigo :${canasta.codigo}  ${canasta.nombre}\nReferencia: ${ref.ref}\nColor: ${ref.color || 'N/A'}\nCantidad: ${ref.cantidad}`)
        .join("\n\n");
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

function updateFloatingDiv(references) {
    const floatingDiv = document.getElementById('floatingDiv');
    floatingDiv.innerHTML = '';
    referenceDetails.clear();

    // Nota: selectedCells almacena los IDs (ubicaciones) de las celdas seleccionadas
    selectedCells.forEach(cellId => {
        // Buscamos la canasta usando la propiedad "ubicacion"
        const canasta = juguetesData.canastas.find(c => c.ubicacion === cellId);
        if (canasta) {
            canasta.referencias
                .filter(ref => references.includes(ref.ref.toLowerCase()))
                .forEach(ref => {
                    const key = `${ref.ref.toLowerCase()}-${ref.color.toLowerCase()}`;
                    if (referenceDetails.has(key)) {
                        referenceDetails.get(key).cantidad += ref.cantidad;
                    } else {
                        referenceDetails.set(key, { cantidad: ref.cantidad, color: ref.color || 'N/A' });
                    }
                });
        }
    });

    if (referenceDetails.size > 0) {
        referenceDetails.forEach(({ cantidad, color }, key) => {
            const [reference, colorValue] = key.split('-');
            const refDiv = document.createElement('div');
            refDiv.textContent = `Referencia: ${reference}\nCantidad: ${cantidad}\nColor: ${colorValue}`;
            refDiv.style.cursor = 'pointer';
            refDiv.onclick = function() {
                highlightCanastas(reference); // Resaltar canastas al hacer clic
            };
            floatingDiv.appendChild(refDiv);
        });
        floatingDiv.style.display = 'block'; // Mostrar el div flotante
    } else {
        floatingDiv.textContent = 'No se encontraron referencias coincidentes.';
        floatingDiv.style.display = 'block'; // Asegurarse de que se muestre incluso si no hay coincidencias
    }
}

function highlightCanastas(reference) {
    const allCells = document.querySelectorAll('.cell, .cell2, .cell3, .cell4');
    allCells.forEach(cell => {
        // Comprobar que el ID de la celda coincide con la referencia
        if (cell.id === reference) {
            cell.classList.toggle('highlight'); // Añadir o quitar la clase de resaltado
        } else {
            cell.classList.remove('highlight'); // Asegurarse de que otras celdas no estén resaltadas
        }
    });
}

function updateSelectedBasketList() {
    const selectedBasketList = document.getElementById('selectedBasketList');
    const searchValue = document.getElementById('search').value.trim().toLowerCase();
    const references = searchValue.split(',').map(ref => ref.trim()).filter(ref => ref.length > 0);
    selectedBasketList.innerHTML = '';

    const basketCounts = new Map();

    selectedCells.forEach(cellId => {
        const canasta = juguetesData.canastas.find(c => c.ubicacion === cellId);
        if (canasta) {
            canasta.referencias
                .filter(ref => references.includes(ref.ref.toLowerCase()))
                .forEach(ref => {
                    const key = `${ref.ref.toLowerCase()}-${ref.color.toLowerCase()}`;
                    if (basketCounts.has(key)) {
                        basketCounts.get(key).cantidad += ref.cantidad;
                    } else {
                        basketCounts.set(key, { referencia: ref.ref, color: ref.color, cantidad: ref.cantidad });
                    }
                });
        }
    });

    basketCounts.forEach(({ referencia, color, cantidad }) => {
        const basketItem = document.createElement('div');
        basketItem.textContent = `Referencia: ${referencia}\nColor: ${color}\nCantidad: ${cantidad}`;
        selectedBasketList.appendChild(basketItem);
    });

    if (selectedBasketList.children.length === 0) {
        selectedBasketList.textContent = 'No hay canastas seleccionadas.';
    }
}

// Función para exportar datos a Excel
function exportToExcel() {
    const selectedData = [];
    const searchValue = document.getElementById('search').value.trim().toLowerCase();
    const references = searchValue.split(',').map(ref => ref.trim()).filter(ref => ref.length > 0);

    selectedCells.forEach(cellId => {
        const canasta = juguetesData.canastas.find(c => c.ubicacion === cellId);
        if (canasta) {
            canasta.referencias
                .filter(ref => references.includes(ref.ref.toLowerCase()))
                .forEach(ref => {
                    selectedData.push({
                        Código: `${canasta.codigo} - ${canasta.nombre}`,
                        Ubicación: canasta.ubicacion,
                        Referencia: ref.ref,
                        Cantidad: ref.cantidad,
                        Color: ref.color || 'N/A'
                    });

                    // Restar la cantidad en juguetesData (asegurando que no baje de 0)
                    ref.cantidad = Math.max(0, ref.cantidad - 1);
                });
        }
    });

    if (selectedData.length === 0) {
        alert("No hay datos seleccionados para exportar.");
        return;
    }

    const ws = XLSX.utils.json_to_sheet(selectedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Canastas Seleccionadas");
    XLSX.writeFile(wb, "canastas_seleccionadas.xlsx");

    console.log("Datos exportados y cantidades actualizadas:", juguetesData);

    enviarPedido(selectedData);
}

function enviarPedido(data) {
    const jsonFinal = { canastas: convertirFormato(data) };

    console.log("📌 JSON enviado al backend:", JSON.stringify(jsonFinal, null, 2));

    fetch("http://localhost/GeneradorFenix/procesar_pedido.php", { 
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonFinal) // 🔥 Asegurar formato correcto
    })
    .then(response => response.json())
    .then(result => {
        alert(result.mensaje);
    })
    .catch(error => {
        console.error("❌ Error al enviar datos al PHP:", error);
    });
}

// Convertir el formato para que coincida con el JSON que espera el PHP
function convertirFormato(data) {
    let resultado = [];

    data.forEach(item => {
        console.log("Item procesado:", item); // 🔍 Verificar estructura

        if (!item["Código"] || !item.Referencia) {
            console.warn("❌ Faltan datos en:", item);
            return; // Saltar elementos mal formateados
        }

        let codigoLimpio = item["Código"].split(" - ")[0]; // Extraer solo el número del código

        let canasta = resultado.find(c => c.codigo === codigoLimpio);

        if (!canasta) {
            canasta = {
                codigo: codigoLimpio, // Solo el número del código
                nombre: item["Código"].split(" - ")[1] || "Desconocido",
                ubicacion: item["Ubicación"] || "No definida",
                referencias: []
            };
            resultado.push(canasta);
        }

        canasta.referencias.push({
            ref: item.Referencia,
            cantidad: item.Cantidad || 0,
            color: item.Color || "Sin color"
        });
    });

    console.log("📌 Resultado final:", JSON.stringify({ canastas: resultado }, null, 2)); // ✅ Verificar salida
    return resultado;
}

// Cargar datos del archivo JSON y transformarlos a la estructura interna esperada
function loadJuguetesData() {
    fetch('../listado.json')
        .then(response => {
            if (!response.ok) throw new Error(`Error al cargar JSON: ${response.status}`);
            return response.json();
        })
        .then(data => {
            // Transformar el nuevo JSON (clave = ubicación, valor = arreglo de canastas)
            // a un arreglo de canastas agregando la propiedad "ubicacion"
            let canastas = [];
            Object.entries(data).forEach(([ubicacion, lista]) => {
                lista.forEach(item => {
                    item.ubicacion = ubicacion; // Agregamos la ubicación a cada objeto
                    canastas.push(item);
                });
            });
            juguetesData.canastas = canastas;
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
    document.getElementById('search').addEventListener('input', highlightAndFindReference);
    document.getElementById('toggleFloatingDiv').onclick = toggleFloatingDiv;
};

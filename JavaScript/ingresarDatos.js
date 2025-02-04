let listado = [];

document.addEventListener("DOMContentLoaded", function () {
    fetch('../data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("JSON recibido:", data);
            listado = Object.values(data.canastas);
            console.log("Datos cargados:", listado);
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
        });

    document.getElementById("id_canasta").focus();
});

document.getElementById("id_canasta").addEventListener("input", function () {
    if (!Array.isArray(listado) || listado.length === 0) {
        console.warn("Los datos aún no se han cargado.");
        return;
    }

    const idCanasta = this.value.trim();
    const canastaEncontrada = listado.find(canasta => canasta.id === idCanasta);

    const resultContainer = document.getElementById("result_container");
    resultContainer.innerHTML = "";

    if (canastaEncontrada) {
        canastaEncontrada.referencias.forEach(ref => {
            const refDiv = document.createElement("div");
            refDiv.classList.add("ref-item");

            refDiv.innerHTML = `
                <p><strong>Referencia:</strong> ${ref.referencia}</p>
                <p><strong>Cantidad:</strong> ${ref.cantidad}</p>
                <p><strong>Color:</strong> ${ref.color}</p>
            `;

            resultContainer.appendChild(refDiv);
        });
    } else {
        resultContainer.innerHTML = "<p>No encontrado</p>";
    }
});

document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault();

    const idCanasta = document.getElementById("id_canasta").value.trim();
    const referencia = document.getElementById("referencia").value.trim();
    const cantidad = parseInt(document.getElementById("cantidad").value.trim(), 10);
    const color = document.getElementById("color").value.trim() || null;

    // Aquí ya no modificamos el listado, solo mostramos los resultados
    console.log("Formulario enviado con los siguientes datos:", { idCanasta, referencia, cantidad, color });
    console.log('asasasa');
    
    document.getElementById("formulario").reset();

    // Después de enviar el formulario, refrescamos el contenido del contenedor de resultados
    document.getElementById("id_canasta").dispatchEvent(new Event("input"));
});

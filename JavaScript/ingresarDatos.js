let listado = {};

document.addEventListener("DOMContentLoaded", function () {
    fetch('./data.json') // Asegúrate de que la ruta sea correcta
        .then(response => response.json())
        .then(data => {
            listado = data.canastas; // Guardamos solo el array de canastas
            console.log("Datos cargados:", listado);
        })
        .catch(error => {
            console.error('Error al cargar productos', error);
        });

    document.getElementById("id_canasta").focus();
});

document.getElementById("id_canasta").addEventListener("input", function () {
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

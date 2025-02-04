<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ingreso de Datos</title>
    <link rel="stylesheet" href="./css/ingresarDatos.css">
</head>
<body>
    
    <header class="menu">
        <img src="./images/LOGO-PLASTICOS-FENIX.png" alt="" class="logo">
    </header>

    <section class="form-part">
        <section>
            <form id="formulario" method="POST" action="guardar_datos.php">
                <h2 class="tittle">Ingresar Datos</h2>
                <div>
                    <label for="id_canasta">Id Canasta</label>
                    <input class="input-form" type="text" id="id_canasta" name="id_canasta" placeholder="Ejemplo: B3-M1-CA-F1-P4...">
                </div>
                <div>
                    <label for="referencai">Referencia</label>
                    <input class="input-form" type="text" id="referencia" name="referencia" placeholder="Ejemplo: pf344...">
                </div>
                <div>
                    <label for="cantidad">Cantidad</label>
                    <input class="input-form" type="text" id="cantidad" name="cantidad" placeholder="Ejemplo: 2000...">
                </div>
                <div>
                    <label for="color">Color (Opcional)</label>
                    <input class="input-form" type="text" id="color" name="color" placeholder="Ejemplo: Rojo...">
                </div>
                <button type="submit" name="action" value="add">Guardar</button>
            </form>
        </section>

        <div class="instructions-part">
            <p>Aquí van las instrucciones o detalles adicionales sobre cómo ingresar los datos.</p>
        </div>
    </section>
    
    <!-- Mostrar la lista de canastas -->
    <section id="result_container">
        <h2>Lista de Canastas</h2>
        <ul id="canastaList">
            <?php
            // Cargar el archivo JSON
            $json_data = file_get_contents('productos.json');
            $data = json_decode($json_data, true);

            // Verificar si el archivo contiene canastas
            if (isset($data['canastas']) && is_array($data['canastas'])) {
                foreach ($data['canastas'] as $canasta) {
                    echo "<li>";
                    echo "<strong>Id Canasta:</strong> {$canasta['id']}<br>";
                    echo "<strong>Referencias:</strong><br>";
                    foreach ($canasta['referencias'] as $ref) {
                        echo "Referencia: {$ref['referencia']}, Cantidad: {$ref['cantidad']}, Color: {$ref['color']}<br>";
                    }
                    echo "</li><br>";
                }
            } else {
                echo "<li>No se encontraron canastas disponibles.</li>";
            }
            ?>
        </ul>
    </section>

</body>
</html>

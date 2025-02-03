<?php
// Verifica si el parámetro 'id_canasta' está presente en la URL
if (isset($_GET['id_canasta'])) {
    // Obtener el valor del parámetro 'id_canasta'
    $id_canasta = $_GET['id_canasta'];

    // Cargar el archivo JSON con los datos
    $productos_json = file_get_contents('../data.json');
    
    if ($productos_json === false) {
        echo "<p>Error al intentar abrir el archivo data.json</p>";
        exit;
    }

    $productos = json_decode($productos_json, true);

    // Verifica si el JSON fue decodificado correctamente
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "<p>Error al procesar los datos JSON</p>";
        exit;
    }

    // Inicializar la variable para almacenar la canasta encontrada
    $canasta_encontrada = null;

    // Recorrer las canastas y buscar la que coincida con el ID
    foreach ($productos['canastas'] as $canasta) {
        if ($canasta['id'] == $id_canasta) {
            $canasta_encontrada = $canasta;
            break;
        }
    }

    // Mostrar la canasta encontrada o un mensaje de error
    if ($canasta_encontrada) {
        // Mostrar los datos de la canasta
        echo "<h3>Canasta Encontrada</h3>";
        echo "<p><strong>ID:</strong> " . $canasta_encontrada['id'] . "</p>";
        foreach ($canasta_encontrada['referencias'] as $referencia) {
            echo "<p><strong>Referencia:</strong> " . $referencia['referencia'] . " | <strong>Cantidad:</strong> " . $referencia['cantidad'] . " | <strong>Color:</strong> " . $referencia['color'] . "</p>";
        }
    } else {
        echo "<p>Canasta no encontrada</p>";
    }
} else {
    echo "<p>ID no especificado</p>";
}
?>
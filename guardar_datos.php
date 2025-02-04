<?php
$file = 'productos.json';

// Leer el archivo JSON y decodificarlo en un array PHP
$productos = json_decode(file_get_contents($file), true);

// Si no hay datos en el archivo, inicializar la estructura
if (!$productos) {
    $productos = ["canastas" => []];
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $canasta_id = $_POST['id_canasta'];
    $referencia = $_POST['referencia'];
    $cantidad = intval($_POST['cantidad']);
    $color = $_POST['color'];

    // Verificar si la canasta existe, si no, crearla
    if (!isset($productos["canastas"][$canasta_id])) {
        $productos["canastas"][$canasta_id] = [
            "id" => $canasta_id,
            "referencias" => []
        ];
    }

    // Agregar nueva referencia dentro de la canasta
    $productos["canastas"][$canasta_id]["referencias"][] = [
        "referencia" => $referencia,
        "cantidad" => $cantidad,
        "color" => $color
    ];

    // Guardar los cambios en el archivo JSON
    file_put_contents($file, json_encode($productos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    // Redirigir de nuevo al formulario
    header('Location: ingresarDatos.php');
    exit();
}

// Eliminar una referencia específica dentro de una canasta
if (isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['canasta_id']) && isset($_GET['referencia'])) {
    $canasta_id = $_GET['canasta_id'];
    $referencia = $_GET['referencia'];

    // Verificar si la canasta existe
    if (isset($productos["canastas"][$canasta_id])) {
        foreach ($productos["canastas"][$canasta_id]["referencias"] as $index => $ref) {
            if ($ref["referencia"] == $referencia) {
                unset($productos["canastas"][$canasta_id]["referencias"][$index]);
                break;
            }
        }
        // Reindexar el array después de eliminar
        $productos["canastas"][$canasta_id]["referencias"] = array_values($productos["canastas"][$canasta_id]["referencias"]);
    }

    // Guardar los cambios en el archivo JSON
    file_put_contents($file, json_encode($productos, JSON_PRETTY_PRINT));

    // Redirigir de nuevo al formulario
    header('Location: ingresarDatos.php');
    exit();
}
?>

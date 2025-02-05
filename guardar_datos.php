<?php
$file = 'productos.json';

// Leer el archivo JSON y decodificarlo en un array PHP
$productos = json_decode(file_get_contents($file), true);

// Si no hay datos en el archivo, inicializar la estructura
if (!$productos) {
    $productos = ["canastas" => []];
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Limpiar y sanitizar datos
    $canasta_id = strtoupper(preg_replace('/\s+/', '', trim($_POST['id_canasta'])));
    $referencia = preg_replace('/\s+/', '', trim($_POST['referencia']));
    $cantidad = intval($_POST['cantidad']);
    $color = trim($_POST['color']); // Mantiene espacios internos, pero elimina los externos

    // Verificar si la canasta existe, si no, crearla
    if (!isset($productos["canastas"][$canasta_id])) {
        $productos["canastas"][$canasta_id] = [
            "id" => $canasta_id,
            "referencias" => []
        ];
    }

    // Buscar si la referencia y el color ya existen en la canasta
    $existe = false;
    foreach ($productos["canastas"][$canasta_id]["referencias"] as &$ref) {
        if ($ref["referencia"] === $referencia && $ref["color"] === $color) {
            // Si ya existe, sumar la cantidad
            $ref["cantidad"] += $cantidad;
            $existe = true;
            break;
        }
    }

    // Si no existe una referencia con el mismo color, agregarla
    if (!$existe) {
        $productos["canastas"][$canasta_id]["referencias"][] = [
            "referencia" => $referencia,
            "cantidad" => $cantidad,
            "color" => $color
        ];
    }

    // Guardar los cambios en el archivo JSON
    file_put_contents($file, json_encode($productos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    // Redirigir de nuevo al formulario
    header('Location: ingresarDatos.php');
    exit();
}

// Eliminar una referencia específica dentro de una canasta
// if (isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['canasta_id']) && isset($_GET['referencia']) && isset($_GET['color'])) {
//     $canasta_id = preg_replace('/\s+/', '', trim($_GET['canasta_id']));
//     $referencia = preg_replace('/\s+/', '', trim($_GET['referencia']));
//     $color = trim($_GET['color']); 

//     // Verificar si la canasta existe
//     if (isset($productos["canastas"][$canasta_id])) {
//         foreach ($productos["canastas"][$canasta_id]["referencias"] as $index => $ref) {
//             if ($ref["referencia"] === $referencia && $ref["color"] === $color) {
//                 unset($productos["canastas"][$canasta_id]["referencias"][$index]);
//                 break;
//             }
//         }
//         // Reindexar el array después de eliminar
//         $productos["canastas"][$canasta_id]["referencias"] = array_values($productos["canastas"][$canasta_id]["referencias"]);
//     }

//     // Guardar los cambios en el archivo JSON
//     file_put_contents($file, json_encode($productos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

//     // Redirigir de nuevo al formulario
//     header('Location: ingresarDatos.php');
//     exit();
// }
?>

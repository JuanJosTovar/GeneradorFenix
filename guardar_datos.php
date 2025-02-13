<?php
$file = 'listado.json';

$productos = json_decode(file_get_contents($file), true);

if (!$productos) {
    $productos = ["canastas" => []];
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $canasta_id = strtoupper(preg_replace('/\s+/', '', trim($_POST['id_canasta'])));
    $referencias = explode(',', $_POST['referencia']);
    $cantidades = explode(',', ($_POST['cantidad']));
    $cantidades = array_map('intval', $cantidades);
    $colores = explode(',', $_POST['color']);

    if (!isset($productos["canastas"][$canasta_id])) {
        $productos["canastas"][$canasta_id] = [
            "id" => $canasta_id,
            "referencias" => []
        ];
    }

    $ultima_cantidad = end($cantidades);
    $ultimo_color = end($colores);

    foreach ($referencias as $index => $ref) {
        $referencia = strtolower(preg_replace('/\s/', '',strtolower(trim($ref))));
        $cantidad = isset($cantidades[$index]) ? $cantidades[$index] : $ultima_cantidad;
        $color = isset($colores[$index]) ? ucfirst(strtolower(preg_replace('/\s/', '',trim($colores[$index])))) : ucfirst(strtolower($ultimo_color));

        $existe = false;

        foreach ($productos["canastas"][$canasta_id]["referencias"] as &$item) {
            if ($item["referencia"] === $referencia && $item["color"] === $color) {
                $item["cantidad"] += $cantidad;
                $existe = true;
                break;
            }
        }


        if (!$existe) {
            $productos["canastas"][$canasta_id]["referencias"][] = [
                "referencia" => $referencia,
                "cantidad" => $cantidad,
                "color" => $color
            ];
        }
    }

    file_put_contents($file, json_encode($productos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    header('Location: ingresarDatos.php');
    exit();
}

// Código para eliminar referencias dentro de una canasta (comentado)

// if (isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['canasta_id']) && isset($_GET['referencia']) && isset($_GET['color'])) {
//     $canasta_id = preg_replace('/\s+/', '', trim($_GET['canasta_id']));
//     $referencia = preg_replace('/\s+/', '', trim($_GET['referencia']));
//     $color = trim($_GET['color']); 

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

//     file_put_contents($file, json_encode($productos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
//     header('Location: ingresarDatos.php');
//     exit();
// }
?>
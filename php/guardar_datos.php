<?php
header('Content-Type: application/json');

$file = 'data.json';
$datos = file_exists($file) ? json_decode(file_get_contents($file), true) : ["canastas" => []];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id_canasta = $_POST['id_canasta'];
    $referencia = $_POST['referencia'];
    $cantidad = $_POST['cantidad'];
    $color = $_POST['color'];

    error_log("📝 Datos recibidos: ID=$id_canasta, Ref=$referencia, Cantidad=$cantidad, Color=$color"); // 📝 Log para verificar los datos enviados

    // Buscar si ya existe la canasta
    $canastaIndex = array_search($id_canasta, array_column($datos['canastas'], 'id'));

    if ($canastaIndex !== false) {
        // La canasta existe, agregar referencia nueva
        array_push($datos['canastas'][$canastaIndex]['referencias'], [
            'referencia' => $referencia,
            'cantidad' => (int)$cantidad,
            'color' => $color
        ]);
        error_log("📌 Se agregó una nueva referencia a la canasta existente");
    } else {
        // Nueva canasta
        $datos['canastas'][] = [
            'id' => $id_canasta,
            'referencias' => [[
                'referencia' => $referencia,
                'cantidad' => (int)$cantidad,
                'color' => $color
            ]]
        ];
        error_log("✅ Nueva canasta creada con ID: $id_canasta");
    }

    file_put_contents($file, json_encode($datos, JSON_PRETTY_PRINT));
    echo json_encode(["message" => "Datos guardados correctamente"]);
    exit();
}

// Eliminar una referencia
if (isset($_GET['eliminar']) && isset($_GET['id'])) {
    $id_canasta = $_GET['id'];
    $referenciaEliminar = $_GET['eliminar'];

    error_log("🗑️ Eliminando referencia: $referenciaEliminar de la canasta $id_canasta"); // 🔄 Log para saber qué se está eliminando

    foreach ($datos['canastas'] as &$canasta) {
        if ($canasta['id'] === $id_canasta) {
            $canasta['referencias'] = array_filter($canasta['referencias'], function ($ref) use ($referenciaEliminar) {
                return $ref['referencia'] !== $referenciaEliminar;
            });
            error_log("✅ Referencia eliminada correctamente");
        }
    }

    file_put_contents($file, json_encode($datos, JSON_PRETTY_PRINT));
    echo json_encode(["message" => "Referencia eliminada"]);
    exit();
}
?>

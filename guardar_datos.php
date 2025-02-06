<?php
$file = 'productos.json';

$productos = json_decode(file_get_contents($file), true);
if (!$productos) {
    $productos = ["canastas" => []];
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $canasta_id = strtoupper(preg_replace('/\s+/', '', trim($_POST['id_canasta'])));
    $referencias = explode(',', $_POST['referencia']);  // Dividir las referencias por coma
    $cantidades = array_map('intval', explode(',', $_POST['cantidad']));  // Convertir cantidades a enteros
    $colores = explode(',', $_POST['color']);  // Dividir los colores por coma

    if (!isset($productos["canastas"][$canasta_id])) {
        $productos["canastas"][$canasta_id] = [
            "id" => $canasta_id,
            "referencias" => []
        ];
    }

    // Asegurarse que el número de cantidades y colores sea el mismo que el número de referencias
    $max_items = max(count($referencias), count($cantidades), count($colores));

    for ($i = 0; $i < $max_items; $i++) {
        // Si no hay más colores o cantidades, usar los últimos valores disponibles
        $cantidad = isset($cantidades[$i]) ? $cantidades[$i] : end($cantidades);
        $color = isset($colores[$i]) ? ucfirst(strtolower(trim($colores[$i]))) : ucfirst(strtolower(end($colores)));

        // Utilizamos la primera referencia, ya que es la misma para todas
        $referencia = strtolower(trim($referencias[0]));

        // Agregar la referencia con cantidad y color
        $productos["canastas"][$canasta_id]["referencias"][] = [
            "referencia" => $referencia,
            "cantidad" => $cantidad,
            "color" => $color
        ];
    }

    // Guardar el archivo actualizado
    file_put_contents($file, json_encode($productos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    header('Location: ingresarDatos.php');
    exit();
}
?>

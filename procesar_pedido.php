<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ruta del archivo JSON donde se almacenan las canastas
$jsonFile = "productos.json";

// Verificar si el archivo JSON existe, si no, crearlo
if (!file_exists($jsonFile)) {
    file_put_contents($jsonFile, json_encode(["canastas" => []], JSON_PRETTY_PRINT));
}

// Leer el contenido del JSON
$jsonData = json_decode(file_get_contents($jsonFile), true);

// Obtener datos enviados desde el frontend
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Verificar que se recibió un JSON válido
if (!isset($data["canastas"]) || !is_array($data["canastas"])) {
    echo json_encode(["error" => "Formato incorrecto, se esperaba un objeto de canastas"]);
    exit;
}

// Procesar las canastas y actualizar el JSON
foreach ($data["canastas"] as $idCanasta => $canasta) {
    if (isset($jsonData["canastas"][$idCanasta])) { // Verifica si la canasta existe en el JSON
        foreach ($canasta["referencias"] as $referencia) {
            $ref = $referencia["referencia"];
            $cantidad = $referencia["cantidad"];
            $color = isset($referencia["color"]) ? $referencia["color"] : null; // Puede no existir

            // Buscar en el JSON y actualizar la cantidad
            foreach ($jsonData["canastas"][$idCanasta]["referencias"] as &$jsonRef) {
                if ($jsonRef["referencia"] == $ref && ($jsonRef["color"] == $color || !isset($jsonRef["color"]))) {
                    $jsonRef["cantidad"] -= $cantidad; // Restar la cantidad
                    if ($jsonRef["cantidad"] < 0) {
                        $jsonRef["cantidad"] = 0; // Evitar números negativos
                    }
                }
            }
        }
    }
}

// Guardar los cambios en el archivo JSON
file_put_contents($jsonFile, json_encode($jsonData, JSON_PRETTY_PRINT));

// Responder al frontend
echo json_encode(["mensaje" => "Stock actualizado en productos.json correctamente"]);
?>

<?php
require 'vendor/autoload.php'; // PhpSpreadsheet

use PhpOffice\PhpSpreadsheet\IOFactory;

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['archivo_excel'])) {
    $archivo = $_FILES['archivo_excel']['tmp_name'];

    if (!$archivo) {
        die("No se subió ningún archivo.");
    }

    // Cargar el Excel
    $spreadsheet = IOFactory::load($archivo);
    $hoja = $spreadsheet->getActiveSheet();
    $datosExcel = $hoja->toArray(null, true, true, true);

    // Leer el JSON existente
    $jsonFile = 'listado.json';
    $jsonData = file_exists($jsonFile) ? json_decode(file_get_contents($jsonFile), true) : ["canastas" => []];

    // Procesar los datos del Excel
    foreach ($datosExcel as $index => $fila) {
        if ($index == 1) continue; // Saltar encabezados

        $codigo = trim($fila['A']);
        $nombre = trim($fila['B']);
        $ubicacion = trim($fila['C']);
        $referencia = trim($fila['D']);
        $cantidad = intval($fila['E']);
        $color = trim($fila['F']);

        // Buscar si ya existe la canasta en el JSON
        $canastaIndex = array_search($codigo, array_column($jsonData["canastas"], "codigo"));

        if ($canastaIndex === false) {
            // Si no existe, agregarla
            $jsonData["canastas"][] = [
                "codigo" => $codigo,
                "nombre" => $nombre,
                "ubicacion" => $ubicacion,
                "referencias" => [
                    ["ref" => $referencia, "cantidad" => $cantidad, "color" => $color]
                ]
            ];
        } else {
            $referencias = &$jsonData["canastas"][$canastaIndex]["referencias"];
        
            // Buscar si la referencia con el color ya existe
            $indexReferencia = array_search($referencia, array_column($referencias, 'ref'));
            
            if ($indexReferencia !== false && $referencias[$indexReferencia]['color'] === $color) {
                // Si ya existe, actualizar la cantidad sumándola
                $referencias[$indexReferencia]["cantidad"] += $cantidad;
            } else {
                // Si no existe, agregarla
                $referencias[] = [
                    "ref" => $referencia,
                    "cantidad" => $cantidad,
                    "color" => $color
                ];
            }
        
        }        
    }

    // Guardar el JSON actualizado
    file_put_contents($jsonFile, json_encode($jsonData, JSON_PRETTY_PRINT));

    echo "Archivo procesado y datos actualizados en JSON.";
}

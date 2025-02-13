<?php
require 'vendor/autoload.php'; // PhpSpreadsheet

use PhpOffice\PhpSpreadsheet\IOFactory;

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['archivo_excel'])) {
    $archivo = $_FILES['archivo_excel']['tmp_name'];

    if (!$archivo || $_FILES['archivo_excel']['error'] !== UPLOAD_ERR_OK) {
        die("Error al subir el archivo.");
    }

    try {
        // Cargar el archivo Excel
        $spreadsheet = IOFactory::load($archivo);
        $hoja = $spreadsheet->getActiveSheet();
        $datosExcel = $hoja->toArray(null, true, true, true);
    } catch (Exception $e) {
        die("Error al procesar el archivo Excel: " . $e->getMessage());
    }

    // Leer el JSON existente
    $jsonFile = 'listado.json';
    $jsonData = file_exists($jsonFile) ? json_decode(file_get_contents($jsonFile), true) : [];

    // Procesar los datos del Excel
    foreach ($datosExcel as $index => $fila) {
        if ($index === 0) continue; // Saltar encabezados

        $codigo = trim($fila['A'] ?? "");
        $nombre = trim($fila['B'] ?? "");
        $ubicacion = trim($fila['C'] ?? "");
        $referencia = trim($fila['D'] ?? "");
        $cantidad = intval($fila['E'] ?? 0);
        $color = trim($fila['F'] ?? "");

        // **Evitar registros vacíos**
        if (empty($codigo) || empty($nombre) || empty($ubicacion) || empty($referencia) || $cantidad <= 0) {
            continue;
        }

        // Inicializar ubicación si no existe
        if (!isset($jsonData[$ubicacion])) {
            $jsonData[$ubicacion] = [];
        }

        // Buscar si la canasta ya existe en la ubicación
        $canastaIndex = array_search($codigo, array_column($jsonData[$ubicacion], "codigo"));

        if ($canastaIndex === false) {
            // Si no existe la canasta, agregarla con la referencia
            $jsonData[$ubicacion][] = [
                "codigo" => $codigo,
                "nombre" => $nombre,
                "referencias" => [
                    [
                        "ref" => $referencia,
                        "cantidad" => $cantidad,
                        "color" => $color
                    ]
                ]
            ];
        } else {
            // Si la canasta ya existe, actualizar o agregar la referencia
            $referencias = &$jsonData[$ubicacion][$canastaIndex]["referencias"];
            
            // Buscar si la referencia ya existe con el mismo color
            $indexReferencia = false;
            foreach ($referencias as $key => $refItem) {
                if ($refItem['ref'] === $referencia && $refItem['color'] === $color) {
                    $indexReferencia = $key;
                    break;
                }
            }

            if ($indexReferencia !== false) {
                // Si ya existe, sumar la cantidad
                $referencias[$indexReferencia]["cantidad"] += $cantidad;
            } else {
                // Si no existe, agregar la nueva referencia
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

    // Redirigir sin que haya problemas de salida de datos
    header('Location: ingresarDatos.php');
    exit();
}
?>

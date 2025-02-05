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
        <img src="./images/LOGO-PLASTICOS-FENIX.png" alt="" class="logo" onclick="navigateTo('index.html')">
    </header>

    <section class="form-part">
        <section>
            <form id="formulario" method="POST" action="guardar_datos.php">
                <h2 class="tittle">Ingresar Datos</h2>
                <div>
                    <p for="id_canasta">Id Canasta</p>
                    <input class="input-form" type="text" id="id_canasta" name="id_canasta" placeholder="Ejemplo: B3-M1-CA-F1-P4" required>
                </div>
                <div>
                    <p for="referencai">Referencia</p>
                    <input class="input-form" type="text" id="referencia" name="referencia" placeholder="Ejemplo: pf344" required>
                </div>
                <div>
                    <p for="cantidad">Cantidad</p>
                    <input class="input-form" type="number" id="cantidad" name="cantidad" placeholder="Ejemplo: 2000" required>
                </div>
                <div>
                    <p for="color">Color (Opcional)</p>
                    <input class="input-form" type="text" id="color" name="color" placeholder="Ejemplo: Rojo">
                </div>
                <button class="guardar" type="submit" name="action" value="add">Guardar</button>
            </form>
        </section>

        <div class="instructions-part">
            <h1>Instrucciones de Ingreso</h1>
            <p>1. Ingresa el id de la canasta con el debido patron indicado en la que sera guardada la nueva referencia Ej: B3-M1-CA-F1-P4 (sin espacios y con mayúsculas)
            <br>
            <strong class="subtitulo">ADVERTENCIA</strong>
            <br>
            En caso de tener que agregar una nueva canasta, avisar al desarrollador previamente</p>
            <p>2. Ingresa la referencia que vas a guardar en la canasta Ej: pf385 (sin espacios y sin mayúsculas)</p>
            <p>3. Ingresa la cantidad/stock de la referencia que ingresaste previamente Ej: 166 (sin espacios y este campo solo admite numeros enteros)</p>
            <p>4. Ingresa el color de la referencia si este es necesario Ej: Azul (sin espacios y sin mayúsculas) recuerda que este campo es opcional</p>
            <br></br>
            <h1>Notas Importantes</h1>
            <ul class="notas">
                <li>Al ingresar y guardar un id de canasta que no existe esto genera automaticamente una nueva canasta, lo cual puede generar errores en el mapeado para los pedidos, por lo tanto se le pide informar al desarrollador previamente</li>
                <li>Al ingresar y guardar un id de canasta y una referencia existente con un color diferente a uno previamente guardado, se creara un objeto diferente y no actualizara el anterior ya que su color es distinto</li>
                <li>Al ingersar y guardar un id de canasta, referencia y color existente con una cantidad diferente a una previamente guardada, se actualizara la cantidad de este objeto sumando la cantidad previa con la recien ingresada</li>
            </ul>
        </div>
    </section>
    
    <script src="./JavaScript/app.js"></script>
</body>
</html>

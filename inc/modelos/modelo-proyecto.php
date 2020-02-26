<?php
    $accion = $_POST['accion'];
    $proyecto = $_POST['proyecto'];

    if ($accion === 'crear') {
        $opciones = array(
            'cost' => 12
        );
        $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
        //importar la conexión
        include '../funciones/conexion.php';
        try {
            //Realizar la consulta a la BD
            $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?)");
            $stmt->bind_param('s', $proyecto);
            $stmt->execute();
            if ($stmt->affected_rows === 1) {
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'accion' => $accion
                );
            }else{
                $respuesta = array(
                    'respuesta' => 'error'
                );
            }
            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            //Tomar la excepcion
            $respuesta = array(
                'error' => $e->getMessage()
            );
        }
    }

  echo json_encode($respuesta);
?>
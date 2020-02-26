<?php
    $accion = $_POST['accion'];
    $password = $_POST['password'];
    $usuario = $_POST['usuario'];

    if ($accion === 'crear') {
        $opciones = array(
            'cost' => 12
        );
        $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
        //importar la conexión
        include '../funciones/conexion.php';
        try {
            //Realizar la consulta a la BD
            $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?,?)");
            $stmt->bind_param('ss', $usuario, $hash_password);
            $stmt->execute();
            if ($stmt->affected_rows === 1) {
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion
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

    if ($accion === 'login') {
        include '../funciones/conexion.php';
        try {
            //Seleccionar el administrador de la BD
            $stmt = $conn->prepare("SELECT id, usuario, password FROM usuarios WHERE usuario=?");
            $stmt->bind_param('s', $usuario);
            $stmt->execute();
            // Loguear el usuario
            $stmt->bind_result($id_usuario, $nombre_usuario, $password_usuario);
            $stmt->fetch();
            
            if ($nombre_usuario) {
                if (password_verify($password,$password_usuario)) {
                    //Iniciar la sesion
                    session_start();
                    $_SESSION['nombre']=$nombre_usuario;
                    $_SESSION['id']=$id_usuario;
                    $_SESSION['login']=true;
                    //Login correcto
                    $respuesta = array(
                        'respuesta' => 'correcto',
                        'tipo' => 'login',
                        'nombre' => $nombre_usuario,
                        'session' => $_SESSION
                    );
                }else{
                    $respuesta = array(
                        'respuesta' => 'Password Incorrecto'
                    );
                }
            } else {
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
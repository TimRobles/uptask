eventListeners();

function eventListeners(){
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e){
    e.preventDefault();
    var usuario = document.querySelector('#usuario').value;
    var password = document.querySelector('#password').value;
    var tipo = document.querySelector('#tipo').value;

    if (usuario === '' || password === '') {
        swal({
            type: 'error',
            title: 'Error!',
            text: 'Ambos campos son obligatorios'
        })
    }else{
        var datos = new FormData();
        datos.append('usuario',usuario);
        datos.append('password',password);
        datos.append('accion',tipo);
        console.log(...datos);

        var xhr = new XMLHttpRequest();
        xhr.open('POST','inc/modelos/modelo-admin.php',true);
        xhr.onload = function(){
            if (this.status === 200) {
                $respuesta = JSON.parse(xhr.responseText);
                if ($respuesta.respuesta === 'correcto') {
                    if ($respuesta.tipo === 'crear') {
                        swal({
                            type: 'success',
                            title: 'Usuario creado',
                            text: 'El usuario se creó correctamente'
                        });
                    }else if ($respuesta.tipo === 'login') {
                        swal({
                            type: 'success',
                            title: 'Login correcto',
                            text: 'Presiona OK para abrir el sistema'
                        })
                        .then(resultado => {
                            if (resultado.value) {
                                window.location.href='index.php';
                            }
                        });
                    }
                }else if ($respuesta.respuesta === 'Password Incorrecto') {
                    swal({
                        type: 'error',
                        title: 'Contraseña incorrecta',
                        text: 'Vuelva a ingresar la contraseña'
                    });
                }else{
                    swal({
                        type: 'error',
                        title: 'Error',
                        text: 'Hubo un error'
                    });
                }
                console.log($respuesta);
            }
        }
        xhr.send(datos);
    }
}
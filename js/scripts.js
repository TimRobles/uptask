eventListeners();
// lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners(){
    document.querySelector('.crear-proyecto a').addEventListener('click',nuevoProyecto);

    document.querySelector('.nueva-tarea').addEventListener('click',agregarTarea);

    document.querySelector('.listado-pendientes').addEventListener('click',accionesTareas);
}

function nuevoProyecto(e) {
    e.preventDefault();

    //Crea un input
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    //al precionar enter crear proyecto
    inputNuevoProyecto.addEventListener('keypress',function(e){
        var tecla = e.which || e.keyCode;
        if (tecla === 13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }
    });
}

function guardarProyectoDB(nombreProyecto){
    // crear
    var xhr = new XMLHttpRequest();
    //enviar formdata
    var datos = new FormData();
    datos.append('proyecto',nombreProyecto);
    datos.append('accion','crear');
    //Abrir
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php',true);
    //carga
    xhr.onload = function(){
        if (this.status === 200) {
            $respuesta=JSON.parse(xhr.responseText);
            console.log($respuesta);
        }
        if ($respuesta.respuesta === 'correcto') {
            if ($respuesta.accion === 'crear'){
                // inyectar el html
                var nuevoProyecto=document.createElement('li');
                nuevoProyecto.innerHTML = `
                    <a href="index.php?id_proyecto=${$respuesta.id_insertado}" id="proyecto:${$respuesta.id_insertado}">
                        ${nombreProyecto}
                    </a>
                `; 
                listaProyectos.appendChild(nuevoProyecto);
                swal({
                    type: 'success',
                    title: 'Usuario Creado',
                    text: 'Proyecto: ' + nombreProyecto + ' se creó correctamente'
                })
                .then(resultado => {
                    if (resultado.value) {
                        window.location.href='index.php?id_respuesta=' + $respuesta.id_insertado;
                    }
                });
            }else{
                swal({
                    type: 'error',
                    title: 'Error',
                    text: 'Hubo un error'
                });
            }
        }else{
            swal({
                type: 'error',
                title: 'Error',
                text: 'Hubo un error'
            });
        }
    }
    //enviar
    xhr.send(datos);
}   

function agregarTarea(e) {
    e.preventDefault();
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    
    if (nombreTarea === '') {
        swal({
           title: 'Error',
           text: 'Tarea vacía',
           type: 'error'
        });
    }else{
        var datos = new FormData();
        datos.append('tarea',nombreTarea);
        datos.append('accion','crear');
        datos.append('id_proyecto',document.querySelector('#id_proyecto').value);

        //crear
        var xhr = new XMLHttpRequest();
        //Abrir
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
        //onload
        xhr.onload = function(){
            if(this.status === 200){
                $respuesta = JSON.parse(xhr.responseText);
                console.log($respuesta);
            }
            if ($respuesta.respuesta === 'correcto') {
                if ($respuesta.accion === 'crear'){
                    // inyectar el html
                    var nuevaTarea=document.createElement('li');
                    nuevaTarea.id = 'tarea:' + $respuesta.id_insertado;
                    nuevaTarea.classList.add('tarea');
                    nuevaTarea.innerHTML=`
                        <p>${nombreTarea}</p>
                        <div class="acciones">
                            <i class="far fa-check-circle"></i>
                            <i class="fas fa-trash"></i>
                        </div>
                    `;
                    var listado = document.querySelector('.listado-pendientes ul');
                    listado.appendChild(nuevaTarea);
                    document.querySelector('.agregar-tarea').reset();
                    swal({
                        type: 'success',
                        title: 'Tarea Creada',
                        text: 'Tarea: ' + nombreTarea + ' se creó correctamente'
                    });
                }else{
                    swal({
                        type: 'error',
                        title: 'Error',
                        text: 'Hubo un error'
                    });
                }
            }else{
                swal({
                    type: 'error',
                    title: 'Error',
                    text: 'Hubo un error'
                });
            }
        }
        //send
        xhr.send(datos);
    }
}
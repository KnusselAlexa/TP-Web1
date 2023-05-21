"use strict"

/*interaccion con la barra de menu*/
document.querySelector(".btn_menu").addEventListener("click", toggleMenu);

function toggleMenu() {
    document.querySelector(".navigation").classList.toggle("show");
}



/*captcha*/
document.querySelector("#btn-enviar").addEventListener("click", verificarCaptcha);
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
let valorCorrecto = generateString(4);
let captcha = document.querySelector("#captcha");
//let textBox = captcha.value;
captcha.textContent = valorCorrecto;

function verificarCaptcha() {
    let textBox = document.querySelector("#ingreso").value;

    console.log(textBox, valorCorrecto);

    if (textBox.trim() === valorCorrecto.trim()) {
        alert("captcha correcto");

    }

    else {
        alert("captcha incorrecto, por favor ingrese de nuevo");
    }
}


/*formulario*/
let formSubmit = document.querySelector("#form_tabla_dinamica");
formSubmit.addEventListener("submit", function (e) {
    e.preventDefault();
    agregar();
});

//tabla con api
const url = 'https://62c483917d83a75e39fb9ae1.mockapi.io/api/v1/locales';
let id = 0;
async function mostrar() {
    let tabla = document.querySelector("#tabla");
    tabla.innerHTML = " ";
    try {
        let respuesta = await fetch(url);
        let locales = await respuesta.json();

        console.log("respuesta ", respuesta);
        if (respuesta.ok) {
            for (let negocio of locales) {
                let Nombre = negocio.Nombre;
                let Calle = negocio.Calle;
                let Altura = negocio.Altura;
                let Telefono = negocio.Telefono;
                let Redes = negocio.Redes;
                let TipoNegocio = negocio.TipoNegocio
                id = negocio.id;

                tabla.innerHTML += `
                <tr id= "tr-${id}">
                
                    <td>${Nombre}</td>    
                    <td>${Calle}</td>
                    <td>${Altura}</td>
                    <td>${Telefono}</td>
                    <td>${Redes}</td>
                    <td>${TipoNegocio}</td>
                    <td class="tdApi">
                        <img src="images/editar.png" id="${id}" class= "btnApi-editar">
                    </td>
                    <td class="tdApi">
                        <img src="images/eliminar.png" id="${id}" class="btnApi-eliminar">
                    </td>
                </tr> `
                let btnModificar = document.querySelectorAll(".btnApi-editar");
                for (let btn of btnModificar) {
                    btn.addEventListener("click", function (e) {
                        let idRow = e.target.id;
                        modificarApi(idRow);
                    });
                }
                let btnBorrar = document.querySelectorAll(".btnApi-eliminar");
                for (let btn of btnBorrar) {
                    btn.addEventListener("click", function (e) {
                        let idRow = e.target.id;
                        eliminarApi(idRow);
                    })
                }
            }


        }
    } catch (error) {
        console.log(error);
    }
}

//form 2
let nombreModificado = document.querySelector("#NombreMod");
let calleModificado = document.querySelector("#CalleMod");
let alturaModificado = document.querySelector("#AlturaMod");
let telefonoModificado = document.querySelector("#TelefonoMod");
let redesModificado = document.querySelector("#Red_socialMod");
let tiponegocioModificado = document.querySelector("#Tipo_negocioMod");
let btnEditar = document.querySelector('#btnModificar');

async function modificarApi(id) {
    let response = await fetch(`${url}/${id}`);
    let json = await response.json();
    nombreModificado.value = json.Nombre;
    calleModificado.value = json.Calle;
    alturaModificado.value = json.Altura;
    telefonoModificado.value = json.Telefono;
    redesModificado.value = json.Redes;
    tiponegocioModificado.value = json.TipoNegocio;
    btnEditar.addEventListener('click', editar)
    function editar() {
        let json = {
            Nombre: nombreModificado.value,
            Calle: calleModificado.value,
            Altura: alturaModificado.value,
            Telefono: telefonoModificado.value,
            Redes: redesModificado.value,
            TipoNegocio: tiponegocioModificado.value
        }
        insertarMod(id, json);
        btnEditar.removeEventListener('click', editar);
    }
}

async function insertarMod(id, json) {

    try {
        let respuesta = await fetch(`${url}/${id}`, {
            "method": "PUT",
            "headers": { "content-type": "application/json" },
            "body": JSON.stringify(json),
        });
        if (respuesta.ok) {
            console.log("Modificado");
            mostrar();
        }
    }
    catch (error) {
        console.log(error);
    }
}

async function agregar() {
    try {
        let nombre = document.querySelector("#Nombre").value;
        let calle = document.querySelector("#Calle").value;
        let altura = document.querySelector("#Altura").value;
        let telefono = document.querySelector("#Telefono").value;
        let redes = document.querySelector("#Red_social").value;
        let tiponegocio = document.querySelector("#Tipo_negocio").value;

        let agregarLocal = {
            Nombre: nombre,
            Calle: calle,
            Altura: altura,
            Telefono: telefono,
            Redes: redes,
            TipoNegocio: tiponegocio
        };



        let respuesta = await fetch(url, {
            "method": "POST",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(agregarLocal),
        });
        if (respuesta.ok) {
            console.log(agregarLocal);
            mostrar();
        }

    }
    catch (error) {
        console.log(error);
    }
}

async function eliminarApi(idToDelete) {

    try {
        let respuesta = await fetch(`${url}/${idToDelete}`, {
            "method": "DELETE"
        });
        if (respuesta.ok) {
            mostrar();

        }

    }
    catch (error) {
        console.log(error);
    }
}

mostrar();


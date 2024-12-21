
const ubicacion = '\uD83D\uDCCD';
const autoIcon = '\uD83D\uDE97';
const atencion = '\u26A0';

function limpiarLocalStorage() {
  localStorage.removeItem("direccionr");

  // Elimina el Local Storage específico para "telefono"
  localStorage.removeItem("telefonor");
}


let boton9 = document.getElementById("boton9");
boton9.addEventListener("click", () => {
  limpiarLocalStorage();
 // mostrarToast3();
 refrescarPagina()
});


function refrescarPagina() {
  location.reload();
}


// Escucha el evento de clic en el botón "Eliminar Local Storage"
document
  .getElementById("eliminarLocalStorageButton")
  .addEventListener("click", function () {
    // Elimina el contenido del localStorage
    localStorage.removeItem("excelr");
    // También puedes usar localStorage.clear() para eliminar todos los datos del localStorage
refrescarPagina()
    // Limpia la variable productos
    productos = [];

    mostrarToastConfig(
      "Base de productos eliminada",
      700,
      "https://github.com/apvarun/toastify-js",
      "center"
    );

    // Realiza otras acciones si es necesario
    console.log("Local Storage eliminado.");
  });

let PREMIUM = 0;

function pricePremium() {
  const codigo = "12167";
  const premium = productos.find((p) => p.codigo === codigo);

  if (premium) {
    PREMIUM = Number(premium.precio); // Convierte el precio a número
  } else {
    // Puedes manejar el caso en el que no se encuentra el producto
    // Por ejemplo, establecer PREMIUM en un valor por defecto.
    PREMIUM = 0; // O cualquier otro valor numérico por defecto
  }
}

///////////////////////////////////////ok

/*

async function verProductosapi() {
  try {
    const response = await fetch("https://api-boxes-default-rtdb.firebaseio.com/productos.json");
    if (!response.ok) {
      throw new Error(`No se pudo cargar los productos. Código de estado: ${response.status}`);
    }
    const jsonResponse = await response.json();
    productosServer = jsonResponse;
    productos = productosServer;
    console.log(productos)
  } catch (error) {
    console.error(`Error al cargar los productos: ${error}`);
  }
}

let productos = [];
let productosServer = [];

verProductosapi();
*/

/////////////////////////////////////////////////////ok////////////////

// Puedes acceder a "productos" después de que la carga esté completa
// Al cargar la página, verifica si hay productos almacenados en el localStorage
const productosAlmacenados = localStorage.getItem("excelr");

if (productosAlmacenados) {
  // Si hay productos en el localStorage, cárgalos
  productos = JSON.parse(productosAlmacenados);
} else {
  // Si no hay productos en el localStorage, inicializa la variable productos
  productos = [];
}

async function cargarProductosDesdeExcel() {
  return new Promise((resolve, reject) => {
    document
      .getElementById("uploadButton")
      .addEventListener("click", async function () {
        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];

        if (file) {
          const reader = new FileReader();

          reader.onload = async function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const producto = [];

            // Agregar un objeto con valores vacíos si alguno de los campos es undefined
            jsonData.forEach((row) => {
              const nombre = row[0] !== undefined ? row[0].toString() : "";
              
              const telefono = row[1] !== undefined ? row[1].toString() : "";
              const marca = row[2] !== undefined ? row[2].toString() : "";
              const modelo = row[3] !== undefined ? row[3].toString() : "";
              const patente = row[4] !== undefined ? row[4].toString() : "";

              producto.push({ nombre, telefono,marca,modelo,patente });

              //   if (row[0] === undefined || row[1] === undefined || row[2] === undefined) {
            //  producto.push({ nombre: "", apellido: "", telefono: "" });
              //    }
            });

            productos = producto; // Actualiza la variable productos fuera de la función
refrescarPagina()
            console.log("Productos cargados desde el archivo Excel:", producto);

            // Después de cargar los productos, guárdalos en el localStorage
            localStorage.setItem("excelr", JSON.stringify(producto));

            resolve(producto); // Resuelve la promesa cuando se han cargado los productos
          };

          reader.readAsArrayBuffer(file);
        } else {
          reject("No se seleccionó ningún archivo."); // Rechaza la promesa si no se seleccionó ningún archivo
        }
      });
  });
}

// Uso de la función cargarProductosDesdeExcel() con async/await
(async () => {
  try {
    const productosCargados = await cargarProductosDesdeExcel();
    // Puedes acceder a los productos cargados aquí
    console.log(
      "Productos cargados desde el archivo Excel:",
      productosCargados
    );

    mostrarToastConfig(
      "Base de productos agregada correctamente",
      800,
      "https://github.com/apvarun/toastify-js",
      "center"
    );
  } catch (error) {
    console.error(
      "Error al cargar los productos desde el archivo Excel:",
      error
    );
  }
})();

pricePremium();





const direccion = localStorage.getItem("direccionr");
const telefono = localStorage.getItem("telefonor");

// Verifica si los valores son nulos o indefinidos antes de usarlos
if (direccion !== null && telefono !== null) {
  // Haz lo que necesites con las variables direccion y telefono
  console.log("Dirección:", direccion);
  console.log("Teléfono:", telefono);
} else {
  console.log("No se encontraron valores en el Local Storage para dirección y/o teléfono.");
}







// Obtén una referencia a los elementos del DOM
const inputMensaje = document.getElementById('inputMensaje');
const btnAceptar = document.getElementById('btnAceptar');
const mensajeContainer = document.getElementById('mensajeContainer');


// Verifica si hay un mensaje guardado en el almacenamiento local y muestre en el contenedor
const mensajeGuardado = localStorage.getItem('mensajer');
if (mensajeGuardado) {
  mensajeContainer.innerText = mensajeGuardado;
}

// Agrega un evento de clic al botón "Aceptar"
btnAceptar.addEventListener('click', function() {
  // Obtiene el valor del campo de entrada de texto
  const mensaje = inputMensaje.value;

  // Muestra el mensaje en el contenedor
  mensajeContainer.innerText = mensaje;

  // Guarda el mensaje en el almacenamiento local
  localStorage.setItem('mensajer', mensaje);
  refrescarPagina()
});




// Obtén el contenedor donde deseas renderizar las tarjetas
const tarjetasContainer = document.getElementById("tarjetas-container");

// Función para crear el mensaje de WhatsApp
function crearMensaje(producto) {
 // const inputMensaje = document.getElementById("inputMensaje");
  const mensajeAdicional = mensajeGuardado
  // Utiliza trim() para eliminar espacios en blanco al principio y al final de las cadenas
  const nombre = producto.nombre.trim();
  const marca = producto.marca.trim();
  const modelo = producto.modelo.trim();
  const patente = producto.patente.trim();

  return `Hola _${nombre}_, se acerca el próximo servicio de tu vehículo:${autoIcon} _${marca}_ _${modelo}_ patente: *${patente}*. ${atencion} ${mensajeAdicional}; *${telefono}*. ${ubicacion} ${direccion}. *Agendanos para enterarte de nuestras promociones y descuentos* `
}

// Itera a través de los elementos del array y crea una tarjeta con un enlace a WhatsApp Web para cada uno
// ...

productos.forEach((producto, index) => {
  // Crea un elemento de tarjeta
  const tarjeta = document.createElement("div");
  tarjeta.className = "card";

  // Construye el contenido de la tarjeta
  tarjeta.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">Cliente ${index + 1}: ${producto.nombre}</h5>
      <p class="card-text">Teléfono: ${producto.telefono}</p>
      <p class="card-text">Marca: ${producto.marca}</p>
      <p class="card-text">Modelo: ${producto.modelo}</p>
      <p class="card-text">Patente: ${producto.patente}</p>
      <a class="btn btn-success whatsapp-button" href="#">Compartir en WhatsApp</a>
    </div>
  `;

  // Agrega la tarjeta al contenedor
  tarjetasContainer.appendChild(tarjeta);

  const whatsappBtn = tarjeta.querySelector(".whatsapp-button");
  whatsappBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del enlace
    const mensaje = crearMensaje(producto);
    let enlaceWhatsApp;
  
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // Si el usuario está en un dispositivo móvil
      enlaceWhatsApp = `https://api.whatsapp.com/send?phone=549${producto.telefono}&text=${encodeURIComponent(mensaje)}`;
    } else {
      // Si el usuario está en una PC
      enlaceWhatsApp = `https://web.whatsapp.com/send?phone=549${producto.telefono}&text=${encodeURIComponent(mensaje)}`;
    }
  
    window.open(enlaceWhatsApp, "_blank");
  
    // Cambia el estilo y el texto del botón después de hacer clic
    whatsappBtn.classList.remove("btn-success");
    whatsappBtn.classList.add("btn-secondary");
    whatsappBtn.textContent = "Recordatorio enviado";
    
    // Deshabilita el botón para que no se pueda hacer clic nuevamente
    whatsappBtn.disabled = true;
  });
  
});




let botonCambiardireccion = document.getElementById("boton10");
let direccionElement = document.getElementById("direccion");
let direccionGuardada = localStorage.getItem("direccionr");

if (direccionElement && direccionGuardada) {
  direccionElement.innerHTML = direccionGuardada;
}

botonCambiardireccion.addEventListener("click", () => {
  let direccion1 = document.getElementById("direccioninput").value;
  if (direccionElement) {
    direccionElement.innerHTML = direccion1;
    document.getElementById("direccioninput").value = "";
    localStorage.setItem("direccionr", direccion1);

    refrescarPagina();
  }
});

let botonCambiarTelefono = document.getElementById("boton11");
let telefonoElement = document.getElementById("telefono");
let telefonoGuardada = localStorage.getItem("telefonor");

if (telefonoElement && telefonoGuardada) {
  telefonoElement.innerHTML = telefonoGuardada;
}

botonCambiarTelefono.addEventListener("click", () => {
  let telefono1 = document.getElementById("telefonoinput").value;
  if (telefonoElement) {
    telefonoElement.innerHTML = telefono1;
    document.getElementById("telefonoinput").value = "";
    localStorage.setItem("telefonor", telefono1);
    refrescarPagina();
  }
});



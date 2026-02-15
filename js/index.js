// ================= ICONOS (como primera versión) =================
const ubicacion = "\uD83D\uDCCD";
const autoIcon = "\uD83D\uDE97";
const atencion = "\u26A0";

// ================= LOCAL STORAGE KEYS =================
const LS_EXCEL = "excelr";
const LS_DIRECCION = "direccionr";
const LS_TELEFONO = "telefonor";
const LS_MENSAJE = "mensajer";
const LS_ENVIADOS = "enviadosr"; // ✅ enviados persistentes

// ================= HELPERS =================
function refrescarPagina() {
  location.reload();
}

// ---------- TOAST (si no existe en tu proyecto, no rompe) ----------
function mostrarToastConfig(texto, duration = 1200, url = "", gravity = "center") {
  if (typeof Toastify === "undefined") return;
  Toastify({
    text: texto,
    duration,
    gravity: "top",
    position: gravity === "center" ? "center" : "right",
    close: true,
    stopOnFocus: true,
    destination: url || undefined,
  }).showToast();
}

// ---------- ENVIADOS ----------
function getEnviados() {
  try {
    return JSON.parse(localStorage.getItem(LS_ENVIADOS) || "{}");
  } catch {
    return {};
  }
}
function setEnviados(obj) {
  localStorage.setItem(LS_ENVIADOS, JSON.stringify(obj));
}
function marcarEnviado(telefono) {
  const key = String(telefono || "").trim();
  if (!key) return;
  const enviados = getEnviados();
  enviados[key] = true;
  setEnviados(enviados);
}
function fueEnviado(telefono) {
  const key = String(telefono || "").trim();
  if (!key) return false;
  const enviados = getEnviados();
  return !!enviados[key];
}
function limpiarEnviados() {
  localStorage.removeItem(LS_ENVIADOS);
}

// ---------- NORMALIZAR PATENTE (no repetir) ----------
function normalizarPatente(p) {
  return String(p || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[-.]/g, "");
}

// ---------- NORMALIZAR TELEFONO (para filtrar) ----------
function telSoloNumeros(t) {
  return String(t || "").replace(/\D/g, "");
}

// ================= CARGA DE CLIENTES DESDE LOCAL STORAGE =================
let productos = [];
const productosAlmacenados = localStorage.getItem(LS_EXCEL);
if (productosAlmacenados) {
  try {
    productos = JSON.parse(productosAlmacenados) || [];
  } catch {
    productos = [];
  }
}

// ================= DIRECCION / TELEFONO BOXES EN UI =================
const direccionElement = document.getElementById("direccion");
const telefonoElement = document.getElementById("telefono");

const direccionGuardada = localStorage.getItem(LS_DIRECCION);
const telefonoGuardada = localStorage.getItem(LS_TELEFONO);

if (direccionElement && direccionGuardada) direccionElement.innerHTML = direccionGuardada;
if (telefonoElement && telefonoGuardada) telefonoElement.innerHTML = telefonoGuardada;

// ================= CAMBIAR DIRECCION =================
const botonCambiardireccion = document.getElementById("boton10");
if (botonCambiardireccion) {
  botonCambiardireccion.addEventListener("click", () => {
    const dir = (document.getElementById("direccioninput")?.value || "").trim();
    if (!dir) return;
    localStorage.setItem(LS_DIRECCION, dir);
    refrescarPagina();
  });
}

// ================= CAMBIAR TELEFONO (nombre boxes) =================
const botonCambiarTelefono = document.getElementById("boton11");
if (botonCambiarTelefono) {
  botonCambiarTelefono.addEventListener("click", () => {
    const tel = (document.getElementById("telefonoinput")?.value || "").trim();
    if (!tel) return;
    localStorage.setItem(LS_TELEFONO, tel);
    refrescarPagina();
  });
}

// ================= LIMPIAR DIRECCION Y TELEFONO =================
const boton9 = document.getElementById("boton9");
if (boton9) {
  boton9.addEventListener("click", () => {
    localStorage.removeItem(LS_DIRECCION);
    localStorage.removeItem(LS_TELEFONO);
    refrescarPagina();
  });
}

// ================= MENSAJE PROMO =================
const inputMensaje = document.getElementById("inputMensaje");
const btnAceptar = document.getElementById("btnAceptar");
const mensajeContainer = document.getElementById("mensajeContainer");

// mostrar mensaje guardado
const mensajeGuardadoInit = localStorage.getItem(LS_MENSAJE);
if (mensajeContainer && mensajeGuardadoInit) {
  mensajeContainer.innerText = mensajeGuardadoInit;
}

// guardar mensaje
if (btnAceptar) {
  btnAceptar.addEventListener("click", function () {
    const mensaje = (inputMensaje?.value || "").trim();
    if (mensajeContainer) mensajeContainer.innerText = mensaje;
    localStorage.setItem(LS_MENSAJE, mensaje);
    refrescarPagina();
  });
}

// ================= ELIMINAR BASE CLIENTES =================
const eliminarLocalStorageButton = document.getElementById("eliminarLocalStorageButton");
if (eliminarLocalStorageButton) {
  eliminarLocalStorageButton.addEventListener("click", function () {
    localStorage.removeItem(LS_EXCEL);
    limpiarEnviados(); // ✅
    productos = [];
    mostrarToastConfig("Base de clientes eliminada", 1200, "", "center");
    refrescarPagina();
  });
}

// ================= SUBIR EXCEL =================
const uploadButton = document.getElementById("uploadButton");
if (uploadButton) {
  uploadButton.addEventListener("click", () => {
    const file = document.getElementById("fileInput")?.files?.[0];
    if (!file) {
      mostrarToastConfig("No se seleccionó ningún archivo", 1400, "", "center");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const lista = [];
      const patentesVistas = new Set();
      let repetidas = 0;

      jsonData.forEach((row) => {
        if (!row || row.length === 0) return;

        const nombre = row[0] !== undefined ? String(row[0]) : "";
        const telefono = row[1] !== undefined ? String(row[1]) : "";
        const marca = row[2] !== undefined ? String(row[2]) : "";
        const modelo = row[3] !== undefined ? String(row[3]) : "";
        const patente = row[4] !== undefined ? String(row[4]) : "";

        const patKey = normalizarPatente(patente);

        // ✅ no repetir patentes (si viene vacía, deja pasar)
        if (patKey) {
          if (patentesVistas.has(patKey)) {
            repetidas++;
            return;
          }
          patentesVistas.add(patKey);
        }

        lista.push({ nombre, telefono, marca, modelo, patente });
      });

      // ✅ nueva base => reset enviados
      limpiarEnviados();

      localStorage.setItem(LS_EXCEL, JSON.stringify(lista));

      if (repetidas > 0) {
        mostrarToastConfig(`Se descartaron ${repetidas} patentes repetidas`, 1800, "", "center");
      } else {
        mostrarToastConfig("Base de clientes agregada correctamente", 1400, "", "center");
      }

      refrescarPagina();
    };

    reader.readAsArrayBuffer(file);
  });
}

// ================= MENSAJE (ESTRUCTURA ORIGINAL) =================
function crearMensaje(producto) {
  const mensajeAdicional = localStorage.getItem(LS_MENSAJE) || "";
  const direccion = localStorage.getItem(LS_DIRECCION) || "";
  const telefonoBoxes = localStorage.getItem(LS_TELEFONO) || "";

  const nombre = (producto.nombre || "").trim();
  const marca = (producto.marca || "").trim();
  const modelo = (producto.modelo || "").trim();
  const patente = (producto.patente || "").trim();

  // ✅ EXACTO como tu primera versión (autito + warning + ubicación)
  return `Hola _${nombre}_, se acerca el próximo servicio de tu vehículo:${autoIcon} _${marca}_ _${modelo}_ patente: *${patente}*. ${atencion} ${mensajeAdicional}; *${telefonoBoxes}*. ${ubicacion} ${direccion}. *Agendanos para enterarte de nuestras promociones y descuentos* `;
}

// ================= RENDER TARJETAS (SOLO CON TELEFONO) =================
const tarjetasContainer = document.getElementById("tarjetas-container");
if (tarjetasContainer) {
  tarjetasContainer.innerHTML = "";

  // ✅ SOLO LOS QUE TIENEN TELEFONO VALIDO
  const clientesConTelefono = productos.filter((p) => {
    const tel = telSoloNumeros(p.telefono);
    return tel.length >= 6;
  });

  if (productos.length > 0 && clientesConTelefono.length === 0) {
    mostrarToastConfig("No hay clientes con teléfono válido", 1500, "", "center");
  }

  clientesConTelefono.forEach((producto, index) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "card";

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

    tarjetasContainer.appendChild(tarjeta);

    const whatsappBtn = tarjeta.querySelector(".whatsapp-button");

    // ✅ estado inicial persistido
    if (fueEnviado(producto.telefono)) {
      whatsappBtn.classList.remove("btn-success");
      whatsappBtn.classList.add("btn-secondary");
      whatsappBtn.textContent = "Recordatorio enviado";
      whatsappBtn.disabled = true;
    }

    whatsappBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (whatsappBtn.disabled) return;

      const mensaje = crearMensaje(producto);

      const tel = telSoloNumeros(producto.telefono); // solo números para WA
      let enlaceWhatsApp;

      // ✅ como tu versión original (mejor para emojis/formato)
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        enlaceWhatsApp = `https://api.whatsapp.com/send?phone=549${tel}&text=${encodeURIComponent(mensaje)}`;
      } else {
        enlaceWhatsApp = `https://web.whatsapp.com/send?phone=549${tel}&text=${encodeURIComponent(mensaje)}`;
      }

      window.open(enlaceWhatsApp, "_blank");

      // ✅ persistir enviado
      marcarEnviado(producto.telefono);

      // UI
      whatsappBtn.classList.remove("btn-success");
      whatsappBtn.classList.add("btn-secondary");
      whatsappBtn.textContent = "Recordatorio enviado";
      whatsappBtn.disabled = true;
    });
  });
}

"use strict";

/* WebMaster Editor — lógica del editor de contenido.
   Renderiza formularios desde content.json, permite editar todo el
   contenido editable del sitio y guarda + reconstruye al pulsar Guardar. */

/* ---------- Estado ---------- */
let contenido = null;
let token = localStorage.getItem("wm-admin-token") || "";
let sucio = false;

const $ = (sel) => document.querySelector(sel);

/* ---------- Utilidades de ruta ---------- */
function getRuta(obj, ruta) {
  return ruta.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

function setRuta(obj, ruta, valor) {
  const claves = ruta.split(".");
  let actual = obj;
  for (let i = 0; i < claves.length - 1; i++) {
    if (actual[claves[i]] == null) actual[claves[i]] = {};
    actual = actual[claves[i]];
  }
  actual[claves[claves.length - 1]] = valor;
}

function esc(texto) {
  const div = document.createElement("div");
  div.textContent = String(texto ?? "");
  return div.innerHTML;
}

/* ---------- Esquema de secciones y campos ---------- */
const ESQUEMA = [
  {
    id: "meta",
    titulo: "Meta y SEO",
    ayuda: "Título y descripción que ven los buscadores y la pestaña del navegador.",
    campos: [
      { ruta: "meta.title", etiqueta: "Título de la página", tipo: "text" },
      { ruta: "meta.description", etiqueta: "Descripción (SEO)", tipo: "textarea" },
    ],
  },
  {
    id: "hero",
    titulo: "Hero (primer pantallla)",
    ayuda: "Todo lo que se ve al abrir la página: marca, frase, titular, botón, cifra y foto.",
    campos: [
      { ruta: "hero.marcaInicio", etiqueta: "Marca — primera parte (en negro)", tipo: "text" },
      { ruta: "hero.marcaFin", etiqueta: "Marca — segunda parte (en azul)", tipo: "text" },
      { ruta: "hero.parrafo", etiqueta: "Frase de presentación", tipo: "textarea" },
      { ruta: "hero.titular", etiqueta: "Titular (líneas)", tipo: "listaSimple", ph: "Línea del titular" },
      { ruta: "hero.accion", etiqueta: "Texto del botón", tipo: "text" },
      { ruta: "hero.cifra.numero", etiqueta: "Cifra destacada", tipo: "text" },
      { ruta: "hero.cifra.texto", etiqueta: "Texto de la cifra", tipo: "textarea" },
      { ruta: "hero.foto.src", etiqueta: "Foto del hero — ruta", tipo: "imagen" },
      { ruta: "hero.foto.alt", etiqueta: "Foto del hero — texto alternativo", tipo: "text" },
      { ruta: "hero.foto.w", etiqueta: "Ancho (px)", tipo: "number" },
      { ruta: "hero.foto.h", etiqueta: "Alto (px)", tipo: "number" },
    ],
  },
  {
    id: "nav",
    titulo: "Navegación",
    ayuda: "Enlaces de la barra de navegación (ancla y etiqueta).",
    campos: [
      {
        ruta: "nav", etiqueta: "Enlaces", tipo: "lista",
        plantilla: { href: "#seccion", label: "Sección" },
        subcampos: [
          { ruta: "href", etiqueta: "Ancla (ej. #servicios)", tipo: "text" },
          { ruta: "label", etiqueta: "Etiqueta visible", tipo: "text" },
        ],
      },
    ],
  },
  {
    id: "servicios",
    titulo: "Servicios (tabla comparativa)",
    ayuda: "Columnas y filas de la tabla. Cada fila: [nombre, WebMaster, agencia, cloud].",
    campos: [
      { ruta: "servicios.titulo", etiqueta: "Título de la sección", tipo: "text" },
      { ruta: "servicios.columnas.0", etiqueta: "Columna 1 (destacada)", tipo: "text" },
      { ruta: "servicios.columnas.1", etiqueta: "Columna 2", tipo: "text" },
      { ruta: "servicios.columnas.2", etiqueta: "Columna 3", tipo: "text" },
      {
        ruta: "servicios.filas", etiqueta: "Filas", tipo: "filas",
        plantilla: ["", "", "", ""],
        etiquetas: ["Concepto", "Columna 1", "Columna 2", "Columna 3"],
      },
    ],
  },
  {
    id: "metodo",
    titulo: "Método",
    ayuda: "Sección «Del hilo a la obra»: introducción y pasos.",
    campos: [
      { ruta: "metodo.titulo", etiqueta: "Título", tipo: "text" },
      { ruta: "metodo.intro", etiqueta: "Introducción", tipo: "textarea" },
      {
        ruta: "metodo.pasos", etiqueta: "Pasos", tipo: "lista",
        plantilla: { titulo: "", texto: "" },
        subcampos: [
          { ruta: "titulo", etiqueta: "Título del paso", tipo: "text" },
          { ruta: "texto", etiqueta: "Texto del paso", tipo: "textarea" },
        ],
      },
    ],
  },
  {
    id: "galeria",
    titulo: "Galería (book de trabajos)",
    ayuda: "La hoja de obras: declaración, tarjeta interactiva y cada obra con su imagen y pie.",
    campos: [
      { ruta: "galeria.declaracion", etiqueta: "Declaración de la galería", tipo: "textarea" },
      { ruta: "galeria.punchcard.titulo", etiqueta: "Tarjeta — título", tipo: "text" },
      { ruta: "galeria.punchcard.ayuda", etiqueta: "Tarjeta — ayuda", tipo: "textarea" },
      { ruta: "galeria.punchcard.botonLimpiar", etiqueta: "Tarjeta — botón limpiar", tipo: "text" },
      { ruta: "galeria.punchcard.pie", etiqueta: "Tarjeta — pie (ej. «hilos en la trama.»)", tipo: "text" },
      {
        ruta: "galeria.hoja", etiqueta: "Obras", tipo: "lista",
        plantilla: { src: "/obras/nueva.jpg", w: 1600, h: 1200, ratio: "4/3", cap: "Nueva obra" },
        subcampos: [
          { ruta: "src", etiqueta: "Imagen — ruta (ej. /obras/tapiz.jpg)", tipo: "imagen" },
          { ruta: "cap", etiqueta: "Pie / título de la obra", tipo: "text" },
          { ruta: "w", etiqueta: "Ancho (px)", tipo: "number" },
          { ruta: "h", etiqueta: "Alto (px)", tipo: "number" },
          { ruta: "ratio", etiqueta: "Relación de aspecto (ej. 1/1, 3/4, 16/9)", tipo: "text" },
        ],
      },
    ],
  },
  {
    id: "contacto",
    titulo: "Contacto",
    ayuda: "Frase, retrato, correo, teléfono y nota de la sección de contacto.",
    campos: [
      { ruta: "contacto.frase", etiqueta: "Frase de contacto", tipo: "textarea" },
      { ruta: "contacto.foto.src", etiqueta: "Retrato — ruta", tipo: "imagen" },
      { ruta: "contacto.foto.alt", etiqueta: "Retrato — texto alternativo", tipo: "text" },
      { ruta: "contacto.foto.w", etiqueta: "Ancho (px)", tipo: "number" },
      { ruta: "contacto.foto.h", etiqueta: "Alto (px)", tipo: "number" },
      { ruta: "contacto.pregunta", etiqueta: "Pregunta (ej. ¿Hablamos?)", tipo: "text" },
      { ruta: "contacto.correo", etiqueta: "Correo electrónico", tipo: "text" },
      { ruta: "contacto.telefono", etiqueta: "Teléfono", tipo: "text" },
      { ruta: "contacto.nota", etiqueta: "Nota (dirección, horario)", tipo: "text" },
    ],
  },
  {
    id: "footer",
    titulo: "Pie de página",
    ayuda: "Columnas del footer: marca, descripción, dirección, enlaces, servicios, legal y créditos.",
    campos: [
      { ruta: "footer.marca", etiqueta: "Marca", tipo: "text" },
      { ruta: "footer.descripcion", etiqueta: "Descripción", tipo: "text" },
      { ruta: "footer.direccion", etiqueta: "Dirección", tipo: "text" },
      {
        ruta: "footer.nav", etiqueta: "Enlaces", tipo: "lista",
        plantilla: { href: "#seccion", label: "Sección" },
        subcampos: [
          { ruta: "href", etiqueta: "Ancla", tipo: "text" },
          { ruta: "label", etiqueta: "Etiqueta", tipo: "text" },
        ],
      },
      {
        ruta: "footer.servicios", etiqueta: "Lista de servicios", tipo: "listaSimple",
        ph: "Servicio",
      },
      { ruta: "footer.legal", etiqueta: "Texto legal", tipo: "text" },
      { ruta: "footer.creditos.texto", etiqueta: "Créditos — texto", tipo: "text" },
      { ruta: "footer.creditos.url", etiqueta: "Créditos — URL", tipo: "text" },
    ],
  },
  {
    id: "video",
    titulo: "Vídeo",
    ayuda: "Vídeo en bucle del hero (opcional). Si «ruta» está vacía se muestra la foto. Coloca el archivo en public/ y pon la ruta (ej. /videos/telar.mp4).",
    campos: [
      { ruta: "video.src", etiqueta: "Vídeo — ruta", tipo: "video" },
      { ruta: "video.poster", etiqueta: "Vídeo — imagen de portada (ruta)", tipo: "imagen" },
      { ruta: "video.alt", etiqueta: "Vídeo — descripción", tipo: "text" },
    ],
  },
];

/* ---------- Render de campos ---------- */

function campoInput(campo, valor, rutaCompleta) {
  const num = campo.tipo === "number";
  return `
    <div class="campo${num ? " campo--num" : ""}">
      <label>${esc(campo.etiqueta)}</label>
      ${campo.tipo === "textarea"
        ? `<textarea data-ruta="${esc(rutaCompleta)}">${esc(valor)}</textarea>`
        : `<input type="${num ? "number" : "text"}" data-ruta="${esc(rutaCompleta)}" value="${esc(valor)}">`
      }
    </div>
  `;
}

function campoImagen(campo, valor, rutaCompleta) {
  const prev = valor
    ? `<img class="prev-img" src="/static${esc(valor)}" alt="" onerror="this.style.display='none'" onload="this.style.display=''">`
    : "";
  return `
    <div class="campo">
      <label>${esc(campo.etiqueta)}</label>
      <input type="text" data-ruta="${esc(rutaCompleta)}" value="${esc(valor)}" placeholder="/obras/imagen.jpg">
      ${prev}
    </div>
  `;
}

function campoVideo(campo, valor, rutaCompleta) {
  const prev = valor
    ? `<video class="prev-video" src="/static${esc(valor)}" muted loop autoplay playsinline></video>`
    : "";
  return `
    <div class="campo">
      <label>${esc(campo.etiqueta)}</label>
      <input type="text" data-ruta="${esc(rutaCompleta)}" value="${esc(valor)}" placeholder="/videos/telar.mp4">
      ${prev}
    </div>
  `;
}

function campoLista(campo, rutaBase) {
  const lista = getRuta(contenido, rutaBase) || [];
  const items = lista
    .map((item, i) => {
      const subcampos = campo.subcampos
        .map((sc) => campoInput(sc, item[sc.ruta], `${rutaBase}.${i}.${sc.ruta}`))
        .join("");
      return `
        <div class="grupo" data-indice="${i}">
          <div class="grupo__cabecera">
            <h3>#${i + 1}</h3>
            <button type="button" class="btn btn--peligro btn--mini" data-accion="quitar" data-ruta-base="${esc(rutaBase)}" data-indice="${i}">Quitar</button>
          </div>
          ${subcampos}
        </div>
      `;
    })
    .join("");
  return `
    <div class="campo">
      <label>${esc(campo.etiqueta)}</label>
      ${items}
      <div class="acciones-grupo">
        <button type="button" class="btn btn--secundario btn--mini" data-accion="anadir" data-ruta-base="${esc(rutaBase)}">Añadir</button>
      </div>
    </div>
  `;
}

function campoListaSimple(campo, rutaBase) {
  const lista = getRuta(contenido, rutaBase) || [];
  const items = lista
    .map((val, i) => `
      <div class="grupo__fila" style="grid-template-columns: 1fr auto; align-items: center;">
        <input type="text" data-ruta="${esc(rutaBase)}.${i}" value="${esc(val)}" placeholder="${esc(campo.ph || "")}">
        <button type="button" class="btn btn--peligro btn--mini" data-accion="quitar" data-ruta-base="${esc(rutaBase)}" data-indice="${i}">Quitar</button>
      </div>
    `)
    .join("");
  return `
    <div class="campo">
      <label>${esc(campo.etiqueta)}</label>
      ${items}
      <div class="acciones-grupo">
        <button type="button" class="btn btn--secundario btn--mini" data-accion="anadir" data-ruta-base="${esc(rutaBase)}">Añadir</button>
      </div>
    </div>
  `;
}

function campoFilas(campo, rutaBase) {
  const lista = getRuta(contenido, rutaBase) || [];
  const items = lista
    .map((fila, i) => {
      const celdas = fila
        .map((val, j) => `
          <input type="text" data-ruta="${esc(rutaBase)}.${i}.${j}" value="${esc(val)}" placeholder="${esc(campo.etiquetas[j] || "")}">
        `)
        .join("");
      return `
        <div class="grupo" data-indice="${i}">
          <div class="grupo__cabecera">
            <h3>Fila ${i + 1}</h3>
            <button type="button" class="btn btn--peligro btn--mini" data-accion="quitar" data-ruta-base="${esc(rutaBase)}" data-indice="${i}">Quitar</button>
          </div>
          <div class="grupo__fila grupo__fila--multi">${celdas}</div>
        </div>
      `;
    })
    .join("");
  return `
    <div class="campo">
      <label>${esc(campo.etiqueta)}</label>
      ${items}
      <div class="acciones-grupo">
        <button type="button" class="btn btn--secundario btn--mini" data-accion="anadir" data-ruta-base="${esc(rutaBase)}">Añadir fila</button>
      </div>
    </div>
  `;
}

function renderizarCampo(campo, rutaBase) {
  const rutaCompleta = campo.ruta;
  const valor = getRuta(contenido, rutaCompleta);
  switch (campo.tipo) {
    case "textarea":
    case "text":
    case "number":
      return campoInput(campo, valor, rutaCompleta);
    case "imagen":
      return campoImagen(campo, valor, rutaCompleta);
    case "video":
      return campoVideo(campo, valor, rutaCompleta);
    case "lista":
      return campoLista(campo, rutaCompleta);
    case "listaSimple":
      return campoListaSimple(campo, rutaCompleta);
    case "filas":
      return campoFilas(campo, rutaCompleta);
    default:
      return campoInput(campo, valor, rutaCompleta);
  }
}

/* ---------- Render de secciones ---------- */
function renderizarTodo() {
  const nav = $("#editor-nav");
  const forms = $("#editor-forms");
  nav.innerHTML = ESQUEMA.map((s, i) => `<a href="#sec-${s.id}" class="${i === 0 ? "activo" : ""}">${esc(s.titulo)}</a>`).join("");
  forms.innerHTML = ESQUEMA.map((s) => `
    <section class="seccion-edit" id="sec-${s.id}">
      <h2 class="seccion-edit__titulo">${esc(s.titulo)}</h2>
      ${s.ayuda ? `<p class="seccion-edit__ayuda">${esc(s.ayuda)}</p>` : ""}
      ${s.campos.map((c) => renderizarCampo(c, s.id)).join("")}
    </section>
  `).join("");
}

/* ---------- Acciones de lista ---------- */
function manejarClickLista(e) {
  const btn = e.target.closest('button[data-accion]');
  if (!btn) return;
  const accion = btn.dataset.accion;
  const rutaBase = btn.dataset.rutaBase;
  const indice = parseInt(btn.dataset.indice, 10);
  const campo = encontrarCampoPorRuta(rutaBase);
  if (!campo) return;

  const lista = getRuta(contenido, rutaBase) || [];

  if (accion === "anadir") {
    lista.push(campo.tipo === "filas" ? [...campo.plantilla] :
               campo.tipo === "listaSimple" ? "" :
               JSON.parse(JSON.stringify(campo.plantilla)));
    setRuta(contenido, rutaBase, lista);
    sucio = true;
    renderizarTodo();
  } else if (accion === "quitar") {
    lista.splice(indice, 1);
    setRuta(contenido, rutaBase, lista);
    sucio = true;
    renderizarTodo();
  }
}

function encontrarCampoPorRuta(ruta) {
  for (const s of ESQUEMA) {
    for (const c of s.campos) {
      if (c.ruta === ruta) return c;
    }
  }
  return null;
}

/* ---------- Recolectar del formulario ---------- */
function recolectar() {
  document.querySelectorAll("#editor-forms [data-ruta]").forEach((el) => {
    const ruta = el.dataset.ruta;
    const esNum = el.type === "number";
    const valor = esNum ? (el.value === "" ? 0 : parseInt(el.value, 10)) : el.value;
    setRuta(contenido, ruta, valor);
  });
}

/* ---------- Guardar ---------- */
async function guardar() {
  recolectar();
  const estado = $("#estado");
  const btn = $("#btn-guardar");
  btn.disabled = true;
  estado.textContent = "Guardando y reconstruyendo…";
  estado.className = "estado";
  try {
    const res = await fetch("/api/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(contenido),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al guardar");
    estado.textContent = "✓ Guardado. Sitio reconstruido.";
    estado.className = "estado estado--ok";
    sucio = false;
  } catch (err) {
    estado.textContent = `✗ ${err.message}`;
    estado.className = "estado estado--error";
  } finally {
    btn.disabled = false;
    setTimeout(() => { if (estado.className.includes("--ok")) estado.textContent = ""; }, 5000);
  }
}

/* ---------- Login ---------- */
async function intentarLogin(t) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: t }),
  });
  return res.ok;
}

async function cargarContenido() {
  const res = await fetch("/api/content", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("No autorizado");
  contenido = await res.json();
}

/* ---------- Inicio ---------- */
async function iniciar() {
  // Login ya válido por token guardado
  if (token) {
    try {
      await cargarContenido();
      mostrarEditor();
      return;
    } catch { /* token inválido */ }
  }
  $("#login").hidden = false;
}

function mostrarEditor() {
  $("#login").hidden = true;
  $("#editor").hidden = false;
  renderizarTodo();
}

$("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const t = $("#login-token").value.trim();
  const error = $("#login-error");
  error.hidden = true;
  const ok = await intentarLogin(t);
  if (!ok) {
    error.hidden = false;
    return;
  }
  token = t;
  localStorage.setItem("wm-admin-token", token);
  await cargarContenido();
  mostrarEditor();
});

$("#btn-guardar").addEventListener("click", guardar);

document.addEventListener("click", manejarClickLista);

// Marcar sucio al editar
document.addEventListener("input", () => { sucio = true; });

window.addEventListener("beforeunload", (e) => {
  if (sucio) e.preventDefault();
});

// Resaltar sección activa en la navegación
const observer = new IntersectionObserver((entradas) => {
  for (const entrada of entradas) {
    if (entrada.isIntersecting) {
      document.querySelectorAll(".editor__nav a").forEach((a) => {
        a.classList.toggle("activo", a.getAttribute("href") === `#${entrada.target.id}`);
      });
    }
  }
}, { rootMargin: "-20% 0px -60% 0px" });

iniciar().catch(() => {
  $("#login").hidden = false;
});

// Observar secciones cuando se rendericen
const obsOriginal = observer;
new MutationObserver(() => {
  document.querySelectorAll(".seccion-edit").forEach((s) => obsOriginal.observe(s));
}).observe($("#editor-forms"), { childList: true });

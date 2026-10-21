import type { CSSProperties } from "react";
import PunchCard from "@/components/PunchCard";
import RevealObserver from "@/components/RevealObserver";
import TelarDiagrama from "@/components/TelarDiagrama";

const CORREO = "hola@webmaster.dev";
const TELEFONO = "+34 600 123 456";

/* Comparativa de servicios: capacidad y tres maneras de resolverla. */
const COMPARATIVA = [
  ["Diseño original, sin plantillas", "Sí, pieza única", "Según presupuesto", "Plantilla y suerte"],
  ["Infraestructura Alibaba Cloud", "Incluida y gestionada", "Se factura aparte", "Tuya, con sus sustos"],
  ["SEO y rendimiento de arranque", "Incluidos", "Extra de última hora", "Manual de por medio"],
  ["Copias de seguridad", "Diarias, automáticas", "Si las pides", "Cuando te acuerdas"],
  ["Monitorización continua", "Alerta en un minuto", "Tickets y esperas", "La de tu proveedor"],
  ["Código fuente", "Tuyo, con historial git", "Licencia de uso", "Obvio, es tuyo"],
  ["Plazo de entrega", "De tres a seis semanas", "De tres a nueve meses", "Cuando puedas"],
  ["Precio", "Cerrado antes de empezar", "Y ya veremos", "El de las sorpresas"],
];

/* Hoja de galería: imágenes reales del Met (dominio público), dos cosechas. */
const HOJA = [
  { src: "/obras/news-of-the-stag-from-the-series.jpg", w: 4000, h: 2929, ratio: "16/9", cap: "La cacería del ciervo, tapiz" },
  { src: "/obras/coverlet.jpg", w: 3740, h: 3920, ratio: "1/1", cap: "Cubrecama Jacquard, 1850" },
  { src: "/obras/joseph-marie-jacquard.jpg", w: 2560, h: 3008, ratio: "3/4", cap: "Joseph Marie Jacquard, tejido" },
  { src: "/obras/loom-width-with-serrated-leaf-design.jpg", w: 1667, h: 3918, ratio: "2/5", cap: "Ancho de telar, seda lampas" },
  { src: "/obras/woven-coverlet-fragment.jpg", w: 2505, h: 2233, ratio: "1/1", cap: "Fragmento de cubrecama, 1841" },
  { src: "/obras/coverlet-2.jpg", w: 1617, h: 2017, ratio: "4/5", cap: "Cubrecama, Peter Leisey" },
  { src: "/obras/girl-playing-a-recorder.jpg", w: 1440, h: 1432, ratio: "1/1", cap: "Música con flauta, tapiz" },
  { src: "/obras/hannah-and-the-infant-samuel.jpg", w: 2241, h: 2809, ratio: "3/4", cap: "Ana y Samuel, tapiz" },
  { src: "/obras/anthony-van-dyck-self-portrait.jpg", w: 2361, h: 2665, ratio: "1/1", cap: "Autorretrato de Van Dyck, tapiz" },
  { src: "/obras/part-of-a-loom.jpg", w: 4000, h: 2250, ratio: "16/9", cap: "Pieza de telar, Egipto" },
  { src: "/obras/coverlet.jpg", w: 3740, h: 3920, ratio: "4/3", cap: "Detalle del cubrecama Jacquard" },
  { src: "/obras/news-of-the-stag-from-the-series.jpg", w: 4000, h: 2929, ratio: "1/1", cap: "Detalle del tapiz de caza" },
  { src: "/obras/loom-width-with-serrated-leaf-design.jpg", w: 1667, h: 3918, ratio: "1/1", cap: "Detalle de la seda lampas" },
  { src: "/obras/joseph-marie-jacquard.jpg", w: 2560, h: 3008, ratio: "1/1", cap: "Detalle del retrato tejido" },
  { src: "/obras/hannah-and-the-infant-samuel.jpg", w: 2241, h: 2809, ratio: "4/5", cap: "Detalle de lana y metal" },
  { src: "/obras/coverlet-2.jpg", w: 1617, h: 2017, ratio: "1/1", cap: "Trama Biederwand, detalle" },
  { src: "/obras/girl-playing-a-recorder.jpg", w: 1440, h: 1432, ratio: "3/4", cap: "Detalle del tapiz musical" },
  { src: "/obras/woven-coverlet-fragment.jpg", w: 2505, h: 2233, ratio: "16/9", cap: "Doble tejido, detalle" },
  { src: "/obras/part-of-a-loom.jpg", w: 4000, h: 2250, ratio: "4/3", cap: "Madera del telar, detalle" },
  { src: "/obras/anthony-van-dyck-self-portrait.jpg", w: 2361, h: 2665, ratio: "4/5", cap: "Hilo de metal, detalle" },
];

export default function Home() {
  return (
    <>
      <main>
        {/* ---------- Hero: narrow talk, wide headline ---------- */}
        <header className="hero">
          <div className="hero__izq">
            <p className="hero__marca">
              Web<span>Master</span>
            </p>
            <p className="hero__parrafo">
              Servicios IT sobre Alibaba Cloud con oficio artesanal: nube, diseño y código.
            </p>
            <a className="boton hero__accion" href={`mailto:${CORREO}?subject=Presupuesto%20WebMaster`}>
              Pedir presupuesto
            </a>
          </div>

          <div className="hero__der">
            <nav className="hero__nav" aria-label="Secciones">
              <a href="#servicios">Servicios</a>
              <a href="#metodo">Método</a>
              <a href="#galeria">Galería</a>
              <a href="#contacto">Contacto</a>
            </nav>

            <h1 className="hero__titular">
              <span className="linea">Tejemos</span>
              <span className="linea">software</span>
            </h1>
          </div>

          <div className="hero__foto">
            <div className="hero__cifra">
              <strong>1804</strong>
              <span>Jacquard programaba el telar con tarjetas perforadas. Nosotros, con código.</span>
            </div>
            <img
              src="/obras/part-of-a-loom.jpg"
              alt="Pieza de madera de un telar egipcio, del Metropolitan Museum of Art"
              width={4000}
              height={2250}
            />
          </div>
        </header>

        {/* ---------- Servicios: comparison set as text ---------- */}
        <section className="seccion" id="servicios" aria-labelledby="titulo-servicios">
          <h2 className="seccion__titulo" id="titulo-servicios" data-reveal>
            Servicios
          </h2>
          <div className="cmp">
            <div className="cmp__cab">
              <span className="cmp__celda" />
              <span className="cmp__celda destacada">WebMaster</span>
              <span className="cmp__celda">Agencia al uso</span>
              <span className="cmp__celda">Cloud por tu cuenta</span>
            </div>
            {COMPARATIVA.map(([nombre, webmaster, agencia, solo], i) => (
              <div className="cmp__fila" key={nombre}>
                <span className="cmp__celda cmp__nombre" data-reveal style={{ "--d": `${i * 40}ms` } as CSSProperties}>{nombre}</span>
                <span className="cmp__celda destacada" data-reveal style={{ "--d": `${i * 40}ms` } as CSSProperties}>
                  <span className="cmp__etiq">WebMaster</span>
                  {webmaster}
                </span>
                <span className="cmp__celda" data-reveal style={{ "--d": `${i * 40}ms` } as CSSProperties}>
                  <span className="cmp__etiq">Agencia al uso</span>
                  {agencia}
                </span>
                <span className="cmp__celda" data-reveal style={{ "--d": `${i * 40}ms` } as CSSProperties}>
                  <span className="cmp__etiq">Cloud por tu cuenta</span>
                  {solo}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Método: many into one ---------- */}
        <section className="seccion" id="metodo" aria-labelledby="titulo-metodo" data-reveal>
          <div className="metodo__intro">
            <h2 className="seccion__titulo" id="titulo-metodo">
              Del hilo a la obra
            </h2>
            <p>
              Reunimos el brief, lo tejemos sobre Alibaba Cloud y lo publicamos con oficio:
              cada obra sale lista para vivir, no para parchear.
            </p>
          </div>

          <div data-reveal style={{ "--d": "60ms" } as CSSProperties}>
            <TelarDiagrama />
          </div>

          <div className="metodo__pasos">
            <div data-reveal style={{ "--d": "0ms" } as CSSProperties}>
              <h3>Reunir</h3>
              <p>Brief, referencias y datos del negocio: los hilos sueltos que traes a la mesa.</p>
            </div>
            <div data-reveal style={{ "--d": "90ms" } as CSSProperties}>
              <h3>Tejer</h3>
              <p>
                Arquitectura, diseño y código en el telar: la urdimbre en Alibaba Cloud,
                la trama en cada línea.
              </p>
            </div>
            <div data-reveal style={{ "--d": "180ms" } as CSSProperties}>
              <h3>Publicar</h3>
              <p>Despliegue, CDN, monitorización y cuidado: la obra colgada y viva.</p>
            </div>
          </div>
        </section>

        {/* ---------- Galería: dense masonry sheet + tarjeta viva ---------- */}
        <section className="seccion" id="galeria" aria-labelledby="titulo-galeria">
          <div className="galeria__encabezado">
            <PunchCard />
            <p className="galeria__declaracion" id="titulo-galeria" data-reveal>
              La trama visible: tejidos y telares reales que inspiran el oficio,
              del telar de madera a la nube.
            </p>
          </div>

          <div className="hoja">
            <figure className="esta" data-reveal>
              <img
                src={HOJA[0].src}
                alt={HOJA[0].cap}
                width={HOJA[0].w}
                height={HOJA[0].h}
              />
              <figcaption>{HOJA[0].cap}</figcaption>
            </figure>
            {HOJA.slice(1).map((obra) => (
              <figure key={`${obra.src}-${obra.ratio}-${obra.cap}`}>
                <img
                  src={obra.src}
                  alt={obra.cap}
                  width={obra.w}
                  height={obra.h}
                  loading="lazy"
                  style={{ aspectRatio: obra.ratio, objectFit: "cover" }}
                />
                <figcaption>{obra.cap}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ---------- Contacto: sentence, portrait, two links ---------- */}
        <section className="contacto" id="contacto" aria-label="Contacto">
          <p className="contacto__frase" data-reveal>
            ¿Un proyecto que tejer? Trazamos su patrón en cuarenta y ocho horas.
          </p>
          <img
            className="contacto__foto"
            src="/obras/joseph-marie-jacquard.jpg"
            alt="Retrato tejido de Joseph Marie Jacquard, 1839"
            width={2560}
            height={3008}
            loading="lazy"
            style={{ objectFit: "cover" }}
          />
          <div className="contacto__enlaces" data-reveal style={{ "--d": "90ms" } as CSSProperties}>
            <p className="pregunta">¿Hablamos?</p>
            <ul>
              <li>
                <a href={`mailto:${CORREO}`}>{CORREO}</a>
              </li>
              <li>
                <a href={`tel:${TELEFONO.replace(/\s/g, "")}`}>{TELEFONO}</a>
              </li>
            </ul>
            <p className="contacto__nota">Valencia · respuesta en 24 h laborables</p>
          </div>
        </section>
      </main>

      {/* ---------- Pie: columns above, wordmark below ---------- */}
      <footer className="pie">
        <div className="pie__columnas" data-reveal>
          <div className="pie__col">
            <h3>WebMaster</h3>
            <p>Agencia de servicios IT evocada a las artes.</p>
            <p>Calle del Telar 1804, Valencia</p>
          </div>
          <div className="pie__col">
            <h3>Navegación</h3>
            <ul>
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#metodo">Método</a></li>
              <li><a href="#galeria">Galería</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
          </div>
          <div className="pie__col">
            <h3>Servicios</h3>
            <ul>
              <li>Diseño y desarrollo web</li>
              <li>Infraestructura Alibaba Cloud</li>
              <li>SEO y rendimiento</li>
              <li>Mantenimiento y monitorización</li>
            </ul>
          </div>
          <div className="pie__col">
            <h3>Contacto</h3>
            <ul>
              <li><a href={`mailto:${CORREO}`}>{CORREO}</a></li>
              <li><a href={`tel:${TELEFONO.replace(/\s/g, "")}`}>{TELEFONO}</a></li>
            </ul>
          </div>
        </div>

        <div className="pie__marca" aria-hidden="true">
          <svg viewBox="0 0 860 110" role="img">
            <text x="0" y="96" fontSize="112" letterSpacing="-3">WEBMASTER</text>
          </svg>
        </div>

        <p className="pie__legal">
          <span>© 2026 WebMaster. Todos los derechos reservados.</span>
          <a href="https://www.metmuseum.org/art/collection" target="_blank" rel="noreferrer">
            Obras de la galería: dominio público (CC0), The Metropolitan Museum of Art
          </a>
        </p>
      </footer>

      <RevealObserver />
    </>
  );
}

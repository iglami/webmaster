import type { CSSProperties } from "react";
import content from "@/content/content.json";
import PunchCard from "@/components/PunchCard";
import RevealObserver from "@/components/RevealObserver";
import TelarDiagrama from "@/components/TelarDiagrama";

export default function Home() {
  const { hero, nav, servicios, metodo, galeria, contacto, footer, video } = content;
  const mailto = `mailto:${contacto.correo}?subject=Presupuesto%20WebMaster`;
  const telHref = `tel:${contacto.telefono.replace(/\s/g, "")}`;

  return (
    <>
      <main>
        {/* ---------- Hero: narrow talk, wide headline ---------- */}
        <header className="hero">
          <div className="hero__izq">
            <p className="hero__marca">
              {hero.marcaInicio}<span>{hero.marcaFin}</span>
            </p>
            <p className="hero__parrafo">
              {hero.parrafo}
            </p>
          </div>

          <div className="hero__der">
            <nav className="hero__nav" aria-label="Secciones">
              {nav.map((item) => (
                <a key={item.href} href={item.href}>{item.label}</a>
              ))}
            </nav>

            <h1 className="hero__titular">
              {hero.titular.map((linea, i) => (
                <span key={i} className="linea">{linea}</span>
              ))}
            </h1>

            <a className="boton hero__accion" href={mailto}>
              {hero.accion}
            </a>
          </div>

          <div className="hero__foto">
            <div className="hero__cifra">
              <strong>{hero.cifra.numero}</strong>
              <span>{hero.cifra.texto}</span>
            </div>
            {video.src ? (
              <video
                className="hero__video"
                src={video.src}
                poster={video.poster || undefined}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={hero.foto.src}
                alt={hero.foto.alt}
                width={hero.foto.w}
                height={hero.foto.h}
              />
            )}
          </div>
        </header>

        {/* ---------- Servicios: comparison set as text ---------- */}
        <section className="seccion" id="servicios" aria-labelledby="titulo-servicios">
          <h2 className="seccion__titulo" id="titulo-servicios" data-reveal>
            {servicios.titulo}
          </h2>
          <div className="cmp">
            <div className="cmp__cab">
              <span className="cmp__celda" />
              <span className="cmp__celda destacada">{servicios.columnas[0]}</span>
              <span className="cmp__celda">{servicios.columnas[1]}</span>
              <span className="cmp__celda">{servicios.columnas[2]}</span>
            </div>
            {servicios.filas.map(([nombre, ...vals], i) => (
              <div className="cmp__fila" key={nombre}>
                <span className="cmp__celda cmp__nombre" data-reveal style={{ "--d": `${i * 40}ms` } as CSSProperties}>{nombre}</span>
                {vals.map((val, j) => (
                  <span
                    key={j}
                    className={`cmp__celda${j === 0 ? " destacada" : ""}`}
                    data-reveal
                    style={{ "--d": `${i * 40}ms` } as CSSProperties}
                  >
                    <span className="cmp__etiq">{servicios.columnas[j]}</span>
                    {val}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Método: many into one ---------- */}
        <section className="seccion" id="metodo" aria-labelledby="titulo-metodo" data-reveal>
          <div className="metodo__intro">
            <h2 className="seccion__titulo" id="titulo-metodo">
              {metodo.titulo}
            </h2>
            <p>{metodo.intro}</p>
          </div>

          <div data-reveal style={{ "--d": "60ms" } as CSSProperties}>
            <TelarDiagrama />
          </div>

          <div className="metodo__pasos">
            {metodo.pasos.map((paso, i) => (
              <div key={paso.titulo} data-reveal style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                <h3>{paso.titulo}</h3>
                <p>{paso.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Galería: dense masonry sheet + tarjeta viva ---------- */}
        <section className="seccion" id="galeria" aria-labelledby="titulo-galeria">
          <div className="galeria__encabezado">
            <PunchCard
              titulo={galeria.punchcard.titulo}
              ayuda={galeria.punchcard.ayuda}
              botonLimpiar={galeria.punchcard.botonLimpiar}
              pie={galeria.punchcard.pie}
            />
            <p className="galeria__declaracion" id="titulo-galeria" data-reveal>
              {galeria.declaracion}
            </p>
          </div>

          <div className="hoja">
            <figure className="esta" data-reveal>
              <img
                src={galeria.hoja[0].src}
                alt={galeria.hoja[0].cap}
                width={galeria.hoja[0].w}
                height={galeria.hoja[0].h}
              />
              <figcaption>{galeria.hoja[0].cap}</figcaption>
            </figure>
            {galeria.hoja.slice(1).map((obra) => (
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
            {contacto.frase}
          </p>
          <img
            className="contacto__foto"
            src={contacto.foto.src}
            alt={contacto.foto.alt}
            width={contacto.foto.w}
            height={contacto.foto.h}
            loading="lazy"
            style={{ objectFit: "cover" }}
          />
          <div className="contacto__enlaces" data-reveal style={{ "--d": "90ms" } as CSSProperties}>
            <p className="pregunta">{contacto.pregunta}</p>
            <ul>
              <li>
                <a href={`mailto:${contacto.correo}`}>{contacto.correo}</a>
              </li>
              <li>
                <a href={telHref}>{contacto.telefono}</a>
              </li>
            </ul>
            <p className="contacto__nota">{contacto.nota}</p>
          </div>
        </section>
      </main>

      {/* ---------- Pie: columns above, wordmark below ---------- */}
      <footer className="pie">
        <div className="pie__columnas" data-reveal>
          <div className="pie__col">
            <h3>{footer.marca}</h3>
            <p>{footer.descripcion}</p>
            <p>{footer.direccion}</p>
          </div>
          <div className="pie__col">
            <h3>Navegación</h3>
            <ul>
              {footer.nav.map((item) => (
                <li key={item.href}><a href={item.href}>{item.label}</a></li>
              ))}
            </ul>
          </div>
          <div className="pie__col">
            <h3>Servicios</h3>
            <ul>
              {footer.servicios.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="pie__col">
            <h3>Contacto</h3>
            <ul>
              <li><a href={`mailto:${contacto.correo}`}>{contacto.correo}</a></li>
              <li><a href={telHref}>{contacto.telefono}</a></li>
            </ul>
          </div>
        </div>

        <div className="pie__marca" aria-hidden="true">
          <svg viewBox="0 0 860 110" role="img">
            <text x="0" y="96" fontSize="112" letterSpacing="-3">{footer.marca.toUpperCase()}</text>
          </svg>
        </div>

        <p className="pie__legal">
          <span>{footer.legal}</span>
          <a href={footer.creditos.url} target="_blank" rel="noreferrer">
            {footer.creditos.texto}
          </a>
        </p>
      </footer>

      <RevealObserver />
    </>
  );
}

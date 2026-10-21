"use client";

import { useState } from "react";

const COLS = 10;
const ROWS = 6;

/* Patrón inicial: rayas diagonales que se leen como trama tejida. */
function patronInicial(): Set<number> {
  const set = new Set<number>();
  for (let fila = 0; fila < ROWS; fila++) {
    const inicio = (fila * 2) % COLS;
    set.add(fila * COLS + inicio);
    set.add(fila * COLS + ((inicio + 1) % COLS));
  }
  return set;
}

export default function PunchCard() {
  const [agujeros, setAgujeros] = useState<Set<number>>(patronInicial);

  function alternar(idx: number) {
    setAgujeros((prev) => {
      const siguiente = new Set(prev);
      if (siguiente.has(idx)) siguiente.delete(idx);
      else siguiente.add(idx);
      return siguiente;
    });
  }

  function limpiar() {
    setAgujeros(new Set());
  }

  return (
    <div className="telar">
      <p className="telar__titulo">Pica tu tarjeta Jacquard</p>
      <p className="telar__ayuda">
        Toca los agujeros de la tarjeta: cada agujero decide un hilo de la trama. Así
        programaba el telar de 1804.
      </p>

      <div className="telar__rejilla" role="group" aria-label="Tarjeta perforada, 10 columnas por 6 filas">
        {Array.from({ length: ROWS * COLS }, (_, idx) => (
          <button
            key={idx}
            type="button"
            className="telar__agujero"
            aria-pressed={agujeros.has(idx)}
            aria-label={`Fila ${Math.floor(idx / COLS) + 1}, columna ${(idx % COLS) + 1}`}
            onClick={() => alternar(idx)}
          />
        ))}
      </div>

      <div className="telar__trama" aria-hidden="true">
        {Array.from({ length: ROWS * COLS }, (_, idx) => (
          <span key={idx} className={`telar__hilo${agujeros.has(idx) ? " mudo" : ""}`} />
        ))}
      </div>

      <p className="telar__pie">
        {agujeros.size} hilos en la trama.{" "}
        <button type="button" onClick={limpiar} style={{ background: "none", border: 0, color: "var(--accent)", textDecoration: "underline", cursor: "pointer", font: "inherit" }}>
          Descardar la tarjeta
        </button>
      </p>
    </div>
  );
}

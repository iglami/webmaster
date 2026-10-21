/* Diagrama "Many into one": dispersión, cinta compacta y filas ordenadas.
   Posiciones deterministas, sin azar: la página es estática. */
const TONO_A = "#e2e2e2";
const TONO_B = "#cfcfcf";

function cuadradosIzquierda() {
  const cuadrados: { x: number; y: number; tono: string }[] = [];
  for (let i = 0; i < 44; i++) {
    cuadrados.push({
      x: 20 + ((i * 61) % 350),
      y: 20 + ((i * 97) % 200),
      tono: i % 2 === 0 ? TONO_A : TONO_B,
    });
  }
  return cuadrados;
}

function cintaCentral() {
  const cuadrados: { x: number; y: number }[] = [];
  const filasY = [112, 128, 144];
  filasY.forEach((y) => {
    for (let x = 420; x <= 784; x += 16) cuadrados.push({ x, y });
  });
  return cuadrados;
}

function filasDerecha() {
  const cuadrados: { x: number; y: number }[] = [];
  for (let fila = 0; fila < 3; fila++) {
    for (let col = 0; col < 12; col++) {
      cuadrados.push({ x: 830 + col * 30, y: 96 + fila * 30 });
    }
  }
  return cuadrados;
}

export default function TelarDiagrama() {
  return (
    <svg
      className="metodo__telar"
      viewBox="0 0 1200 260"
      role="img"
      aria-label="Diagrama del método: hilos dispersos se tejen en una cinta y salen como filas ordenadas"
    >
      {cuadradosIzquierda().map((c, i) => (
        <rect key={`a${i}`} x={c.x} y={c.y} width="12" height="12" fill={c.tono} />
      ))}
      {cintaCentral().map((c, i) => (
        <rect key={`c${i}`} x={c.x} y={c.y} width="12" height="12" fill="var(--ink)" />
      ))}
      {filasDerecha().map((c, i) => (
        <rect key={`d${i}`} x={c.x} y={c.y} width="12" height="12" fill="var(--accent)" />
      ))}
    </svg>
  );
}

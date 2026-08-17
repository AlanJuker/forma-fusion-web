/**
 * Logotipo "FF" modular.
 *
 * Construido solo con rectángulos sobre una retícula, sin una sola curva, en el
 * mismo lenguaje que el logotipo del sitio de referencia: trazo grueso,
 * contraformas cuadradas y ángulos exclusivamente de 90°.
 *
 * Retícula por letra: 7 × 10 unidades, trazo de 2.6. Las dos efes se separan
 * 1.3 unidades, así que el conjunto mide 15.3 × 10.
 */

const STROKE = 2.6;
const ARM_TOP = 7; // ancho del brazo superior = ancho total de la letra
const ARM_MID = 5.2; // el brazo central es más corto, como en una F clásica
const MID_Y = 3.9;
const LETTER_W = 7;
const GAP = 1.3;

function Ef({ x }: { x: number }) {
  return (
    <>
      {/* asta vertical */}
      <rect x={x} y={0} width={STROKE} height={10} />
      {/* brazo superior */}
      <rect x={x} y={0} width={ARM_TOP} height={STROKE} />
      {/* brazo central */}
      <rect x={x} y={MID_Y} width={ARM_MID} height={STROKE} />
    </>
  );
}

export function LogoFF({
  className,
  title = "Forma & Fusión",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${LETTER_W * 2 + GAP} 10`}
      fill="currentColor"
      role="img"
      aria-label={title}
      className={className}
      // Alto controlado por CSS; el ancho sigue la proporción del viewBox.
      style={{ display: "block", height: "1em", width: "auto" }}
      shapeRendering="crispEdges"
    >
      <Ef x={0} />
      <Ef x={LETTER_W + GAP} />
    </svg>
  );
}

/**
 * Marca cuadrada para las fichas de proyecto: un glifo geométrico en negativo
 * dentro de un cuadrado negro, como los diagramas que acompañan cada obra en el
 * sitio de referencia. `seed` elige una de las variantes de forma estable.
 */
const GLYPHS = [
  // escalonado
  <>
    <rect x="2" y="6" width="4" height="2" />
    <rect x="4" y="4" width="4" height="2" />
    <rect x="6" y="2" width="4" height="2" />
  </>,
  // patio: marco con hueco central
  <>
    <rect x="2" y="2" width="8" height="2" />
    <rect x="2" y="8" width="8" height="2" />
    <rect x="2" y="4" width="2" height="4" />
    <rect x="8" y="4" width="2" height="4" />
  </>,
  // dos crujías
  <>
    <rect x="2" y="2" width="3" height="8" />
    <rect x="7" y="5" width="3" height="5" />
  </>,
  // voladizo
  <>
    <rect x="2" y="2" width="2" height="8" />
    <rect x="2" y="4" width="8" height="2" />
  </>,
  // torre
  <>
    <rect x="5" y="2" width="2" height="8" />
    <rect x="2" y="8" width="8" height="2" />
  </>,
  // damero
  <>
    <rect x="2" y="2" width="3" height="3" />
    <rect x="7" y="2" width="3" height="3" />
    <rect x="2" y="7" width="3" height="3" />
    <rect x="7" y="7" width="3" height="3" />
  </>,
  // cubierta a dos aguas
  <>
    <rect x="2" y="6" width="8" height="2" />
    <rect x="4" y="4" width="4" height="2" />
    <rect x="2" y="8" width="2" height="2" />
    <rect x="8" y="8" width="2" height="2" />
  </>,
  // franjas horizontales
  <>
    <rect x="2" y="2" width="8" height="2" />
    <rect x="2" y="5" width="8" height="2" />
    <rect x="2" y="8" width="8" height="2" />
  </>,
  // núcleo central
  <>
    <rect x="4" y="4" width="4" height="4" />
    <rect x="2" y="2" width="2" height="2" />
    <rect x="8" y="8" width="2" height="2" />
  </>,
  // ele
  <>
    <rect x="2" y="2" width="2" height="8" />
    <rect x="4" y="8" width="6" height="2" />
  </>,
  // peine
  <>
    <rect x="2" y="2" width="8" height="2" />
    <rect x="2" y="4" width="2" height="6" />
    <rect x="5" y="4" width="2" height="4" />
    <rect x="8" y="4" width="2" height="6" />
  </>,
  // hueco descentrado
  <>
    <rect x="2" y="2" width="8" height="8" />
    <rect x="4" y="4" width="3" height="3" fill="var(--color-ink)" />
  </>,
];

export function ProjectMark({
  seed = 0,
  className,
}: {
  seed?: number;
  className?: string;
}) {
  const glyph = GLYPHS[Math.abs(seed) % GLYPHS.length];
  return (
    <svg
      viewBox="0 0 12 12"
      className={className}
      aria-hidden
      shapeRendering="crispEdges"
      style={{ display: "block" }}
    >
      <rect x="0" y="0" width="12" height="12" fill="currentColor" />
      <g fill="var(--color-paper)">{glyph}</g>
    </svg>
  );
}


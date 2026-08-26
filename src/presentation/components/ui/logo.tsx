/**
 * Logotipo "F&F" modular.
 *
 * Construido solo con rectángulos sobre una retícula, sin una sola curva, en el
 * mismo lenguaje que el logotipo del sitio de referencia: trazo grueso,
 * contraformas cuadradas y ángulos exclusivamente de 90°.
 *
 * Las efes se describen con rectángulos directos; el ampersand, con una matriz
 * de celdas, porque su forma no se deja resumir en tres barras. Las celdas
 * contiguas de una misma fila se fusionan en un solo rectángulo, así el SVG
 * queda con pocas formas y sin costuras visibles entre ellas.
 */

const STROKE = 2.6;
const ARM_TOP = 7; // el brazo superior abarca todo el ancho de la letra
const ARM_MID = 5.2; // el central es más corto, como en una F clásica
const MID_Y = 3.9;
const LETTER_W = 7;
const HEIGHT = 10;

/** Ampersand: 7 columnas × 9 filas. La celda suelta de la última fila es la
 *  cola, y es lo que impide que se lea como un ocho. */
const AMPERSAND = [
  "..####.",
  ".##..##",
  ".##..##",
  "..####.",
  ".####..",
  "##..##.",
  "##...##",
  "##...##",
  ".####.#",
];

// El ampersand ocupa el 80% del alto de las letras y se centra respecto a
// ellas, como corresponde tipográficamente a un signo entre mayúsculas.
const AMP_ROWS = AMPERSAND.length;
const AMP_COLS = AMPERSAND[0].length;
const AMP_UNIT = (HEIGHT * 0.8) / AMP_ROWS;
const AMP_W = AMP_COLS * AMP_UNIT;
const AMP_Y = (HEIGHT - AMP_ROWS * AMP_UNIT) / 2;
const GAP = 1.1;

const AMP_X = LETTER_W + GAP;
const SECOND_F_X = AMP_X + AMP_W + GAP;
const TOTAL_W = SECOND_F_X + LETTER_W;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Fusiona celdas contiguas de cada fila para emitir menos rectángulos. */
function matrixToRects(rows: string[], originX: number, originY: number, unit: number): Rect[] {
  const rects: Rect[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] === "#") {
        let width = 0;
        while (x + width < row.length && row[x + width] === "#") width += 1;
        rects.push({
          x: originX + x * unit,
          y: originY + y * unit,
          w: width * unit,
          h: unit,
        });
        x += width;
      } else {
        x += 1;
      }
    }
  });
  return rects;
}

function efRects(x: number): Rect[] {
  return [
    { x, y: 0, w: STROKE, h: HEIGHT }, // asta vertical
    { x, y: 0, w: ARM_TOP, h: STROKE }, // brazo superior
    { x, y: MID_Y, w: ARM_MID, h: STROKE }, // brazo central
  ];
}

const LOGO_RECTS: Rect[] = [
  ...efRects(0),
  ...matrixToRects(AMPERSAND, AMP_X, AMP_Y, AMP_UNIT),
  ...efRects(SECOND_F_X),
];

export function LogoFF({
  className,
  title = "Forma & Fusión",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${TOTAL_W} ${HEIGHT}`}
      fill="currentColor"
      role="img"
      aria-label={title}
      className={className}
      // Alto controlado por CSS; el ancho sigue la proporción del viewBox.
      style={{ display: "block", height: "1em", width: "auto" }}
      shapeRendering="crispEdges"
    >
      {LOGO_RECTS.map((r) => (
        <rect key={`${r.x}-${r.y}-${r.w}`} x={r.x} y={r.y} width={r.w} height={r.h} />
      ))}
    </svg>
  );
}

/**
 * Marca cuadrada para las fichas de proyecto: un glifo geométrico en negativo
 * dentro de un cuadrado negro, como los diagramas que acompañan cada obra en el
 * sitio de referencia. `seed` elige una de las variantes de forma estable.
 */
const GLYPHS = [
  <>
    <rect x="2" y="6" width="4" height="2" />
    <rect x="4" y="4" width="4" height="2" />
    <rect x="6" y="2" width="4" height="2" />
  </>,
  <>
    <rect x="2" y="2" width="8" height="2" />
    <rect x="2" y="8" width="8" height="2" />
    <rect x="2" y="4" width="2" height="4" />
    <rect x="8" y="4" width="2" height="4" />
  </>,
  <>
    <rect x="2" y="2" width="3" height="8" />
    <rect x="7" y="5" width="3" height="5" />
  </>,
  <>
    <rect x="2" y="2" width="2" height="8" />
    <rect x="2" y="4" width="8" height="2" />
  </>,
  <>
    <rect x="5" y="2" width="2" height="8" />
    <rect x="2" y="8" width="8" height="2" />
  </>,
  <>
    <rect x="2" y="2" width="3" height="3" />
    <rect x="7" y="2" width="3" height="3" />
    <rect x="2" y="7" width="3" height="3" />
    <rect x="7" y="7" width="3" height="3" />
  </>,
  <>
    <rect x="2" y="6" width="8" height="2" />
    <rect x="4" y="4" width="4" height="2" />
    <rect x="2" y="8" width="2" height="2" />
    <rect x="8" y="8" width="2" height="2" />
  </>,
  <>
    <rect x="2" y="2" width="8" height="2" />
    <rect x="2" y="5" width="8" height="2" />
    <rect x="2" y="8" width="8" height="2" />
  </>,
  <>
    <rect x="4" y="4" width="4" height="4" />
    <rect x="2" y="2" width="2" height="2" />
    <rect x="8" y="8" width="2" height="2" />
  </>,
  <>
    <rect x="2" y="2" width="2" height="8" />
    <rect x="4" y="8" width="6" height="2" />
  </>,
  <>
    <rect x="2" y="2" width="8" height="2" />
    <rect x="2" y="4" width="2" height="6" />
    <rect x="5" y="4" width="2" height="4" />
    <rect x="8" y="4" width="2" height="6" />
  </>,
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

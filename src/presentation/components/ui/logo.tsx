/**
 * Logotipo "F&F".
 *
 * Las efes son modulares —solo rectángulos y ángulos de 90°, en el lenguaje del
 * sitio de referencia— y el ampersand es el de Space Grotesk, la tipografía del
 * propio sitio, en su peso más grueso.
 *
 * Se probó a dibujar también el ampersand con rectángulos, pero un "&" es una
 * forma con curvas y una diagonal cruzada: aproximarla con celdas daba un signo
 * que no se leía. El contorno va incrustado como `path`, extraído una vez de la
 * fuente, así que no depende de que la tipografía llegue a cargar y conserva el
 * mismo grosor óptico que las astas de las efes.
 */

const STROKE = 2.6;
const ARM_TOP = 7; // el brazo superior abarca todo el ancho de la letra (7)
const ARM_MID = 5.2; // el central es más corto, como en una F clásica
const MID_Y = 3.9;
const HEIGHT = 10;

/** Contorno del "&", normalizado a la altura de mayúsculas del logotipo. */
const AMPERSAND_PATH =
  "M6.929 0L3.357 0Q2.471 0 1.807-0.321Q1.143-0.643 0.771-1.250Q0.400-1.857 0.400-2.700Q0.400-3.314 0.621-3.771Q0.843-4.229 1.229-4.529Q1.614-4.829 2.086-4.971L2.086-5.171Q1.371-5.386 0.914-5.914Q0.457-6.443 0.457-7.314Q0.457-8.186 0.843-8.786Q1.229-9.386 1.893-9.693Q2.557-10 3.414-10L4.971-10L4.971-8.514L3.743-8.514Q3.100-8.514 2.679-8.171Q2.257-7.829 2.257-7.157Q2.257-6.686 2.464-6.386Q2.671-6.086 3.007-5.943Q3.343-5.800 3.743-5.800L5.129-5.800L5.129-7.086L6.929-7.086L6.929-5.800L8.243-5.800L8.243-4.314L6.929-4.314L6.929 0M3.686-1.486L5.129-1.486L5.129-4.314L3.686-4.314Q3.057-4.314 2.629-3.957Q2.200-3.600 2.200-2.900Q2.200-2.186 2.650-1.836Q3.100-1.486 3.686-1.486";

// Colocación del signo. Los valores salen de medir el contorno del glifo
// (su caja es x 0.40→8.24 con la línea base en y = 0) y se dejan resueltos:
// la escala lo deja algo por debajo del alto de las letras, como corresponde
// tipográficamente, y la traslación lo centra en vertical.
const AMP_SCALE = 0.92;
const AMP_X = 7.632;
const AMP_BASELINE_Y = 9.6;

const SECOND_F_X = 16.215;
const TOTAL_W = 23.215;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function efRects(x: number): Rect[] {
  return [
    { x, y: 0, w: STROKE, h: HEIGHT }, // asta vertical
    { x, y: 0, w: ARM_TOP, h: STROKE }, // brazo superior
    { x, y: MID_Y, w: ARM_MID, h: STROKE }, // brazo central
  ];
}

const LOGO_RECTS: Rect[] = [...efRects(0), ...efRects(SECOND_F_X)];

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
    >
      {LOGO_RECTS.map((r) => (
        <rect key={`${r.x}-${r.y}-${r.w}`} x={r.x} y={r.y} width={r.w} height={r.h} />
      ))}
      <g transform={`translate(${AMP_X} ${AMP_BASELINE_Y}) scale(${AMP_SCALE})`}>
        <path d={AMPERSAND_PATH} />
      </g>
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

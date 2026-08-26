/**
 * Logotipo "F&F".
 *
 * Las efes son modulares —solo rectángulos y ángulos de 90°, en el lenguaje del
 * sitio de referencia— y el ampersand es un glifo tipográfico incrustado como
 * contorno.
 *
 * El signo NO sale de Space Grotesk, la tipografía del sitio: su ampersand tiene
 * el lazo casi rectangular y no se reconoce como "&". Se usa el de DM Sans, de
 * forma canónica y con la diagonal marcada, escalado al 91% para que su trazo
 * pese lo mismo que las astas de las efes. Va incrustado como `path`, así que no
 * añade ninguna descarga ni depende de que cargue una fuente.
 */

const STROKE = 2.6;
const ARM_TOP = 7; // el brazo superior abarca todo el ancho de la letra (7)
const ARM_MID = 5.2; // el central es más corto, como en una F clásica
const MID_Y = 3.9;
const HEIGHT = 10;

/** Contorno del "&" (DM Sans, peso 700), a la altura de las mayúsculas. */
const AMPERSAND_PATH =
  "M10.814 0L8.514 0L3.086-5.400Q2.429-6.057 2.157-6.593Q1.886-7.129 1.886-7.729Q1.886-8.414 2.229-8.971Q2.571-9.529 3.236-9.850Q3.900-10.171 4.829-10.171Q5.757-10.171 6.393-9.829Q7.029-9.486 7.364-8.929Q7.700-8.371 7.686-7.671L5.843-7.671Q5.843-8.186 5.543-8.443Q5.243-8.700 4.800-8.700Q4.314-8.700 4.021-8.436Q3.729-8.171 3.729-7.743Q3.729-7.400 3.943-7.029Q4.157-6.657 4.600-6.200L10.814 0M4.171 0.157Q3.071 0.157 2.264-0.221Q1.457-0.600 1.014-1.286Q0.571-1.971 0.571-2.900Q0.571-3.614 0.871-4.236Q1.171-4.857 1.771-5.336Q2.371-5.814 3.257-6.100L3.986-6.329L4.829-5.129L4.171-4.914Q3.300-4.629 2.879-4.143Q2.457-3.657 2.457-3.014Q2.457-2.571 2.671-2.207Q2.886-1.843 3.300-1.629Q3.714-1.414 4.271-1.414Q5.043-1.414 5.657-1.757Q6.271-2.100 6.843-2.857Q7.100-3.200 7.357-3.629Q7.614-4.057 7.871-4.586L8.171-5.200L10.129-5.200L9.643-4.214Q9.286-3.471 8.914-2.857Q8.543-2.243 8.143-1.771Q7.329-0.757 6.364-0.300Q5.400 0.157 4.171 0.157";

// Colocación del signo: la escala lo deja algo por debajo del alto de las
// letras, como corresponde tipográficamente, y la traslación lo centra en
// vertical (el glifo viene con la línea base en y = 0).
const AMP_SCALE = 0.9101;
const AMP_X = 7.48;
const AMP_BASELINE_Y = 9.557;

const SECOND_F_X = 18.322;
const TOTAL_W = 25.322;

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

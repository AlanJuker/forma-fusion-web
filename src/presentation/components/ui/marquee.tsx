"use client";

/**
 * Cinta de texto en movimiento continuo. Se duplica el contenido y se anima
 * -50%, de modo que el bucle es exacto y no se aprecia el salto.
 */
export function Marquee({
  items,
  speedSeconds = 40,
}: {
  items: string[];
  speedSeconds?: number;
}) {
  const track = [...items, ...items];

  return (
    <div className="relative flex overflow-hidden select-none">
      <div
        className="flex shrink-0 items-center gap-10 whitespace-nowrap will-change-transform motion-reduce:animate-none"
        style={{ animation: `ff-marquee ${speedSeconds}s linear infinite` }}
      >
        {track.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-10">
            <span className="display-sm uppercase">{item}</span>
            <span aria-hidden className="text-grey-300 text-4xl leading-none">
              &#8226;
            </span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ff-marquee {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </div>
  );
}

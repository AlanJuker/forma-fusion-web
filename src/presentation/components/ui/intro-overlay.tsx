"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimate } from "motion/react";

import { LogoFF } from "./logo";

/**
 * Secuencia de entrada.
 *
 * Pantalla negra con el logotipo blanco centrado; el logotipo viaja a la
 * esquina superior izquierda y, mientras llega, el panel negro se retrae hacia
 * arriba y descubre la página.
 *
 * El logotipo blanco vive DENTRO del panel, así que lo recorta el mismo
 * `clip-path` que lo retrae: al desaparecer la franja negra queda debajo el
 * logotipo negro de la cabecera, exactamente en la misma posición y tamaño. No
 * hay cambio de color ni salto — es el mismo dibujo, revelado al contrario.
 *
 * Para que las dos posiciones coincidan en cualquier viewport se mide en tiempo
 * real la cabecera (técnica FLIP) en lugar de fijar coordenadas a mano.
 */

const SESSION_KEY = "ff:intro-played";

/**
 * Acceso tolerante a sessionStorage.
 *
 * En modo privado estricto, con el almacenamiento bloqueado o dentro de un
 * iframe de otro origen, el simple hecho de leer `window.sessionStorage` lanza.
 * Si esa excepción escapa del efecto, React desmonta el árbol y el visitante se
 * queda con la página en blanco: por eso nunca se toca sin proteger.
 */
function readIntroPlayed(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markIntroPlayed(): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // Sin almacenamiento la intro se repetirá en la próxima carga. Es
    // preferible a romper la página.
  }
}

export function IntroOverlay() {
  const [scope, animate] = useAnimate();
  const panelRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  // Arranca en false a propósito: en el HTML servido este componente no pinta
  // nada. Si el panel negro viajara en el SSR, sin JavaScript (bundle
  // bloqueado, chunk caído tras un despliegue) se quedaría cubriendo la página
  // para siempre, porque ninguna hoja de estilos lo retira. Quien tapa la
  // pantalla hasta que montamos es `.intro-shield`, que sí se controla por CSS
  // y tiene su válvula de escape en <noscript>.
  const [active, setActive] = useState(false);

  // Decide si hay intro que reproducir. Solo entonces se monta el panel.
  useEffect(() => {
    const root = document.documentElement;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Ya vista en esta sesión, o el usuario pide menos movimiento: se descubre
    // la página de inmediato, sin animar nada.
    if (readIntroPlayed() || prefersReduced) {
      root.dataset.intro = "done";
      return;
    }

    setActive(true);
  }, []);

  // Reproduce la secuencia una vez el panel ya está en el DOM.
  useEffect(() => {
    if (!active) return;

    const root = document.documentElement;
    const panel = panelRef.current;
    const logo = logoRef.current;
    const target = document.querySelector<HTMLElement>("[data-logo-target]");
    if (!panel || !logo || !target) {
      root.dataset.intro = "done";
      setActive(false);
      return;
    }

    root.dataset.intro = "playing";
    // Se marca al empezar, no al terminar: si el visitante navega a mitad de la
    // secuencia, la página siguiente no debe volver a reproducirla desde cero.
    markIntroPlayed();
    // El scroll queda bloqueado mientras dura la secuencia.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const logoRect = logo.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    // `transform-origin: top left` permite tratar posición y escala por
    // separado: la x/y es la esquina de destino y la escala, la razón de altos.
    const scale = targetRect.height / logoRect.height;
    const startX = (window.innerWidth - logoRect.width) / 2;
    const startY = (window.innerHeight - logoRect.height) / 2;

    logo.style.transform = `translate3d(${startX}px, ${startY}px, 0) scale(1)`;

    let cancelled = false;

    const run = async () => {
      try {
        await animate(
          [
            // El logotipo se asienta antes de moverse.
            [logo, { opacity: [0, 1] }, { duration: 0.55, ease: [0.22, 1, 0.36, 1] }],
            [
              logo,
              {
                transform: `translate3d(${targetRect.left}px, ${targetRect.top}px, 0) scale(${scale})`,
              },
              { duration: 1.05, ease: [0.76, 0, 0.24, 1], at: "+0.75" },
            ],
            // El panel arranca antes de que el logotipo termine: los dos gestos
            // se solapan y el conjunto se lee como uno solo.
            [
              panel,
              { clipPath: "inset(0% 0% 100% 0%)" },
              { duration: 0.95, ease: [0.76, 0, 0.24, 1], at: "-0.55" },
            ],
          ],
        );
      } catch {
        // Si la animación se interrumpe (desmontaje), se descubre la página.
      }
      if (cancelled) return;
      root.dataset.intro = "done";
      document.body.style.overflow = previousOverflow;
      setActive(false);
    };

    void run();

    return () => {
      cancelled = true;
      document.body.style.overflow = previousOverflow;
      root.dataset.intro = "done";
    };
  }, [active, animate]);

  if (!active) return null;

  return (
    <div ref={scope} className="intro-overlay" aria-hidden>
      <div
        ref={panelRef}
        className="fixed inset-0 z-[100] bg-ink"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      >
        <div
          ref={logoRef}
          className="absolute left-0 top-0 text-paper opacity-0"
          style={{
            fontSize: "clamp(56px, 9vw, 128px)",
            transformOrigin: "top left",
            willChange: "transform",
          }}
        >
          <LogoFF />
        </div>
      </div>
    </div>
  );
}

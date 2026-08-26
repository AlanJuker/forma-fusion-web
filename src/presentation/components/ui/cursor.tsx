"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor de seguimiento.
 *
 * Un punto que persigue al ratón con un poco de retardo y se abre en anillo
 * sobre lo que se puede pulsar. Va en `mix-blend-mode: difference`, así que se
 * invierte contra el fondo: negro sobre el papel, blanco sobre la fotografía o
 * el telón de la intro, sin necesidad de saber qué hay debajo.
 *
 * Solo se activa con un puntero de precisión: en pantalla táctil no hay cursor
 * que seguir, y con movimiento reducido no se monta.
 */

const TAMANO_PUNTO = 8;
const TAMANO_ANILLO = 38;
/** Cuánto se acerca el punto a la posición real en cada fotograma. */
const SUAVIZADO = 0.18;

export function Cursor() {
  const puntoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finoYConMovimiento =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finoYConMovimiento) return;

    const punto = puntoRef.current;
    if (!punto) return;

    let objetivoX = window.innerWidth / 2;
    let objetivoY = window.innerHeight / 2;
    let x = objetivoX;
    let y = objetivoY;
    let escala = 1;
    let escalaObjetivo = 1;
    let visible = false;
    let frame = 0;

    const alMover = (event: PointerEvent) => {
      objetivoX = event.clientX;
      objetivoY = event.clientY;
      if (!visible) {
        // Colocarlo de golpe la primera vez evita que cruce la pantalla.
        x = objetivoX;
        y = objetivoY;
        visible = true;
        punto.style.opacity = "1";
      }
      // Sobre un elemento pulsable el punto se abre en anillo.
      const sobrePulsable = Boolean(
        (event.target as Element | null)?.closest?.(
          'a, button, [role="button"], input, textarea, select, label',
        ),
      );
      escalaObjetivo = sobrePulsable ? TAMANO_ANILLO / TAMANO_PUNTO : 1;
      punto.dataset.anillo = sobrePulsable ? "si" : "no";
    };

    const alSalir = () => {
      visible = false;
      punto.style.opacity = "0";
    };

    const bucle = () => {
      x += (objetivoX - x) * SUAVIZADO;
      y += (objetivoY - y) * SUAVIZADO;
      escala += (escalaObjetivo - escala) * SUAVIZADO;
      punto.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${escala.toFixed(3)})`;
      frame = requestAnimationFrame(bucle);
    };
    frame = requestAnimationFrame(bucle);

    window.addEventListener("pointermove", alMover, { passive: true });
    document.addEventListener("pointerleave", alSalir);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", alMover);
      document.removeEventListener("pointerleave", alSalir);
    };
  }, []);

  return <div ref={puntoRef} className="ff-cursor" aria-hidden />;
}

"use client";

import { MotionConfig } from "motion/react";

/**
 * Política de movimiento para todo el sitio.
 *
 * `reducedMotion="user"` deja que la librería respete la preferencia del
 * sistema: desactiva desplazamientos y escalas, y conserva los fundidos.
 *
 * Se hace aquí, y no con `useReducedMotion()` en cada componente, porque ese
 * hook devuelve `null` en el servidor y `true` en el cliente de quien pide
 * menos movimiento. Usarlo para elegir qué se renderiza produce un árbol
 * distinto en servidor y en cliente, es decir, un fallo de hidratación.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

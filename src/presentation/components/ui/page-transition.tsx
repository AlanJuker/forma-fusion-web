"use client";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";

/**
 * Entrada suave del contenido en cada navegación.
 *
 * Solo se anima la entrada, sin `AnimatePresence`: en el App Router el árbol de
 * `children` se sustituye cuando la ruta ya ha cambiado, así que una animación
 * de salida se quedaría a medias o retrasaría la navegación. Un fundido corto
 * con la clave del pathname basta para que el cambio se lea continuo.
 *
 * La preferencia de movimiento reducido la aplica `MotionProvider`; aquí no se
 * ramifica el render, que causaría un desajuste de hidratación.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

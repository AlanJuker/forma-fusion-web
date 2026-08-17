"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

/**
 * Aparición al entrar en viewport: desplazamiento corto + fundido.
 *
 * La preferencia de movimiento reducido la aplica `MotionProvider` (que anula
 * desplazamientos y conserva fundidos); no se ramifica el render, porque el
 * hook `useReducedMotion` vale `null` en el servidor y produciría un árbol
 * distinto al del cliente.
 * `amount: 0.15` dispara la animación en cuanto asoma el bloque, no cuando ya
 * está centrado, que es lo que hace que el scroll se sienta continuo.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15 }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Titular que se revela por líneas tras una máscara, como una cortina.
 *
 * Quien observa el viewport es el contenedor, no cada línea: la línea arranca
 * desplazada un 110% fuera de su máscara `overflow-hidden`, así que su área
 * visible es cero y un observador puesto sobre ella nunca llegaría a dispararse
 * (no se muestra porque no anima, y no anima porque no se muestra). El
 * contenedor sí ocupa su alto real, y desde él las variantes bajan a las líneas.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
}) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {lines.map((line, index) => (
        // Nivel intermedio con variantes vacías: mantiene la cadena de
        // propagación, que se corta en cuanto hay un elemento no animado.
        <motion.span
          key={line}
          className="block overflow-hidden"
          variants={{ hidden: {}, visible: {} }}
        >
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            variants={{ hidden: { y: "110%" }, visible: { y: 0 } }}
            transition={{
              duration: 1,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </motion.span>
  );
}

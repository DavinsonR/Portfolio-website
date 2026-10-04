import type { Dictionary } from "../dictionaries";

/** La tarjeta de `work.cards` que corresponde a una ruta.
 *
 *  Siete páginas (y el aparte de /historia) leían su visual de cabecera con
 *  `cards.find(...)!`. Una ruta nueva sin su entrada en `lib/content/home.ts`
 *  rompía el build con «Cannot read properties of undefined», que no dice qué
 *  falta ni dónde. Aquí el error nombra la ruta y el archivo. */
export function workCard(dict: Dictionary, href: string) {
  const card = dict.work.cards.find((c) => c.href === href);
  if (!card) {
    throw new Error(`workCard: no hay entrada en work.cards (lib/content/home.ts) con href "${href}". Una ruta nueva necesita la suya, con un \`viz\` que Previews.tsx sepa dibujar.`);
  }
  return card;
}

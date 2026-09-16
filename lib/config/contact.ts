import type { Dictionary } from "../dictionaries";

/** El `mailto:` del sitio, en un solo sitio.
 *
 *  Estaba escrito a mano en cinco lugares (barra, cabecera, cierre, CV, pie del
 *  CV) y ninguno llevaba asunto. Un correo que llega sin asunto y sin estructura
 *  se responde con otra ronda de preguntas: rol, empresa, modalidad, rango. Esas
 *  cuatro líneas viajan ahora en el propio enlace.
 *
 *  El cuerpo va codificado con `encodeURIComponent`, que convierte los saltos de
 *  línea en `%0A` — la forma que aceptan Outlook, Gmail y Mail. */
export function mailtoHref(dict: Dictionary) {
  const q = new URLSearchParams({
    subject: dict.contact.mailSubject,
    body: dict.contact.mailBody,
  });
  // URLSearchParams codifica el espacio como "+", que un cliente de correo
  // muestra literalmente dentro del asunto.
  return `mailto:${dict.profile.email}?${q.toString().replace(/\+/g, "%20")}`;
}

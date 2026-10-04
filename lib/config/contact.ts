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

/** La página de citas: el compromiso más pequeño que se le puede pedir a un
 *  reclutador que decide en un minuto (auditoría final, reclutador #11).
 *
 *  Vacía, el botón no se pinta en ningún sitio y el correo sigue de primario:
 *  un enlace a una agenda que todavía no existe sería un enlace roto, y este
 *  sitio dice lo que no está vivo en vez de ofrecerlo. Se rellena con la URL
 *  pública de la página de reservas (Google Calendar, Cal.com…) y nada más. */
export const SCHEDULING_URL: string = "";

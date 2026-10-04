import type { Dictionary } from "@/lib/dictionaries";
import { SCHEDULING_URL } from "@/lib/config/contact";

/** El botón de agendar, y la clase que le toca al correo según exista o no.
 *
 *  Con agenda, agendar es la acción primaria (azul relleno) y el correo pasa a
 *  contorno: dos botones rellenos uno al lado del otro no dicen cuál pulsar.
 *  Sin agenda (`SCHEDULING_URL` vacía) no se pinta nada y el correo sigue
 *  siendo el primario, como antes. */
export const SOLID =
  "lift inline-flex items-center rounded-[3px] bg-cold px-5 py-3 text-[14.5px] font-semibold text-paper transition-opacity hover:opacity-90";
export const OUTLINE =
  "lift inline-flex items-center rounded-[3px] border border-control px-5 py-3 text-[14.5px] font-semibold text-ink transition-colors hover:border-cold hover:text-cold";

export const hasScheduling = SCHEDULING_URL !== "";
export const emailButtonClass = hasScheduling ? OUTLINE : SOLID;

export default function ScheduleButton({ dict }: { dict: Dictionary }) {
  if (!hasScheduling) return null;
  return (
    <a href={SCHEDULING_URL} target="_blank" rel="noopener noreferrer" className={SOLID}>
      {dict.contact.schedule}
    </a>
  );
}

/** La línea que dice qué es lo que se agenda: sin ella, «20 minutos» puede ser
 *  una llamada, una prueba técnica o un formulario. */
export function ScheduleNote({ dict, className = "" }: { dict: Dictionary; className?: string }) {
  if (!hasScheduling) return null;
  return <p className={`text-[14px] text-body ${className}`}>{dict.contact.scheduleNote}</p>;
}

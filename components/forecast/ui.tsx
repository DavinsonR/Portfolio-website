"use client";

/* Piezas de interfaz del laboratorio que se repiten: la tabla ordenable, la lista
   desplegable de selección múltiple y el recuadro de un visual. Planas, con regla y
   fondo teñido, sin sombras (docs/DESIGN.md): el aspecto de tablero sale de la grilla y
   de las reglas, no de tarjetas flotantes. */

import { useEffect, useId, useMemo, useRef, useState } from "react";

// ---------------------------------------------------------------- tabla ordenable

export type Column<R> = {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  /** Valor para ordenar; null va siempre al final, en los dos sentidos. */
  sort?: (r: R) => number | string | null;
  render: (r: R) => React.ReactNode;
  className?: string;
};

export function SortTable<R>({ rows, columns, rowKey, initial, caption, minWidth = 480, rowClass, onRow }: {
  rows: R[];
  columns: Column<R>[];
  rowKey: (r: R) => string;
  initial?: { key: string; dir: "asc" | "desc" };
  caption?: string;
  minWidth?: number;
  rowClass?: (r: R) => string;
  onRow?: (r: R) => void;
}) {
  const [sort, setSort] = useState(initial ?? null);
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sort) return rows;
    const get = col.sort;
    return [...rows].sort((a, b) => {
      const va = get(a), vb = get(b);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      const c = typeof va === "string" ? va.localeCompare(String(vb)) : va - (vb as number);
      return sort.dir === "asc" ? c : -c;
    });
  }, [rows, columns, sort]);

  const click = (key: string) =>
    setSort((s) => (s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === columns[0]?.key ? "asc" : "desc" }));

  return (
    <div tabIndex={0} role="region" aria-label={caption} className="overflow-x-auto">
      <table className="fl-table w-full border-collapse text-[14px]" style={{ minWidth }}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c) => {
              const active = sort?.key === c.key;
              return (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : "none"}
                  className={c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"}
                >
                  {c.sort ? (
                    <button type="button" onClick={() => click(c.key)} className="fl-sort" data-active={active || undefined}>
                      {c.label}
                      <span aria-hidden="true" className="fl-sort-ico">{active ? (sort!.dir === "asc" ? "▲" : "▼") : "↕"}</span>
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={rowKey(r)} className={rowClass?.(r)} onClick={onRow ? () => onRow(r) : undefined} style={onRow ? { cursor: "pointer" } : undefined}>
              {columns.map((c) => (
                <td key={c.key} className={`${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"} ${c.className ?? ""}`}>
                  {c.render(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------- desplegable múltiple

export type Option = { id: string; label: string; swatch?: React.ReactNode };

/** Botón que abre una lista con casillas. Casillas nativas: el teclado y el lector de
 *  pantalla ya saben usarlas, y un listbox a medida no añade nada aquí. */
export function MultiSelect({ label, summary, options, selected, onChange, max, search, actions }: {
  label: string;
  summary: string;
  options: Option[];
  selected: string[];
  onChange: (ids: string[]) => void;
  max?: number;
  search?: string;
  actions?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const shown = options.filter((o) => o.label.toLowerCase().includes(q.trim().toLowerCase()));
  const full = max != null && selected.length >= max;

  return (
    <div ref={box} className="fl-ms">
      <span className="fl-ms-label" id={`${id}-l`}>{label}</span>
      <button type="button" className="fl-ms-btn" aria-expanded={open} aria-controls={`${id}-p`} aria-labelledby={`${id}-l ${id}-b`} id={`${id}-b`} onClick={() => setOpen((v) => !v)}>
        <span className="truncate">{summary}</span>
        <span aria-hidden="true" className="fl-ms-caret">▾</span>
      </button>
      {open && (
        <div className="fl-ms-pop" id={`${id}-p`} role="group" aria-labelledby={`${id}-l`}>
          {search && (
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={search} aria-label={search} className="fl-ms-search" autoFocus />
          )}
          {actions && <div className="fl-ms-actions">{actions}</div>}
          <ul className="fl-ms-list">
            {shown.map((o) => {
              const on = selected.includes(o.id);
              return (
                <li key={o.id}>
                  <label className={`fl-ms-opt ${!on && full ? "opacity-50" : ""}`}>
                    <input
                      type="checkbox"
                      checked={on}
                      disabled={!on && full}
                      onChange={() => onChange(on ? selected.filter((x) => x !== o.id) : [...selected, o.id])}
                    />
                    {o.swatch}
                    <span>{o.label}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- ancho real

/** Ancho real del contenedor. Los gráficos se dibujan a ese ancho —un píxel de viewBox es
 *  un píxel de pantalla— en vez de encoger un lienzo de escritorio: en un teléfono de 390
 *  px, un gráfico de 1.100 unidades comprimido dejaba ejes y etiquetas encimados. Mientras
 *  no se mide (servidor, primer pintado) se usa el ancho de escritorio. */
export function useWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w || fallback] as const;
}

// ---------------------------------------------------------------- recuadro de un visual

export function Tile({ title, hint, className, children, tools }: {
  title: React.ReactNode;
  hint?: string;
  className?: string;
  children: React.ReactNode;
  tools?: React.ReactNode;
}) {
  return (
    <section className={`fl-tile ${className ?? ""}`}>
      <header className="fl-tile-head">
        <div className="min-w-0">
          <h3 className="fl-tile-title">{title}</h3>
          {hint && <p className="fl-tile-hint">{hint}</p>}
        </div>
        {tools && <div className="shrink-0">{tools}</div>}
      </header>
      <div className="fl-tile-body">{children}</div>
    </section>
  );
}

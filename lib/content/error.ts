// ============================================================
// La frontera de error de cliente (`app/[lang]/error.tsx`).
//
// Vive en su propio bloque, y no dentro de `about.ts` junto al 404, porque
// `error.tsx` es un componente de CLIENTE por contrato de Next y lo que importe
// viaja en el bundle de TODAS las rutas: este fichero son cuatro cadenas por
// idioma, no los 45 KB del diccionario entero. `lib/dictionaries.ts` lo
// ensambla igual que a los demás, así que `check:dict` le exige la misma forma
// en los dos idiomas.
//
// INVARIANTE: `es` y `en` tienen exactamente la misma forma.
// ============================================================

export const errorPage = {
  es: {
    errorPage: {
      title: "Algo se rompió al pintar esta página.",
      body: "No es tu conexión: es un error del sitio. Puedes reintentar o volver a la portada; el CV en PDF sigue disponible desde allí.",
      retry: "Reintentar",
      home: "Volver al inicio",
    },
  },
  en: {
    errorPage: {
      title: "Something broke while rendering this page.",
      body: "It is not your connection: it is an error on the site's side. You can retry or go back to the home page; the PDF résumé is still available from there.",
      retry: "Try again",
      home: "Back to home",
    },
  },
};

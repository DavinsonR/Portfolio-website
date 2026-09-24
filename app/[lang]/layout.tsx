import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { getDictionary, locales, type Locale } from "@/lib/dictionaries";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MotionRoot from "@/components/Motion";
import DocumentNavigation from "@/components/DocumentNavigation";
import { SITE } from "@/lib/config/site";
import { alternates } from "@/lib/config/alternates";
import { mailtoHref } from "@/lib/config/contact";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** Sin esto, `[lang]` acepta cualquier primer segmento: `/pricing` devolvía 200
 *  con la portada en español dentro de un `<html lang="pricing">` y con
 *  `robots: index, follow`. Una granja de soft-404 indexable, y el `canonical`
 *  por ruta la empeoraba (cada URL basura se declaraba canónica de sí misma).
 *  Ahora todo lo que no sea `es` o `en` es 404. */
export const dynamicParams = false;

/** La barra del navegador móvil sigue al tema: el manifest solo puede declarar
 *  un color, y era el azul del tema claro también en oscuro. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f4c81" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1216" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const path = `/${lang}`;
  return {
    metadataBase: new URL(SITE),
    // Sin plantilla, `/en/projects/trading-sim` se titulaba "Trading Sim — 1,300+
    // strategies vs. reality": el nombre de la persona no aparecía en ninguna
    // parte de la ranura que Google enseña para una búsqueda por nombre.
    title: { default: dict.meta.title, template: `%s — ${dict.profile.name}` },
    description: dict.meta.description,
    alternates: alternates(lang),
    // Sin esto, pegar el enlace en LinkedIn o WhatsApp muestra una tarjeta vacía.
    openGraph: {
      type: "profile",
      url: path,
      siteName: dict.profile.name,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: lang === "es" ? "es_CO" : "en_US",
      alternateLocale: lang === "es" ? "en_US" : "es_CO",
      images: [{ url: `/og-${lang}.png`, width: 1200, height: 630, alt: `${dict.profile.name} — ${dict.sheet.verdict}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [`/og-${lang}.png`],
    },
    robots: { index: true, follow: true },
  };
}

/* Applied before paint so a reload never flashes the wrong ground, and so the
   reveal states exist from the first frame instead of snapping in at hydration.
   The timer is the failsafe: if the bundle never runs, nothing stays hidden. */
const BOOT = `(function(){var r=document.documentElement;try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')r.setAttribute('data-theme',t);}catch(e){}r.classList.add('js');setTimeout(function(){if(!r.hasAttribute('data-motion'))document.querySelectorAll('[data-reveal]').forEach(function(e){e.classList.add('is-in')})},3000);})();`;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* Antes de los <link>: un script clásico en línea no se ejecuta mientras
            una hoja de estilo bloquea scripts, así que el tema pre-pintado
            quedaba detrás de una petición de red. Ya no hay ninguna en la
            cabecera, pero el orden sigue siendo el correcto. */}
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        {/* Autoalojadas en public/fonts, con @font-face en globals.css. El <link>
            a Google entregaba la IP de cada visitante a un tercero en cada carga y
            metía una hoja mutable —sin SRI posible— en la ruta crítica. Versionadas
            en el repo, el build tampoco necesita red: FALLO-01 resuelto, no esquivado. */}
        <link rel="preload" href="/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* El serif solo aparece sobre el pliegue en la portada y en el CV (las
            cifras grandes y la línea de veredicto); las otras ocho rutas lo
            precargaban igual. Esas dos páginas lo declaran ellas mismas y React
            lo iza a <head>. */}
      </head>
      <body className="font-sans antialiased">
        {/* El primer tabulador de un lector de teclado caía en el conmutador de
            idioma y luego en cada enlace de la barra, en las cinco rutas. */}
        <a
          href="#main"
          className="no-print sr-only rounded-[3px] bg-cold px-4 py-2 text-[14.5px] font-semibold text-paper focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60]"
        >
          {dict.nav.skip}
        </a>
        <MotionRoot />
        {/* La página de crédito tiene su propia CSP: se entra cargando el documento. */}
        <DocumentNavigation />
        <Navbar nav={dict.nav} mailHref={mailtoHref(dict)} lang={lang as Locale} />
        {children}
        <Footer dict={dict} lang={lang as Locale} />
        {/* Analítica de Vercel, y no un contador de terceros, por la CSP: el
            script se sirve desde /_vercel/insights/script.js y los eventos van a
            /_vercel/insights/event, los dos del MISMO origen. Así `script-src
            'self'` y `connect-src 'self'` lo cubren tal cual están, sin abrir un
            host externo en la política que protege el resto del sitio.
            Sin cookies y sin huella: no hay banner de consentimiento que poner,
            y la divulgación del pie lo dice (`disclosures`). */}
        <Analytics />
      </body>
    </html>
  );
}

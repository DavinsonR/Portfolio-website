// ============================================================
// Generador de la fuente LaTeX del CV — lee lib/content/cv.ts
// Uso: npm run latex  →  public/*.tex en ES y EN
//
// El archivo resultante es autocontenido: se sube a Overleaf,
// se compila con pdfLaTeX y no necesita nada más. Es la sugerencia
// de Felix ("para tu cv usa overleaf, latex, ese formato es más
// decente") entregada como fuente, no como imitación.
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { dictionaries, type CvProject, type Locale } from "../lib/dictionaries";
import { SITE } from "../lib/config/site";

/** Un href relativo al idioma ("/projects/powerbi") se vuelve absoluto en el PDF. */
const abs = (lang: Locale, href: string) => (href.startsWith("http") ? href : `${SITE}/${lang}${href}`);

/** LaTeX se traga el texto plano; hay que devolverle sus escapes.
 *  El orden importa: la barra invertida se sustituye primero, si no
 *  se re-escaparían las que introducen las reglas siguientes. */
function tex(input: string): string {
  return input
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([&%$#_{}])/g, "\\$1")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/—/g, "---")
    .replace(/–/g, "--")
    .replace(/·/g, "\\,\\textperiodcentered\\,")
    .replace(/→/g, "$\\rightarrow$")
    .replace(/×/g, "$\\times$")
    .replace(/●/g, "\\textbullet{}")
    .replace(/…/g, "\\ldots{}")
    // comillas emparejadas, no una comilla de apertura para todo
    .replace(/"([^"]*)"/g, "``$1''");
}

/** `tex()` escapa las etiquetas, pero el argumento URL de \href{} nunca pasaba
 *  por ningún filtro. Una `}` en cualquier href cierra el argumento y el resto
 *  se ejecuta como LaTeX (`\input{...}` funcionaría; `\write18` no, está
 *  desactivado por defecto). No es explotable —los valores salen de
 *  `lib/dictionaries.ts`, un fichero propio, y quien pueda editarlo ya ejecuta
 *  código porque `npm run latex` lo importa— pero una URL legítima con `}` o `%`
 *  rompe el CV en silencio. Mejor que reviente aquí, con el href a la vista. */
function url(u: string): string {
  // `hyperref` sí digiere `#` y `%` en el argumento de \href (las anclas del CV
  // dependen de ello). Lo que rompe de verdad es `}`, que cierra el argumento y
  // deja que el resto se lea como LaTeX, más `{` y la barra invertida.
  if (!/^(https?:\/\/|mailto:)[^\s{}\\]+$/.test(u)) {
    throw new Error(`href no apto para LaTeX: ${u}`);
  }
  return u;
}

const strings = {
  es: {
    file: "Davirson_Novoa_CV_ES.tex",
    lang: "spanish",
    profile: "Perfil",
    crossover: "El rol cruzado",
    experience: "Experiencia",
    projects: "Proyectos en producción",
    research: "Investigación",
    skills: "Habilidades",
    finance: "Dominio financiero",
    data: "Datos e ingeniería",
    levels: "Nivel declarado",
    education: "Educación",
    certs: "Certificaciones",
    awards: "Reconocimientos",
    remote: "Preparado para remoto",
    stack: "Stack",
  },
  en: {
    file: "Davirson_Novoa_Resume_EN.tex",
    lang: "english",
    profile: "Profile",
    crossover: "The crossover role",
    experience: "Experience",
    projects: "Production projects",
    research: "Research",
    skills: "Skills",
    finance: "Finance domain",
    data: "Data & engineering",
    levels: "Declared level",
    education: "Education",
    certs: "Certifications",
    awards: "Recognition",
    remote: "Remote-ready",
    stack: "Stack",
  },
} as const;

function build(lang: Locale): string {
  const dict = dictionaries[lang];
  const cv = dict.cv;
  const t = strings[lang];
  const L: string[] = [];
  const w = (s = "") => L.push(s);

  const bullets = (items: readonly string[]) => {
    w("\\begin{itemize}[leftmargin=1.1em, itemsep=0pt, topsep=1pt, parsep=0pt]");
    for (const b of items) w(`  \\item ${tex(b)}`);
    w("\\end{itemize}");
  };

  // ---------- preámbulo ----------
  w("% =========================================================");
  w(`% ${tex(cv.title)} — ${tex(cv.targets.join(" / "))}`);
  w("% Generado desde lib/content/cv.ts (npm run latex).");
  w("% Compila en Overleaf con pdfLaTeX, sin paquetes externos.");
  w("% =========================================================");
  w("\\documentclass[a4paper,10pt]{article}");
  w("\\usepackage[utf8]{inputenc}");
  w("\\usepackage[T1]{fontenc}");
  // es-noshorthands apaga los atajos activos de babel-spanish ("a, <<, ~, .)
  // que de otro modo reinterpretan puntuación corriente dentro del texto.
  w(`\\usepackage[${lang === "es" ? "spanish,es-noshorthands" : t.lang}]{babel}`);
  w("\\usepackage{lmodern}");
  w("\\usepackage{microtype}");
  w("\\usepackage[top=1.3cm,bottom=1.2cm,left=1.5cm,right=1.5cm]{geometry}");
  w("\\usepackage{enumitem}");
  w("\\usepackage{titlesec}");
  w("\\usepackage{xcolor}");
  w("\\usepackage[hidelinks]{hyperref}");
  w("\\usepackage{needspace}");
  w("\\usepackage{multicol}");
  w("");
  w("\\definecolor{cold}{HTML}{0F4C81}   % azul institucional del sitio");
  w("\\definecolor{ink}{HTML}{14181D}");
  w("\\definecolor{body}{HTML}{454E57}");
  w("\\hypersetup{colorlinks=true, urlcolor=cold, linkcolor=cold}");
  w("");
  w("\\pagestyle{empty}");
  w("\\setlength{\\parindent}{0pt}");
  w("\\linespread{0.94}");
  w("\\color{body}");
  w("");
  w("% Sección: versalitas con regla completa debajo — la firma del formato.");
  w("\\titleformat{\\section}");
  w("  {\\normalfont\\scshape\\bfseries\\color{ink}\\large}{}{0pt}{}[\\vspace{-6pt}\\color{cold}\\rule{\\linewidth}{0.8pt}]");
  w("\\titlespacing*{\\section}{0pt}{7pt}{3pt}");
  w("");
  w("% Un encabezado con la fecha alineada al margen derecho.");
  w("\\newcommand{\\headline}[2]{\\needspace{3\\baselineskip}\\textbf{\\color{ink}#1}\\hfill{\\small #2}\\par}");
  w("\\newcommand{\\subline}[2]{\\textit{#1}\\hfill{\\small #2}\\par}");
  w("");
  w("\\begin{document}");
  w("");

  // ---------- encabezado ----------
  w("\\begin{center}");
  w(`  {\\LARGE\\bfseries\\color{ink} ${tex(cv.title)}}\\\\[3pt]`);
  w(`  {\\large\\color{cold} ${cv.targets.map(tex).join(" \\,\\textperiodcentered\\, ")}}\\\\[4pt]`);
  w(`  {\\small ${tex(cv.subtitle)}}\\\\[3pt]`);
  w(`  {\\small ${tex(cv.metaLine)}}\\\\[2pt]`);
  // El PDF es el artefacto que sobrevive a la visita: se reenvía dentro de la
  // empresa sin el enlace que lo trajo. La cabecera llevaba correo, LinkedIn y
  // GitHub, y ninguna forma de volver al sitio donde está la evidencia.
  // OJO: aquí las barras van DOBLES. En una plantilla de JavaScript `\s` es `s`,
  // `\h` es `h` y `\,` es `,` — y `\t` es un TABULADOR. Esta línea se escribió
  // con barras simples y salió al PDF como
  //   `{small href{mailto:...}{...} ,<TAB>extperiodcentered, ...}`
  // durante todo el tiempo que el CV lleva publicado: la línea de contacto
  // —correo, LinkedIn, GitHub y el sitio, lo primero que mira quien contrata—
  // era texto crudo con los comandos rotos, y ni `tsc` ni LaTeX se quejan,
  // porque el resultado es LaTeX válido que sencillamente no es el que se quiso.
  // El resto del fichero ya usaba barras dobles; esta línea era la excepción.
  w(
    `  {\\small \\href{${url(`mailto:${dict.profile.email}`)}}{${tex(dict.profile.email)}} \\,\\textperiodcentered\\, ` +
      `\\href{${url(dict.profile.linkedin)}}{${tex(dict.profile.linkedin.replace("https://", ""))}} \\,\\textperiodcentered\\, ` +
      `\\href{${url(dict.profile.github)}}{${tex(dict.profile.github.replace("https://", ""))}} \\,\\textperiodcentered\\, ` +
      `\\href{${url(`${SITE}/${lang}`)}}{${tex(SITE.replace("https://", ""))}}}`
  );
  w("\\end{center}");
  w("\\vspace{2pt}");
  w("");

  // ---------- perfil ----------
  w(`\\section*{${tex(cv.profileLabel)}}`);
  w(tex(cv.profileText));
  w("");

  // ---------- el rol cruzado ----------
  w(`\\section*{${tex(t.crossover)}}`);
  w(tex(cv.pivot.body));
  w("");

  // ---------- experiencia ----------
  w(`\\section*{${tex(t.experience)}}`);
  for (const company of cv.experience) {
    const mode = company.mode === "remote" ? cv.remoteTag : cv.hybridTag;
    // "Remoto · remoto" es ruido: cuando la sede ya es la modalidad, va una sola vez
    const where =
      company.location.toLowerCase() === mode.toLowerCase()
        ? mode
        : `${company.location} · ${mode}`;
    w(`\\headline{${tex(company.company)}}{${tex(where)}}`);
    if ("note" in company && company.note) {
      w(`{\\small\\itshape\\color{cold} ${tex(company.note)}}\\par`);
    }
    w("\\vspace{1pt}");
    for (const role of company.roles) {
      w(`\\subline{${tex(role.title)}}{${tex(role.period)}}`);
      bullets(role.bullets);
    }
    w("\\vspace{4pt}");
  }
  w("");

  // ---------- proyectos e investigación: el mismo bloque ----------
  const projectBlock = (pr: CvProject) => {
    w(`\\headline{${tex(pr.name)}}{${tex(pr.period)}}`);
    w(`\\subline{${tex(pr.role)}}{\\href{${url(abs(lang, pr.href))}}{${tex(pr.hrefLabel)}}}`);
    bullets(pr.bullets);
    w(`{\\small\\textbf{${tex(t.stack)}:} ${pr.stack.map(tex).join(" \\,\\textperiodcentered\\, ")}}\\par`);
    w("\\vspace{4pt}");
  };
  w(`\\section*{${tex(t.projects)}}`);
  w(`{\\small\\itshape ${tex(cv.projectsNote)}}\\par\\vspace{3pt}`);
  cv.projects.forEach(projectBlock);
  w("");
  w(`\\section*{${tex(t.research)}}`);
  w(`{\\small\\itshape ${tex(cv.researchNote)}}\\par\\vspace{3pt}`);
  cv.research.forEach(projectBlock);
  w("");

  // ---------- habilidades ----------
  w(`\\section*{${tex(t.skills)}}`);
  w(`\\textbf{\\color{ink}${tex(cv.skillsFinTitle)}:} ${cv.skillsFin.map(tex).join(" \\,\\textperiodcentered\\, ")}\\par\\vspace{3pt}`);
  w(`\\textbf{\\color{ink}${tex(cv.skillsDataTitle)}:} ${cv.skillsData.map(tex).join(" \\,\\textperiodcentered\\, ")}\\par\\vspace{3pt}`);
  w(`\\textbf{\\color{ink}${tex(cv.skillsTechTitle)}}\\par\\vspace{2pt}`);
  // en dos columnas y una por línea: un nivel se compara, no se lee corrido
  w("\\begin{multicols}{2}");
  w("\\begin{itemize}[leftmargin=1.1em, itemsep=1pt, topsep=0pt, parsep=0pt]");
  for (const sk of cv.skillsTech) {
    // la prueba que tiene página propia se lleva su enlace al PDF
    const proof = sk.href ? `\\href{${url(abs(lang, sk.href))}}{${tex(sk.proof)}}` : tex(sk.proof);
    w(`  \\item \\textbf{\\color{ink}${tex(sk.name)}} --- ${proof}`);
  }
  w("\\end{itemize}");
  w("\\end{multicols}");
  w("");

  // ---------- educación, certificaciones y reconocimientos ----------
  // Un solo bloque: son cuatro listas cortas y cuatro títulos de sección
  // costaban media página en un documento que debe caber en dos.
  w(`\\section*{${tex(t.education)}}`);
  for (const e of cv.education) {
    const title = e.href ? `\\href{${url(abs(lang, e.href))}}{${tex(e.title)}}` : tex(e.title);
    w(`\\headline{${title}}{${tex(e.period)}}`);
    w(`{\\small ${tex(e.inst)} \\,\\textperiodcentered\\, ${tex(e.statusText.toLowerCase())}}\\par`);
    if (e.note) w(`{\\small\\itshape ${tex(e.note)}}\\par`);
    w("\\vspace{1pt}");
  }
  w("\\vspace{3pt}");
  w(`\\textbf{\\color{ink}${tex(t.certs)}:} ` +
    cv.certs.map((c) => `${tex(c.title)} (${tex(c.inst)}, ${tex(c.year)})`).join(" \\,\\textperiodcentered\\, ") + "\\par\\vspace{3pt}");
  w(`\\textbf{\\color{ink}${tex(t.awards)}:} ` +
    cv.awards
      .map((a) => {
        const label = `${tex(a.title)} (${tex(a.year)})`;
        // el premio con evidencia pública se lleva su enlace al PDF
        return a.href ? `\\href{${url(a.href)}}{${label}}` : label;
      })
      .join(" \\,\\textperiodcentered\\, ") + "\\par");
  w("");

  // ---------- remoto ----------
  w(`\\section*{${tex(t.remote)}}`);
  w(cv.remote.points.map(tex).join(" \\,\\textperiodcentered\\, "));
  w("");
  w("\\end{document}");

  return L.join("\n") + "\n";
}

const outDir = path.join(process.cwd(), "public");
fs.mkdirSync(outDir, { recursive: true });
for (const lang of ["es", "en"] as const) {
  const out = path.join(outDir, strings[lang].file);
  fs.writeFileSync(out, build(lang), "utf-8");
  console.log(`✓ ${out}`);
}

// ============================================================
// LA VERSIÓN DE UNA PÁGINA
//
// Por qué existe. El CV completo son tres páginas: es el formato académico y
// es el correcto para quien ya decidió leerte. Pero quien CRIBA dedica entre 30
// y 60 segundos, y muchos ATS truncan. Aplicar con tres páginas es pedirle al
// lector que trabaje antes de saber si le interesas.
//
// No es otro CV: es el MISMO `lib/content/cv.ts` con una regla de recorte fija,
// escrita aquí y no decidida a ojo cada vez. Así las dos versiones no pueden
// contradecirse — que es el fallo que este repositorio lleva evitando desde
// D-07.
//
// La regla, explícita:
//   · perfil entero (es el posicionamiento, no se recorta)
//   · las DOS empresas más recientes, con 3 viñetas cada una
//   · las demás experiencias, una línea sin viñetas
//   · proyectos e investigación, una línea cada uno con su enlace
//   · educación, una línea cada una
//   · el stack, una sola línea
//
// Que quepa en una página no se supone: `check:artifacts` cuenta las páginas
// del PDF y falla si son dos.
// ============================================================

function buildOnePage(lang: Locale): string {
  const dict = dictionaries[lang];
  const cv = dict.cv;
  const t = strings[lang];
  const L: string[] = [];
  const w = (s = "") => L.push(s);
  const dot = " \\,\\textperiodcentered\\, ";

  w("% =========================================================");
  w(`% ${tex(cv.title)} — ${tex(cv.targets.join(" / "))}`);
  w("% VERSIÓN DE UNA PÁGINA — generada desde lib/content/cv.ts (npm run latex).");
  w("% El CV completo, con todas las viñetas, es el otro fichero de public/.");
  w("% =========================================================");
  w("\\documentclass[a4paper,10pt]{article}");
  w("\\usepackage[utf8]{inputenc}");
  w("\\usepackage[T1]{fontenc}");
  w(`\\usepackage[${lang === "es" ? "spanish,es-noshorthands" : t.lang}]{babel}`);
  w("\\usepackage{lmodern}");
  w("\\usepackage{microtype}");
  w("\\usepackage[top=0.8cm,bottom=0.7cm,left=1.2cm,right=1.2cm]{geometry}");
  w("\\usepackage{enumitem}");
  w("\\usepackage{titlesec}");
  w("\\usepackage{xcolor}");
  w("\\usepackage[hidelinks]{hyperref}");
  w("");
  w("\\definecolor{cold}{HTML}{0F4C81}");
  w("\\definecolor{ink}{HTML}{14181D}");
  w("\\definecolor{body}{HTML}{454E57}");
  w("\\hypersetup{colorlinks=true, urlcolor=cold, linkcolor=cold}");
  w("\\pagestyle{empty}");
  w("\\setlength{\\parindent}{0pt}");
  w("\\linespread{0.88}");
  w("\\color{body}");
  w("");
  w("\\titleformat{\\section}");
  w("  {\\normalfont\\scshape\\bfseries\\color{ink}\\normalsize}{}{0pt}{}[\\vspace{-5pt}\\color{cold}\\rule{\\linewidth}{0.7pt}]");
  w("\\titlespacing*{\\section}{0pt}{4pt}{1pt}");
  w("\\newcommand{\\row}[2]{\\textbf{\\color{ink}#1}\\hfill{\\small #2}\\par}");
  w("");
  w("\\begin{document}");
  w("");

  // ---------- encabezado ----------
  w("\\begin{center}");
  w(`  {\\Large\\bfseries\\color{ink} ${tex(cv.title)}}\\\\\[2pt]`);
  w(`  {\\normalsize\\color{cold} ${cv.targets.map(tex).join(dot)}}\\\\\[3pt]`);
  w(`  {\\small ${tex(cv.metaLine)}}\\\\\[2pt]`);
  // Los términos de contratación que el sitio pone en ámbar sobre el pliegue
  // —nivel, inicio, vía— no viajaban en el PDF, que es justo lo que se reenvía
  // sin el enlace que lo trajo. Una línea, de la misma fuente que la portada.
  w(`  {\\small\\color{cold} ${dict.sheet.hire.map((h) => `${tex(h.term)}: ${tex(h.detail)}`).join(dot)}}\\\\\[2pt]`);
  w(
    `  {\\small \\href{${url(`mailto:${dict.profile.email}`)}}{${tex(dict.profile.email)}}${dot}` +
      `\\href{${url(dict.profile.linkedin)}}{${tex(dict.profile.linkedin.replace("https://", ""))}}${dot}` +
      `\\href{${url(dict.profile.github)}}{${tex(dict.profile.github.replace("https://", ""))}}${dot}` +
      `\\href{${url(`${SITE}/${lang}`)}}{${tex(SITE.replace("https://", ""))}}}`,
  );
  w("\\end{center}");
  w("");

  // ---------- perfil ----------
  // Texto propio de la hoja corta, no el de tres páginas: el largo empuja el
  // documento a dos páginas y `check:artifacts` lo rechaza — que es como se
  // descubrió. Recortar aquí, nunca aflojar el margen.
  w(`\\section*{${tex(t.profile)}}`);
  w(tex(cv.profileShortText));
  w("");

  // ---------- el rol cruzado ----------
  // Es el párrafo que explica por qué un economista de finanzas aplica a un
  // puesto de datos. En una hoja que se lee en 30 segundos, esa explicación
  // vale más que una viñeta más de una empresa antigua — pero se dice en
  // cuatro frases, no en nueve.
  w(`\\section*{${tex(t.crossover)}}`);
  w(tex(cv.pivot.shortBody));
  w("");

  // ---------- experiencia ----------
  //
  // La regla del recorte, en un sitio y no repartida por el código:
  //   · las DOS empresas más recientes llevan todos sus roles; el más reciente
  //     con todas sus viñetas y los anteriores con una, la primera, que es la
  //     que el autor puso delante;
  //   · las demás llevan su línea y una viñeta. Existen, se nombran, y algo
  //     dicen — un CV de una página no es un CV amputado.
  w(`\\section*{${tex(t.experience)}}`);
  cv.experience.forEach((company, i) => {
    const recent = i < 2;
    const mode = company.mode === "remote" ? cv.remoteTag : company.mode === "hybrid" ? cv.hybridTag : "";
    // "Remote · remote" es ruido: cuando la sede YA es la modalidad, va una sola
    // vez. La hoja de tres páginas ya lo hacía; esta nació sin el guardia y sacó
    // el duplicado en las dos experiencias remotas.
    const sameAsMode = mode && company.location.toLowerCase() === mode.toLowerCase();
    const right = sameAsMode ? tex(mode) : `${tex(company.location)}${mode ? dot + tex(mode) : ""}`;
    w(`\\row{${tex(company.company)}}{${right}}`);
    if (company.note) w(`{\\small\\itshape\\color{cold} ${tex(company.note)}}\\par`);
    const roles = recent ? company.roles : company.roles.slice(0, 1);
    roles.forEach((role, r) => {
      w(`\\textit{${tex(role.title)}}\\hfill{\\small ${tex(role.period)}}\\par`);
      // La viñeta que se queda es la que lleva una CIFRA, y si no hay, la
      // primera. Antes era siempre la primera, y en el Treasury Analyst la
      // primera decía «automaticé la conciliación» y la segunda «60 horas al
      // mes devueltas al equipo»: la hoja de una página —la que se reenvía—
      // salía sin un solo resultado cuantificado en Experiencia (CO-02).
      const withFigure = role.bullets.find((b) => /\d/.test(b)) ?? role.bullets[0];
      const keep = recent && r === 0 ? role.bullets : withFigure ? [withFigure] : [];
      w("\\begin{itemize}[leftmargin=1em, itemsep=0pt, topsep=1pt, parsep=0pt]");
      for (const b of keep) w(`  \\item ${tex(b)}`);
      w("\\end{itemize}");
    });
    if (i < cv.experience.length - 1) w("\\vspace{2pt}");
  });
  w("");

  // ---------- proyectos e investigación ----------
  w(`\\section*{${tex(t.projects)}}`);
  for (const p of [...cv.projects, ...cv.research]) {
    w(
      `\\row{${tex(p.name)}}{${tex(p.period)}}` +
        `{\\small ${tex(p.stack.slice(0, 6).join(" \u00b7 "))}${dot}\\href{${url(abs(lang, p.href))}}{${tex(p.hrefLabel)}}}\\par`,
    );
    w("\\vspace{1pt}");
  }
  w("");

  // ---------- educación ----------
  w(`\\section*{${tex(t.education)}}`);
  for (const e of cv.education) {
    w(`\\row{${tex(e.title)} \\textnormal{---} ${tex(e.inst)}}{${tex(e.period)}}`);
  }
  // Las certificaciones no salían en la hoja corta, y el Stanford ML es la
  // línea que un screener de datos busca primero.
  w(
    `{\\small\\textbf{\\color{ink}${tex(t.certs)}:} ` +
      cv.certs.map((c) => `${tex(c.title)} (${tex(c.inst)}, ${tex(c.year)})`).join(dot) +
      "}\\par",
  );
  w("");

  // ---------- reconocimientos ----------
  w(`\\section*{${tex(t.awards)}}`);
  for (const a of cv.awards) {
    const label = `${tex(a.title)} \\textnormal{(${tex(a.year)})}`;
    w(`\\row{${a.href ? `\\href{${url(a.href)}}{${label}}` : label}}{}`);
  }
  w("");

  // ---------- stack ----------
  w(`\\section*{${tex(t.stack)}}`);
  w(cv.skillsTech.map((s) => tex(s.name)).join(dot));
  w("");
  w("\\end{document}");

  return L.join("\n") + "\n";
}

for (const lang of ["es", "en"] as const) {
  const out = path.join(outDir, strings[lang].file.replace(".tex", "_1p.tex"));
  fs.writeFileSync(out, buildOnePage(lang), "utf-8");
  console.log(`✓ ${out}`);
}

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // D-33: las imágenes van en <img>. next/image con `unoptimized` no
  // convertía, ni redimensionaba, ni generaba srcset: solo enviaba su runtime.
  // Son WebP con medidas declaradas y `loading="lazy"`; si algún día se quiere
  // optimización real, vuelve next/image SIN `unoptimized` y esta regla se va.
  { rules: { "@next/next/no-img-element": "off" } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

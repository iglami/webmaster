/* Optimiza las obras descargadas (assets/) hacia public/obras/.
   Uso: node scripts/optimize-images.mjs */
import sharp from "sharp";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const ENTRADA = "assets";
const SALIDA = "public/obras";
const LADO_MAX = 1600;

const archivos = readdirSync(ENTRADA).filter((f) => f.endsWith(".jpg"));

for (const archivo of archivos) {
  const info = await sharp(join(ENTRADA, archivo))
    .resize({ width: LADO_MAX, height: LADO_MAX, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true })
    .toFile(join(SALIDA, archivo));
  console.log(`${archivo}: ${(info.size / 1024).toFixed(0)} KB`);
}

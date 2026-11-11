/** @format */

// One-off: rasterize public/og-cover.svg -> public/og-cover.png (1200x630).
// Run: node scripts/render-og-cover.mjs
// Uses @resvg/resvg-js (no browser/Canvas needed).
import { readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const svg = readFileSync(path.join(root, "public", "og-cover.svg"), "utf8");

const resvg = new Resvg(svg, {
  fitTo: { width: 1200, height: 630 },
  font: {
    loadSystemFonts: true,
  },
});

const png = resvg.render().asPng();
writeFileSync(path.join(root, "public", "og-cover.png"), png);

console.log(`Wrote public/og-cover.png (${png.length / 1024 / 1024} MB)`);

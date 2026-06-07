import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const OUT_DIR = new URL('../public/', import.meta.url);

const swatches = [
  ['#0052ff', 0, 0],
  ['#ff2d2d', 1, 0],
  ['#ffd400', 2, 0],
  ['#16a34a', 0, 1],
  ['#050505', 1, 1],
];

function posterSvg(width, height, compact = false) {
  const unit = Math.min(width, height) / 12;
  const blocks = swatches
    .map(([fill, x, y]) => {
      const size = compact ? unit * 2.2 : unit * 2.7;
      return `<rect x="${unit * (1.2 + Number(x) * 3.1)}" y="${unit * (compact ? 5.4 + Number(y) * 2.6 : 6.2 + Number(y) * 3.2)}" width="${size}" height="${size}" fill="${fill}"/>`;
    })
    .join('');

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#f7f6f2"/>
  <rect x="0" y="0" width="${Math.round(width * 0.13)}" height="${height}" fill="#050505"/>
  <rect x="${Math.round(width * 0.13)}" y="0" width="${Math.round(width * 0.03)}" height="${height}" fill="#0052ff"/>
  <text x="${unit * 2.1}" y="${unit * (compact ? 2.4 : 2.8)}" font-family="Arial, Helvetica, sans-serif" font-size="${unit * (compact ? 1.1 : 1.35)}" font-weight="900" fill="#050505">BASE</text>
  <text x="${unit * 2.1}" y="${unit * (compact ? 3.55 : 4.15)}" font-family="Arial, Helvetica, sans-serif" font-size="${unit * (compact ? 1.1 : 1.35)}" font-weight="900" fill="#050505">COLOR</text>
  <text x="${unit * 2.1}" y="${unit * (compact ? 4.7 : 5.5)}" font-family="Arial, Helvetica, sans-serif" font-size="${unit * (compact ? 1.1 : 1.35)}" font-weight="900" fill="#050505">DROP</text>
  ${blocks}
  <line x1="${unit * 2.1}" y1="${height - unit * 1.4}" x2="${width - unit * 1.3}" y2="${height - unit * 1.4}" stroke="#050505" stroke-width="4"/>
</svg>`;
}

await mkdir(OUT_DIR, { recursive: true });

await Promise.all([
  sharp(Buffer.from(posterSvg(1200, 630)))
    .png()
    .toFile(fileURLToPath(new URL('miniapp-preview.png', OUT_DIR))),
  sharp(Buffer.from(posterSvg(1284, 2778)))
    .png()
    .toFile(fileURLToPath(new URL('screenshot.png', OUT_DIR))),
  sharp(Buffer.from(posterSvg(1024, 1024, true)))
    .png()
    .toFile(fileURLToPath(new URL('icon.png', OUT_DIR))),
  sharp(Buffer.from(posterSvg(200, 200, true)))
    .png()
    .toFile(fileURLToPath(new URL('splash.png', OUT_DIR))),
]);

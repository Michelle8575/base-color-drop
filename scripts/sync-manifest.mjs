import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const envPath = new URL('.env', root);
const localEnvPath = new URL('.env.local', root);
const manifestPath = new URL('public/.well-known/farcaster.json', root);

function parseEnv(input) {
  return Object.fromEntries(
    input
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const index = line.indexOf('=');
        if (index === -1) return [line, ''];
        return [line.slice(0, index), line.slice(index + 1).replace(/^"|"$/g, '')];
      }),
  );
}

async function loadEnv() {
  let values = {};
  try {
    values = { ...values, ...parseEnv(await readFile(envPath, 'utf8')) };
  } catch {}
  try {
    values = { ...values, ...parseEnv(await readFile(localEnvPath, 'utf8')) };
  } catch {}
  return { ...values, ...process.env };
}

const env = await loadEnv();
const vercelUrl = env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL;
const appUrl = (env.NEXT_PUBLIC_APP_URL || (vercelUrl ? `https://${vercelUrl}` : 'https://REPLACE_WITH_DOMAIN')).replace(/\/$/, '');
const ownerAddress =
  env.NEXT_PUBLIC_BASE_BUILDER_OWNER || '0x0000000000000000000000000000000000000000';

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

manifest.baseBuilder = {
  ownerAddress,
};

manifest.miniapp = {
  ...manifest.miniapp,
  homeUrl: appUrl,
  iconUrl: `${appUrl}/icon.png`,
  splashImageUrl: `${appUrl}/splash.png`,
  heroImageUrl: `${appUrl}/miniapp-preview.png`,
  ogImageUrl: `${appUrl}/miniapp-preview.png`,
  screenshotUrls: [`${appUrl}/screenshot.png`],
};

await writeFile(fileURLToPath(manifestPath), `${JSON.stringify(manifest, null, 2)}\n`);

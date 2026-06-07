import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import './globals.css';

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || (vercelUrl ? `https://${vercelUrl}` : 'https://REPLACE_WITH_DOMAIN');
const miniAppEmbed = {
  version: 'next',
  imageUrl: `${appUrl}/miniapp-preview.png`,
  button: {
    title: 'Drop Color',
    action: {
      type: 'launch_miniapp',
      url: appUrl,
      name: 'Base Color Drop',
      splashImageUrl: `${appUrl}/miniapp-preview.png`,
    },
  },
};

export const metadata: Metadata = {
  title: 'Base Color Drop',
  description: 'Vote your latest onchain color on Base.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="6a24ea5095cfa95c11629b79" />
        <meta
          name="talentapp:project_verification"
          content="cdacebe00eff4e524683fd7a5ac2b1bf66431250c91fcf5dcad3c0e2929c2cdb6674b81c47957c9871fdf0398a1a4186b8d3a3bd0ac97c737d6d438795e1d476"
        />
        <meta name="fc:miniapp" content={JSON.stringify(miniAppEmbed)} />
      </head>
      <body className="font-swiss">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

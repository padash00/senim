import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

// cyrillic-ext is critical: Kazakh-specific letters (ә, ғ, қ, ң, ө, ұ, ү, і)
// live in that subset, not in basic cyrillic.
const sans = Inter({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
const display = Manrope({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Сенім", template: "%s · Сенім" },
  description: "Коррекционно-развивающий центр для детей и подростков. Шымкент.",
};

export const viewport: Viewport = {
  themeColor: "#f7f5ef",
  width: "device-width",
  initialScale: 1,
};

// Inline script to set the theme class before paint — eliminates the
// dreaded "flash of light theme" on dark-mode users.
const themeBootstrap = `
(function(){try{
  var k='senim-theme';
  var saved=localStorage.getItem(k);
  var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;
  var dark = saved ? saved==='dark' : prefersDark;
  if(dark) document.documentElement.classList.add('dark');
}catch(e){}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-screen antialiased">
        <div className="scroll-progress" aria-hidden />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meridian — Analytics Dashboard",
  description: "CRM analytics dashboard demo",
};

/** Keep aligned with `ThemeProvider` in `app/providers.tsx` (class, storage key, default, system). Runs via `next/script` so React 19 does not render a client `<script>`. */
const themeBootstrap = `
(function () {
  var d = document.documentElement;
  var w = ["light", "dark"];
  function applyTheme(name) {
    d.classList.remove("light", "dark");
    if (name === "light" || name === "dark") d.classList.add(name);
    if (w.indexOf(name) !== -1) d.style.colorScheme = name;
  }
  function system() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  try {
    var stored = localStorage.getItem("theme") || "dark";
    var resolved = stored === "system" ? system() : stored;
    applyTheme(resolved);
  } catch (e) {}
})();
`.trim();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrap}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

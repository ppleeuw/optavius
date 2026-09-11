import type { Metadata } from "next";
import "./styles/fonts.css";
import "./styles/site.css";
import "./styles/extra.css";
import "./styles/mockups.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.optavius.com"),
  title: "AI voice agents for eye care | Optavius",
  description: "AI voice agents for eye-care providers that answer questions, schedule appointments and handle routine requests, 24/7.",
  icons: { icon: [{ url: "/favicon.ico", sizes: "32x32" }, { url: "/icon.svg", type: "image/svg+xml" }], apple: "/apple-icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="gtamerica_6d0b17ea-module__xVsKFa__variable gtamericamono_7f09841-module__x8mR4a__variable"
      style={{ "--sticky-navigation-height": "72px" } as React.CSSProperties}
    >
      <body className="flex min-h-screen flex-col text-primary antialiased">{children}</body>
    </html>
  );
}

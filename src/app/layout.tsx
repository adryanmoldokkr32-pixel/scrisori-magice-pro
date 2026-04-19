import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScrisoriMagice PRO+",
  description: "Digital Love Letters",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}

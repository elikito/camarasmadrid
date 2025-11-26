import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cámaras Madrid - Visualización de tráfico",
  description: "Mapa interactivo de cámaras de tráfico y radares de Madrid",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

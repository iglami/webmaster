import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "WebMaster: Servicios IT tejidos como las artes",
  description:
    "Agencia de servicios IT sobre Alibaba Cloud: nube, diseño y desarrollo con oficio artesanal. Del hilo a la obra.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

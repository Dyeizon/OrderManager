import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrderManager",
  description: "Gerenciador de Pedidos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

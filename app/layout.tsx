import type { Metadata } from "next";
import { Anonymous_Pro } from "next/font/google";
import "./globals.css";

const anonPro = Anonymous_Pro({
  weight: ["400", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-anon-pro",
});


export const metadata: Metadata = {
  title: "strxdale's catalog | Pakaian Esensial",
  description: "Pilihan terkurasi untuk barang-barang esensial yang tak lekang oleh waktu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className={`${anonPro.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

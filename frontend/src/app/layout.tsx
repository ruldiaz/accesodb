import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; 
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acceso Db",
  description: "Generado por Create Next App and Developed by RHDF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <title>Blockchain tech</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-800 font-[var(--font-geist-sans)]`}
      >
        <div className="flex flex-col min-h-screen">
          <header className="bg-gray-800 text-white p-4 flex items-center">
            <h1 className="text-sm flex-1 text-center font-[var(--font-geist-mono)]">
             <Link href="/">Blockchain Tech App</Link>  
            </h1>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="bg-gray-800 text-white p-4 text-center">
            <p className="text-sm font-[var(--font-geist-mono)]">
              &copy; 2025 Raúl Humberto Díaz Fernández
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}

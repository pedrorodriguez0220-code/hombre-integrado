import "./globals.css";
import { Cormorant_Garamond, Inter } from "next/font/google";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "El Hombre Integrado",
  description: "Un espejo implacable para la expansión de la consciencia.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${sans.variable} ${serif.variable} antialiased bg-[#0a0a0a] text-[#e5e5e5]`}
      >
        {children}
      </body>
    </html>
  );
}

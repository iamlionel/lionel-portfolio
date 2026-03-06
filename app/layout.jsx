import Header from "@/components/Header";
import { LanguageProvider } from "@/context/LanguageContext";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Lionel's Space",
  description:
    "Product Engineer specializing in AI voice interaction and full-stack development.",
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrainsMono",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <LanguageProvider>
          <Header />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

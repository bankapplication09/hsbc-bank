import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BRAND } from "@/lib/constants";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: BRAND,
  description: "HSBC UK personal banking",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

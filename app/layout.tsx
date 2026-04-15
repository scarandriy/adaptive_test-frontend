import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Apex Assessment — Top Manager Evaluation",
  description: "Adaptive competency evaluation platform for executive-level candidates",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-gray-50">
        {/* Nav */}
        <header className="sticky top-0 z-50 h-14 md:h-16 bg-white border-b border-gray-200">
          <div className="flex h-full items-center justify-between px-4 md:px-8 lg:px-12 xl:px-16">
            {/* Logo + name */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[#0056D2]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z"
                    stroke="white" strokeWidth="1.25" fill="rgba(255,255,255,0.2)" />
                  <circle cx="7" cy="7" r="2" fill="white" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-900">Apex Assessment</span>
            </div>

            {/* Right — hidden on mobile */}
            <span className="hidden text-xs font-medium uppercase tracking-widest text-gray-500 md:block">
              Top Manager Evaluation Platform
            </span>
          </div>
        </header>

        <main className="flex flex-1 flex-col">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}

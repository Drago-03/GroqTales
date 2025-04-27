import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { QueryProvider } from "@/components/query-provider";
import { Web3Provider } from "@/components/providers/web3-provider";
import Script from "next/script";
import fs from 'fs';
import path from 'path';
import ClientLayout from "@/components/client-layout";
import Link from "next/link";
import Image from "next/image";

// Optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'sans-serif']
});

// Get quick boot script content
const getQuickBootScript = () => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'quick-boot.js');
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    console.warn('Could not read quick-boot.js:', e);
    return ''; // Return empty string if file reading fails
  }
};

// Quick boot script to prevent flashing and improve initial load
const quickBootScript = getQuickBootScript();

export const metadata = {
  title: "GroqTales - AI-Powered Web3 Storytelling Platform",
  description: "Create and share AI-generated stories powered by blockchain technology",
  // Performance-focused metadata
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" }
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline critical JS for fastest possible execution */}
        <script dangerouslySetInnerHTML={{ __html: quickBootScript }} />
        
        {/* Preload critical resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Optimize for performance */}
        <meta name="color-scheme" content="light dark" />
        
        {/* Performance optimization scripts */}
        <Script id="theme-fix" src="/theme-fix.js" strategy="beforeInteractive" />
        <Script id="performance-fix" src="/performance-fix.js" strategy="afterInteractive" />
      </head>
      <body className={`${inter.className} optimize-paint`}>
        <Web3Provider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange={false}
              storageKey="groqtales-theme"
            >
              <ClientLayout>
                <div className="min-h-screen bg-background flex flex-col">
                  <Header />
                  <main className="container mx-auto px-4 py-6 flex-grow">{children}</main>
                  <Footer />
                </div>
                <Toaster />
              </ClientLayout>
            </ThemeProvider>
          </QueryProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
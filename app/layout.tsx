import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { QueryProvider } from "@/components/query-provider";
import { Web3Provider } from "@/components/providers/web3-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GroqTales - AI-Powered Web3 Storytelling Platform",
  description: "Create and share AI-generated stories powered by blockchain technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Web3Provider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="container mx-auto px-4 py-6 flex-grow">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
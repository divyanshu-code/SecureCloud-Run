import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://securecloud.run"),
  title: "SecureCloud Run - Secure Distributed Code Execution",
  description: "A distributed code execution platform powered by Docker, gVisor, Redis, BullMQ, and Worker Pools. Run untrusted code securely at cloud scale.",
  keywords: ["Code Execution", "Docker Sandbox", "gVisor", "Serverless", "Remote Code Execution"],
  authors: [{ name: "SecureCloud Team" }],
  openGraph: {
    title: "SecureCloud Run",
    description: "Run untrusted code securely at cloud scale.",
    url: "https://securecloud.run",
    siteName: "SecureCloud Run",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SecureCloud Run Architecture",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SecureCloud Run",
    description: "Run untrusted code securely at cloud scale.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#111318', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      </body>
    </html>
  );
}

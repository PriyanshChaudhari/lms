import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/Theme/theme-provider";
import "./globals.css";
import { ModeToggle } from "../components/Theme/toggleTheme";
import Navbar from "@/components/Navbar/navbar";
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "MSU LMS",
    description: "Learning Management System for MSU Baroda",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <Head>
                <title>MSU LMS - Your Learning Management System</title>
                <meta name="description" content="Learning Management System for MSU Baroda" />
                <meta name="keywords" content="MSU LMS, msu-lms,LMS MSU, LMS MSU Baroda, LMS for MSU Baroda, MSU Baroda, msu-lms netlify, msu lms netlify, LMS, Learning Management System, Education, MSU" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="canonical" href="https://msu-lms.netlify.app" />
                <meta property="og:title" content="MSU LMS" />
                <meta property="og:description" content="LMS for MSU Baroda" />
                <meta property="og:url" content="https://msu-lms.netlify.app" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://msu-lms.netlify.app/og-image.jpg" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "MSU LMS",
                        "url": "https://msu-lms.netlify.app",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://msu-lms.netlify.app/search?q={search_term_string}",
                            "query-input": "required name=search_term_string"
                        }
                    })}
                </script>
            </Head>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {/* <ModeToggle /> */}
                    <Navbar />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
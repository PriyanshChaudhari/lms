import React from 'react';
import Head from 'next/head';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Head>
                <title>MSU LMS - Your Learning Management System</title>
                <meta name="description" content="Learning Management System for MSU Baroda" />
                <meta name="keywords" content="LMS, Learning Management System, Education, MSU" />
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
            <header>
                <nav>
                    {/* Add your navigation items here */}
                </nav>
            </header>
            <main>
                {children}
            </main>
            <footer>
                <p>&copy; {new Date().getFullYear()} MSU LMS. All rights reserved.</p>
            </footer>
        </>
    );
};

export default Layout;
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['firebasestorage.googleapis.com'], // Add the Firebase Storage domain
    },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                // Toda vez que acessarmos /api/bot/..., a Vercel vai buscar na Oracle e nos devolver
                source: '/api/bot/:path*',
                destination: 'http://137.131.223.249:3001/api/:path*',
            },
        ];
    },
};

export default nextConfig;

const path = require('path');
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    reactStrictMode: false,
    output: 'standalone',
    pageExtensions: ['jsx', 'js'],
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.resolve(__dirname, './src'),
            '@app': path.resolve(__dirname, './src/app'),
            '@modules': path.resolve(__dirname, './src/modules'),
            '@components': path.resolve(__dirname, './src/components'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@lib': path.resolve(__dirname, './src/lib'),
            // '@locales': path.resolve(__dirname, './src/locales'),
        }
        return config
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
                port: "",
                pathname: "**",
            },
            {
                protocol: "http",
                hostname: "10.147.30.12",
                port: "40107",
                pathname: "/api/crm/racs/file/download/**",
            },
            {
                protocol: "http",
                hostname: "10.141.25.59",
                port: "8081",
                pathname: "/api/crm/racs/file/download/**",
            }
            ,
            {
                protocol: "https",
                hostname: "devnewrplus.korail.com",
                port: "40103",
                pathname: "/api/crm/racs/file/download/**",
            }
            ,
            {
                protocol: "https",
                hostname: "devrailplus.korail.com",
                port: "443",
                pathname: "/api/crm/racs/file/download/**",
            }
        ],
    },
    compiler: {
        styledComponents: true,
        // removeConsole: process.env.NODE_ENV === 'production'
    },
    experimental: {
        workerThreads: false,
        cpus: 1,
        serverActions: {
            bodySizeLimit: '100mb',
        },
    },
};

module.exports = withNextIntl(nextConfig);
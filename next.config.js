/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Tenemos que definir el dominio de las imagenes que queremos
  // que se optimizen y permitan con next/image
  images: {
    domains: ["raw.githubusercontent.com"],
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["postgres"],
  typescript: {
    ignoreBuildErrors: true,
  }
}

export default nextConfig

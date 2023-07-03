/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.(frag|vert|glsl)$/,
      loader: 'glsl-shader-loader',
    });
    return config
  },
}

module.exports = nextConfig

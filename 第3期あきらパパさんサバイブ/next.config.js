/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@mui/material',
    '@mui/system',
    '@mui/utils',
    '@mui/icons-material',
    '@emotion/react',
    '@emotion/styled',
  ],
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'nodemailer'],
    esmExternals: 'loose',
  },
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // サーバーサイドビルドでのESM解決問題を回避
    // 特に @mui/utils などでのディレクトリインポートエラー (ERR_UNSUPPORTED_DIR_IMPORT) 対策
    config.resolve.fullySpecified = false;

    return config;
  },
}

module.exports = nextConfig


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
  serverComponentsExternalPackages: ['mongoose', 'nodemailer'],
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    // ES modulesの解決を改善
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
    };
    // MUIのES modules問題を回避 - ディレクトリインポートを解決
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    // MUI utilsのディレクトリインポート問題を解決
    if (isServer) {
      config.resolve.fullySpecified = false;
    }
    return config;
  },
}

module.exports = nextConfig


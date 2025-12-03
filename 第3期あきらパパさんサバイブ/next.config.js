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
  serverComponentsExternalPackages: ['mongoose', 'nodemailer', '@mui/utils', '@mui/material', '@mui/system'],
  swcMinify: true,
  outputFileTracingIncludes: {
    '/**': ['./node_modules/@mui/**/*'],
  },
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
    // MUIのES modules問題を回避
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
}

module.exports = nextConfig


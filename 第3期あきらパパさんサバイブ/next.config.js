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
    esmExternals: false, // ESモジュールサポートを無効化してCommonJSとして処理させる
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

    // @mui/utils などを強制的に解決するためのエイリアス設定
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mui/material': '@mui/material/node',
      '@mui/icons-material': '@mui/icons-material/node',
      '@mui/system': '@mui/system/node',
      '@mui/utils': '@mui/utils/node',
    };

    return config;
  },
}

module.exports = nextConfig


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
    // esmExternals: false は削除し、デフォルトの挙動に戻す
  },
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
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

    // エイリアス設定を削除し、標準的な解決に戻す
    // 過度なエイリアス設定が内部依存関係の解決を妨げているため

    return config;
  },
}

module.exports = nextConfig


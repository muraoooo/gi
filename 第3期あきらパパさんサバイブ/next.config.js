/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@mui/material',
    '@mui/system',
    '@mui/utils',
    '@mui/icons-material',
    '@mui/x-data-grid',
    '@emotion/react',
    '@emotion/styled',
  ],
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'nodemailer'],
    esmExternals: false,
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

    // Node.js がディレクトリインポートをサポートしないため、MUI内部の一部モジュールをファイル単位で指すようにエイリアスを設定
    const resolveModule = (request) => {
      try {
        return require.resolve(request);
      } catch (error) {
        console.warn(`Failed to resolve ${request}:`, error);
        return request;
      }
    };

    // @mui/utilsのモジュール解決を改善
    // generateUtilityClassesの解決を改善
    try {
      const generateUtilityClassesPath = require.resolve('@mui/utils/generateUtilityClasses/generateUtilityClasses.js');
      config.resolve.alias = {
        ...config.resolve.alias,
        '@mui/utils/formatMuiErrorMessage$': resolveModule('@mui/utils/formatMuiErrorMessage/index.js'),
        '@mui/utils/generateUtilityClasses': generateUtilityClassesPath,
        '@mui/utils/generateUtilityClass$': resolveModule('@mui/utils/generateUtilityClass/generateUtilityClass.js'),
        '@mui/system/colorManipulator$': resolveModule('@mui/system/colorManipulator.js'),
      };
    } catch (error) {
      console.warn('Failed to resolve @mui/utils modules:', error);
      config.resolve.alias = {
        ...config.resolve.alias,
        '@mui/utils/formatMuiErrorMessage$': resolveModule('@mui/utils/formatMuiErrorMessage/index.js'),
        '@mui/utils/generateUtilityClass$': resolveModule('@mui/utils/generateUtilityClass/generateUtilityClass.js'),
        '@mui/system/colorManipulator$': resolveModule('@mui/system/colorManipulator.js'),
      };
    }

    // CSSファイルの解決を設定
    config.resolve.extensions = [
      ...config.resolve.extensions,
      '.css',
    ];

    return config;
  },
}

module.exports = nextConfig


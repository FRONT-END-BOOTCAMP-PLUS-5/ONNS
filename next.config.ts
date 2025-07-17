import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Image domains configuration
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'k.kakaocdn.net', port: '', pathname: '/**' },
      { protocol: 'http', hostname: 'k.kakaocdn.net', port: '', pathname: '/**' },
      // 신규 추가
      { protocol: 'http', hostname: 'img1.kakaocdn.net', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'img1.kakaocdn.net', port: '', pathname: '/**' },
      { protocol: 'http', hostname: 't1.kakaocdn.net', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 't1.kakaocdn.net', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'example.com', port: '', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'fplqqqtqhiuuvszpepfu.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // TurboPack 설정
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // webpack 설정
  webpack: (config) => {
    // @ts-expect-error 타입 에러 무시
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              typescript: true,
              ext: 'tsx',
            },
          },
        ],
      },
    );
    fileLoaderRule.exclude = /\.svg$/i;
    return config;
  },
};

export default nextConfig;

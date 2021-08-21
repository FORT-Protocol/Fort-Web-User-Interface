export default {
    catalogs: [
      {
        path: '<rootDir>/src/locales/{locale}',
        include: ['<rootDir>/src'],
      },
    ],
    fallbackLocales: {
      default: 'en-US',
    },
    format: 'po',
    formatOptions: {
      lineNumbers: false,
    },
    locales: ['en-US', 'zh-CN'],
    rootDir: '.',
    runtimeConfigModule: ['@lingui/core', 'i18n'],
    sourceLocale: 'en-US',
  }
  
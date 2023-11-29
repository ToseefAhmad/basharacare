const jestConfig = {
  transform: {
    // Reproduce the Webpack `graphql-tag/loader` that lets Venia
    // Import `.graphql` files into JS.
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    // Use the default babel-jest for everything else.
    '\\.(jsx?|css)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '!node_modules/react-runtime',
    '/node_modules/(?!@magento).+\\.js$'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png)$': '@magento/venia-ui/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '@magento/venia-drivers': '@magento/venia-ui/lib/drivers/index.js'
  },
  // Include files with zero tests in overall coverage analysis by specifying
  // Coverage paths manually.
  collectCoverage: true,
  collectCoverageFrom: [
    // Code directories
    'src/**/*.js',
    // Not node_modules
    '!**/node_modules/**',
    // Not __tests__, __helpers__, or __any_double_underscore_folders__
    '!**/TestHelpers/**',
    '!**/__[[:alpha:]]*__/**',
    '!**/.*/__[[:alpha:]]*__/**',
    // Not this file itself
    '!jest.config.js'
  ],
  // Don't look for test files in these directories.
  testPathIgnorePatterns: [
    'dist',
    'node_modules',
    '__fixtures__',
    '__helpers__',
    '__snapshots__'
  ]
};

module.exports = jestConfig;
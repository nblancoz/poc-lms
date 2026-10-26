import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowJs: true,
          module: 'esnext',
          target: 'ES2022',
          types: ['jest', '@testing-library/jest-dom'],
        },
      },
    ],
  },
  testMatch: ['<rootDir>/test/**/*.test.(ts|tsx)'],
};

export default config;

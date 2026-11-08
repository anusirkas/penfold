import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    globalSetup: './tests/globalSetup.ts',
    env: { DATABASE_URL: 'file:./test.db' },
    // The test files share one SQLite database, so they must not overlap.
    fileParallelism: false,
  },
})

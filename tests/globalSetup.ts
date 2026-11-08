import { execSync } from 'child_process'
import { rmSync } from 'fs'

// Rebuild the test database from the migrations before every run.
export default function setup() {
  rmSync('prisma/test.db', { force: true })
  rmSync('prisma/test.db-journal', { force: true })
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
  })
}

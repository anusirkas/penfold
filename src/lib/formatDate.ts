// The locale and time zone are fixed so the server and the browser render
// the same text. Otherwise React reports a hydration mismatch.
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

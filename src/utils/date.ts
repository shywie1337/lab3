export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(`${value}T12:00:00`))
}

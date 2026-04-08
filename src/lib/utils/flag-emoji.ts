/**
 * Converts a country code (ISO 3166-1 alpha-2) to a flag emoji
 * @param countryCode - Two-letter country code (e.g., "US", "GB")
 * @returns Flag emoji string
 */
export function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) {
    return '🏳️' // Default flag
  }

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))

  return String.fromCodePoint(...codePoints)
}


/**
 * Generate a random alphanumeric short code for QR codes
 * Format: 6 characters, lowercase letters and numbers (e.g., 'abc123')
 */
export function generateShortCode(length: number = 6): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return result
}

/**
 * Check if a short code is unique in the database
 * Returns a unique short code after checking for collisions
 */
export async function generateUniqueShortCode(
    checkExists: (code: string) => Promise<boolean>
): Promise<string> {
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
        const code = generateShortCode()
        const exists = await checkExists(code)

        if (!exists) {
            return code
        }

        attempts++
    }

    // If we can't find a unique code in 10 attempts, use a longer code
    return generateShortCode(8)
}

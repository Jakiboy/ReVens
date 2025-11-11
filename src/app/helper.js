/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 2.0.0
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

export function generateSlug(name) {

    if (typeof name !== 'string') {
        throw new Error('Input must be a string');
    }

    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

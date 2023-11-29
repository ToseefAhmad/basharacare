export const CRYPTO_ALGORITHM_SHA_1 = 'SHA-1';
export const CRYPTO_ALGORITHM_SHA_256 = 'SHA-256';
export const CRYPTO_ALGORITHM_SHA_384 = 'SHA-384';
export const CRYPTO_ALGORITHM_SHA_512 = 'SHA-512';

/**
 * Use built-in SubtleCrypto.digest() to generate cryptographic hashes
 * Must be used in secure context (https)!
 *
 * @param {string} str
 * @param {('SHA-1'|'SHA-256'|'SHA-384'|'SHA-512')} algorithm
 * @returns {Promise<string>}
 */
export const createHash = async (str = '', algorithm = CRYPTO_ALGORITHM_SHA_256) => {
    if (location.protocol !== 'https:') {
        console.warn('crypto is not available in unsecure context. Switch to https protocol');

        return str;
    }

    const encoder = new globalThis.TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await globalThis.crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new globalThis.Uint8Array(hashBuffer));

    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const createHashSha1 = async str => createHash(str, CRYPTO_ALGORITHM_SHA_1);
export const createHashSha256 = async str => createHash(str, CRYPTO_ALGORITHM_SHA_256);
export const createHashSha384 = async str => createHash(str, CRYPTO_ALGORITHM_SHA_384);
export const createHashSha512 = async str => createHash(str, CRYPTO_ALGORITHM_SHA_512);

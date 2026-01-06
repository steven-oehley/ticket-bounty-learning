// =============================================================================
// src/features/password/utils/hash-and-verify.ts
// PURPOSE: Secure password hashing using Argon2id
// =============================================================================

import { hash, verify } from '@node-rs/argon2';

/**
 * Hashes a password using Argon2id.
 *
 * WHY ARGON2ID?
 * - Winner of the Password Hashing Competition (2015)
 * - Designed to be SLOW and MEMORY-INTENSIVE
 * - This makes brute-force attacks expensive
 *
 * CONFIGURATION EXPLAINED:
 *
 * memoryCost: 19456 (KB)
 *   └── Uses ~19MB of RAM per hash
 *   └── GPUs have limited memory per core
 *   └── This makes GPU attacks expensive
 *
 * timeCost: 2
 *   └── Number of iterations
 *   └── Higher = slower = more secure
 *   └── 2 is the OWASP minimum recommendation
 *
 * outputLen: 32
 *   └── 256-bit output hash
 *   └── Standard cryptographic strength
 *
 * parallelism: 1
 *   └── Single-threaded hashing
 *   └── Simpler, still secure
 *
 * THESE ARE OWASP-RECOMMENDED SETTINGS for Argon2id.
 */
export const hashPassword = async (password: string) => {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
};

/**
 * Verifies a password against a stored hash.
 *
 * HOW IT WORKS:
 * 1. Extract salt and parameters from stored hash
 * 2. Hash the provided password with same parameters
 * 3. Compare using constant-time comparison (prevents timing attacks)
 *
 * CONSTANT-TIME COMPARISON:
 * Regular === stops comparing at first different character.
 * Attacker could time responses to guess characters.
 * Argon2's verify() compares ALL characters in same time.
 *
 * @param passwordHash - The stored hash (from database)
 * @param password - The password to verify (from user input)
 * @returns true if password matches, false otherwise
 */
export const verifyPasswordHash = async (passwordHash: string, password: string) => {
  return await verify(passwordHash, password);
};

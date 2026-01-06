// =============================================================================
// src/utils/crypto.ts
// PURPOSE: Low-level cryptographic utilities for token generation and hashing
// =============================================================================

import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';

/**
 * Generates a cryptographically secure random token.
 *
 * WHAT THIS DOES:
 * 1. Creates 20 random bytes (160 bits of entropy)
 * 2. Encodes them as Base32 (URL-safe, case-insensitive)
 *
 * WHY 20 BYTES?
 * - 160 bits = 2^160 possible values
 * - That's 1,461,501,637,330,902,918,203,684,832,716,283,019,655,932,542,976 possibilities
 * - Effectively impossible to guess or brute-force
 *
 * WHY BASE32?
 * - URL-safe (no + or / like Base64)
 * - Case-insensitive (no confusion between 'O' and '0')
 * - Human-readable if needed for debugging
 *
 * EXAMPLE OUTPUT: "k77wey6ozggqzzkq5v6n3t4cau"
 */
export const generateRandomToken = () => {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes); // Web Crypto API - available in Node 20+
  return encodeBase32LowerCaseNoPadding(bytes);
};

/**
 * Hashes a token using SHA-256.
 *
 * THIS IS THE KEY SECURITY PATTERN:
 *
 * Browser Cookie: "k77wey6ozggqzzkq5v6n3t4cau"  ← What user has
 *                          ↓ SHA-256 hash
 * Database ID:    "a1b2c3d4e5f6..."              ← What we store
 *
 * WHY HASH BEFORE STORING?
 * If an attacker dumps your database, they see:
 * - HASHED session IDs (useless without the original token)
 * - They CANNOT reverse SHA-256 to get the cookie value
 * - They CANNOT forge sessions
 *
 * ANALOGY: It's like storing password hashes instead of passwords.
 * Even if the database leaks, user sessions are safe.
 */
export const hashToken = (token: string) => {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
};

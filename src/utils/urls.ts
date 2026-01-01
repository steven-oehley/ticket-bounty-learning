export const getBaseUrl = () => {
  // Know what current env is prod or dev
  const environment = process.env.NODE_ENV;

  const baseUrl =
    environment === 'development'
      ? 'http://localhost:3000'
      : `https://${process.env.NEXT_PUBLIC_BASE_URL}`;

  return baseUrl;
};

// Automatically avaiolable env variables from hosting provider, framewrok or node env.
// No need to define them in env file - wow!

// VERCEL_
// NEXT_
// NODE_ENV

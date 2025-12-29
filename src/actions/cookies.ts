'use server';

import { cookies } from 'next/headers';

export const setCookieByKey = async (key: string, value: string) => {
  const cookieJar = await cookies();
  cookieJar.set(key, value);
};

export const getCookieByKey = async (key: string) => {
  const cookieJar = await cookies();
  const foundCookie = cookieJar.get(key);
  if (!foundCookie) {
    return null;
  }
  return foundCookie.value;
};

export const deleteCookieByKey = async (key: string) => {
  const cookieJar = await cookies();
  cookieJar.delete(key);
};

export const consumeCookieByKey = async (key: string) => {
  const foundCookieValue = await getCookieByKey(key);
  if (!foundCookieValue) {
    return null;
  }
  await deleteCookieByKey(key);

  return foundCookieValue;
};

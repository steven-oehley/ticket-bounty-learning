'use client';

import { useEffect } from 'react';

import { toast } from 'sonner';

import { consumeCookieByKey } from '@/actions/cookies';

const RedirectToast = () => {
  useEffect(() => {
    const showCookieToast = async () => {
      const toastMessage = await consumeCookieByKey('toastMessage');
      if (toastMessage) {
        toast.success(toastMessage);
      }
    };

    showCookieToast();
  }, []);

  return null;
};
export default RedirectToast;

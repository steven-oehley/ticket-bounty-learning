'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { toast } from 'sonner';

import { consumeCookieByKey } from '@/actions/cookies';

const RedirectToast = () => {
  const pathname = usePathname();
  useEffect(() => {
    const showCookieToast = async () => {
      const toastMessage = await consumeCookieByKey('toastMessage');
      if (toastMessage) {
        toast.success(toastMessage);
      }
    };

    showCookieToast();
  }, [pathname]);

  return null;
};
export default RedirectToast;

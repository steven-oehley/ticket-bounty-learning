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
      const toastErrorMessage = await consumeCookieByKey('toastErrorMessage');

      if (toastMessage) {
        toast.success(toastMessage);
      }

      if (toastErrorMessage) {
        toast.error(toastErrorMessage, { className: 'bg-destructive text-destructive-foreground' });
      }
    };

    showCookieToast();
  }, [pathname]);

  return null;
};
export default RedirectToast;

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { type User as AuthUser } from 'lucia';

import { getAuth } from '../actions/get-auth';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { user } = await getAuth();
      setUser(user);
      setIsLoading(false);
    };

    getUser();
  }, [pathname]); // re-fetch when route changes

  return { user, isLoading };
};

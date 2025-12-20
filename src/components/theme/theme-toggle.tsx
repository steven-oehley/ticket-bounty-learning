'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { LucideMoon, LucideSun } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Button className="cursor-pointer" size="icon" variant="outline" onClick={handleToggle}>
      {theme === 'light' ? <LucideMoon className="h-4 w-4" /> : <LucideSun className="h-4 w-4" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

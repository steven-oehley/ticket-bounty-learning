import React from 'react';

import { LucideBook, LucideLibrary } from 'lucide-react';

import { homePath, ticketsPath } from '@/constants/paths';

export type NavItem = {
  title: string;
  icon: React.ReactElement;
  href: string;
};

export const navItems: NavItem[] = [
  {
    title: 'All Tickets',
    icon: <LucideLibrary />,
    href: homePath,
  },
  {
    title: 'My Tickets',
    icon: <LucideBook />,
    href: ticketsPath,
  },
];

'use client';

import { useFormStatus } from 'react-dom';

import { LucideLoader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './ui/button';

interface SubmitBtnProps {
  className?: string;
  label: string;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link' | 'secondary';
}

const SubmitBtn = ({ className, label, variant }: SubmitBtnProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      className={cn('w-full', { className })}
      disabled={pending}
      type="submit"
      variant={variant}
    >
      {pending ? <LucideLoader2 className="animate-spin" /> : label}
    </Button>
  );
};
export default SubmitBtn;

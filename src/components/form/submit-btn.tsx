'use client';

import { useFormStatus } from 'react-dom';

import { LucideLoader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

interface SubmitBtnProps {
  className?: string;
  label: string;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link' | 'secondary';
  isDisabled?: boolean;
}

const SubmitBtn = ({ className, label, variant, isDisabled }: SubmitBtnProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      className={cn('w-full cursor-pointer', { className })}
      disabled={isDisabled}
      type="submit"
      variant={variant}
    >
      {pending ? <LucideLoader2 className="animate-spin" /> : label}
    </Button>
  );
};
export default SubmitBtn;

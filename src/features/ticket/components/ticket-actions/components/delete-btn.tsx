'use client';

import { useFormStatus } from 'react-dom';

import { LucideLoader2, LucideTrash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

const DeleteBtn = () => {
  const { pending } = useFormStatus();
  return (
    <Button className="cursor-pointer" size="icon" variant="outline">
      {pending ? <LucideLoader2 /> : <LucideTrash2 />}
    </Button>
  );
};
export default DeleteBtn;

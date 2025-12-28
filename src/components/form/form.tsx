import { useMemo } from 'react';
import NextForm from 'next/form';

import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import useActionFeedback, { type UseActionFeedbackOptions } from './hooks/use-action-feedback';
import { type ActionState } from './utils/to-action-state';

interface FormProps {
  action: (payload: FormData) => void;
  children?: React.ReactNode;
  actionState: ActionState;
  className?: string;
}

const Form = ({ action, children, actionState, className }: FormProps) => {
  const feedbackOptions = useMemo<UseActionFeedbackOptions>(
    () => ({
      onSuccess: ({ actionState }) => {
        if (actionState.message) {
          toast.success(actionState.message);
        }
      },
      onError: ({ actionState }) => {
        if (actionState.message) {
          toast.error(actionState.message);
        }
      },
    }),
    []
  );

  useActionFeedback(actionState, feedbackOptions);

  return (
    <NextForm action={action} className={cn('flex flex-col gap-y-2', className)}>
      {children}
    </NextForm>
  );
};

export default Form;

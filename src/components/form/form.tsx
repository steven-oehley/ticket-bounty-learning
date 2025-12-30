import NextForm from 'next/form';

import { cn } from '@/lib/utils';

import useActionFeedback from './hooks/use-action-feedback';
import { type ActionState } from './utils/to-action-state';

interface FormProps {
  action: (payload: FormData) => void;
  children?: React.ReactNode;
  actionState: ActionState;
  className?: string;
  onSuccess?: (actionState: ActionState) => void;
  onError?: (actionState: ActionState) => void;
}

const Form = ({ action, children, actionState, className, onError, onSuccess }: FormProps) => {
  useActionFeedback(actionState, onSuccess, onError);

  return (
    <NextForm action={action} className={cn('flex flex-col gap-y-2', className)}>
      {children}
    </NextForm>
  );
};

export default Form;

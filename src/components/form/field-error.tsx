import { LucideMessageSquareWarning } from 'lucide-react';

import { type ActionState } from './utils/to-action-state';

interface FieldErrorProps {
  actionState: ActionState;
  name: string;
}

const FieldError = ({ actionState, name }: FieldErrorProps) => {
  const message = actionState.fieldErrors?.[name]?.[0];

  if (!message) {
    return null;
  }

  return (
    <span className="text-destructive bg-destructive/30 rounded-3xl px-2 py-1 text-xs">
      <LucideMessageSquareWarning className="mr-2 inline h-4 w-4" />
      {message}
    </span>
  );
};
export default FieldError;

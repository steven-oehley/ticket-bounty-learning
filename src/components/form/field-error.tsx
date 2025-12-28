import { LucideMessageSquareWarning } from 'lucide-react';

interface FieldErrorProps {
  message: string;
}

const FieldError = ({ message }: FieldErrorProps) => {
  return (
    <span className="text-destructive bg-destructive/30 rounded-3xl px-2 py-1 text-xs">
      <LucideMessageSquareWarning className="mr-2 inline h-4 w-4" />
      {message}
    </span>
  );
};
export default FieldError;

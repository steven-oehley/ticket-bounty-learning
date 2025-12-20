import { type LucideIcon, LucideMessageSquareWarning } from 'lucide-react';

type PlaceholderProps = {
  label: string;
  Icon?: LucideIcon;
  button?: React.ReactNode;
};

const Placeholder = ({ label, Icon = LucideMessageSquareWarning, button }: PlaceholderProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-2 self-center">
      <Icon className="h-16 w-16" />
      <h2 className="text-center text-lg">{label}</h2>
      {button && <div className="h-10">{button}</div>}
    </div>
  );
};

export { Placeholder };

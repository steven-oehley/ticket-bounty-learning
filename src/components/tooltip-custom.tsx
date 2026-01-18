import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TooltipCustomProps {
  children: React.ReactNode;
  message: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const TooltipCustom = ({ children, message, side = 'right' }: TooltipCustomProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent side={side}>
        <p>{message}</p>
      </TooltipContent>
    </Tooltip>
  );
};
export default TooltipCustom;

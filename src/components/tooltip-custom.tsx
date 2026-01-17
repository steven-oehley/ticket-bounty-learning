import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TooltipCustomProps {
  children: React.ReactNode;
  message: string;
}

const TooltipCustom = ({ children, message }: TooltipCustomProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent side="right">
        <p>{message}</p>
      </TooltipContent>
    </Tooltip>
  );
};
export default TooltipCustom;

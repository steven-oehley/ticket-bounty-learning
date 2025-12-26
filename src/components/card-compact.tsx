import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardCompactProps {
  title: string;
  description: string;
  className?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const CardCompact = ({ title, description, footer, className, children }: CardCompactProps) => {
  return (
    <Card className={cn('w-full max-w-105 self-center', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};
export default CardCompact;

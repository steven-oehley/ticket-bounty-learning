import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CardCompactProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const CardCompact = ({ title, description, children }: CardCompactProps) => {
  return (
    <Card className="w-full max-w-105 self-center">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
export default CardCompact;

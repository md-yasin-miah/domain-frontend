import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

export default function PaymentEscrow() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Payment Escrow
        </CardTitle>
        <CardDescription>
          Payment escrow system coming soon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This feature is currently under development and will be available in a future update.
        </p>
      </CardContent>
    </Card>
  );
}

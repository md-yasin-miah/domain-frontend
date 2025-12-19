import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store } from 'lucide-react';

export default function MarketplaceAdmin() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Marketplace Admin
          </CardTitle>
          <CardDescription>
            Marketplace management system coming soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This feature is currently under development and will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

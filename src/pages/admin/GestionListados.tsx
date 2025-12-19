import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { List } from 'lucide-react';

export default function GestionListados() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Gestión de Listados
          </CardTitle>
          <CardDescription>
            Listings management system coming soon
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

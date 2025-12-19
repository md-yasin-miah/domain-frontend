import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';

export default function AdminDashboardStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Dashboard Statistics
        </CardTitle>
        <CardDescription>
          Analytics and statistics coming soon
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

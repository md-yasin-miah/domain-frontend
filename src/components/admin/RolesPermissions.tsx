import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function RolesPermissions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Roles & Permissions
        </CardTitle>
        <CardDescription>
          Advanced role management coming soon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This feature is currently under development. Please use the User Management page for now.
        </p>
      </CardContent>
    </Card>
  );
}

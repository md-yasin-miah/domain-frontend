import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Image } from 'lucide-react';

export default function MediaLibrary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Media Library
        </CardTitle>
        <CardDescription>
          Media management system coming soon
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

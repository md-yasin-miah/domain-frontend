import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DomainsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-9 w-48" />
          </div>
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Search Skeleton */}
      <div className="relative mb-6">
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Tabs Skeleton */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" disabled>
            <Skeleton className="h-5 w-16" />
          </TabsTrigger>
          <TabsTrigger value="active" disabled>
            <Skeleton className="h-5 w-20" />
          </TabsTrigger>
          <TabsTrigger value="expiring" disabled>
            <Skeleton className="h-5 w-24" />
          </TabsTrigger>
          <TabsTrigger value="expired" disabled>
            <Skeleton className="h-5 w-20" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Skeleton className="w-3 h-3 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-6 w-64 mb-2" />
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-28 rounded-full" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Domain Info Skeleton */}
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-40" />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* DNS Info Skeleton */}
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-40" />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-9 w-full" />
                    </div>

                    {/* Actions Skeleton */}
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-32" />
                      <div className="space-y-2">
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-9 w-full" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Individual Domain Card Skeleton (for use in lists)
export function DomainCardSkeleton() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="w-3 h-3 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-6 w-64 mb-2" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Domain Info Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          </div>

          {/* DNS Info Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-9 w-full" />
          </div>

          {/* Actions Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Header Skeleton (for use when only header is loading)
export function DomainsHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-9 w-48" />
        </div>
        <Skeleton className="h-5 w-80" />
      </div>
      <Skeleton className="h-10 w-40" />
    </div>
  );
}

// Search Skeleton
export function DomainsSearchSkeleton() {
  return (
    <div className="relative mb-6">
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

// Tabs Skeleton
export function DomainsTabsSkeleton() {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all" disabled>
          <Skeleton className="h-5 w-16" />
        </TabsTrigger>
        <TabsTrigger value="active" disabled>
          <Skeleton className="h-5 w-20" />
        </TabsTrigger>
        <TabsTrigger value="expiring" disabled>
          <Skeleton className="h-5 w-24" />
        </TabsTrigger>
        <TabsTrigger value="expired" disabled>
          <Skeleton className="h-5 w-20" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}


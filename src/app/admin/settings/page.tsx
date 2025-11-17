'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Settings</h1>
       <Card>
            <CardHeader>
                <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-40 w-full flex items-center justify-center text-muted-foreground">
                   Admin settings form will be implemented here.
                </div>
            </CardContent>
        </Card>
    </div>
  );
}

"use client";

import RoleGate from "@/components/RoleGate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function AdminPage() {
  return (
    <>
      <div className="container mt-6">
        <p className="text-3xl font-bold">Admin</p>
        <p className="mt-2 text-muted-foreground">
          You will only see the component below if you have the admin role.
        </p>
        <p className="mt-2 text-muted-foreground">
          <span className="font-bold">Add the admin role</span> on the
          <span className="font-bold"> user&apos;s public metadata</span> on
          Clerk.
        </p>
        <p className="mt-2 text-muted-foreground">
          Read the <span className="font-bold">README.md</span> file for more
          information.
        </p>

        <div className="mt-8">
          <RoleGate allowedRoles={["admin"]}>
            <Card className="max-w-md border-primary/50 bg-primary/5">
              <CardHeader className="flex flex-row items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <CardTitle className="text-primary">Admin Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">You are in fact an admin! 🎉</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  This card is only visible to users with the admin role.
                </p>
              </CardContent>
            </Card>
          </RoleGate>
        </div>
      </div>
    </>
  );
}

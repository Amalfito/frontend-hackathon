import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLoginForm } from "@/components/admin-login-form";
import { ADMIN_COOKIE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const c = await cookies();
  if (c.get(ADMIN_COOKIE)?.value) redirect("/admin");

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          {"// ZONE RESTREINTE"}
        </p>
        <h1 className="font-mono text-2xl font-bold text-primary text-glow">
          PORTAIL MAÎTRE DU JEU
        </h1>
      </div>
      <Card className="terminal-glow border-primary/30">
        <CardHeader>
          <CardTitle className="font-mono text-sm text-muted-foreground">
            Authentification requise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminLoginForm />
        </CardContent>
      </Card>
    </div>
  );
}

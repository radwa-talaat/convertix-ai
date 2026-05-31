import Link from "next/link";

import { loginAction } from "@/app/(auth)/actions";
import { AuthShell } from "@/components/layout/auth-shell";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LoginPageProps = {
  searchParams: {
    message?: string;
    next?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <AuthShell
      description="Use your account to access protected SaaS routes."
      title="Welcome back"
    >
      {searchParams.message ? (
        <Alert className="mb-4">{searchParams.message}</Alert>
      ) : null}
      <form action={loginAction} className="space-y-4">
        <input name="next" type="hidden" value={searchParams.next ?? ""} />
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <Input
            autoComplete="email"
            id="email"
            name="email"
            placeholder="you@company.com"
            required
            type="email"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <Input
            autoComplete="current-password"
            id="password"
            minLength={8}
            name="password"
            required
            type="password"
          />
        </div>
        <Button className="w-full" type="submit">
          Login
        </Button>
      </form>
      <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
        <Link className="hover:text-foreground" href="/register">
          Create account
        </Link>
        <Link className="hover:text-foreground" href="/forgot-password">
          Forgot password
        </Link>
      </div>
    </AuthShell>
  );
}

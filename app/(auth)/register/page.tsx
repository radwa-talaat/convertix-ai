import Link from "next/link";

import { registerAction } from "@/app/(auth)/actions";
import { AuthShell } from "@/components/layout/auth-shell";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RegisterPageProps = {
  searchParams: {
    message?: string;
  };
};

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  return (
    <AuthShell
      description="Create your workspace identity before accessing protected pages."
      title="Create account"
    >
      {searchParams.message ? (
        <Alert className="mb-4">{searchParams.message}</Alert>
      ) : null}
      <form action={registerAction} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="fullName">
            Full name
          </label>
          <Input
            autoComplete="name"
            id="fullName"
            name="fullName"
            required
            type="text"
          />
        </div>
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
            autoComplete="new-password"
            id="password"
            minLength={8}
            name="password"
            required
            type="password"
          />
        </div>
        <Button className="w-full" type="submit">
          Register
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-medium text-foreground" href="/login">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}

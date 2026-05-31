import Link from "next/link";

import { forgotPasswordAction } from "@/app/(auth)/actions";
import { AuthShell } from "@/components/layout/auth-shell";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ForgotPasswordPageProps = {
  searchParams: {
    message?: string;
  };
};

export default function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  return (
    <AuthShell
      description="Receive secure password recovery instructions by email."
      title="Reset password"
    >
      {searchParams.message ? (
        <Alert className="mb-4">{searchParams.message}</Alert>
      ) : null}
      <form action={forgotPasswordAction} className="space-y-4">
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
        <Button className="w-full" type="submit">
          Send reset link
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link className="font-medium text-foreground" href="/login">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}

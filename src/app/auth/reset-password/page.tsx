import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthFlow } from "@/components/auth-flow";

export const metadata: Metadata = { title: "Reset password" };

type ResetPasswordPageProps = {
  searchParams: Promise<{ email?: string | string[]; token?: string | string[] }>;
};

async function ResetPasswordContent({ searchParams }: ResetPasswordPageProps) {
  const parameters = await searchParams;
  const email = typeof parameters.email === "string" ? parameters.email : "";
  const token = typeof parameters.token === "string" ? parameters.token : "";
  return <AuthFlow mode="reset-password" initialEmail={email} initialToken={token} />;
}

export default function ResetPasswordPage(props: ResetPasswordPageProps) {
  return (
    <Suspense fallback={<AuthFlow mode="reset-password" />}>
      <ResetPasswordContent searchParams={props.searchParams} />
    </Suspense>
  );
}

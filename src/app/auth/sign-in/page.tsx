import type { Metadata } from "next";
import { AuthFlow } from "@/components/auth-flow";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return <AuthFlow mode="sign-in" />;
}

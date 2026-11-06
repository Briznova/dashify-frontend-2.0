import type { Metadata } from "next";
import { AuthFlow } from "@/components/auth-flow";

export const metadata: Metadata = { title: "Create an account" };

export default function SignUpPage() {
  return <AuthFlow mode="sign-up" />;
}

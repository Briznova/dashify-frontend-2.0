import type { Metadata } from "next";
import { AuthFlow } from "@/components/auth-flow";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return <AuthFlow mode="forgot-password" />;
}

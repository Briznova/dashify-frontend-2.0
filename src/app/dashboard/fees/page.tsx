import type { Metadata } from "next";
import { FeesDirectory } from "@/components/school-extras";

export const metadata: Metadata = { title: "Fees & payments" };

export default function FeesPage() {
  return <FeesDirectory />;
}

import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dashify — Find your flow",
    template: "%s | Dashify",
  },
  description:
    "A clearer workspace for your business, projects, and people. Bring your team and insights together with Dashify.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={roboto.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}

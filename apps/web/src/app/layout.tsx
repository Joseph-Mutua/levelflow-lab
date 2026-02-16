import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Level FlowLab",
  description: "Simulation and debugging workspace for RMM automations"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

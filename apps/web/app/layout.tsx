import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata = {
  title: "TruTravel",
  description: "Segment-first group travel — matched, not just booked.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body style={{ fontFamily: "var(--font-plus-jakarta), var(--font-sans)" }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

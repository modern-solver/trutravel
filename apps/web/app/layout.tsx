import type { ReactNode } from "react";

export const metadata = {
  title: "TruTravel",
  description: "Segment-first group travel — matched, not just booked.",
};

/**
 * Minimal root layout. P2's design tokens / brand shell (docs/design/key-screens.md,
 * docs/design/ui-principles.md) are not implemented here — this ticket builds the API surface
 * those screens call, not the React implementation of the screens themselves (see
 * docs/architecture/platform-architecture.md §11).
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

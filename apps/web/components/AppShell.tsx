import Link from "next/link";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="shell-header">
        <div className="container shell-header-inner">
          <Link href="/" className="brand-mark" aria-label="TruTravel home">
            TruTravel
            <span>matched group travel</span>
          </Link>
          <nav className="shell-nav" aria-label="Primary">
            <Link href="/">Discover</Link>
            <Link href="/profile">Profile</Link>
            <Link href="/auth/login">Log in</Link>
            <Link href="/auth/signup" className="btn btn-secondary">
              Sign up
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </>
  );
}

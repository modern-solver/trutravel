import { SignupForm } from "@/components/AuthForms";

export default function SignupPage() {
  return (
    <main className="container">
      <div className="auth-card">
        <h1 className="t-h1" style={{ marginTop: 0 }}>
          Sign up
        </h1>
        <p className="t-meta">Age gate runs once here — never re-asked per booking.</p>
        <SignupForm />
      </div>
    </main>
  );
}

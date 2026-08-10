import { LoginForm } from "@/components/AuthForms";

export default function LoginPage() {
  return (
    <main className="container">
      <div className="auth-card">
        <h1 className="t-h1" style={{ marginTop: 0 }}>
          Log in
        </h1>
        <p className="t-meta">Email + password for this slice. Phone OTP path remains on the API.</p>
        <LoginForm />
      </div>
    </main>
  );
}

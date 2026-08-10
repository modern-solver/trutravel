"use client";

import { useState, type FormEvent } from "react";

export function WaitlistForm({ segmentName }: { segmentName: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, segmentName }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Could not save your request.");
        return;
      }
      setStatus("done");
      setMessage("You're on the list. We'll notify you when this catalog opens.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error — try again.");
    }
  }

  return (
    <form className="form-stack" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="waitlist-email">Email</label>
        <input
          id="waitlist-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <button className="btn btn-primary" type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : "Get notified"}
      </button>
      {message ? (
        <p className={status === "error" ? "field-error" : "form-note"} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}

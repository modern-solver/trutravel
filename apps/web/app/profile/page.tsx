import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@trutravel/db";
import { ProfileTagsForm } from "@/components/ProfileTagsForm";
import { getSession } from "@/lib/get-session";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = getSession();
  if (!session) redirect("/auth/login?next=/profile");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { thrillingProfile: true, trippyProfile: true, profile: true },
  });

  if (!user) redirect("/auth/signup");

  return (
    <main className="container" style={{ paddingBottom: 64 }}>
      <header className="page-header">
        <h1 className="t-h1" style={{ margin: 0 }}>
          Profile
        </h1>
        <p className="t-meta" style={{ margin: "8px 0 0" }}>
          {user.email ?? user.phone} · self-declared tags feed matching and the trip comparison module.
        </p>
      </header>

      <div style={{ display: "grid", gap: 24, maxWidth: 720 }}>
        <section className="detail-panel">
          <h2>Thrilling declarations</h2>
          <ProfileTagsForm
            segment="thrilling_tours"
            initial={{
              skillLevel: user.thrillingProfile?.skillLevel ?? null,
              fitnessLevel: user.thrillingProfile?.fitnessLevel ?? null,
              riskAppetite: user.thrillingProfile?.riskAppetite ?? null,
            }}
          />
        </section>

        <section className="detail-panel">
          <h2>Trippy declarations</h2>
          <ProfileTagsForm
            segment="trippy_tours"
            initial={{
              pacePreference: user.trippyProfile?.pacePreference ?? null,
              groupSizePref: user.trippyProfile?.groupSizePref ?? null,
              noiseEnergy: user.trippyProfile?.noiseEnergy ?? null,
              spiritualOpenness: user.trippyProfile?.spiritualOpenness ?? null,
              photographyComfort: user.trippyProfile?.photographyComfort ?? null,
            }}
          />
        </section>

        <p className="form-note">
          Emergency contact and waiver are collected in the booking flow.{" "}
          <Link href="/">Back to Discover</Link>
        </p>
      </div>
    </main>
  );
}

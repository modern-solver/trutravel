import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@trutravel/db";
import { BookingFlow } from "@/components/BookingFlow";
import { getSession } from "@/lib/get-session";

export const dynamic = "force-dynamic";

export default async function BookTripPage({ params }: { params: { tripId: string } }) {
  const session = getSession();
  if (!session) {
    redirect(`/auth/login?next=/trips/${params.tripId}/book`);
  }

  const trip = await prisma.trip.findUnique({
    where: { id: params.tripId },
    include: {
      partner: true,
      departures: { orderBy: { dateStart: "asc" } },
    },
  });

  if (!trip || !trip.isPublished) notFound();
  if (trip.segment !== "thrilling_tours" && trip.segment !== "trippy_tours") notFound();

  const departure = trip.departures[0];
  if (!departure) {
    return (
      <main className="container">
        <div className="empty-state" style={{ marginTop: 48 }}>
          <p className="t-h3">No open departure to book.</p>
          <Link href={`/trips/${trip.id}`}>Back to trip</Link>
        </div>
      </main>
    );
  }

  const confirmedSeatCount = await prisma.seat.count({
    where: { departureId: departure.id, state: "confirmed" },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { thrillingProfile: true, trippyProfile: true },
  });

  const hasSelfDeclaration =
    trip.segment === "thrilling_tours" ? !!user?.thrillingProfile : !!user?.trippyProfile;

  return (
    <main className="container" style={{ paddingTop: 32 }}>
      <p className="t-meta" style={{ marginBottom: 16 }}>
        <Link href={`/trips/${trip.id}`}>← {trip.title}</Link>
      </p>
      <BookingFlow
        trip={{
          id: trip.id,
          title: trip.title,
          segment: trip.segment,
          priceINR: trip.priceINR,
          partnerVerification: trip.partner.verificationState,
          partnerName: trip.partner.legalName,
          departure: {
            id: departure.id,
            dateStart: departure.dateStart.toISOString(),
            dateEnd: departure.dateEnd.toISOString(),
            capacity: departure.capacity,
            confirmedSeatCount,
          },
          hasSelfDeclaration,
        }}
      />
    </main>
  );
}

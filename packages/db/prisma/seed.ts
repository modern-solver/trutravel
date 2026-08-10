/**
 * Fixture data for local dev / QA — not a substitute for T5's test plan.
 *
 * Seeds:
 *  - All six Segment rows (Home six-tile grid, P2 key-screens.md §5.1), only Thrilling/Trippy
 *    `catalogLive: true` for this vertical slice.
 *  - One Corridor (Himachal Adventure Belt).
 *  - Two Partners (one per segment, both `verified` for convenience).
 *  - One Thrilling Trip (Bir paragliding — standard altitude, per Thrilling PRD §7's Sept scope
 *    cut) and one Trippy Trip (Old Manali slow circuit), each with a single Open Departure.
 *
 * Run: `npm run seed` from packages/db, or `npm run db:seed` from the repo root.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingTrip = await prisma.trip.findFirst({ where: { isPublished: true } });
  if (existingTrip) {
    console.log("Seed skipped — published trips already exist:", existingTrip.id);
    return;
  }

  await prisma.segment.createMany({
    data: [
      { key: "trippy_tours", name: "Trippy Tours", accentTokenKey: "trippy", catalogLive: true, sortOrder: 0 },
      { key: "thrilling_tours", name: "Thrilling Tours", accentTokenKey: "thrilling", catalogLive: true, sortOrder: 1 },
      { key: "wellness_tours", name: "Wellness Tours", accentTokenKey: "wellness", catalogLive: false, sortOrder: 2 },
      { key: "couple_getaways", name: "Couple Getaways", accentTokenKey: "couples", catalogLive: false, sortOrder: 3 },
      { key: "codehouses", name: "CodeHouses", accentTokenKey: "codehouses", catalogLive: false, sortOrder: 4 },
      { key: "festivals", name: "Music + Art Festivals", accentTokenKey: "festivals", catalogLive: false, sortOrder: 5 },
    ],
    skipDuplicates: true,
  });

  const corridor = await prisma.corridor.upsert({
    where: { name: "Himachal Adventure Belt" },
    update: {},
    create: { name: "Himachal Adventure Belt" },
  });

  const thrillingPartner = await prisma.partner.create({
    data: {
      legalName: "Bir Skywalkers Adventures (fixture)",
      businessRegistrationRef: "FIXTURE-REG-001",
      gstNumber: "FIXTURE-GST-001",
      insuranceCertRef: "FIXTURE-INS-001",
      verificationState: "verified",
      segmentTiers: {
        create: [{ segment: "thrilling_tours", tier: "t2" }],
      },
    },
  });

  const trippyPartner = await prisma.partner.create({
    data: {
      legalName: "Old Manali Slow Travel Collective (fixture)",
      businessRegistrationRef: "FIXTURE-REG-002",
      gstNumber: "FIXTURE-GST-002",
      insuranceCertRef: "FIXTURE-INS-002",
      verificationState: "verified",
      segmentTiers: {
        create: [{ segment: "trippy_tours", tier: "t2" }],
      },
    },
  });

  const guide = await prisma.guide.create({
    data: {
      partnerId: thrillingPartner.id,
      name: "Fixture Guide — Grade III certified",
      certificationRef: "FIXTURE-CERT-GRADE-III",
      certificationGrade: "Grade III",
    },
  });

  const thrillingTrip = await prisma.trip.create({
    data: {
      corridorId: corridor.id,
      segment: "thrilling_tours",
      subLocation: "bir",
      title: "Bir Paragliding — Tandem + Solo Progression",
      durationDays: 1,
      priceINR: 6500,
      partnerId: thrillingPartner.id,
      isPublished: true,
      thrillingDetail: {
        create: {
          activityType: "multi_activity",
          skillLevelMin: "beginner",
          fitnessLevelMin: null, // not flagged physically-demanding (matching-v0 §2.1.7)
          maxAltitudeM: 2400,
          altitudeTier: "standard", // <3000m — Sept-publishable per Thrilling PRD §7
          requiresCertification: false,
          guideId: guide.id,
        },
      },
      departures: {
        create: [
          {
            dateStart: new Date("2026-09-15"),
            dateEnd: new Date("2026-09-15"),
            capacity: 12,
            state: "open",
          },
        ],
      },
    },
  });

  const trippyTrip = await prisma.trip.create({
    data: {
      corridorId: corridor.id,
      segment: "trippy_tours",
      subLocation: "manali", // never kasol_parvati — see prisma/sql/hard_constraints.sql
      title: "Old Manali Slow Circuit",
      durationDays: 4,
      priceINR: 12000,
      partnerId: trippyPartner.id,
      isPublished: true,
      trippyDetail: {
        create: {
          pacePreference: "loosely_planned",
          groupSizePref: "standard_8_12",
        },
      },
      departures: {
        create: [
          {
            dateStart: new Date("2026-09-20"),
            dateEnd: new Date("2026-09-23"),
            capacity: 10,
            state: "open",
          },
        ],
      },
    },
  });

  console.log("Seeded:", { thrillingTripId: thrillingTrip.id, trippyTripId: trippyTrip.id });
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

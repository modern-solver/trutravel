import { NextResponse } from "next/server";
import {
  prisma,
  type FitnessLevel,
  type GroupSizePref,
  type NoiseEnergy,
  type PacePreference,
  type PhotographyComfort,
  type RiskAppetite,
  type SkillLevel,
  type SpiritualOpenness,
} from "@trutravel/db";
import { getSession } from "../../../../lib/get-session";

type ThrillingBody = {
  segment: "thrilling_tours";
  skillLevel: SkillLevel;
  fitnessLevel: FitnessLevel;
  riskAppetite: RiskAppetite;
};

type TrippyBody = {
  segment: "trippy_tours";
  pacePreference: PacePreference;
  groupSizePref: GroupSizePref;
  noiseEnergy: NoiseEnergy;
  spiritualOpenness?: SpiritualOpenness;
  photographyComfort?: PhotographyComfort;
};

/**
 * PUT /api/profile/tags — traveler self-declaration for Thrilling or Trippy
 * (key-screens.md §6.7 / §9 step 1; matching-v0 declare-once).
 */
export async function PUT(request: Request) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated. Sign up or log in first." }, { status: 401 });
  }

  let body: ThrillingBody | TrippyBody;
  try {
    body = (await request.json()) as ThrillingBody | TrippyBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (body.segment === "thrilling_tours") {
    if (!body.skillLevel || !body.fitnessLevel || !body.riskAppetite) {
      return NextResponse.json({ error: "skillLevel, fitnessLevel, and riskAppetite are required." }, { status: 400 });
    }
    const profile = await prisma.thrillingTravelerProfile.upsert({
      where: { userId: session.userId },
      create: {
        userId: session.userId,
        skillLevel: body.skillLevel,
        fitnessLevel: body.fitnessLevel,
        riskAppetite: body.riskAppetite,
      },
      update: {
        skillLevel: body.skillLevel,
        fitnessLevel: body.fitnessLevel,
        riskAppetite: body.riskAppetite,
      },
    });
    return NextResponse.json({ profile });
  }

  if (body.segment === "trippy_tours") {
    if (!body.pacePreference || !body.groupSizePref || !body.noiseEnergy) {
      return NextResponse.json(
        { error: "pacePreference, groupSizePref, and noiseEnergy are required." },
        { status: 400 }
      );
    }
    const profile = await prisma.trippyTravelerProfile.upsert({
      where: { userId: session.userId },
      create: {
        userId: session.userId,
        pacePreference: body.pacePreference,
        groupSizePref: body.groupSizePref,
        noiseEnergy: body.noiseEnergy,
        spiritualOpenness: body.spiritualOpenness ?? "curious",
        photographyComfort: body.photographyComfort ?? "ask_first",
      },
      update: {
        pacePreference: body.pacePreference,
        groupSizePref: body.groupSizePref,
        noiseEnergy: body.noiseEnergy,
        ...(body.spiritualOpenness ? { spiritualOpenness: body.spiritualOpenness } : {}),
        ...(body.photographyComfort ? { photographyComfort: body.photographyComfort } : {}),
      },
    });
    return NextResponse.json({ profile });
  }

  return NextResponse.json({ error: "Unknown segment." }, { status: 400 });
}

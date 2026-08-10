import { NextResponse } from "next/server";
import { prisma } from "@trutravel/db";
import { getSession } from "../../../lib/get-session";

/**
 * PUT /api/profile — emergency contact / medical / waiver (booking step 2).
 */
export async function PUT(request: Request) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: {
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
    medicalDisclosure?: string;
    waiverAccepted?: boolean;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.emergencyContactName || !body.emergencyContactPhone || !body.emergencyContactRelation) {
    return NextResponse.json({ error: "Emergency contact fields are required." }, { status: 400 });
  }
  if (!body.waiverAccepted) {
    return NextResponse.json({ error: "Waiver acknowledgment is required." }, { status: 400 });
  }

  const profile = await prisma.profile.upsert({
    where: { userId: session.userId },
    create: {
      userId: session.userId,
      emergencyContactName: body.emergencyContactName,
      emergencyContactPhone: body.emergencyContactPhone,
      emergencyContactRelation: body.emergencyContactRelation,
      medicalDisclosure: body.medicalDisclosure || null,
      waiverAcceptedAt: new Date(),
    },
    update: {
      emergencyContactName: body.emergencyContactName,
      emergencyContactPhone: body.emergencyContactPhone,
      emergencyContactRelation: body.emergencyContactRelation,
      medicalDisclosure: body.medicalDisclosure || null,
      waiverAcceptedAt: new Date(),
    },
  });

  return NextResponse.json({ profile });
}

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      profile: true,
      thrillingProfile: true,
      trippyProfile: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      profile: user.profile,
      thrillingProfile: user.thrillingProfile,
      trippyProfile: user.trippyProfile,
    },
  });
}

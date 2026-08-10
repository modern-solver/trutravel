-- CreateEnum
CREATE TYPE "SegmentKey" AS ENUM ('trippy_tours', 'thrilling_tours', 'wellness_tours', 'couple_getaways', 'codehouses', 'festivals');

-- CreateEnum
CREATE TYPE "SubLocation" AS ENUM ('manali', 'bir', 'kasol_parvati', 'spiti');

-- CreateEnum
CREATE TYPE "AltitudeTier" AS ENUM ('standard', 'high_altitude');

-- CreateEnum
CREATE TYPE "DepartureState" AS ENUM ('open', 'filling', 'waitlist', 'locked', 'cancelled');

-- CreateEnum
CREATE TYPE "SeatState" AS ENUM ('pending', 'confirmed', 'refund_pending', 'refunded', 'cancelled');

-- CreateEnum
CREATE TYPE "CancellationReasonCode" AS ENUM ('traveler_initiated', 'operator_weather_abort', 'operator_permit_issue', 'operator_min_group_not_met', 'other_operator_initiated');

-- CreateEnum
CREATE TYPE "PartnerVerificationState" AS ENUM ('unverified', 'under_review', 'verified', 'suspended');

-- CreateEnum
CREATE TYPE "PartnerTier" AS ENUM ('t1', 't2', 't3');

-- CreateEnum
CREATE TYPE "IdentityVerificationLevel" AS ENUM ('none', 'basic', 'professional_verified');

-- CreateEnum
CREATE TYPE "TrainingType" AS ENUM ('trippy_code_of_conduct');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

-- CreateEnum
CREATE TYPE "FitnessLevel" AS ENUM ('low', 'moderate', 'high', 'athlete');

-- CreateEnum
CREATE TYPE "RiskAppetite" AS ENUM ('cautious', 'moderate', 'high');

-- CreateEnum
CREATE TYPE "CertificationHeldLevel" AS ENUM ('none', 'basic', 'advanced', 'professional');

-- CreateEnum
CREATE TYPE "GearOwnership" AS ENUM ('none', 'partial', 'full');

-- CreateEnum
CREATE TYPE "PacePreference" AS ENUM ('unplanned', 'loosely_planned', 'structured');

-- CreateEnum
CREATE TYPE "GroupSizePref" AS ENUM ('micro_4_6', 'standard_8_12', 'large_12_plus');

-- CreateEnum
CREATE TYPE "NoiseEnergy" AS ENUM ('chill', 'moderate', 'high_energy');

-- CreateEnum
CREATE TYPE "SpiritualOpenness" AS ENUM ('none', 'curious', 'practicing');

-- CreateEnum
CREATE TYPE "PhotographyComfort" AS ENUM ('private', 'ask_first', 'open');

-- CreateTable
CREATE TABLE "Segment" (
    "key" "SegmentKey" NOT NULL,
    "name" TEXT NOT NULL,
    "accentTokenKey" TEXT NOT NULL,
    "catalogLive" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "passwordHash" TEXT,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "ageGatePassedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "emergencyContactRelation" TEXT,
    "medicalDisclosure" TEXT,
    "waiverAcceptedAt" TIMESTAMP(3),
    "identityVerificationLevel" "IdentityVerificationLevel" NOT NULL DEFAULT 'none',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Corridor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Corridor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "corridorId" TEXT NOT NULL,
    "segment" "SegmentKey" NOT NULL,
    "subLocation" "SubLocation" NOT NULL,
    "title" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "priceINR" INTEGER NOT NULL,
    "partnerId" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThrillingTripDetail" (
    "tripId" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "skillLevelMin" "SkillLevel" NOT NULL,
    "fitnessLevelMin" "FitnessLevel",
    "maxAltitudeM" INTEGER NOT NULL,
    "altitudeTier" "AltitudeTier" NOT NULL,
    "requiresCertification" BOOLEAN NOT NULL DEFAULT false,
    "certificationRequired" TEXT,
    "guideId" TEXT,

    CONSTRAINT "ThrillingTripDetail_pkey" PRIMARY KEY ("tripId")
);

-- CreateTable
CREATE TABLE "TrippyTripDetail" (
    "tripId" TEXT NOT NULL,
    "pacePreference" "PacePreference" NOT NULL,
    "groupSizePref" "GroupSizePref" NOT NULL,

    CONSTRAINT "TrippyTripDetail_pkey" PRIMARY KEY ("tripId")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "businessRegistrationRef" TEXT,
    "gstNumber" TEXT,
    "insuranceCertRef" TEXT,
    "verificationState" "PartnerVerificationState" NOT NULL DEFAULT 'unverified',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerSegmentTier" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "segment" "SegmentKey" NOT NULL,
    "tier" "PartnerTier" NOT NULL,
    "qualifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerSegmentTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerStaff" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "PartnerStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guide" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "certificationRef" TEXT NOT NULL,
    "certificationGrade" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Captain" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "identityVerificationLevel" "IdentityVerificationLevel" NOT NULL DEFAULT 'none',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Captain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaptainTraining" (
    "id" TEXT NOT NULL,
    "captainId" TEXT NOT NULL,
    "trainingType" "TrainingType" NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaptainTraining_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departure" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "state" "DepartureState" NOT NULL DEFAULT 'open',
    "captainId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Departure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seat" (
    "id" TEXT NOT NULL,
    "departureId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "state" "SeatState" NOT NULL DEFAULT 'pending',
    "groupBookingId" TEXT,
    "depositAmountINR" INTEGER,
    "balanceAmountINR" INTEGER,
    "totalAmountINR" INTEGER,
    "cancellationReasonCode" "CancellationReasonCode",
    "cancelledAt" TIMESTAMP(3),
    "hardGateResultJson" JSONB,
    "selfDeclaredSnapshotJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchOverride" (
    "id" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "departureId" TEXT NOT NULL,
    "overriddenById" TEXT NOT NULL,
    "gateFailed" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThrillingTravelerProfile" (
    "userId" TEXT NOT NULL,
    "skillLevel" "SkillLevel" NOT NULL,
    "fitnessLevel" "FitnessLevel" NOT NULL,
    "riskAppetite" "RiskAppetite" NOT NULL,
    "certificationHeld" "CertificationHeldLevel" NOT NULL DEFAULT 'none',
    "gearOwnership" "GearOwnership" NOT NULL DEFAULT 'none',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThrillingTravelerProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "TrippyTravelerProfile" (
    "userId" TEXT NOT NULL,
    "pacePreference" "PacePreference" NOT NULL,
    "groupSizePref" "GroupSizePref" NOT NULL,
    "noiseEnergy" "NoiseEnergy" NOT NULL,
    "spiritualOpenness" "SpiritualOpenness" NOT NULL,
    "photographyComfort" "PhotographyComfort" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrippyTravelerProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "LoyaltySegmentCount" (
    "userId" TEXT NOT NULL,
    "segment" "SegmentKey" NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LoyaltySegmentCount_pkey" PRIMARY KEY ("userId","segment")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Corridor_name_key" ON "Corridor"("name");

-- CreateIndex
CREATE INDEX "Trip_segment_subLocation_isPublished_idx" ON "Trip"("segment", "subLocation", "isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerSegmentTier_partnerId_segment_key" ON "PartnerSegmentTier"("partnerId", "segment");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerStaff_partnerId_userId_key" ON "PartnerStaff"("partnerId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Captain_userId_key" ON "Captain"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CaptainTraining_captainId_trainingType_key" ON "CaptainTraining"("captainId", "trainingType");

-- CreateIndex
CREATE INDEX "Departure_tripId_state_idx" ON "Departure"("tripId", "state");

-- CreateIndex
CREATE INDEX "Seat_departureId_state_idx" ON "Seat"("departureId", "state");

-- CreateIndex
CREATE INDEX "Seat_userId_idx" ON "Seat"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchOverride_seatId_key" ON "MatchOverride"("seatId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_corridorId_fkey" FOREIGN KEY ("corridorId") REFERENCES "Corridor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_segment_fkey" FOREIGN KEY ("segment") REFERENCES "Segment"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThrillingTripDetail" ADD CONSTRAINT "ThrillingTripDetail_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThrillingTripDetail" ADD CONSTRAINT "ThrillingTripDetail_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrippyTripDetail" ADD CONSTRAINT "TrippyTripDetail_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerSegmentTier" ADD CONSTRAINT "PartnerSegmentTier_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerStaff" ADD CONSTRAINT "PartnerStaff_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerStaff" ADD CONSTRAINT "PartnerStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guide" ADD CONSTRAINT "Guide_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Captain" ADD CONSTRAINT "Captain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaptainTraining" ADD CONSTRAINT "CaptainTraining_captainId_fkey" FOREIGN KEY ("captainId") REFERENCES "Captain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_captainId_fkey" FOREIGN KEY ("captainId") REFERENCES "Captain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_departureId_fkey" FOREIGN KEY ("departureId") REFERENCES "Departure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchOverride" ADD CONSTRAINT "MatchOverride_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchOverride" ADD CONSTRAINT "MatchOverride_departureId_fkey" FOREIGN KEY ("departureId") REFERENCES "Departure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchOverride" ADD CONSTRAINT "MatchOverride_overriddenById_fkey" FOREIGN KEY ("overriddenById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThrillingTravelerProfile" ADD CONSTRAINT "ThrillingTravelerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrippyTravelerProfile" ADD CONSTRAINT "TrippyTravelerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltySegmentCount" ADD CONSTRAINT "LoyaltySegmentCount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

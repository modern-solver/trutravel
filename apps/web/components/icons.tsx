import type { AccentKey } from "@/lib/segments";

type IconProps = { className?: string };

/** Thrilling: route / zigzag-path glyph — not flame/lightning. */
export function ThrillingIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2 12 L5 7 L8 10 L11 4 L14 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Trippy: open-circle / pathway-dot — not leaf/peace/flame. */
export function TrippyIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function WellnessIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 2.5 V13.5 M4.5 6.5 H11.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.25" opacity="0.45" />
    </svg>
  );
}

export function CouplesIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="5.5" cy="6" r="2.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10.5" cy="6" r="2.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.5 12.5 C3.5 10.5 5 9.5 5.5 9.5 C7 9.5 7.5 10.5 8 11 C8.5 10.5 9 9.5 10.5 9.5 C11 9.5 12.5 10.5 12.5 12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CodehousesIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 11.5 L6.5 8 L3 4.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 12.5 H13" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function FestivalsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 12.5 H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 12.5 V6.5 L8 4.5 L11 6.5 V12.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="8" cy="8.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function SegmentIcon({ accent, className }: { accent: AccentKey; className?: string }) {
  switch (accent) {
    case "thrilling":
      return <ThrillingIcon className={className} />;
    case "trippy":
      return <TrippyIcon className={className} />;
    case "wellness":
      return <WellnessIcon className={className} />;
    case "couples":
      return <CouplesIcon className={className} />;
    case "codehouses":
      return <CodehousesIcon className={className} />;
    case "festivals":
      return <FestivalsIcon className={className} />;
  }
}

export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 1.75 L12.5 3.5 V7.5 C12.5 10.5 10.4 12.9 8 14 C5.6 12.9 3.5 10.5 3.5 7.5 V3.5 Z"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="M8 1.75 L12.5 3.5 V7.5 C12.5 10.5 10.4 12.9 8 14 C5.6 12.9 3.5 10.5 3.5 7.5 V3.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M5.6 7.8 L7.2 9.4 L10.5 5.9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShieldHalfIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 1.75 L12.5 3.5 V7.5 C12.5 10.5 10.4 12.9 8 14 C5.6 12.9 3.5 10.5 3.5 7.5 V3.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M8 1.75 V14 C5.6 12.9 3.5 10.5 3.5 7.5 V3.5 Z" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export function ShieldXIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 1.75 L12.5 3.5 V7.5 C12.5 10.5 10.4 12.9 8 14 C5.6 12.9 3.5 10.5 3.5 7.5 V3.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M6 6.5 L10 10.5 M10 6.5 L6 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldOutlineIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 1.75 L12.5 3.5 V7.5 C12.5 10.5 10.4 12.9 8 14 C5.6 12.9 3.5 10.5 3.5 7.5 V3.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CertIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <rect x="3" y="2.5" width="10" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.5 10.5 L5.5 13.5 L8 12 L10.5 13.5 L9.5 10.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

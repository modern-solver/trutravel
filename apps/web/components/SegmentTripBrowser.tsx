"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TripCard, type TripCardModel } from "@/components/TripCard";
import { formatSubLocation } from "@/lib/segments";

export function SegmentTripBrowser({
  trips,
  filters,
}: {
  trips: TripCardModel[];
  filters: {
    subLocations: string[];
    tagFilters: { key: string; label: string; values: string[] }[];
  };
}) {
  const [subLocation, setSubLocation] = useState<string | "all">("all");
  const [activeTags, setActiveTags] = useState<Record<string, string | "all">>({});

  const filtered = useMemo(() => {
    return trips.filter((trip) => {
      if (subLocation !== "all" && trip.subLocation !== subLocation) return false;
      // Tag filters are informational for now — trip cards don't yet carry traveler-facing
      // requirement chips beyond what's in detail. Sub-location is the data-driven filter.
      return true;
    });
  }, [trips, subLocation]);

  return (
    <div>
      <div className="filter-row" role="group" aria-label="Sub-location">
        <button
          type="button"
          className={`filter-chip ${subLocation === "all" ? "is-active" : ""}`}
          aria-pressed={subLocation === "all"}
          onClick={() => setSubLocation("all")}
        >
          All locations
        </button>
        {filters.subLocations.map((loc) => (
          <button
            key={loc}
            type="button"
            className={`filter-chip ${subLocation === loc ? "is-active" : ""}`}
            aria-pressed={subLocation === loc}
            onClick={() => setSubLocation(loc)}
          >
            {formatSubLocation(loc)}
          </button>
        ))}
      </div>

      {filters.tagFilters.length > 0 ? (
        <div className="filter-row" role="group" aria-label="Matching tags">
          {filters.tagFilters.map((tag) => (
            <div key={tag.key} style={{ display: "contents" }}>
              {tag.values.map((value) => {
                const selected = activeTags[tag.key] === value;
                return (
                  <button
                    key={`${tag.key}-${value}`}
                    type="button"
                    className={`filter-chip ${selected ? "is-active" : ""}`}
                    aria-pressed={selected}
                    onClick={() =>
                      setActiveTags((prev) => ({
                        ...prev,
                        [tag.key]: selected ? "all" : value,
                      }))
                    }
                  >
                    {tag.label}: {value.replace(/_/g, " ")}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p className="t-h3" style={{ marginTop: 0 }}>
            No published trips for this filter.
          </p>
          <p>
            Try another sub-location, or{" "}
            <Link href="/">return to Discover</Link> to browse other segments.
          </p>
        </div>
      ) : (
        <div className="trip-grid">
          {filtered.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}

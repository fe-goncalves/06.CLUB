"use client";

import { useMemo, useState } from "react";
import { EntityCard, TeamSubtitle } from "@/components/entity/EntityCard";
import { TitleSearchBar } from "@/components/nav/TitleSearchBar";
import { displayShortName } from "@/lib/format";
import { teamAbbr } from "@/lib/meta";
import type { TeamRef } from "@/lib/types";

export function TeamsClient({ items }: { items: TeamRef[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((t) => {
      const blob = `${t.name} ${t.short_name || ""} ${t.abbreviation || ""}`.toLowerCase();
      return blob.includes(q);
    });
  }, [items, query]);

  return (
    <main>
      <TitleSearchBar
        title="Equipes"
        placeholder="Buscar equipe…"
        value={query}
        onChange={setQuery}
      />
      <section className="space-y-1 px-4 py-2">
        {filtered.length === 0 ? (
          <p className="font-inter py-16 text-center text-sm text-[#EEEEEE]/40">
            Nenhuma equipe encontrada.
          </p>
        ) : (
          filtered.map((t) => (
            <EntityCard
              key={t.id}
              href={`/teams/${t.id}`}
              name={t.name}
              shortName={displayShortName(t)}
              logoUrl={t.logo_url}
              subtitle={<TeamSubtitle abbr={teamAbbr(t)} fullName={t.name} />}
            />
          ))
        )}
      </section>
    </main>
  );
}

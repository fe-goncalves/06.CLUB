"use client";

import { useMemo, useState } from "react";
import { EntityCard } from "@/components/entity/EntityCard";
import { TitleSearchBar } from "@/components/nav/TitleSearchBar";
import { displayShortName } from "@/lib/format";
import type { CompetitionRef } from "@/lib/types";

export function CompetitionsClient({ items }: { items: CompetitionRef[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) => {
      const blob = `${c.name} ${c.short_name || ""} ${c.season || ""}`.toLowerCase();
      return blob.includes(q);
    });
  }, [items, query]);

  return (
    <main>
      <TitleSearchBar
        title="Competições"
        placeholder="Buscar competição…"
        value={query}
        onChange={setQuery}
      />
      <section className="space-y-1 px-4 py-2">
        {filtered.length === 0 ? (
          <p className="font-inter py-16 text-center text-sm text-[#EEEEEE]/40">
            Nenhuma competição encontrada.
          </p>
        ) : (
          filtered.map((c) => (
            <EntityCard
              key={c.id}
              href={`/competitions/${c.id}`}
              name={c.name}
              shortName={displayShortName(c)}
              logoUrl={c.logo_url}
              subtitle={c.name.toLowerCase()}
            />
          ))
        )}
      </section>
    </main>
  );
}

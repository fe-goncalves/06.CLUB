"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeMatchRef } from "@/lib/format";
import { IconPesquisa } from "@/components/ui/Icons";

export function OpenMatchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function submit(e?: FormEvent) {
    e?.preventDefault();
    const ref = normalizeMatchRef(value);
    if (!ref) {
      setError("Cole um código de 5 caracteres ou o link da partida.");
      return;
    }
    setError(null);
    setValue("");
    onClose();
    router.push(`/m/${ref.value}`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-4 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl bg-[#111] p-5 shadow-2xl"
      >
        <div className="mb-2 flex items-center gap-2 text-[#00FB5E]">
          <IconPesquisa size={22} />
          <h2 className="font-tosh text-lg uppercase text-[#EEEEEE]">Abrir partida</h2>
        </div>
        <p className="font-inter text-sm text-[#EEEEEE]/45">
          Cole o link ou o código de 5 caracteres (ex.: X7BS8).
        </p>
        <input
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder="https://…/m/X7BS8 ou X7BS8"
          className="font-inter mt-4 w-full rounded-xl bg-black/50 px-4 py-3 text-sm text-[#EEEEEE] outline-none ring-[#00FB5E]/40 placeholder:text-[#EEEEEE]/25 focus:ring-2"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
        />
        {error ? (
          <p className="font-inter mt-2 text-xs text-[#FF4040]">{error}</p>
        ) : null}
        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="font-inter rounded-xl px-4 py-2 text-sm text-[#EEEEEE]/45"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="font-inter rounded-xl bg-[#00FB5E] px-5 py-2 text-sm font-bold text-black"
          >
            Abrir
          </button>
        </div>
      </form>
    </div>
  );
}

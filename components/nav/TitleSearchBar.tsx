"use client";

import { useEffect, useRef, useState } from "react";

export function TitleSearchBar({
  title,
  placeholder,
  value,
  onChange,
}: {
  title: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  return (
    <header className="sticky top-0 z-30 bg-black/90 px-4 pb-3 pt-[max(32px,calc(env(safe-area-inset-top)+18px))] backdrop-blur-xl">
      {editing || value ? (
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => {
              if (!value.trim()) setEditing(false);
            }}
            placeholder={placeholder}
            className="font-inter w-full bg-transparent text-[22px] font-medium tracking-wide text-[#EEEEEE] outline-none placeholder:text-[#EEEEEE]/30"
          />
          {value ? (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setEditing(false);
              }}
              className="font-inter shrink-0 text-xs text-[#EEEEEE]/45"
            >
              Limpar
            </button>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="w-full text-left"
          aria-label={`Buscar em ${title}`}
        >
          <h1 className="font-tosh text-[34px] font-black uppercase leading-none tracking-wide text-[#EEEEEE]">
            {title}
          </h1>
        </button>
      )}
    </header>
  );
}

type IconProps = {
  size?: number;
  className?: string;
  color?: string;
  outlined?: boolean;
};

function SvgShell({
  size = 24,
  className,
  color = "currentColor",
  children,
  viewBox = "0 0 24 24",
}: IconProps & { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      className={className}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconVoltar(props: IconProps) {
  return (
    <SvgShell {...props}>
      <path d="M6 11.99 14.058 4l1.432 1.42-6.636 6.57 6.646 6.6L14.078 20z" />
    </SvgShell>
  );
}

export function IconPesquisa(props: IconProps) {
  return (
    <SvgShell {...props}>
      <path
        fillRule="evenodd"
        d="M15.7 13.58h-1.38a6.96 6.96 0 0 0 1.7-4.57C16.02 5.14 12.88 2 9.01 2S2 5.14 2 9.01s3.14 7.01 7.01 7.01c1.75 0 3.34-.64 4.57-1.7v1.38l6.3 6.3L22 19.88zm-6.69.44C6.25 14.02 4 11.77 4 9.01S6.25 4 9.01 4s5.01 2.25 5.01 5.01-2.25 5.01-5.01 5.01"
      />
    </SvgShell>
  );
}

export function IconDownload(props: IconProps) {
  return (
    <SvgShell {...props}>
      <path d="M4.5 22a2.4 2.4 0 0 1-1.766-.734A2.4 2.4 0 0 1 2 19.5v-3.75h2.5v3.75h15v-3.75H22v3.75a2.4 2.4 0 0 1-.734 1.766Q20.532 22 19.5 22z" />
      <path d="m12 17-6.25-6.25L7.5 8.937l3.25 3.25V2h2.5v10.188l3.25-3.25 1.75 1.812z" />
    </SvgShell>
  );
}

export function IconCompeticao(props: IconProps) {
  return (
    <SvgShell {...props} viewBox="0 0 40 40">
      <path d="M21.569 32.923v-1.23h1.255V29.23h-5.648v2.461h1.255v1.231h-4.706l-1.882 1.846V36h16.314v-1.23l-1.882-1.847h-4.706zM36 6.77h-4.706v3.077h1.569v5.206l-2.824 2.77V4H9.961v13.822l-2.824-2.77V9.846h1.569V6.77H4v9.563l5.96 5.846v2.745l1.883 1.23L14.98 28h10.04l3.137-1.846 1.882-1.23v-2.746L36 16.332V6.77z" />
    </SvgShell>
  );
}

export function IconHome({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill={color} aria-hidden>
      <path d="M12 3.2 3.5 10.1V21h6.2v-6.3h4.6V21h6.2V10.1L12 3.2Z" />
    </svg>
  );
}

/** Escudo sólido (preenchido). */
export function IconShield({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill={color} aria-hidden>
      <path d="M12 2 3.5 5.4v6.3c0 5.55 3.72 10.05 8.5 11.7 4.78-1.65 8.5-6.15 8.5-11.7V5.4L12 2Z" />
    </svg>
  );
}

/** Share — arq/Icons/SHARE.svg (`outlined` = traçado) */
export function IconShare({
  size = 24,
  className,
  color = "currentColor",
  outlined = false,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-36 -36 400.83 401.49"
      className={className}
      fill={outlined ? "none" : color}
      stroke={outlined ? color : "none"}
      strokeWidth={outlined ? 40 : undefined}
      strokeLinejoin="round"
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M204.74,141.27c5.11-5.12,5.36-11.91.95-17.05-3.81-4.45-12.01-5.79-16.93-.86l-71.19,71.29L12.17,138.68C3.35,134-.93,124.27.17,114.78s7.38-16.81,16.73-19.93L296.75,1.38c9.06-3.03,18.38-.98,24.82,5.34,6.68,6.56,9.02,16.04,5.9,25.41l-93.68,281.52c-3.2,9.63-12.54,15.4-21.53,15.81-10.45.48-18.29-5.27-23.11-14.4l-54.63-103.48,70.22-70.31Z" />
    </svg>
  );
}

export function IconSelect({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill={color} aria-hidden>
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Zm8.7 4.3 1.4 1.4-5.6 5.6-3.4-3.4 1.4-1.4 2 2 4.2-4.2Z" />
    </svg>
  );
}

export function IconVideos({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill={color} aria-hidden>
      <path d="m7.965 9.013 3.92-2.613-3.92-2.614zm.457 3.593h3.66a1.43 1.43 0 0 1-.392.686 1.3 1.3 0 0 1-.72.326l-7.123.866q-.54.081-.972-.253a1.26 1.26 0 0 1-.498-.874L1.51 6.22q-.066-.539.261-.964t.866-.49l.752-.098v1.307l-.588.082.882 7.137zm-2.418-1.307q-.54 0-.923-.384a1.26 1.26 0 0 1-.384-.922V2.807q0-.54.384-.923.384-.384.923-.384h7.189q.54 0 .923.384.384.383.384.923v7.186q0 .539-.384.922a1.26 1.26 0 0 1-.923.384zm0-1.306h7.189V2.807H6.004z" />
    </svg>
  );
}

export function IconGoal({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" className={className} fill={color} aria-hidden>
      <path d="m9.5 5.83-2.76 1v3.02l2.08.81 2.07-2.29z" />
      <path d="M7 0C3.14 0 0 3.14 0 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7m0 12.26c-.97 0-1.88-.27-2.66-.73l.25-1.38-1.55-1.73-.94.48A5.2 5.2 0 0 1 1.74 7v-.17l2.01-.72.66-2.48-.92-.55a5.24 5.24 0 0 1 3.5-1.35c.1 0 .19 0 .29.01l-.29 1.07 2.72 1.15.88-.81c1.02.96 1.67 2.32 1.67 3.83 0 2.9-2.36 5.27-5.26 5.27z" />
    </svg>
  );
}

export function IconDefesa({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill={color} aria-hidden>
      <path d="m2.901 9.399 4.2 4.199L5.697 15H4.77l-3.265-3.267L1.5 10.8zM10.758 1l.915.873-3.145 3.29.452.435 3.78-3.955.884.841-3.786 3.953.452.436 3.152-3.294.884.841-3.153 3.3.453.43 2.519-2.635.396.387v1.026l-3.902 4.085-3.183 2.157-4.2-4.149 1.327-6.268 1.341.285-.084 2.658.8-.419z" />
    </svg>
  );
}

export function IconPenalti({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" className={className} fill={color} aria-hidden>
      <path d="m8.78 8.43-1.88.68v2.06l1.41.55 1.42-1.56z" />
      <path d="M7.07 4.45c-2.63 0-4.77 2.14-4.77 4.77s2.14 4.77 4.77 4.77 4.77-2.14 4.77-4.77S9.7 4.45 7.07 4.45m0 8.37c-.66 0-1.28-.18-1.82-.5l.17-.94-1.06-1.18-.64.33c-.16-.4-.24-.84-.24-1.29v-.12l1.37-.49.45-1.69-.63-.37c.64-.57 1.47-.92 2.39-.92h.2l-.2.73 1.86.78.6-.55c.7.66 1.14 1.58 1.14 2.62 0 1.98-1.61 3.59-3.59 3.59" />
      <path d="M14 6.75h-1.5V1.5h-11v5.25H0V0h14z" />
    </svg>
  );
}

export function ActionIcon({
  kind,
  size = 14,
  color = "#000",
  className,
}: {
  kind: "goal" | "defesa" | "penalti";
  size?: number;
  color?: string;
  className?: string;
}) {
  if (kind === "defesa") return <IconDefesa size={size} color={color} className={className} />;
  if (kind === "penalti") return <IconPenalti size={size} color={color} className={className} />;
  return <IconGoal size={size} color={color} className={className} />;
}

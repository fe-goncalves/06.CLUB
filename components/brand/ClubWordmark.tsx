export function ClubWordmark({
  height = 24,
  className,
}: {
  height?: number;
  className?: string;
}) {
  const width = Math.round(height * (400.15 / 78.84));
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/wordmark.svg"
      alt="06.CLUB"
      width={width}
      height={height}
      className={className}
      style={{ width, height, objectFit: "contain" }}
    />
  );
}

export function ClubMark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/mark.svg"
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}

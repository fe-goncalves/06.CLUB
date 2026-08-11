type MediaImgProps = {
  src?: string | null;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  style?: React.CSSProperties;
};

/** img otimizado para logos/thumbs remotos (lazy + async decode). */
export function MediaImg({
  src,
  alt = "",
  className,
  width,
  height,
  priority = false,
  style,
}: MediaImgProps) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "low"}
      referrerPolicy="no-referrer"
    />
  );
}

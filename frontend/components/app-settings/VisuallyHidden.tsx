// Screen-reader-only label (mockup `.vh`), in rem so no px reaches the stylesheet.
export default function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute h-[0.0625rem] w-[0.0625rem] overflow-hidden whitespace-nowrap [clip:rect(0_0_0_0)]">
      {children}
    </span>
  );
}

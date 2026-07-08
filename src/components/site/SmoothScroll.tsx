import { ReactLenis } from "@studio-freight/react-lenis";
import type { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.4, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}

import { ReactLenis } from "@studio-freight/react-lenis";
import type { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const Comp = ReactLenis as unknown as (props: { root?: boolean; options?: object; children: ReactNode }) => JSX.Element;
  return (
    <Comp root options={{ lerp: 0.08, duration: 1.4, smoothWheel: true }}>
      {children}
    </Comp>
  );
}

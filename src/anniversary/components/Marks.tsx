import type { Mark } from "../lib/rough";

/**
 * Renders the marks `sketch()` produced. roughjs has already decided which
 * paths are outline and which are fill, so this only has to place them —
 * and stamp the repeated ones (bloom clusters, flower petals) at each transform.
 */
export default function Marks({ marks }: { marks: Mark[] }) {
  return (
    <>
      {marks.map((m, i) => {
        const path = (
          <path
            d={m.d}
            stroke={m.stroke}
            strokeWidth={m.strokeWidth}
            fill={m.fill}
            opacity={m.opacity}
            strokeDasharray={m.dash?.join(" ")}
          />
        );
        return (
          <g key={i}>
            {m.at
              ? m.at.map((t, j) => (
                  <g key={j} transform={t}>
                    {path}
                  </g>
                ))
              : path}
          </g>
        );
      })}
    </>
  );
}

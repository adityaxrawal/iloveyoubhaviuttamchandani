import type { CSSProperties, ReactNode } from "react";
import canonCameraExactSvg from "../elements/canon_camera_exact.svg";
import usExactSvg from "../elements/us_exact.svg";
import s from "./CanonCamera.module.css";

export interface CanonCameraProps {
  className?: string;
  style?: CSSProperties;
  photoSrc?: string;
  photoAlt?: string;
  photoClassName?: string;
  children?: ReactNode;
}

export default function CanonCamera({
  className,
  style,
  photoSrc = usExactSvg,
  photoAlt = "Us",
  photoClassName,
  children,
}: CanonCameraProps) {
  return (
    <div
      className={[s.cameraWrapper, className].filter(Boolean).join(" ")}
      style={style}
    >
      <div className={s.screenArea}>
        {photoSrc && (
          <img
            src={photoSrc}
            alt={photoAlt}
            className={[s.photo, photoClassName].filter(Boolean).join(" ")}
          />
        )}
        {children}
      </div>
      <img
        src={canonCameraExactSvg}
        alt="Canon camera"
        className={s.cameraFrame}
        aria-hidden="true"
      />
    </div>
  );
}

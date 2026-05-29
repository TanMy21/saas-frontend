/* eslint-disable react/no-unknown-property */
import { SurfaceClickSample } from "../../../types/insightTypes";

export function SurfaceClickMarkers({
  samples,
}: {
  samples: SurfaceClickSample[];
}) {
  const visibleSamples = samples.slice(0, 100);

  return (
    <>
      {visibleSamples.map((sample, index) => (
        <mesh
          key={`${sample.meshName ?? "mesh"}-${sample.t}-${index}`}
          position={[sample.point.x, sample.point.y, sample.point.z]}
        >
          {/* Creates a small marker sphere at the captured model click point. */}
          <sphereGeometry args={[0.01, 12, 12]} />

          {/* Uses a simple material so click markers stay visually clear. */}
          <meshBasicMaterial color="#2563eb" />
        </mesh>
      ))}
    </>
  );
}

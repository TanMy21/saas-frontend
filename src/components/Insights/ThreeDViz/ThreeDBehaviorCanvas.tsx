/* eslint-disable react/no-unknown-property */
import { Suspense } from "react";

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import {
  ColoredClickedMeshArea,
  SurfaceClickSample,
} from "../../../types/behaviorTypes";
import ThreeDModelLoader from "../../Loaders/ThreeDModelLoader";

import { ThreeDHighlightResults } from "./ThreeDHighlightResults";

export function ThreeDBehaviorCanvas({
  modelUrl,
  clickedMeshes,
  surfaceClickSamples,
  autoRotate,
}: {
  modelUrl: string;
  clickedMeshes: ColoredClickedMeshArea[];
  surfaceClickSamples: SurfaceClickSample[];
  autoRotate: boolean;
}) {
  return (
    <Canvas
      key={modelUrl}
      dpr={[1, 1.5]}
      shadows
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      onCreated={({ gl }) => {
        // Keeps model colors closer to how they appear in the participant viewer.
        gl.toneMappingExposure = 1.15;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
      camera={{
        position: [1.2, 1.1, 1.3],
        fov: 50,
        near: 0.01,
        far: 100,
      }}
    >
      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#ffffff", "#3d3d3d", 0.7]} />
      <directionalLight position={[3, 5, 2]} intensity={1.2} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} />

      <Environment preset="city" background={false} />

      <Suspense fallback={<ThreeDModelLoader />}>
        <ThreeDHighlightResults
          modelUrl={modelUrl}
          clickedMeshes={clickedMeshes}
          surfaceClickSamples={surfaceClickSamples}
        />
      </Suspense>

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.8}
        zoomSpeed={0.9}
        minDistance={0.15}
        maxDistance={8}
        autoRotate={autoRotate}
        autoRotateSpeed={0.35}
      />
    </Canvas>
  );
}

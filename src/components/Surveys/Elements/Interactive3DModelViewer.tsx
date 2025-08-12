import { Suspense, useEffect } from "react";

import {
  OrbitControls,
  useGLTF,
  Environment,
  Bounds,
  Html,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import { Interactive3DModelViewerProps } from "../../../utils/types";

function Model({ src }: { src: string }) {
  const { scene } = useGLTF(src, true);

  // Basic shadow toggles so models look nicer
  useEffect(() => {
    scene.traverse((obj: THREE.Object3D) => {
      const mesh = obj as THREE.Mesh;
      if ((mesh as any).isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    // Fit model to viewport regardless of original size
    <Bounds fit clip observe margin={1.1}>
      <primitive object={scene} />
    </Bounds>
  );
}

export const Interactive3DModelViewer = ({
  src,
  hdrEnvUrl,
  height = 420,
  background = "white",
  autoRotate = false,
  autoRotateSpeed = 0.5,
  minDistance = 0.2,
  maxDistance = 6,
  maxPolarAngle = Math.PI / 2,
}: Interactive3DModelViewerProps) => {
  // Optional: try to preload the model
  useEffect(() => {
    if ((useGLTF as any).preload) (useGLTF as any).preload(src);
  }, [src]);

  const dpr =
    typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1;

  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: 12,
        overflow: "hidden",
        background,
      }}
    >
      <Canvas
        dpr={dpr}
        shadows
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [1.2, 1.1, 1.3], fov: 50, near: 0.01, far: 100 }}
      >
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 2]} intensity={0.8} castShadow />

        {/* Optional HDRI for nicer reflections */}
        {hdrEnvUrl ? (
          <Environment files={hdrEnvUrl} background={false} />
        ) : null}

        {/* Model */}
        <Suspense
          fallback={
            <Html center>
              <div
                style={{
                  padding: "8px 12px",
                  background: "rgba(255,255,255,.9)",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,.08)",
                  fontSize: 12,
                }}
              >
                Loading 3D…
              </div>
            </Html>
          }
        >
          <Model src={src} />
        </Suspense>

        {/* Controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.8}
          zoomSpeed={0.9}
          minDistance={minDistance}
          maxDistance={maxDistance}
          maxPolarAngle={maxPolarAngle}
          autoRotate={autoRotate}
          autoRotateSpeed={autoRotateSpeed}
        />
      </Canvas>
    </div>
  );
};

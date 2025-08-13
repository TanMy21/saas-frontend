import { Suspense, useEffect, useRef, useState } from "react";

import {
  OrbitControls,
  useGLTF,
  Environment,
  Bounds,
  Html,
  useBounds,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Focus } from "lucide-react";
import * as THREE from "three";

import {
  InitialViewParams,
  Interactive3DModelViewerProps,
  Model3DParams,
  SetInitialViewParams,
  ViewName,
} from "../../../utils/types";

function setInitialView({
  camera,
  controls,
  object,
  view = "front",
  fov = 50,
  aspect = 16 / 9,
  padding = 1.15,
  frontIsNegZ = true,
}: SetInitialViewParams) {
  // 1) Bounds
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z);

  // 2) Direction for each named view (in model space)
  const dirs: Record<ViewName, THREE.Vector3> = {
    front: new THREE.Vector3(0, 0, frontIsNegZ ? -1 : 1),
    back: new THREE.Vector3(0, 0, frontIsNegZ ? 1 : -1),
    left: new THREE.Vector3(-1, 0, 0),
    right: new THREE.Vector3(1, 0, 0),
    top: new THREE.Vector3(0, 1, 0),
    bottom: new THREE.Vector3(0, -1, 0),
  };
  const dir = dirs[view].clone().normalize();

  // 3) Distance to fit (account for FOV + aspect)
  const vFov = (fov * Math.PI) / 180; // vertical FOV in radians
  const fitHeightDist = (maxSize * padding) / (2 * Math.tan(vFov / 2));
  const fitWidthDist =
    (maxSize * padding) /
    (2 * Math.tan(Math.atan(Math.tan(vFov / 2) * aspect)));
  const distance = Math.max(fitHeightDist, fitWidthDist);

  // 4) Position camera and set target
  const position = center.clone().add(dir.multiplyScalar(distance));
  camera.position.copy(position);
  controls.target.copy(center);
  controls.update();
}

function Model({ src, onReady }: Model3DParams) {
  const { scene } = useGLTF(src, true);

  useEffect(() => {
    scene.traverse((obj: THREE.Object3D) => {
      const mesh = obj as THREE.Mesh;
      if ((mesh as any).isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    onReady?.(scene);
  }, [scene, onReady]);

  return (
    <Bounds fit clip observe margin={1.1}>
      <primitive object={scene} />
      {/* Buttons must live inside <Bounds> so they can call useBounds() */}
      <RefocusButtons />
    </Bounds>
  );
}

/**
 * Overlay buttons:
 * - Frame: bounds.refresh().fit()  -> smart “fit to view”
 * - Home: restore initial camera position + controls target
 */
function RefocusButtons() {
  const bounds = useBounds(); // provided by <Bounds>
  const { camera } = useThree();

  const controls = useThree((s) => s.controls) as any;

  // Capture initial camera & target once (the “Home” pose)
  const initialCam = useRef(camera.position.clone());
  const initialTarget = useRef(new THREE.Vector3());
  useEffect(() => {
    if (controls && controls.target)
      initialTarget.current.copy(controls.target);
    initialCam.current.copy(camera.position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const frameAll = () => {
    // Recompute model bounds and fit camera nicely
    bounds.refresh().fit();
  };

  // Small, unobtrusive UI overlayed on the canvas
  return (
    <Html transform={false} fullscreen>
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          gap: 8,
          pointerEvents: "auto", // allow clicks
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <button
          onClick={frameAll}
          title="Fit to view"
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,.12)",
            background: "rgba(255,255,255,.9)",
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            cursor: "pointer",
          }}
        >
          <Focus />
        </button>
      </div>
    </Html>
  );
}

function InitialViewApplier({
  object,
  initialView,
  frontIsNegZ,
  controlsRef,
}: InitialViewParams) {
  const { camera, size } = useThree();
  const appliedRef = useRef(false);

  useEffect(() => {
    if (!object || !controlsRef.current || appliedRef.current) return;
    appliedRef.current = true;

    const controls = controlsRef.current;
    const aspect = size.width / Math.max(1, size.height);
    const cam = camera as THREE.PerspectiveCamera;

    setInitialView({
      camera: cam,
      controls,
      object,
      view: initialView,
      fov: cam.fov,
      aspect,
      frontIsNegZ,
    });
  }, [object, controlsRef, size, camera, initialView, frontIsNegZ]);

  return null;
}

export const Interactive3DModelViewer = ({
  src,
  hdrEnvUrl,
  height = 600,
  background = "white",
  autoRotate = false,
  autoRotateSpeed = 0.5,
  minDistance = 0.2,
  maxDistance = 6,
  maxPolarAngle = Math.PI / 2,
  initialView = "front",
  frontIsNegZ = true,
}: Interactive3DModelViewerProps) => {
  // Optional: try to preload the model
  useEffect(() => {
    if ((useGLTF as any).preload) (useGLTF as any).preload(src);
  }, [src]);

  const dpr =
    typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1;

  const [modelRoot, setModelRoot] = useState<THREE.Object3D | null>(null);
  const controlsRef = useRef<any>(null);

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
          <Model src={src} onReady={setModelRoot} />
        </Suspense>

        <InitialViewApplier
          object={modelRoot}
          initialView={initialView}
          frontIsNegZ={frontIsNegZ}
          controlsRef={controlsRef}
        />

        {/* Controls */}
        <OrbitControls
          ref={controlsRef}
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

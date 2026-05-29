/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo } from "react";

import { Bounds, useGLTF } from "@react-three/drei";
import * as THREE from "three";

import { ColoredClickedMeshArea } from "../../../types/behaviorTypes";
import { SurfaceClickSample } from "../../../types/insightTypes";

import { ResultRefocusButton } from "./RefocusButton";
import { SurfaceClickMarkers } from "./SurfaceClickMarkers";

export function ThreeDHighlightResults({
  modelUrl,
  clickedMeshes,
  surfaceClickSamples,
}: {
  modelUrl: string;
  clickedMeshes: ColoredClickedMeshArea[];
  surfaceClickSamples: SurfaceClickSample[];
}) {
  const { scene } = useGLTF(modelUrl, true);

  // Builds a lookup table for clicked meshes.
  const clickLookup = useMemo(() => {
    const maxClicks = Math.max(
      1,
      ...clickedMeshes.map((area) => area.clickCount),
    );

    return clickedMeshes.reduce<
      Record<
        string,
        {
          label: string;
          clickCount: number;
          intensity: number;
          color: string;
        }
      >
    >((acc, area) => {
      acc[area.meshName] = {
        label: area.label,
        clickCount: area.clickCount,
        intensity: area.clickCount / maxClicks,
        color: area.color,
      };

      return acc;
    }, {});
  }, [clickedMeshes]);

  // Clones the loaded scene so result-page material changes do not mutate the global GLTF cache.
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      // Clone material so highlight changes do not affect other viewers using the same cached GLB.
      if (Array.isArray(child.material)) {
        child.material = child.material.map((mat) => mat.clone());
      } else {
        child.material = child.material.clone();
      }
    });

    return clone;
  }, [scene]);

  // Applies heatmap-style highlighting to meshes that were clicked by participants.
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const hit = clickLookup[child.name];

      if (!hit) return;

      // Stronger intensity means more clicks on this generic model area.
      const intensity = hit.intensity;

      child.material = new THREE.MeshStandardMaterial({
        // Uses a unique area color instead of one yellow heatmap color.
        color: new THREE.Color(hit.color),

        // Light emissive effect keeps the area visible on darker models.
        emissive: new THREE.Color(hit.color),

        // Intensity still communicates relative click count within that color.
        emissiveIntensity: 0.12 + intensity * 0.35,

        roughness: 0.5,
        metalness: 0.05,
        transparent: true,

        // Keep some transparency so the model shape still remains readable.
        opacity: 0.62 + intensity * 0.25,
      });
    });
  }, [clonedScene, clickLookup]);

  return (
    <Bounds fit clip observe margin={1.15}>
      <primitive object={clonedScene} />

      <SurfaceClickMarkers samples={surfaceClickSamples} />

      <ResultRefocusButton />
    </Bounds>
  );
}

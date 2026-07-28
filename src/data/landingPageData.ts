import {
  Activity,
  Box,
  CircleDot,
  Crosshair,
  EyeOff,
  Image as Img,
} from "lucide-react";

import { type UseCase } from "../types/landingTypes";

export const useCases: UseCase[] = [
  {
    eyebrow: "Customer research",
    title: "Customer research",
    description:
      "Understand people’s needs, pain points, and expectations through richer feedback.",
    mockupLabel: "Customer research",
    color: "uc-color-blue",
  },
  {
    eyebrow: "Product feedback",
    title: "Product feedback",
    description:
      "Validate ideas, prioritize your roadmap, and understand what users actually need before building.",
    mockupLabel: "Product feedback",
    color: "uc-color-violet",
  },
  {
    eyebrow: "Marketing research",
    title: "Marketing research",
    description:
      "Test messaging, understand audience intent, and learn what makes people choose, trust, or ignore your offer.",
    mockupLabel: "Marketing research",
    color: "uc-color-emerald",
  },
  {
    eyebrow: "Physical products",
    title: "Physical product testing",
    description:
      "Collect feedback on physical products, packaging, and 3D experiences before launch.",
    mockupLabel: "Physical product",
    color: "uc-color-amber",
  },
];

export const oldWayItems = [
  {
    icon: EyeOff,
    title: "Hidden friction",
    description: "Users hesitate, scroll, and change answers — unseen.",
  },
  {
    icon: CircleDot,
    title: "Surface-level responses",
    description: "You get the responses, not the reason behind it.",
  },
  {
    icon: Img,
    title: "Flat product feedback",
    description: "Images and text fall short for visual or physical products.",
  },
];

export const newWayItems = [
  {
    icon: Crosshair,
    title: "Intent-aware feedback",
    description: "Connect responses with behavior to understand real intent.",
  },
  {
    icon: Activity,
    title: "Behavioral insights",
    description: "Spot uncertainty, confusion, and confidence in interactions.",
  },
  {
    icon: Box,
    title: "3D product feedback",
    description: "Let users explore products naturally before responding.",
  },
];

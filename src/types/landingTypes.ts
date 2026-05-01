import { RefObject } from "react";

import { Plus } from "lucide-react";

export type FeatureKey = "create" | "threeD" | "track" | "insights";

export type FeatureItem = {
  key: FeatureKey;
  label: string;
  icon: typeof Plus;
  step: string;
  title: string;
  description: string;
  bullets: {
    icon: typeof Plus;
    title: string;
    desc: string;
  }[];
  cta: string;
  color: string;
};

export type FeaturesProps = {
  scrollParentRef?: RefObject<HTMLDivElement | null>;
};


export type UseCase = {
  eyebrow: string;
  title: string;
  description: string;
  mockupLabel: string;
  color: string;
};

export type UseCasesProps = {
  scrollParentRef?: RefObject<HTMLDivElement | null>;
};
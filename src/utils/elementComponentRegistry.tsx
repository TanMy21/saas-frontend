import { lazy, type ComponentType } from "react";

import type {
  ElementProps,
  ElementSettingsProps,
  QuestionTypeKey,
} from "./types";

const BinaryElement = lazy(
  () => import("../components/Surveys/Elements/BinaryElement"),
);

const CheckBoxElement = lazy(
  () => import("../components/Surveys/Elements/CheckBoxElement"),
);

const ChoiceElement = lazy(
  () => import("../components/Surveys/Elements/ChoiceElement"),
);

const ConceptFitElement = lazy(() =>
  import("../components/Surveys/Elements/ConceptFitElement").then((module) => ({
    default: module.ConceptFitElement,
  })),
);

const DropdownElement = lazy(
  () => import("../components/Surveys/Elements/DropdownElement"),
);

const EmailContactELement = lazy(
  () => import("../components/Surveys/Elements/EmailContactELement"),
);

const EndScreenElement = lazy(
  () => import("../components/Surveys/Elements/EndScreenElement"),
);

const ImplicitAssociationTest = lazy(
  () => import("../components/Surveys/Elements/ImplicitAssociationTest"),
);

const InfoScreenElement = lazy(
  () => import("../components/Surveys/Elements/InfoScreenElement"),
);

const InstructionsElement = lazy(
  () => import("../components/Surveys/Elements/InstructionsElement"),
);

const MediaElement = lazy(
  () => import("../components/Surveys/Elements/MediaElement"),
);

const NumberElement = lazy(
  () => import("../components/Surveys/Elements/NumberElement"),
);

const RankElement = lazy(
  () => import("../components/Surveys/Elements/RankElement"),
);

const ScaleElement = lazy(
  () => import("../components/Surveys/Elements/ScaleElement"),
);

const TextElement = lazy(
  () => import("../components/Surveys/Elements/TextElement"),
);

const ThreeDElement = lazy(
  () => import("../components/Surveys/Elements/ThreeDElement"),
);

const TimedChoiceElement = lazy(
  () => import("../components/Surveys/Elements/TimedChoiceElement"),
);

const WelcomeScreenElement = lazy(
  () => import("../components/Surveys/Elements/WelcomeScreenElement"),
);

const BinaryElementSettings = lazy(
  () => import("../components/Surveys/ElementSettings/BinaryElementSettings"),
);

const CheckBoxElementSettings = lazy(
  () => import("../components/Surveys/ElementSettings/CheckBoxElementSettings"),
);

const ChoiceElementSettings = lazy(
  () => import("../components/Surveys/ElementSettings/ChoiceElementSettings"),
);

const ConceptFitElementSettings = lazy(
  () =>
    import("../components/Surveys/ElementSettings/ConceptFitElementSettings"),
);

const DropdownElementSettings = lazy(
  () => import("../components/Surveys/ElementSettings/DropdownElementSettings"),
);

const EmailContactElementSettings = lazy(
  () =>
    import("../components/Surveys/ElementSettings/EmailContactElementSettings"),
);

const EndScreenElementSettings = lazy(
  () =>
    import("../components/Surveys/ElementSettings/EndScreenElementSettings"),
);

const IATElementSettings = lazy(
  () => import("../components/Surveys/ElementSettings/IATElementSettings"),
);

const InfoScreenElementSettings = lazy(
  () =>
    import("../components/Surveys/ElementSettings/InfoScreenElementSettings"),
);

const InstructionsElementSettings = lazy(
  () =>
    import("../components/Surveys/ElementSettings/InstructionsElementSettings"),
);

const MediaElementSettings = lazy(
  () => import("../components/Surveys/ElementSettings/MediaElementSettings"),
);

const NumberElementSettings = lazy(
  () => import("../components/Surveys/ElementSettings/NumberElementSettings"),
);

const RankElementSettings = lazy(
  () => import("../components/Surveys/ElementSettings/RankElementSettings"),
);

const ScaleElementSettings = lazy(
  () => import("../components/Surveys/ElementSettings/ScaleElementSettings"),
);

const TextElementSettings = lazy(
  () => import("../components/Surveys/ElementSettings/TextElementSettings"),
);

const ThreeDElementSettings = lazy(
  () => import("../components/Surveys/ElementSettings/ThreeDElementSettings"),
);

const TimedChoiceElementSettings = lazy(
  () =>
    import("../components/Surveys/ElementSettings/TimedChoiceElementSettings"),
);

const WelcomeScreenElementSettings = lazy(
  () =>
    import("../components/Surveys/ElementSettings/WelcomeScreenElementSettings"),
);

export const elementComponents: {
  [key in QuestionTypeKey]: ComponentType<ElementProps>;
} = {
  BINARY: BinaryElement,
  EMAIL_CONTACT: EmailContactELement,
  END_SCREEN: EndScreenElement,
  INSTRUCTIONS: InstructionsElement,
  MEDIA: MediaElement,
  MULTIPLE_CHOICE: CheckBoxElement,
  NUMBER: NumberElement,
  RADIO: ChoiceElement,
  RANK: RankElement,
  RANGE: ScaleElement,
  TEXT: TextElement,
  THREE_D: ThreeDElement,
  WELCOME_SCREEN: WelcomeScreenElement,
  DROPDOWN: DropdownElement,
  TIMED_CHOICE: TimedChoiceElement,
  CONCEPT_FIT: ConceptFitElement,
  IAT: ImplicitAssociationTest,
  INFO_SCREEN: InfoScreenElement,
};

export const elementSettingsComponents: {
  [key in QuestionTypeKey]: ComponentType<ElementSettingsProps>;
} = {
  BINARY: BinaryElementSettings,
  EMAIL_CONTACT: EmailContactElementSettings,
  END_SCREEN: EndScreenElementSettings,
  INSTRUCTIONS: InstructionsElementSettings,
  MEDIA: MediaElementSettings,
  MULTIPLE_CHOICE: CheckBoxElementSettings,
  NUMBER: NumberElementSettings,
  RADIO: ChoiceElementSettings,
  RANK: RankElementSettings,
  RANGE: ScaleElementSettings,
  TEXT: TextElementSettings,
  THREE_D: ThreeDElementSettings,
  WELCOME_SCREEN: WelcomeScreenElementSettings,
  DROPDOWN: DropdownElementSettings,
  TIMED_CHOICE: TimedChoiceElementSettings,
  CONCEPT_FIT: ConceptFitElementSettings,
  IAT: IATElementSettings,
  INFO_SCREEN: InfoScreenElementSettings,
};

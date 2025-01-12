import { useEffect, useState } from "react";

import Joyride, { CallBackProps } from "react-joyride";

import { useUpdateUserTourStatusMutation } from "../../app/slices/userApiSlice";
import { DashboardTourProps } from "../../utils/types";

const SurveyBuilderTour = ({
  stepIndex,
  setStepIndex,
  runTour,
  setRunTour,
}: DashboardTourProps) => {
  const [builderTourCompleted, setBuilderTourCompleted] = useState(false);
  const [builderTourSkipped, setBuilderTourSkipped] = useState(false);

  const [updateUserTourStatus] = useUpdateUserTourStatusMutation();

  const updateTourStatus = async (
    builderTourCompleted: boolean,
    builderTourSkipped: boolean
  ) => {
    try {
      console.log("Updating tour status clicked...");
      await updateUserTourStatus({
        hasCompletedBuilderTour: builderTourCompleted,
        hasSkippedBuilderTour: builderTourSkipped,
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const steps = [
    {
      target: "#add-element-menu",
      content: (
        <div>
          <p>Add Elements to your survey by clicking this button.</p>
        </div>
      ),
      spotlightClicks: true,
      hideFooter: true,
      disableBeacon: true,
    },
    {
      target: "#survey-builder-tabs",
      content: (
        <div>
          <p>
            <strong>Click </strong> the button to Create survey or see Results
            of your Survey.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: "#mobile-view",
      content: (
        <div>
          <p>
            <strong>Click </strong>the button to view how the survey looks on
            mobile.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: "#desktop-view",
      content: (
        <div>
          <p>
            <strong>Click </strong> the button to view how the survey looks on
            Desktop.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: "#share-survey",
      content: (
        <div>
          <p>
            <strong>Share </strong>your survey.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: "#survey-settings",
      content: (
        <div>
          <p>
            <strong>Settings </strong> for your survey.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: "#upload-questions",
      content: (
        <div>
          <p>
            <strong>Upload </strong> your questions with options to compose your
            survey.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: "#question-settings",
      content: (
        <div>
          <p>
            <strong>Settings </strong>change settings, looks and preferences of
            your questions.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    console.log("Type:", type);

    if (type === "step:after") {
      setStepIndex(index + (action === "prev" ? -1 : 1));
      setRunTour(true);
    }

    if (type === "step:after" && index === 3) {
      setStepIndex(index + (action === "prev" ? -1 : 1));
      setRunTour(true);
    }

    if (status === "finished") {
      setRunTour(false);
      setBuilderTourCompleted(true);
    }

    if (status === "skipped") {
      setRunTour(false);
      setBuilderTourSkipped(true);
    }
  };

  useEffect(() => {
    if (builderTourCompleted || builderTourSkipped) {
      updateTourStatus(builderTourCompleted, builderTourSkipped);
    }
  }, [builderTourCompleted, builderTourSkipped]);

  return (
    <Joyride
      run={runTour}
      steps={steps}
      stepIndex={stepIndex}
      continuous
      spotlightClicks
      debug
      // scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
    />
  );
};

export default SurveyBuilderTour;

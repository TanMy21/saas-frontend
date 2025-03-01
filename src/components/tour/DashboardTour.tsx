import { useEffect, useState } from "react";

import Joyride, { CallBackProps } from "react-joyride";

import { useUpdateUserTourStatusMutation } from "../../app/slices/userApiSlice";
import { DashboardTourProps } from "../../utils/types";

const DashboardTour = ({
  stepIndex,
  setStepIndex,
  runTour,
  setRunTour,
}: DashboardTourProps) => {
  const [dashboardTourCompleted, setDashboardTourCompleted] = useState(false);
  const [dashboardTourSkipped, setDashboardTourSkipped] = useState(false);

  const [updateUserTourStatus] = useUpdateUserTourStatusMutation();

  const updateTourStatus = async (
    dashboardTourCompleted: boolean,
    dashboardTourSkipped: boolean
  ) => {
    try {
      await updateUserTourStatus({
        hasCompletedDashboardTour: dashboardTourCompleted,
        hasSkippedDashboardTour: dashboardTourSkipped,
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const steps = [
    {
      target: "#header-icon-menu",
      content: (
        <div>
          <p>Access various options and settings by clicking this menu.</p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: "#add-workspace",
      content: (
        <div>
          <p>
            <strong>Click</strong> the button to add a new workspace and proceed
            to the next step.
          </p>
        </div>
      ),
      spotlightClicks: true,
      hideFooter: true,
      disableBeacon: true,
    },
    {
      target: "#workspace-list",
      content: (
        <div>
          <p>
            This is your <strong>Workspace List</strong>. View all the
            workspaces you've created.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: "#workspace-dropdown-menu",
      content: (
        <div>
          <p className="text-sm text-gray-600 mt-2">
            Use this menu to <strong>Rename</strong> or <strong>Delete </strong>
            your workspace.
          </p>
          <p>
            <strong>* Click</strong> the dropdown button to proceed to next
            step.
          </p>
        </div>
      ),
      spotlightClicks: true,
      hideFooter: true,
      disableBeacon: true,
    },
    {
      target: "#new-survey-btn",
      content: (
        <div>
          <p>
            Click the <strong>Create New Survey</strong> button to add a new
            survey to your workspace.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: "#sort-surveys",
      content: (
        <div>
          <p>
            <strong>Sort surveys</strong>.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            * Use it to organize your surveys based on your preferences, such as
            by created at,updated at, or alphabetically.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: "#survey-view-layout",
      content: (
        <div>
          <p>
            <strong>Layout view toggle switch</strong>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            * Switch between a <strong>List View</strong> and
            <strong> Grid View</strong>.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: "#survey-list",
      content: (
        <div>
          <p>
            <strong>Survey List</strong>. Here, you can see all your surveys
            displayed in an organized format.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

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
      setDashboardTourCompleted(true);
    }

    if (status === "skipped") {
      setRunTour(false);
      setDashboardTourSkipped(true);
    }
  };

  useEffect(() => {
    if (dashboardTourCompleted || dashboardTourSkipped) {
      updateTourStatus(dashboardTourCompleted, dashboardTourSkipped);
    }
  }, [dashboardTourCompleted, dashboardTourSkipped]);

  return (
    <Joyride
      run={runTour}
      steps={steps}
      stepIndex={stepIndex}
      continuous
      spotlightClicks
      debug
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
    />
  );
};

export default DashboardTour;

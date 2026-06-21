import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import {
  useCreateElementMutation,
  useCreateScreenElementMutation,
} from "../../../app/slices/elementApiSlice";
import { addElement } from "../../../app/slices/surveySlice";
import { RootState } from "../../../app/store";
import { useAppDispatch, useAppSelector } from "../../../app/typedReduxHooks";
import useAuth from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/useToast";
import { useAppTheme } from "../../../theme/useAppTheme";
import { AddMenuItemConfig } from "../../../types/surveyBuilderTypes";
import {
  baseScreenMenuItems,
  implicitMenuItems,
  questionMenuItems,
  threeDMenuItem,
} from "../../../utils/AddElementMenuConfig";
import { hasMinimumPlan } from "../../../utils/planLimits";
import { AddElementMenuProps, QuestionTypeKey } from "../../../utils/types";

const AddMenuItem = ({
  item,
  isLoading,
  onAdd,
}: {
  item: AddMenuItemConfig;
  isLoading?: boolean;
  onAdd: (item: AddMenuItemConfig) => void;
}) => {
  return (
    <MenuItem
      onClick={() => onAdd(item)}
      disabled={Boolean(isLoading || item.disabled)}
      title={item.title || ""}
    >
      <Box display="flex" alignItems="center" gap={1.25}>
        <Typography sx={{ fontSize: 24, color: item.color, lineHeight: 1 }}>
          {item.icon}
        </Typography>

        <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>
          {item.label}
        </Typography>
      </Box>
    </MenuItem>
  );
};

/**
 * Renders a labeled group of add-menu items.
 */
const AddMenuSection = ({
  title,
  items,
  isLoading,
  onAdd,
}: {
  title: string;
  items: AddMenuItemConfig[];
  isLoading?: boolean;
  onAdd: (item: AddMenuItemConfig) => void;
}) => {
  return (
    <>
      <Box sx={{ px: 1, py: 0.75 }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          {title}
        </Typography>
      </Box>

      {items.map((item) => (
        <AddMenuItem
          key={item.type}
          item={item}
          isLoading={isLoading}
          onAdd={onAdd}
        />
      ))}
    </>
  );
};

/**
 * Displays the add-element menu for questions, implicit tests, and screens.
 */
const AddElementMenu = ({
  surveyID,
  anchorEl,
  open,
  handleClose,
  handleClick,
}: AddElementMenuProps) => {
  const { primary } = useAppTheme();
  const dispatch = useAppDispatch();
  const { can, tier = "FREE" } = useAuth();

  const canCreatePremiumQuestion =
    can("CREATE_QUESTION") && hasMinimumPlan(tier, "PROFESSIONAL");

  const [createElement, { isLoading, isError, error }] =
    useCreateElementMutation();

  const [createScreenElement, { isError: isErrorScreen, error: errorScreen }] =
    useCreateScreenElementMutation();

  const elements = useAppSelector(
    (state: RootState) => state.surveyBuilder.elements,
  );

  const containsWelcome = elements?.some(
    (element) => element.type === "WELCOME_SCREEN",
  );

  const containsInstruction = elements?.some(
    (element) => element.type === "INSTRUCTIONS",
  );

  /**
   * Applies runtime plan gating for 3D without putting auth-dependent logic in config.
   */
  const gatedQuestionItems: AddMenuItemConfig[] = canCreatePremiumQuestion
    ? [threeDMenuItem]
    : [];

  const gatedImplicitMenuItems: AddMenuItemConfig[] = canCreatePremiumQuestion
    ? implicitMenuItems
    : [];

  /**
   * Applies runtime disabled states for fixed system screens.
   * INFO_SCREEN intentionally remains reusable and is not disabled.
   */
  const screenMenuItems: AddMenuItemConfig[] = baseScreenMenuItems.map(
    (item) => {
      if (item.type === "INSTRUCTIONS") {
        return {
          ...item,
          disabled: containsInstruction,
          title: containsInstruction ? "Instructions screen already added" : "",
        };
      }

      if (item.type === "WELCOME_SCREEN") {
        return {
          ...item,
          disabled: containsWelcome,
          title: containsWelcome ? "Welcome screen already added" : "",
        };
      }

      return item;
    },
  );

  /**
   * Creates a normal question/test element using the existing createElement mutation.
   */
  const handleElementAdd = async (type: QuestionTypeKey) => {
    if (isLoading) return;

    try {
      const newElement = await createElement({
        surveyID,
        type,
      }).unwrap();

      dispatch(addElement(newElement));
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Creates a screen element using the existing createScreenElement mutation.
   */
  const handleScreenElementAdd = async (type: QuestionTypeKey) => {
    try {
      const newScreenElement = await createScreenElement({
        surveyID,
        type,
      }).unwrap();

      dispatch(addElement(newScreenElement));
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Routes add-menu clicks to the correct existing creation mutation.
   */
  const handleMenuItemAdd = async (item: AddMenuItemConfig) => {
    if (item.action === "SCREEN") {
      await handleScreenElementAdd(item.type);
      return;
    }

    await handleElementAdd(item.type);
  };

  useToast({
    isError,
    error,
  });

  useToast({
    isError: isErrorScreen,
    error: errorScreen,
  });

  return (
    <>
      <IconButton
        aria-label="Add question or screen"
        onClick={handleClick}
        disabled={!can("CREATE_QUESTION")}
        disableRipple
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: primary.dark,
          color: "#fff",
          "&:hover": { backgroundColor: primary.dark },
          "&:focus-visible": {
            outline: "2px solid rgba(76, 111, 255, 0.6)",
            outlineOffset: 2,
          },
        }}
      >
        <AddOutlinedIcon fontSize="medium" />
      </IconButton>

      <Menu
        id="add-element-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.25,
              ml: 1.5,
              width: 520,
              borderRadius: 2,
              border: "1px solid #EEF2F7",
              boxShadow:
                "0 8px 28px rgba(16,24,40,0.12), 0 2px 6px rgba(16,24,40,0.06)",
            },
          },
        }}
        MenuListProps={{
          dense: true,
          disablePadding: true,
          sx: {
            py: 1,
            "& .MuiMenuItem-root": {
              py: 1,
              minHeight: 40,
            },
            "& .MuiMenuItem-root + .MuiMenuItem-root": {
              mt: 0.25,
            },
          },
        }}
      >
        <Grid container spacing={0.75} sx={{ px: 1 }}>
          <Grid item xs={12} sm={6}>
            <AddMenuSection
              title="Questions"
              items={[...gatedQuestionItems, ...questionMenuItems]}
              isLoading={isLoading}
              onAdd={handleMenuItemAdd}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            {gatedImplicitMenuItems.length > 0 && (
              <AddMenuSection
                title="Implicit"
                items={gatedImplicitMenuItems}
                isLoading={isLoading}
                onAdd={handleMenuItemAdd}
              />
            )}

            <Box sx={{ mt: 1 }}>
              <AddMenuSection
                title="Screens"
                items={screenMenuItems}
                isLoading={isLoading}
                onAdd={handleMenuItemAdd}
              />
            </Box>
          </Grid>
        </Grid>
      </Menu>
    </>
  );
};

export default AddElementMenu;

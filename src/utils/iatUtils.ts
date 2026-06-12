import {
  DEFAULT_IAT_UI_CONFIG,
  IATCategorySettingsForm,
  IATGroup,
  IATOptionSettings,
  IATUiConfig,
} from "../types/surveyBuilderTypes";

/**
 * Safely reads IAT option metadata from the generic Option.settings JSON field.
 * This protects the UI from crashing when settings is null, malformed, or from an older option.
 */
export const getIATOptionSettings = (settings: unknown): IATOptionSettings => {
  if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
    return {};
  }

  return settings;
};

/**
 * Returns true when an option belongs to the requested IAT association group.
 * This is used to split all option rows into Theme A and Theme B attribute lists.
 */
export const isIATOptionInGroup = (
  settings: unknown,
  group: IATGroup,
): boolean => {
  return getIATOptionSettings(settings).iatGroup === group;
};

/**
 * Builds safe IAT uiConfig values from whatever is currently stored on the question.
 * This keeps old questions working even if they do not yet have the new Brand/Theme shape.
 */
export const getIATUiConfig = (uiConfig?: IATUiConfig | null) => {
  return {
    iatBrandA: uiConfig?.iatBrandA || DEFAULT_IAT_UI_CONFIG.iatBrandA,
    iatBrandB: uiConfig?.iatBrandB || DEFAULT_IAT_UI_CONFIG.iatBrandB,
    iatThemeA: uiConfig?.iatThemeA || DEFAULT_IAT_UI_CONFIG.iatThemeA,
    iatThemeB: uiConfig?.iatThemeB || DEFAULT_IAT_UI_CONFIG.iatThemeB,
    iatLeftKey: uiConfig?.iatLeftKey || DEFAULT_IAT_UI_CONFIG.iatLeftKey,
    iatRightKey: uiConfig?.iatRightKey || DEFAULT_IAT_UI_CONFIG.iatRightKey,
  };
};

/**
 * Converts saved IAT uiConfig into React Hook Form defaults.
 * The settings panel and inline canvas editor should both write to the same uiConfig fields.
 */
export const getIATCategoryDefaults = (
  uiConfig?: IATUiConfig | null,
): IATCategorySettingsForm => {
  const safeConfig = getIATUiConfig(uiConfig);

  return {
    iatBrandALabel: safeConfig.iatBrandA.label,
    iatBrandBLabel: safeConfig.iatBrandB.label,
    iatThemeALabel: safeConfig.iatThemeA.label,
    iatThemeBLabel: safeConfig.iatThemeB.label,
    iatLeftKey: safeConfig.iatLeftKey,
    iatRightKey: safeConfig.iatRightKey,
  };
};

/**
 * Builds the next uiConfig object while preserving unrelated question preference settings.
 * This prevents overwriting other uiConfig values that may exist for the question.
 */
export const buildIATCategoryUiConfig = (
  data: IATCategorySettingsForm,
  currentUiConfig?: IATUiConfig | null,
): IATUiConfig => {
  return {
    ...(currentUiConfig || {}),
    iatBrandA: {
      id: "brand_a",
      label:
        data.iatBrandALabel.trim() || DEFAULT_IAT_UI_CONFIG.iatBrandA.label,
    },
    iatBrandB: {
      id: "brand_b",
      label:
        data.iatBrandBLabel.trim() || DEFAULT_IAT_UI_CONFIG.iatBrandB.label,
    },
    iatThemeA: {
      id: "theme_a",
      label:
        data.iatThemeALabel.trim() || DEFAULT_IAT_UI_CONFIG.iatThemeA.label,
    },
    iatThemeB: {
      id: "theme_b",
      label:
        data.iatThemeBLabel.trim() || DEFAULT_IAT_UI_CONFIG.iatThemeB.label,
    },
    iatLeftKey: data.iatLeftKey.trim() || DEFAULT_IAT_UI_CONFIG.iatLeftKey,
    iatRightKey: data.iatRightKey.trim() || DEFAULT_IAT_UI_CONFIG.iatRightKey,
  };
};

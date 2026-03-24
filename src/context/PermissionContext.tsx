import { createContext, useContext } from "react";

/**
 * Context shape for UI-level permissions
 */
type PermissionContextType = {
  canEditQuestion: boolean;
};

/**
 * Default (safe fallback)
 */
const PermissionContext = createContext<PermissionContextType>({
  canEditQuestion: false,
});

/**
 * Hook for consuming permissions
 */
export const usePermission = () => useContext(PermissionContext);

export default PermissionContext;
